import { NavLink, Outlet } from 'react-router-dom';

const AppLayout = () => (
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
      </nav>
      <div className="topbar-right">
        <span className="lang">English</span>
        <span className="topbar-note">Client-side only</span>
      </div>
    </header>
    <Outlet />
  </div>
);

export default AppLayout;
