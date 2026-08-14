import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { lang, setLang, t, languages } = useLanguage();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand" onClick={() => setOpen(false)}>
        <span className="navbar-logo">🌱</span> {t('brandName')}
      </Link>

      <button
        className="navbar-toggle"
        aria-label="Toggle navigation"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className={open ? 'navbar-links open' : 'navbar-links'}>
        <Link to="/products" onClick={() => setOpen(false)}>
          {t('browseProducts')}
        </Link>
        <Link to="/market-prices" onClick={() => setOpen(false)}>
          {t('marketPrices')}
        </Link>
        <Link to="/freight" onClick={() => setOpen(false)}>
          {t('logistics')}
        </Link>
        <Link to="/advisory" onClick={() => setOpen(false)}>
          {t('cropAdvisory')}
        </Link>

        {/* Language Switcher */}
        <div className="language-selector">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="lang-select"
            aria-label="Select Language"
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.native}
              </option>
            ))}
          </select>
        </div>

        {!user && (
          <>
            <Link to="/login" onClick={() => setOpen(false)}>
              {t('login')}
            </Link>
            <Link to="/register" className="navbar-cta" onClick={() => setOpen(false)}>
              {t('register')}
            </Link>
          </>
        )}

        {(user?.role === 'farmer' || user?.role === 'cooperative') && (
          <Link to="/farmer/dashboard" onClick={() => setOpen(false)}>
            {t('myDashboard')}
          </Link>
        )}
        {(user?.role === 'farmer' || user?.role === 'buyer' || user?.role === 'cooperative') && (
          <Link to="/orders" onClick={() => setOpen(false)}>
            {t('myOrders')}
          </Link>
        )}
        {(user?.role === 'farmer' || user?.role === 'buyer' || user?.role === 'cooperative') && (
          <Link to="/messages" onClick={() => setOpen(false)}>
            {t('messages')}
          </Link>
        )}
        {user?.role === 'admin' && (
          <Link to="/admin/dashboard" onClick={() => setOpen(false)}>
            {t('adminDashboard')}
          </Link>
        )}

        {user && (
          <>
            <NotificationBell />
            <span className="navbar-user">
              Hi, {user.name.split(' ')[0]} <span className="navbar-role">({user.role})</span>
            </span>
            <button onClick={handleLogout} className="navbar-logout">
              {t('logout')}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

