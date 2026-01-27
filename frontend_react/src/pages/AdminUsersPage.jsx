import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';
import { authFetch } from '../utils/authFetch';
import DataSeeder from '../components/DataSeeder';
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

        <DataSeeder />
      </section>
    </main>
  );
};

export default AdminUsersPage;
