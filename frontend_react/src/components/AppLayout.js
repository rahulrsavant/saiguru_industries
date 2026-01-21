import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" />
          <div>
            <div className="brand-name">SAIGURU INDUSTRIES</div>
            <div className="brand-sub">Metal products calculator</div>
          </div>
        </div>
        <nav className="topnav">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
            Home
          </NavLink>
          <NavLink to="/estimate" className={({ isActive }) => (isActive ? 'active' : '')}>
            Estimate
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => (isActive ? 'active' : '')}>
            History
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => (isActive ? 'active' : '')}>
            Settings
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
            Profile
          </NavLink>
          {user?.role === 'ADMIN' ? (
            <NavLink to="/admin/users" className={({ isActive }) => (isActive ? 'active' : '')}>
              User Management
            </NavLink>
          ) : null}
        </nav>
        <div className="topbar-right">
          <span className="user-pill">{user?.username}</span>
          <button type="button" className="secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      <Outlet />
    </div>
  );
};

export default AppLayout;
