import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LANGUAGE_STORAGE_KEY } from '../i18n';
import useGlossaryTranslation from '../i18n/useGlossaryTranslation';

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useGlossaryTranslation();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const handleLanguageChange = (event) => {
    const nextLang = event.target.value;
    i18n.changeLanguage(nextLang);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLang);
    }
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" />
          <div>
            <div className="brand-name">SAIGURU INDUSTRIES</div>
            <div className="brand-sub">{t('app.tagline')}</div>
          </div>
        </div>
        <nav className="topnav">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
            {t('nav.home')}
          </NavLink>
          <NavLink to="/estimate" className={({ isActive }) => (isActive ? 'active' : '')}>
            {t('nav.estimate')}
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => (isActive ? 'active' : '')}>
            {t('nav.history')}
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => (isActive ? 'active' : '')}>
            {t('nav.settings')}
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
            {t('nav.profile')}
          </NavLink>
          {user?.role === 'ADMIN' ? (
            <NavLink to="/admin/users" className={({ isActive }) => (isActive ? 'active' : '')}>
              {t('nav.userManagement')}
            </NavLink>
          ) : null}
        </nav>
        <div className="topbar-right">
          <label className="language-switcher">
            <span className="visually-hidden">{t('language.label')}</span>
            <select value={i18n.language} onChange={handleLanguageChange} aria-label={t('language.label')}>
              <option value="en">{t('language.englishShort')}</option>
              <option value="hi">{t('language.hindi')}</option>
              <option value="mr">{t('language.marathi')}</option>
            </select>
          </label>
          <span className="user-pill">{user?.username}</span>
          <button type="button" className="secondary" onClick={handleLogout}>
            {t('nav.logout')}
          </button>
        </div>
      </header>
      <Outlet />
    </div>
  );
};

export default AppLayout;
