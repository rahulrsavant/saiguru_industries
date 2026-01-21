import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../utils/apiConfig';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { user, login } = useAuth();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/';

  if (user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        setError('Invalid username or password.');
        return;
      }
      const data = await response.json();
      login(data);
    } catch (err) {
      setError('Unable to login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page">
      <section className="auth-card">
        <h1>Sign in</h1>
        <p>Use your Saiguru Industries account to continue.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Username or email
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {error ? <div className="error-box">{error}</div> : null}
          <button type="submit" className="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </section>
    </main>
  );
};

export default LoginPage;
