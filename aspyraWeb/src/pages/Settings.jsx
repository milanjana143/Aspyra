import { FaPalette } from 'react-icons/fa';
import './Settings.css';
import { useState, useEffect } from 'react';

const Settings = () => {
  const [theme, setTheme] = useState('Light');
  const [language, setLanguage] = useState('English');
  const [message, setMessage] = useState(null);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('appTheme') || 'Light';
    const savedLanguage = localStorage.getItem('appLanguage') || 'English';
    setTheme(savedTheme);
    setLanguage(savedLanguage);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeName) => {
    const root = document.documentElement;
    const body = document.body;
    
    // Remove existing theme classes
    body.classList.remove('light-theme', 'dark-theme', 'auto-theme');
    
    if (themeName === 'Dark') {
      body.classList.add('dark-theme');
      root.setAttribute('data-bs-theme', 'dark');
      root.style.colorScheme = 'dark';
      
      // Apply comprehensive dark mode styles
      body.style.backgroundColor = '#0d0d0d';
      body.style.color = '#e0e0e0';
      
      // Update CSS custom properties for dark mode
      root.style.setProperty('--bs-body-bg', '#0d0d0d');
      root.style.setProperty('--bs-body-color', '#e0e0e0');
      root.style.setProperty('--bs-border-color', '#333333');
      root.style.setProperty('--bs-card-bg', '#1a1a1a');
      root.style.setProperty('--bs-table-bg', '#1a1a1a');
      root.style.setProperty('--bs-table-border-color', '#333333');
      
      // Apply dark styles to all elements
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        if (el.classList.contains('navbar') || el.classList.contains('sidebar') || 
            el.classList.contains('card') || el.classList.contains('modal') ||
            el.classList.contains('table') || el.classList.contains('form-control') ||
            el.classList.contains('btn')) {
          // Bootstrap will handle these with data-bs-theme
        }
      });
    } else if (themeName === 'Light') {
      body.classList.add('light-theme');
      root.setAttribute('data-bs-theme', 'light');
      root.style.colorScheme = 'light';
      
      body.style.backgroundColor = '#ffffff';
      body.style.color = '#212529';
      
      // Reset CSS custom properties for light mode
      root.style.setProperty('--bs-body-bg', '#ffffff');
      root.style.setProperty('--bs-body-color', '#212529');
      root.style.setProperty('--bs-border-color', '#dee2e6');
      root.style.setProperty('--bs-card-bg', '#ffffff');
      root.style.setProperty('--bs-table-bg', '#ffffff');
      root.style.setProperty('--bs-table-border-color', '#dee2e6');
    } else if (themeName === 'Auto') {
      body.classList.add('auto-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-bs-theme', prefersDark ? 'dark' : 'light');
      root.style.colorScheme = prefersDark ? 'dark' : 'light';
      
      if (prefersDark) {
        body.style.backgroundColor = '#0d0d0d';
        body.style.color = '#e0e0e0';
        root.style.setProperty('--bs-body-bg', '#0d0d0d');
        root.style.setProperty('--bs-body-color', '#e0e0e0');
        root.style.setProperty('--bs-border-color', '#333333');
        root.style.setProperty('--bs-card-bg', '#1a1a1a');
      } else {
        body.style.backgroundColor = '#ffffff';
        body.style.color = '#212529';
        root.style.setProperty('--bs-body-bg', '#ffffff');
        root.style.setProperty('--bs-body-color', '#212529');
        root.style.setProperty('--bs-border-color', '#dee2e6');
        root.style.setProperty('--bs-card-bg', '#ffffff');
      }
    }
  };

  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    applyTheme(newTheme); // Apply theme immediately for preview
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleSave = () => {
    localStorage.setItem('appTheme', theme);
    localStorage.setItem('appLanguage', language);
    applyTheme(theme);
    setMessage('Settings saved successfully');
    setTimeout(() => setMessage(null), 3000);
  };

  const settingsSections = [
    {
      title: 'Appearance',
      icon: FaPalette,
      iconColor: '#a855f7',
      settings: [
        { label: 'Theme', type: 'select', options: ['Light', 'Dark', 'Auto'] },
        { label: 'Language', type: 'select', options: ['English', 'Spanish', 'French', 'German'] }
      ]
    }
  ];

  return (
    <div className="settings-page">
      {/* Page Header */}
      <div className="page-header-section mb-4">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account preferences and settings.</p>
      </div>

      {message && <div className="alert alert-success mt-2">{message}</div>}

      {/* Settings Sections */}
      <div className="row g-4">
        {settingsSections.map((section, index) => (
          <div key={index} className="col-lg-6">
            <div className="settings-card">
              <div className="settings-card-header">
                <div 
                  className="settings-icon"
                  style={{ backgroundColor: section.iconColor + '20', color: section.iconColor }}
                >
                  <section.icon />
                </div>
                <h3 className="settings-title">{section.title}</h3>
              </div>
              
              <div className="settings-card-body">
                {section.settings.map((setting, idx) => (
                  <div key={idx} className="setting-item">
                    <label className="setting-label">{setting.label}</label>
                    
                    {setting.type === 'switch' && (
                      <div className="form-check form-switch">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          defaultChecked={setting.defaultChecked}
                        />
                      </div>
                    )}
                    
                    {setting.type === 'select' && (
                      <select 
                        className="form-select setting-select"
                        value={setting.label === 'Theme' ? theme : language}
                        onChange={setting.label === 'Theme' ? handleThemeChange : handleLanguageChange}
                      >
                        {setting.options.map((option, optIdx) => (
                          <option key={optIdx}>{option}</option>
                        ))}
                      </select>
                    )}
                    
                    {setting.type === 'button' && (
                      <button 
                        className={`btn ${setting.variant === 'danger' ? 'btn-danger' : 'btn-primary'} btn-sm`}
                      >
                        {setting.label}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="mt-4">
        <button className="btn btn-primary btn-lg" onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
};

export default Settings;