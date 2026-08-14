import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { lang, setLang, t, languages } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar-wrapper">
      <nav className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="nav-brand" onClick={() => setOpen(false)}>
          <div className="brand-icon">
            <span>🌱</span>
          </div>
          <div className="brand-text">
            <span className="brand-title">{t('brandName')}</span>
            <span className="brand-badge">ET</span>
          </div>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="nav-mobile-toggle"
          aria-label="Toggle navigation"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span />
          <span />
        </button>

        {/* Main Navigation Links */}
        <div className={`nav-menu ${open ? 'nav-menu-open' : ''}`}>
          <div className="nav-main-links">
            <Link
              to="/products"
              className={`nav-link ${isActive('/products') ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {t('browseProducts')}
            </Link>
            <Link
              to="/market-prices"
              className={`nav-link ${isActive('/market-prices') ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {t('marketPrices')}
            </Link>
            <Link
              to="/freight"
              className={`nav-link ${isActive('/freight') ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {t('logistics')}
            </Link>
            <Link
              to="/advisory"
              className={`nav-link ${isActive('/advisory') ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {t('cropAdvisory')}
            </Link>
          </div>

          <div className="nav-actions">
            {/* Language Switcher */}
            <div className="nav-lang-picker">
              <span className="lang-icon">🌐</span>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="nav-lang-select"
                aria-label="Select Language"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.native}
                  </option>
                ))}
              </select>
            </div>

            {/* Authenticated Links or Auth Buttons */}
            {!user ? (
              <div className="nav-auth-buttons">
                <Link to="/login" className="nav-link-subtle" onClick={() => setOpen(false)}>
                  {t('login')}
                </Link>
                <Link to="/register" className="nav-btn-primary" onClick={() => setOpen(false)}>
                  {t('register')}
                </Link>
              </div>
            ) : (
              <div className="nav-user-cluster">
                {(user.role === 'farmer' || user.role === 'cooperative') && (
                  <Link
                    to="/farmer/dashboard"
                    className={`nav-link-user ${isActive('/farmer/dashboard') ? 'active' : ''}`}
                    onClick={() => setOpen(false)}
                  >
                    {t('myDashboard')}
                  </Link>
                )}
                <Link
                  to="/orders"
                  className={`nav-link-user ${isActive('/orders') ? 'active' : ''}`}
                  onClick={() => setOpen(false)}
                >
                  {t('myOrders')}
                </Link>
                <Link
                  to="/messages"
                  className={`nav-link-user ${isActive('/messages') ? 'active' : ''}`}
                  onClick={() => setOpen(false)}
                >
                  {t('messages')}
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className={`nav-link-user ${isActive('/admin/dashboard') ? 'active' : ''}`}
                    onClick={() => setOpen(false)}
                  >
                    {t('adminDashboard')}
                  </Link>
                )}

                <NotificationBell />

                <div className="nav-user-pill">
                  <span className="user-avatar-initial">{user.name.charAt(0).toUpperCase()}</span>
                  <span className="user-name-short">{user.name.split(' ')[0]}</span>
                </div>

                <button onClick={handleLogout} className="nav-logout-btn" title="Logout">
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}


