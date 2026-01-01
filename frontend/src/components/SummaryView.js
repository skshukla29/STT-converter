import React, { useState } from 'react';
import axios from 'axios';
import { useSettings } from '../context/SettingsContext';
import { FileText, List, Sparkles, Volume2, Loader2 } from 'lucide-react';

function SummaryView() {
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [actionItems, setActionItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('transcript');
  const [ttsLoading, setTtsLoading] = useState(false);
  const { settings } = useSettings();

  const handleTranscriptChange = (e) => {
    setTranscript(e.target.value);
    setError('');
  };

  const handleSummarize = async () => {
    if (!transcript.trim()) {
      setError('Please enter or paste a transcript first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/summarize', {
        transcript: transcript,
        apiKey: settings.openaiApiKey || undefined, // Optional - backend will use .env if not provided
        model: settings.llmModel || 'gpt-4o-mini'
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setSummary(response.data.summary || '');
        setActionItems(response.data.action_items || []);
        setActiveTab('summary');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate summary. Check your API key and connection.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaySummary = async () => {
    if (!summary) {
      setError('No summary available to play.');
      return;
    }

    setTtsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/text-to-speech', {
        text: summary,
        language: 'en'
      }, {
        responseType: 'blob'
      });

      // Create audio blob and play
      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();

      // Clean up after playing
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };
    } catch (err) {
      setError('Failed to generate audio. Please try again.');
    } finally {
      setTtsLoading(false);
    }
  };

  const tabStyle = (tab) => ({
    padding: '12px 24px',
    border: 'none',
    background: activeTab === tab ? '#007bff' : '#e9ecef',
    color: activeTab === tab ? 'white' : '#495057',
    cursor: 'pointer',
    borderRadius: '8px 8px 0 0',
    fontWeight: activeTab === tab ? 'bold' : 'normal',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  });

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Sparkles size={32} />
        Transcript Summarization & Analysis
      </h1>

      {/* Transcript Input Section */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="transcript-input" style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Enter or Paste Transcript:
        </label>
        <textarea
          id="transcript-input"
          value={transcript}
          onChange={handleTranscriptChange}
          placeholder="Paste your transcript here or use the Upload/Record views to generate one..."
          rows="8"
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '14px',
            border: '2px solid #ced4da',
            borderRadius: '8px',
            resize: 'vertical',
            fontFamily: 'monospace'
          }}
        />
      </div>

      {/* Action Buttons */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={handleSummarize}
          disabled={loading || !transcript.trim()}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            background: loading ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading || !transcript.trim() ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 'bold'
          }}
        >
          {loading ? <Loader2 size={20} className="spinner" /> : <Sparkles size={20} />}
          {loading ? 'Analyzing...' : 'Generate Summary & Tasks'}
        </button>

        <button
          onClick={handlePlaySummary}
          disabled={ttsLoading || !summary}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            background: ttsLoading || !summary ? '#6c757d' : '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: ttsLoading || !summary ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 'bold'
          }}
        >
          {ttsLoading ? <Loader2 size={20} className="spinner" /> : <Volume2 size={20} />}
          {ttsLoading ? 'Generating...' : 'Play Summary'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          padding: '15px',
          background: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {/* Results Section with Tabs */}
      {(summary || actionItems.length > 0) && (
        <div style={{ marginTop: '30px' }}>
          {/* Tab Navigation */}
          <div style={{ display: 'flex', gap: '5px', marginBottom: '-1px', borderBottom: '2px solid #007bff' }}>
            <button
              onClick={() => setActiveTab('transcript')}
              style={tabStyle('transcript')}
            >
              <FileText size={18} />
              Transcript
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              style={tabStyle('summary')}
            >
              <Sparkles size={18} />
              Summary
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              style={tabStyle('tasks')}
            >
              <List size={18} />
              Action Items ({actionItems.length})
            </button>
          </div>

          {/* Tab Content */}
          <div style={{
            border: '2px solid #007bff',
            borderTop: 'none',
            borderRadius: '0 8px 8px 8px',
            padding: '20px',
            background: 'white',
            minHeight: '200px'
          }}>
            {activeTab === 'transcript' && (
              <div>
                <h3 style={{ marginTop: 0 }}>Original Transcript</h3>
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{transcript}</p>
              </div>
            )}

            {activeTab === 'summary' && (
              <div>
                <h3 style={{ marginTop: 0 }}>AI-Generated Summary</h3>
                <p style={{ lineHeight: '1.8', fontSize: '16px' }}>{summary}</p>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div>
                <h3 style={{ marginTop: 0 }}>Extracted Action Items</h3>
                {actionItems.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {actionItems.map((item, index) => (
                      <li
                        key={index}
                        style={{
                          padding: '15px',
                          marginBottom: '10px',
                          background: '#f8f9fa',
                          border: '1px solid #dee2e6',
                          borderRadius: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span style={{ fontWeight: 'bold' }}>
                          {index + 1}. {item.task}
                        </span>
                        {item.deadline && (
                          <span style={{
                            padding: '5px 10px',
                            background: '#ffc107',
                            color: '#000',
                            borderRadius: '5px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            📅 {item.deadline}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontStyle: 'italic', color: '#6c757d' }}>
                    No action items detected in this transcript.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      {!summary && !loading && (
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: '#e7f3ff',
          border: '1px solid #b3d9ff',
          borderRadius: '8px'
        }}>
          <h3 style={{ marginTop: 0 }}>How to Use:</h3>
          <ol style={{ lineHeight: '1.8' }}>
            <li>Enter or paste a transcript in the text area above</li>
            <li>Make sure you've set your OpenAI API key in <strong>Settings</strong></li>
            <li>Click <strong>"Generate Summary & Tasks"</strong> to analyze the content</li>
            <li>View the AI-generated summary and extracted action items</li>
            <li>Click <strong>"Play Summary"</strong> to hear the summary as audio</li>
          </ol>
        </div>
      )}

      <style>{`
        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default SummaryView;
