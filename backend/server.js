const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Log and keep process alive on unexpected errors
process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason);
});

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

// Multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // Unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Create uploads dir if missing
if (!fs.existsSync('uploads')){
    fs.mkdirSync('uploads');
}

app.post('/api/transcribe', upload.single('audio'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const absoluteFilePath = path.resolve(filePath);
    
    // Get options from request body
    const model = req.body.model || 'base';
    const language = req.body.language || 'auto';

    // Python path setup
    const venvPythonFull = path.join(__dirname, 'venv', 'Scripts', 'python.exe');
    // Handle Windows paths with spaces
    const pythonCommand = fs.existsSync(venvPythonFull) ? '.\\venv\\Scripts\\python.exe' : 'python';

    // Quote command for shell execution
    const command = `"${pythonCommand}" transcribe.py "${absoluteFilePath}" --model "${model}" --language "${language}"`;
    
    console.log(`Executing: ${command}`);

    // Use exec instead of spawn for better command string handling on Windows
    exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
        // Delete the temporary file
        fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting file:', err);
        });

        if (error) {
            console.error(`Exec error: ${error}`);
            console.error(`Stderr: ${stderr}`);
            return res.status(500).json({ error: 'Transcription failed', details: stderr || error.message });
        }

        try {
            // Parse the JSON output from stdout
            const jsonResponse = JSON.parse(stdout);
            res.json(jsonResponse);
        } catch (e) {
            console.error('Error parsing JSON:', e);
            console.error('Raw output:', stdout);
            res.status(500).json({ error: 'Invalid response from transcriber', details: 'The transcriber did not return valid JSON.' });
        }
    });
});

// Summarize transcript endpoint
app.post('/api/summarize', express.json({ limit: '10mb' }), (req, res) => {
    const { transcript, apiKey, model } = req.body;

    if (!transcript) {
        return res.status(400).json({ error: 'No transcript provided' });
    }

    // Use API key from request body or fall back to environment variable
    const effectiveApiKey = apiKey || process.env.OPENAI_API_KEY;

    if (!effectiveApiKey) {
        return res.status(400).json({ error: 'OpenAI API key not provided. Set it in Settings or in backend/.env file.' });
    }

    const venvPythonFull = path.join(__dirname, 'venv', 'Scripts', 'python.exe');
    const pythonCommand = fs.existsSync(venvPythonFull) ? '.\\venv\\Scripts\\python.exe' : 'python';

    // Escape quotes in transcript for command line
    const escapedTranscript = transcript.replace(/"/g, '\\"');
    const llmModel = model || 'gpt-4o-mini';

    const command = `"${pythonCommand}" summarize.py --transcript "${escapedTranscript}" --api-key "${effectiveApiKey}" --model "${llmModel}"`;
    
    console.log(`Executing summarization...`);

    exec(command, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Exec error: ${error}`);
            console.error(`Stderr: ${stderr}`);
            return res.status(500).json({ error: 'Summarization failed', details: stderr || error.message });
        }

        try {
            const jsonResponse = JSON.parse(stdout);
            res.json(jsonResponse);
        } catch (e) {
            console.error('Error parsing JSON:', e);
            console.error('Raw output:', stdout);
            res.status(500).json({ error: 'Invalid response from summarizer', details: 'The summarizer did not return valid JSON.' });
        }
    });
});

// Text-to-Speech endpoint
app.post('/api/text-to-speech', express.json({ limit: '10mb' }), (req, res) => {
    const { text, language } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'No text provided' });
    }

    const venvPythonFull = path.join(__dirname, 'venv', 'Scripts', 'python.exe');
    const pythonCommand = fs.existsSync(venvPythonFull) ? '.\\venv\\Scripts\\python.exe' : 'python';

    // Create unique filename for TTS output
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const outputFileName = `tts-${uniqueSuffix}.mp3`;
    const outputPath = path.join(__dirname, 'uploads', outputFileName);

    // Escape quotes in text
    const escapedText = text.replace(/"/g, '\\"');
    const lang = language || 'en';

    const command = `"${pythonCommand}" tts.py --text "${escapedText}" --output "${outputPath}" --language "${lang}"`;
    
    console.log(`Executing TTS conversion...`);

    exec(command, { cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Exec error: ${error}`);
            console.error(`Stderr: ${stderr}`);
            return res.status(500).json({ error: 'TTS conversion failed', details: stderr || error.message });
        }

        try {
            const jsonResponse = JSON.parse(stdout);
            
            if (jsonResponse.success && jsonResponse.file_path) {
                // Return the file as audio stream
                const audioPath = jsonResponse.file_path;
                
                res.setHeader('Content-Type', 'audio/mpeg');
                res.setHeader('Content-Disposition', `attachment; filename="${outputFileName}"`);
                
                const fileStream = fs.createReadStream(audioPath);
                fileStream.pipe(res);
                
                // Clean up file after sending
                fileStream.on('end', () => {
                    fs.unlink(audioPath, (err) => {
                        if (err) console.error('Error deleting TTS file:', err);
                    });
                });
            } else {
                res.status(500).json(jsonResponse);
            }
        } catch (e) {
            console.error('Error parsing JSON:', e);
            console.error('Raw output:', stdout);
            res.status(500).json({ error: 'Invalid response from TTS converter', details: stdout });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
