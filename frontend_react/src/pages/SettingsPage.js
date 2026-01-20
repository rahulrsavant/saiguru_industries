import { useState } from 'react';
import { clearEstimateHistory, getSettings, saveSettings } from '../utils/estimateStorage';

const SettingsPage = () => {
  const [settings, setSettings] = useState(getSettings());
  const [status, setStatus] = useState('');

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    saveSettings(settings);
    setStatus('Settings saved.');
    setTimeout(() => setStatus(''), 2000);
  };

  const handleClearHistory = () => {
    const confirmed = window.confirm('Clear all estimate history? This cannot be undone.');
    if (!confirmed) return;
    clearEstimateHistory();
    setStatus('History cleared.');
    setTimeout(() => setStatus(''), 2000);
  };

  return (
    <main className="page page-settings">
      <section className="section-title">
        <h1>Settings</h1>
        <p>Preferences are stored locally for this device.</p>
      </section>

      <section className="settings-card">
        <div className="field-row">
          <label>
            Default prefix
            <input
              type="text"
              value={settings.prefix}
              onChange={(event) => handleChange('prefix', event.target.value.toUpperCase())}
            />
          </label>
          <label>
            Default unit system
            <select value={settings.unitSystem} onChange={(event) => handleChange('unitSystem', event.target.value)}>
              <option value="metric">Metric</option>
              <option value="imperial">Imperial</option>
            </select>
          </label>
        </div>
        <div className="action-row">
          <button type="button" className="primary" onClick={handleSave}>
            Save settings
          </button>
          <button type="button" className="secondary" onClick={handleClearHistory}>
            Clear all history
          </button>
          {status ? <span className="status-pill">{status}</span> : null}
        </div>
      </section>
    </main>
  );
};

export default SettingsPage;
