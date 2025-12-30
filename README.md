# STT Converter

A local speech-to-text tool I built using OpenAI's Whisper. It handles audio uploads and live recording directly in the browser.

## What it does
- **Transcribe**: Upload audio files or record straight from the mic.
- **History**: Keeps track of past transcriptions so you don't lose them.
- **Customizable**: Switch between Whisper models (tiny, base, small) depending on how much RAM you want to use.
- **Dark Mode**: Because everything needs a dark mode.

## Setup

You'll need Node.js, Python, and FFmpeg installed.

### Backend
The backend is a mix of Node (Express) and Python. Node handles the API and file management, while Python runs the heavy lifting with Whisper.

```bash
cd backend
# Setup python env
python -m venv venv
.\venv\Scripts\pip install -r requirements.txt

# Install node deps
npm install

# Run it
node server.js
```

### Frontend
Standard React setup.

```bash
cd frontend
npm install
npm start
```

Check it out at `http://localhost:3000`.
