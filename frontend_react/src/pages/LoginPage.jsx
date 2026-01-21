import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../utils/apiConfig';
import { useAuth } from '../context/AuthContext';
import useGlossaryTranslation from '../i18n/useGlossaryTranslation';

const LoginPage = () => {
  const { user, login } = useAuth();
  const location = useLocation();
  const { t } = useGlossaryTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorKey, setErrorKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/';

  if (user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorKey('');
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        setErrorKey('login.invalidCredentials');
        return;
      }
      const data = await response.json();
      login(data);
    } catch (err) {
      setErrorKey('login.unableToLogin');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page">
      <section className="auth-card">
        <h1>{t('login.title')}</h1>
        <p>{t('login.subtitle')}</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            {t('login.usernameOrEmail')}
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label>
            {t('login.password')}
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {errorKey ? <div className="error-box">{t(errorKey)}</div> : null}
          <button type="submit" className="primary" disabled={isSubmitting}>
            {isSubmitting ? t('login.signingIn') : t('login.login')}
          </button>
        </form>
      </section>
    </main>
  );
};

export default LoginPage;
