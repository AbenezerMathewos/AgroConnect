import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useCurrencyUnit } from '../context/CurrencyUnitContext';
import NotificationBell from './NotificationBell';



const ROLE_INFO = {
  admin: { label: '🛡️ Admin', class: 'role-admin' },
  farmer: { label: '👨‍🌾 Farmer', class: 'role-farmer' },
  cooperative: { label: '🏢 Union Coop', class: 'role-coop' },
  transporter: { label: '🚚 Logistics', class: 'role-transporter' },
  buyer: { label: '🛒 Buyer', class: 'role-buyer' },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { lang, setLang, t, languages } = useLanguage();
  const { theme, toggleTheme, isDark } = useTheme();
  const { currency, toggleCurrency } = useCurrencyUnit();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);



  const handleLogout = () => {
    setOpen(false);
    setUserMenuOpen(false);
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;
  const currentRole = user?.role || 'public';
  const roleMeta = ROLE_INFO[currentRole] || { label: 'User', class: 'role-buyer' };

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`navbar-wrapper nav-theme-${currentRole === 'admin' ? 'admin' : 'emerald'}`}>
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
              🌾 Marketplace
            </Link>
            <Link
              to="/market-prices"
              className={`nav-link ${isActive('/market-prices') ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              📊 Price Radar
            </Link>
            <Link
              to="/freight"
              className={`nav-link ${isActive('/freight') ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              🚚 Freight
            </Link>
            <Link
              to="/advisory"
              className={`nav-link ${isActive('/advisory') ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              🌿 Crop AI
            </Link>
          </div>


          <div className="nav-actions">
            {/* Currency Switcher */}
            <button
              onClick={toggleCurrency}
              className="nav-currency-btn"
              title={`Active Currency: ${currency}. Click to switch to ${currency === 'ETB' ? 'USD ($)' : 'ETB (ብር)'}`}
            >
              <span>{currency === 'ETB' ? '🇪🇹 ETB' : '🇺🇸 USD'}</span>
            </button>

            {/* Theme Toggler Button */}
            <button
              onClick={toggleTheme}
              className={`nav-theme-toggle-btn ${isDark ? 'active-dark' : 'active-light'}`}
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={isDark ? '☀️ Switch to Light Mode' : '🌙 Switch to Dark Mode'}
            >
              <span className="theme-toggle-icon">{isDark ? '☀️' : '🌙'}</span>
              <span className="theme-toggle-label">{isDark ? 'Light' : 'Dark'}</span>
            </button>


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
              <div className="nav-user-cluster" ref={userMenuRef}>
                {/* Fast Action: Dashboard Button */}
                {(user.role === 'farmer' || user.role === 'cooperative') && (
                  <Link
                    to="/farmer/dashboard"
                    className={`nav-btn-action ${isActive('/farmer/dashboard') ? 'active' : ''}`}
                    onClick={() => setOpen(false)}
                  >
                    👨‍🌾 Dashboard
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className={`nav-btn-action ${isActive('/admin/dashboard') ? 'active' : ''}`}
                    onClick={() => setOpen(false)}
                  >
                    🛡️ Admin Panel
                  </Link>
                )}

                {/* Unread Notifications */}
                <NotificationBell />

                {/* User Dropdown Menu Button */}
                <div className="user-dropdown-container">
                  <button
                    className={`nav-user-pill-btn ${userMenuOpen ? 'active' : ''}`}
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    aria-expanded={userMenuOpen}
                  >
                    <span className="user-avatar-initial">{user.name.charAt(0).toUpperCase()}</span>
                    <div className="user-info-stack">
                      <span className="user-name-short">{user.name.split(' ')[0]}</span>
                      <span className={`user-role-badge ${roleMeta.class}`}>{roleMeta.label}</span>
                    </div>
                    <span className="dropdown-caret">▾</span>
                  </button>

                  {/* Glassmorphic Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="user-glass-dropdown">
                      <div className="dropdown-user-header">
                        <strong>{user.name}</strong>
                        <small>{user.email}</small>
                      </div>
                      <hr className="dropdown-divider" />
                      {(user.role === 'farmer' || user.role === 'cooperative') && (
                        <Link
                          to="/farmer/dashboard"
                          className="dropdown-item"
                          onClick={() => { setUserMenuOpen(false); setOpen(false); }}
                        >
                          🌾 {t('myDashboard')}
                        </Link>
                      )}
                      {user.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          className="dropdown-item"
                          onClick={() => { setUserMenuOpen(false); setOpen(false); }}
                        >
                          🛡️ {t('adminDashboard')}
                        </Link>
                      )}
                      <Link
                        to="/orders"
                        className="dropdown-item"
                        onClick={() => { setUserMenuOpen(false); setOpen(false); }}
                      >
                        📦 {t('myOrders')}
                      </Link>
                      <Link
                        to="/messages"
                        className="dropdown-item"
                        onClick={() => { setUserMenuOpen(false); setOpen(false); }}
                      >
                        💬 {t('messages')}
                      </Link>
                      <hr className="dropdown-divider" />
                      <button onClick={handleLogout} className="dropdown-item dropdown-logout">
                        🚪 {t('logout')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
