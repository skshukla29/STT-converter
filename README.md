# Speech-to-Text Converter

A professional full-stack application that converts speech to text using OpenAI's Whisper model.

## Features

- **Upload Audio**: Support for various audio formats.
- **Live Recording**: Record audio directly in the browser.
- **Transcription History**: Save and manage your past transcriptions.
- **Settings**: Configure Whisper model size and language.
- **Theme Support**: Toggle between Light and Dark modes.
- **Responsive Design**: Works on desktop and mobile.

## Tech Stack

- **Frontend**: React, Lucide React, CSS Variables
- **Backend**: Node.js (Express), Python (Whisper, FFmpeg)

## How to Run

### Prerequisites
- Node.js
- Python 3.8+
- FFmpeg installed and added to PATH

### 1. Start the Backend
```bash
cd backend
# Create virtual env (first time only)
python -m venv venv
# Install Python dependencies
.\venv\Scripts\pip install -r requirements.txt
# Install Node dependencies
npm install
# Start server
node server.js
```

### 2. Start the Frontend
```bash
cd frontend
npm install
npm start
```

The application will run at `http://localhost:3000`.
