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
        </div>
        
        <div className="settings-footer">
            <p><Save size={16} style={{verticalAlign: 'middle', marginRight: '5px'}}/> Settings are saved automatically</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
