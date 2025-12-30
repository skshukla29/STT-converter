import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import Sidebar from './components/Sidebar';
import UploadView from './components/UploadView';
import RecordView from './components/RecordView';
import HistoryView from './components/HistoryView';
import SettingsView from './components/SettingsView';
import './App.css';
import { Sun, Moon } from 'lucide-react';

const Layout = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {/* Mobile Theme Toggle (Floating) */}
        <button 
          className="mobile-theme-toggle" 
          onClick={toggleTheme}
          style={{ display: window.innerWidth <= 768 ? 'flex' : 'none' }}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/upload" replace />} />
              <Route path="/upload" element={<UploadView />} />
              <Route path="/record" element={<RecordView />} />
              <Route path="/history" element={<HistoryView />} />
              <Route path="/settings" element={<SettingsView />} />
            </Routes>
          </Layout>
        </Router>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export default App;
