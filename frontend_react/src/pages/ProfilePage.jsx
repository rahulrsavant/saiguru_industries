import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/apiConfig';
import { authFetch } from '../utils/authFetch';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    try {
      const response = await authFetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: 'POST',
        body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
      });
      if (!response.ok) {
        setError('Unable to change password. Verify your current password and policy.');
        return;
      }
      setSuccess('Password updated. Please sign in again.');
      logout();
      navigate('/login', { replace: true });
    } catch (err) {
      setError('Unable to change password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page">
      <section className="profile-card">
        <h1>Profile</h1>
        <p>Signed in as {user?.username}</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Current password
            <input
              type="password"
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          <label>
            New password
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              autoComplete="new-password"
              required
            />
          </label>
          <label>
            Confirm new password
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              required
            />
          </label>
          {error ? <div className="error-box">{error}</div> : null}
          {success ? <div className="success-box">{success}</div> : null}
          <button type="submit" className="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Change password'}
          </button>
        </form>
      </section>
    </main>
  );
};

export default ProfilePage;
