import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../utils/apiConfig';
import { authFetch } from '../utils/authFetch';

const DEFAULT_ROLE = 'USER';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(DEFAULT_ROLE);
  const [error, setError] = useState('');
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
    setError('');
    setIsSubmitting(true);
    try {
      const response = await authFetch(`${API_BASE_URL}/api/admin/users`, {
        method: 'POST',
        body: JSON.stringify({ username, password, role }),
      });
      if (!response.ok) {
        setError('Unable to create user. Check password policy and try again.');
        return;
      }
      setUsername('');
      setPassword('');
      setRole(DEFAULT_ROLE);
      await loadUsers();
    } catch (err) {
      setError('Unable to create user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (userId) => {
    const newPassword = window.prompt('Enter a new temporary password');
    if (!newPassword) return;
    const response = await authFetch(`${API_BASE_URL}/api/admin/users/${userId}/reset-password`, {
      method: 'PUT',
      body: JSON.stringify({ newPassword }),
    });
    if (!response.ok) {
      setError('Unable to reset password. Ensure policy: 8 chars, 1 uppercase, 1 number.');
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
          <h1>User Management</h1>
          <p>Create users, reset passwords, and manage access.</p>
        </div>

        <form className="admin-form" onSubmit={handleCreate}>
          <label>
            Username or email
            <input value={username} onChange={(event) => setUsername(event.target.value)} required />
          </label>
          <label>
            Temporary password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <label>
            Role
            <select value={role} onChange={(event) => setRole(event.target.value)}>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>
          <button type="submit" className="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create user'}
          </button>
          {error ? <div className="error-box">{error}</div> : null}
        </form>

        <div className="admin-table">
          <div className="admin-table-row admin-table-header">
            <span>Username</span>
            <span>Role</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {users.map((user) => (
            <div key={user.id} className="admin-table-row">
              <span>{user.username}</span>
              <span>{user.role}</span>
              <span>{user.active ? 'Active' : 'Disabled'}</span>
              <div className="admin-actions">
                <button type="button" className="secondary" onClick={() => handleResetPassword(user.id)}>
                  Reset password
                </button>
                <button type="button" className="secondary" onClick={() => handleToggleStatus(user)}>
                  {user.active ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AdminUsersPage;
