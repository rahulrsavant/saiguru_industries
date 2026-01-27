import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';
import { authFetch } from '../utils/authFetch';
import useGlossaryTranslation from '../i18n/useGlossaryTranslation';

const DEFAULT_ROLE = 'USER';

const AdminUsersPage = () => {
  const { t } = useGlossaryTranslation();
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(DEFAULT_ROLE);
  const [errorKey, setErrorKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [seedSummary, setSeedSummary] = useState(null);
  const [seedErrorKey, setSeedErrorKey] = useState('');
  const [isSeeding, setIsSeeding] = useState(false);
  const [confirmMode, setConfirmMode] = useState('');

  const loadUsers = async () => {
    const response = await authFetch(`${API_BASE_URL}/api/admin/users`);
    if (response.ok) {
      const data = await response.json();
      setUsers(data);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    setErrorKey('');
    setIsSubmitting(true);
    try {
      const response = await authFetch(`${API_BASE_URL}/api/admin/users`, {
        method: 'POST',
        body: JSON.stringify({ username, password, role }),
      });
      if (!response.ok) {
        setErrorKey('admin.errorCreateUserPolicy');
        return;
      }
      setUsername('');
      setPassword('');
      setRole(DEFAULT_ROLE);
      await loadUsers();
    } catch (err) {
      setErrorKey('admin.errorCreateUser');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (userId) => {
    const newPassword = window.prompt(t('admin.promptTempPassword'));
    if (!newPassword) return;
    const response = await authFetch(`${API_BASE_URL}/api/admin/users/${userId}/reset-password`, {
      method: 'PUT',
      body: JSON.stringify({ newPassword }),
    });
    if (!response.ok) {
      setErrorKey('admin.errorResetPassword');
    }
  };

  const handleToggleStatus = async (user) => {
    const response = await authFetch(`${API_BASE_URL}/api/admin/users/${user.id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ active: !user.active }),
    });
    if (response.ok) {
      const updated = await response.json();
      setUsers((prev) => prev.map((entry) => (entry.id === updated.id ? updated : entry)));
    }
  };

  const handleSeed = async (mode) => {
    setIsSeeding(true);
    setSeedErrorKey('');
    setSeedSummary(null);
    try {
      const response = await authFetch(`${API_BASE_URL}/api/admin/seed/products`, {
        method: 'POST',
        body: JSON.stringify({ mode }),
      });
      if (!response.ok) {
        setSeedErrorKey('admin.seedError');
        return;
      }
      const data = await response.json();
      setSeedSummary(data);
    } catch (err) {
      setSeedErrorKey('admin.seedError');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <main className="page">
      <section className="admin-panel">
        <div className="admin-header">
          <h1>{t('admin.title')}</h1>
          <p>{t('admin.subtitle')}</p>
        </div>

        <form className="admin-form" onSubmit={handleCreate}>
          <label>
            {t('admin.usernameOrEmail')}
            <input value={username} onChange={(event) => setUsername(event.target.value)} required />
          </label>
          <label>
            {t('admin.tempPassword')}
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <label>
            {t('admin.role')}
            <select value={role} onChange={(event) => setRole(event.target.value)}>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>
          <button type="submit" className="primary" disabled={isSubmitting}>
            {isSubmitting ? t('admin.creating') : t('admin.createUser')}
          </button>
          {errorKey ? <div className="error-box">{t(errorKey)}</div> : null}
        </form>

        <div className="admin-table">
          <div className="admin-table-row admin-table-header">
            <span>{t('admin.username')}</span>
            <span>{t('admin.role')}</span>
            <span>{t('admin.status')}</span>
            <span>{t('admin.actions')}</span>
          </div>
          {users.map((user) => (
            <div key={user.id} className="admin-table-row">
              <span>{user.username}</span>
              <span>{user.role}</span>
              <span>{user.active ? t('admin.active') : t('admin.disabled')}</span>
              <div className="admin-actions">
                <button type="button" className="secondary" onClick={() => handleResetPassword(user.id)}>
                  {t('admin.resetPassword')}
                </button>
                <button type="button" className="secondary" onClick={() => handleToggleStatus(user)}>
                  {user.active ? t('admin.disable') : t('admin.enable')}
                </button>
              </div>
            </div>
          ))}
        </div>

        <section className="admin-seed-panel">
          <div className="admin-header">
            <h2>{t('admin.seedTitle')}</h2>
            <p>{t('admin.seedSubtitle')}</p>
          </div>
          <div className="admin-seed-actions">
            <button type="button" className="secondary" onClick={() => setConfirmMode('seed')}>
              {t('admin.seedButton')}
            </button>
            <button type="button" className="secondary" onClick={() => setConfirmMode('reseed')}>
              {t('admin.reseedButton')}
            </button>
            {isSeeding ? <span className="helper-text">{t('admin.seedRunning')}</span> : null}
          </div>

          {seedErrorKey ? <div className="error-box">{t(seedErrorKey)}</div> : null}

          {seedSummary ? (
            <div className="admin-seed-summary">
              <div className="admin-seed-metrics">
                <span>{t('admin.seedInserted', { count: seedSummary.inserted })}</span>
                <span>{t('admin.seedSkipped', { count: seedSummary.skipped })}</span>
                <span>{t('admin.seedDeleted', { count: seedSummary.deleted })}</span>
                <span>{t('admin.seedBatch', { batchId: seedSummary.batchId })}</span>
              </div>

              {seedSummary.errors?.length ? (
                <div className="admin-seed-errors">
                  {seedSummary.errors.map((error) => (
                    <div key={error}>{error}</div>
                  ))}
                </div>
              ) : null}

              {seedSummary.items?.length ? (
                <div className="admin-table">
                  <div className="admin-table-row admin-table-header seed-row">
                    <span>{t('admin.seedType')}</span>
                    <span>{t('admin.seedName')}</span>
                    <span>{t('admin.seedStatus')}</span>
                    <span>{t('admin.seedWeight')}</span>
                    <span>{t('admin.seedNotes')}</span>
                  </div>
                  {seedSummary.items.map((item) => (
                    <div key={`${item.type}-${item.id || item.name}`} className="admin-table-row seed-row">
                      <span>{item.type}</span>
                      <span>{item.name}</span>
                      <span>{item.status}</span>
                      <span>{item.weightKg != null ? `${item.weightKg.toFixed(3)} kg` : '--'}</span>
                      <span>{item.notes || '--'}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      </section>

      {confirmMode ? (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{t('admin.seedConfirmTitle')}</h3>
              <button
                type="button"
                className="icon-button"
                onClick={() => setConfirmMode('')}
                title={t('general.close')}
                aria-label={t('general.close')}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p>
                {confirmMode === 'reseed' ? t('admin.reseedConfirm') : t('admin.seedConfirm')}
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="secondary" onClick={() => setConfirmMode('')}>
                {t('general.cancel')}
              </button>
              <button
                type="button"
                className="primary"
                onClick={() => {
                  const mode = confirmMode;
                  setConfirmMode('');
                  handleSeed(mode);
                }}
              >
                {t('general.confirm')}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
};

export default AdminUsersPage;
