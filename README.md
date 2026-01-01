# STT Converter

A local speech-to-text tool with AI-powered summarization. Built using OpenAI's Whisper for transcription and GPT for intelligent analysis.

## What it does
- **Transcribe**: Upload audio files or record straight from the mic using Whisper AI.
- **Summarize**: Generate concise summaries of your transcripts using OpenAI GPT.
- **Extract Tasks**: Automatically detect action items, deadlines, and to-dos from conversations.
- **Text-to-Speech**: Convert summaries back to audio for easy playback.
- **History**: Keeps track of past transcriptions so you don't lose them.
- **Customizable**: Switch between Whisper models (tiny, base, small) and GPT models.
- **Dark Mode**: Because everything needs a dark mode.

## Features

### 🎙️ Speech-to-Text
- Upload audio files in various formats
- Live microphone recording
- Multiple Whisper model options (tiny/base/small/medium)
- Multi-language support with auto-detection

### 🤖 AI-Powered Analysis
- **Smart Summarization**: GPT generates concise summaries highlighting key points
- **Action Item Extraction**: Automatically identifies tasks, deadlines, and to-dos
- **Tabbed Interface**: Easy switching between transcript, summary, and tasks
- **Model Selection**: Choose from GPT-4o, GPT-4o Mini, GPT-3.5 Turbo

### 🔊 Text-to-Speech Playback
- Convert summaries to audio using Google TTS
- Play summaries directly in the browser
- Supports multiple languages

## Setup

You'll need Node.js, Python, and FFmpeg installed.

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (3.8 or higher)
- **FFmpeg** (for audio processing)
- **OpenAI API Key** (for summarization features)

### Backend
The backend is a mix of Node (Express) and Python. Node handles the API and file management, while Python runs Whisper transcription, GPT summarization, and TTS conversion.

```bash
cd backend

# Setup Python virtual environment
python -m venv venv

# Activate virtual environment (Windows)
.\venv\Scripts\activate

# Install Python dependencies (Whisper, OpenAI, gTTS)
pip install -r requirements.txt

# Install Node dependencies
npm install

# Run the backend server
node server.js
```

The backend will start on `http://localhost:5000`.

### Frontend
Standard React setup.

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will open at `http://localhost:3000`.

## Configuration

1. **Navigate to Settings** in the app
2. **Set your OpenAI API Key** (required for summarization)
3. **Choose your preferred models**:
   - Whisper model (tiny/base/small/medium)
   - LLM model (GPT-4o Mini recommended for cost-effectiveness)
4. **Select language** preferences

Your settings are saved locally in the browser.

## How to Use

### Transcribe Audio
1. Go to **Upload** or **Record** view
2. Upload an audio file or record from your microphone
3. Wait for Whisper to process the audio
4. View and copy your transcript

### Summarize & Extract Tasks
1. Go to **Summarize** view
2. Paste a transcript (or use one from Upload/Record)
3. Click **"Generate Summary & Tasks"**
4. View:
   - **Transcript**: Original text
   - **Summary**: AI-generated key points
   - **Tasks**: Extracted action items with deadlines

### Play Summary
1. After generating a summary, click **"Play Summary"**
2. The browser will play the audio version of your summary

## Tech Stack

### Frontend
- **React** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Context API** - State management

### Backend
- **Node.js / Express** - API server
- **Multer** - File upload handling
- **Python** - AI processing
- **OpenAI Whisper** - Speech-to-text
- **OpenAI GPT** - Summarization & analysis
- **gTTS** - Text-to-speech conversion

## API Endpoints

### `/api/health` (GET)
Health check for backend status

### `/api/transcribe` (POST)
Transcribe audio files using Whisper
- **Body**: FormData with audio file, model, language
- **Response**: `{ text: "transcription..." }`

### `/api/summarize` (POST)
Generate summary and extract action items
- **Body**: `{ transcript, apiKey, model }`
- **Response**: `{ summary, action_items: [{ task, deadline }] }`

### `/api/text-to-speech` (POST)
Convert text to audio
- **Body**: `{ text, language }`
- **Response**: Audio file stream (MP3)

## Project Structure

```
backend/
├── server.js           # Express API server
├── transcribe.py       # Whisper transcription
├── summarize.py        # GPT summarization & task extraction
├── tts.py             # Text-to-speech conversion
├── requirements.txt    # Python dependencies
├── package.json        # Node dependencies
└── uploads/           # Temporary file storage

frontend/
├── src/
│   ├── components/
│   │   ├── UploadView.js    # File upload interface
│   │   ├── RecordView.js    # Live recording
│   │   ├── HistoryView.js   # Transcription history
│   │   ├── SummaryView.js   # NEW: AI analysis interface
│   │   ├── SettingsView.js  # Configuration
│   │   └── Sidebar.js       # Navigation
│   ├── context/
│   │   ├── SettingsContext.js  # App settings
│   │   └── ThemeContext.js     # Theme management
│   └── App.js
└── package.json
```

## Cost Considerations

- **Whisper**: Runs locally, no API costs
- **GPT-4o Mini**: ~$0.15 per 1M input tokens (recommended)
- **gTTS**: Free (Google Text-to-Speech)

For a typical 5-minute meeting transcript (~750 words):
- Summary generation: < $0.01

## Troubleshooting

### Backend won't start
- Ensure Python virtual environment is activated
- Check that FFmpeg is installed and in PATH
- Verify all dependencies are installed

### Summarization fails
- Confirm OpenAI API key is set in Settings
- Check API key has sufficient credits
- Verify backend console for error messages

### Audio playback issues
- Ensure browser supports Web Audio API
- Check browser console for errors
- Try a different browser (Chrome/Edge recommended)

## Future Enhancements
- Speaker diarization (who said what)
- Export summaries as PDF/Word
- Integration with calendar apps for action items
- Real-time streaming transcription
- Support for Claude API as alternative to OpenAI

## License
MIT

---

Built with ❤️ using Whisper, GPT, and React
