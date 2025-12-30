import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSettings } from '../context/SettingsContext';

function UploadView() {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');
  const { settings } = useSettings();

  useEffect(() => {
    // Check backend health on load
    axios.get('http://127.0.0.1:5000/api/health')
      .then(() => setBackendStatus('connected'))
      .catch(() => setBackendStatus('disconnected'));
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setTranscription('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('audio', file);
    formData.append('model', settings.model);
    formData.append('language', settings.language);

    setLoading(true);
    setError('');
    setTranscription('');

    try {
      // Use 127.0.0.1 instead of localhost to avoid IPv4/IPv6 resolution issues
      const response = await axios.post('http://127.0.0.1:5000/api/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const text = response.data.text;
      setTranscription(text);

      // Save to history
      const historyItem = {
        id: Date.now(),
        date: new Date().toISOString(),
        text: text,
        type: 'Upload',
        filename: file.name
      };
      
      const existingHistory = JSON.parse(localStorage.getItem('transcriptionHistory') || '[]');
      localStorage.setItem('transcriptionHistory', JSON.stringify([historyItem, ...existingHistory]));

    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.details || err.response?.data?.error || err.message || 'An error occurred during transcription.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([transcription], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "transcript.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element); // Clean up
  };

  const handleReset = () => {
    setFile(null);
    setTranscription('');
    setError('');
    // Reset file input value
    const fileInput = document.querySelector('.file-input');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="upload-view">
      <div className="card">
        <h1>Upload Audio</h1>
        
        {backendStatus === 'disconnected' && (
          <div className="error-message" style={{backgroundColor: 'var(--warning-bg)', color: 'var(--warning-text)', border: '1px solid var(--warning-border)'}}>
            <strong>Warning:</strong> Backend server is not reachable. Please ensure 'node server.js' is running in the backend folder.
          </div>
        )}

        <div className="upload-section">
          <input type="file" accept="audio/*" onChange={handleFileChange} className="file-input" />
          {file && <p className="file-name">Selected: {file.name}</p>}
          <button onClick={handleUpload} disabled={loading || !file} className="primary-btn">
            {loading ? 'Processing...' : 'Transcribe Audio'}
          </button>
        </div>

        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Transcribing... This may take a moment.</p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {transcription && (
          <div className="result-section">
            <h2>Transcription Result:</h2>
            <textarea 
              value={transcription} 
              readOnly 
              className="transcription-text"
              rows={10}
            />
            <div className="button-group">
                <button onClick={handleDownload} className="secondary-btn">
                Download as TXT
                </button>
                <button onClick={handleReset} className="reset-btn">
                Transcribe Another
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadView;
