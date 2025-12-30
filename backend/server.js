const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

// Configure multer storage to preserve file extensions
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // Generate unique filename with original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Ensure uploads directory exists
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

    // Determine Python executable path (use venv if available)
    const venvPythonFull = path.join(__dirname, 'venv', 'Scripts', 'python.exe');
    // Use relative path to avoid issues with spaces in absolute paths on Windows
    const pythonCommand = fs.existsSync(venvPythonFull) ? '.\\venv\\Scripts\\python.exe' : 'python';

    // Construct command string with proper quoting for Windows
    // Add model and language arguments
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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
