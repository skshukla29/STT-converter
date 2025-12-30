import React, { useState, useEffect } from 'react';
import { Trash2, FileText, Clock, Calendar } from 'lucide-react';

const HistoryView = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('transcriptionHistory') || '[]');
    setHistory(savedHistory);
  }, []);

  const deleteItem = (id) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem('transcriptionHistory', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      setHistory([]);
      localStorage.removeItem('transcriptionHistory');
    }
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString();
  };

  return (
    <div className="history-view">
      <div className="card" style={{maxWidth: '900px'}}>
        <div className="history-header">
            <h1>Transcription History</h1>
            {history.length > 0 && (
                <button onClick={clearHistory} className="reset-btn" style={{backgroundColor: 'var(--error-bg)', color: 'var(--error-text)'}}>
                    Clear All
                </button>
            )}
        </div>

        {history.length === 0 ? (
          <div className="empty-state">
            <Clock size={48} color="var(--text-secondary)" />
            <p>No transcription history yet.</p>
          </div>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <div key={item.id} className="history-item">
                <div className="history-meta">
                  <span className="history-type">
                    {item.type === 'Recording' ? <Clock size={14} /> : <FileText size={14} />}
                    {item.type || 'Upload'}
                  </span>
                  <span className="history-date">
                    <Calendar size={14} /> {formatDate(item.date)}
                  </span>
                </div>
                <div className="history-content">
                  <p>{item.text}</p>
                </div>
                <button onClick={() => deleteItem(item.id)} className="delete-btn" title="Delete">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;
