import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/apiConfig';
import { authFetch } from '../utils/authFetch';
import { useAuth } from '../context/AuthContext';
import useGlossaryTranslation from '../i18n/useGlossaryTranslation';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useGlossaryTranslation();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorKey, setErrorKey] = useState('');
  const [successKey, setSuccessKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorKey('');
    setSuccessKey('');
    setIsSubmitting(true);
    try {
      const response = await authFetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: 'POST',
        body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
      });
      if (!response.ok) {
        setErrorKey('profile.errorChangePassword');
        return;
      }
      setSuccessKey('profile.successPasswordUpdated');
      logout();
      navigate('/login', { replace: true });
    } catch (err) {
      setErrorKey('profile.errorChangePasswordGeneric');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page">
      <section className="profile-card">
        <h1>{t('profile.title')}</h1>
        <p>{t('profile.signedInAs', { user: user?.username || '' })}</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            {t('profile.currentPassword')}
            <input
              type="password"
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          <label>
            {t('profile.newPassword')}
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              autoComplete="new-password"
              required
            />
          </label>
          <label>
            {t('profile.confirmNewPassword')}
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              autoComplete="new-password"
              required
            />
          </label>
          {errorKey ? <div className="error-box">{t(errorKey)}</div> : null}
          {successKey ? <div className="success-box">{t(successKey)}</div> : null}
          <button type="submit" className="primary" disabled={isSubmitting}>
            {isSubmitting ? t('profile.updating') : t('profile.changePassword')}
          </button>
        </form>
      </section>
    </main>
  );
};

export default ProfilePage;
