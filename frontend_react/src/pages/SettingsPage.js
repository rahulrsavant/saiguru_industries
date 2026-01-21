import { useState } from 'react';
import { clearEstimateHistory, getSettings, saveSettings } from '../utils/estimateStorage';
import useGlossaryTranslation from '../i18n/useGlossaryTranslation';

const SettingsPage = () => {
  const { t } = useGlossaryTranslation();
  const [settings, setSettings] = useState(getSettings());
  const [statusKey, setStatusKey] = useState('');

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    saveSettings(settings);
    setStatusKey('settings.saved');
    setTimeout(() => setStatusKey(''), 2000);
  };

  const handleClearHistory = () => {
    const confirmed = window.confirm(t('settings.confirmClear'));
    if (!confirmed) return;
    clearEstimateHistory();
    setStatusKey('settings.cleared');
    setTimeout(() => setStatusKey(''), 2000);
  };

  return (
    <main className="page page-settings">
      <section className="section-title">
        <h1>{t('settings.title')}</h1>
        <p>{t('settings.subtitle')}</p>
      </section>

      <section className="settings-card">
        <div className="field-row">
          <label>
            {t('settings.defaultPrefix')}
            <input
              type="text"
              value={settings.prefix}
              onChange={(event) => handleChange('prefix', event.target.value.toUpperCase())}
            />
          </label>
          <label>
            {t('settings.defaultUnitSystem')}
            <select value={settings.unitSystem} onChange={(event) => handleChange('unitSystem', event.target.value)}>
              <option value="metric">{t('settings.metric')}</option>
              <option value="imperial">{t('settings.imperial')}</option>
            </select>
          </label>
        </div>
        <div className="action-row">
          <button type="button" className="primary" onClick={handleSave}>
            {t('settings.save')}
          </button>
          <button type="button" className="secondary" onClick={handleClearHistory}>
            {t('settings.clearHistory')}
          </button>
          {statusKey ? <span className="status-pill">{t(statusKey)}</span> : null}
        </div>
      </section>
    </main>
  );
};

export default SettingsPage;
