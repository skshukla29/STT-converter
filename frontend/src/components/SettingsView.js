import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { Save } from 'lucide-react';

const SettingsView = () => {
  const { settings, updateSettings } = useSettings();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateSettings({ [name]: value });
  };

  return (
    <div className="settings-view">
      <div className="card">
        <h1>Settings</h1>
        
        <div className="settings-form">
          <div className="form-group">
            <label htmlFor="model">Whisper Model Size</label>
            <select 
              id="model" 
              name="model" 
              value={settings.model} 
              onChange={handleChange}
              className="settings-select"
            >
              <option value="tiny">Tiny (Fastest, Lower Accuracy)</option>
              <option value="base">Base (Balanced)</option>
              <option value="small">Small (Better Accuracy)</option>
              <option value="medium">Medium (Slower, High Accuracy)</option>
            </select>
            <p className="help-text">Larger models take longer to process but provide better results.</p>
          </div>

          <div className="form-group">
            <label htmlFor="language">Language</label>
            <select 
              id="language" 
              name="language" 
              value={settings.language} 
              onChange={handleChange}
              className="settings-select"
            >
              <option value="auto">Auto Detect</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
              <option value="nl">Dutch</option>
              <option value="ja">Japanese</option>
              <option value="zh">Chinese</option>
              <option value="ru">Russian</option>
              <option value="hi">Hindi</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="openaiApiKey">OpenAI API Key (Optional)</label>
            <input 
              type="password"
              id="openaiApiKey" 
              name="openaiApiKey" 
              value={settings.openaiApiKey || ''} 
              onChange={handleChange}
              className="settings-select"
              placeholder="Leave empty to use backend configuration"
              style={{ fontFamily: 'monospace' }}
            />
            <p className="help-text">Optional: Override the backend API key. Leave empty to use the key configured in backend/.env file.</p>
          </div>

          <div className="form-group">
            <label htmlFor="llmModel">LLM Model</label>
            <select 
              id="llmModel" 
              name="llmModel" 
              value={settings.llmModel || 'gpt-4o-mini'} 
              onChange={handleChange}
              className="settings-select"
            >
              <option value="gpt-4o-mini">GPT-4o Mini (Fastest, Cost-Effective)</option>
              <option value="gpt-4o">GPT-4o (Better Quality)</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            </select>
            <p className="help-text">Model used for text summarization and analysis.</p>
          </div>
        </div>
        
        <div className="settings-footer">
            <p><Save size={16} style={{verticalAlign: 'middle', marginRight: '5px'}}/> Settings are saved automatically</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
