# Quick Start Guide - Enhanced STT Converter

## 🚀 Installation Steps

### 1. Install Dependencies (Backend)
```bash
cd backend
npm install
pip install -r requirements.txt
```

### 2. Install Dependencies (Frontend)
```bash
cd frontend
npm install
```

### 3. Get OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy and save it securely

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
node server.js
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### 5. Configure Settings
1. Open http://localhost:3000
2. Navigate to **Settings**
3. Paste your OpenAI API key
4. Select your preferred models

---

## ✨ New Features Added

### 1. **AI Summarization**
- Automatically generates concise summaries of transcripts
- Highlights key points and main topics
- Uses OpenAI GPT-4o Mini (fast & cost-effective)

### 2. **Action Item Extraction**
- Detects tasks, deadlines, and to-dos
- Displays them in an organized list
- Shows deadlines prominently

### 3. **Text-to-Speech Playback**
- Converts summaries to audio
- Play directly in browser
- Uses Google Text-to-Speech (free)

### 4. **New SummaryView Component**
- Tabbed interface: Transcript / Summary / Tasks
- Clean, intuitive design
- Real-time loading indicators

---

## 📝 Usage Example

1. **Upload Audio**
   - Go to Upload view
   - Select an audio file (meeting recording, interview, etc.)
   - Click "Transcribe"

2. **Generate Summary**
   - Copy the transcript
   - Go to Summarize view
   - Paste and click "Generate Summary & Tasks"

3. **Review Results**
   - Read the AI-generated summary
   - Check extracted action items
   - Click "Play Summary" to listen

---

## 🔑 API Keys & Security

- API keys are stored locally in your browser (localStorage)
- Never shared or sent anywhere except OpenAI's API
- Clear browser data to remove stored keys

---

## 💰 Cost Estimate

Using GPT-4o Mini (recommended):
- 10-minute meeting transcript: ~$0.02
- 100 transcripts per month: ~$2.00

---

## ⚠️ Common Issues

**"OpenAI API key not provided"**
→ Set your API key in Settings

**"Summarization failed"**
→ Check API key has credits
→ Verify backend is running

**TTS not working**
→ Ensure gTTS is installed: `pip install gtts`

---

## 🎯 Quick Tips

1. Use **GPT-4o Mini** for fastest & cheapest summaries
2. Choose **Whisper base** model for balanced transcription
3. Keep transcripts under 10,000 words for best results
4. Use **auto-detect** for multi-language content

---

Enjoy your enhanced STT Converter! 🎉
