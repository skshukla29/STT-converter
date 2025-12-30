import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Mic, Square, Loader } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const RecordView = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);
  const { settings } = useSettings();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      setError('');
      setTranscription('');
      setAudioBlob(null);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTranscribe = async () => {
    if (!audioBlob) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    // Send as .webm, backend/ffmpeg should handle it
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('model', settings.model);
    formData.append('language', settings.language);

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/transcribe', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      const text = response.data.text;
      setTranscription(text);
      
      // Save to history
      const historyItem = {
        id: Date.now(),
        date: new Date().toISOString(),
        text: text,
        type: 'Recording',
        duration: formatTime(recordingTime)
      };
      
      const existingHistory = JSON.parse(localStorage.getItem('transcriptionHistory') || '[]');
      localStorage.setItem('transcriptionHistory', JSON.stringify([historyItem, ...existingHistory]));

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.details || "Transcription failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="record-view">
      <div className="card">
        <h1>Record Audio</h1>
        
        <div className="recorder-interface">
          <div className={`timer-display ${isRecording ? 'recording' : ''}`}>
            {formatTime(recordingTime)}
          </div>
          
          <div className="controls">
            {!isRecording ? (
              <button onClick={startRecording} className="record-btn" disabled={loading}>
                <Mic size={24} /> Start Recording
              </button>
            ) : (
              <button onClick={stopRecording} className="stop-btn">
                <Square size={24} /> Stop Recording
              </button>
            )}
          </div>

          {audioBlob && !isRecording && !loading && !transcription && (
            <div className="preview-section">
              <audio controls src={URL.createObjectURL(audioBlob)} className="audio-player" />
              <button onClick={handleTranscribe} className="primary-btn">
                Transcribe Recording
              </button>
            </div>
          )}
        </div>

        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Processing audio...</p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {transcription && (
          <div className="result-section">
            <h2>Transcription Result:</h2>
            <textarea value={transcription} readOnly className="transcription-text" rows={8} />
            <button onClick={() => {
                setAudioBlob(null);
                setTranscription('');
                setRecordingTime(0);
            }} className="reset-btn">Record New</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordView;
