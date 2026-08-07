import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, logout } = useAuth();
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
        <span className="navbar-logo">🌾</span> Wolaita AgroConnect
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
          Browse Products
        </Link>
        <Link to="/market-prices" onClick={() => setOpen(false)}>
          Market Prices
        </Link>

        {!user && (
          <>
            <Link to="/login" onClick={() => setOpen(false)}>
              Login
            </Link>
            <Link to="/register" className="navbar-cta" onClick={() => setOpen(false)}>
              Register
            </Link>
          </>
        )}

        {user?.role === 'farmer' && (
          <Link to="/farmer/dashboard" onClick={() => setOpen(false)}>
            My Dashboard
          </Link>
        )}
        {(user?.role === 'farmer' || user?.role === 'buyer') && (
          <Link to="/orders" onClick={() => setOpen(false)}>
            My Orders
          </Link>
        )}
        {(user?.role === 'farmer' || user?.role === 'buyer') && (
          <Link to="/messages" onClick={() => setOpen(false)}>
            Messages
          </Link>
        )}
        {user?.role === 'admin' && (
          <Link to="/admin/dashboard" onClick={() => setOpen(false)}>
            Admin Dashboard
          </Link>
        )}

        {user && (
          <>
            <NotificationBell />
            <span className="navbar-user">
              Hi, {user.name.split(' ')[0]} <span className="navbar-role">({user.role})</span>
            </span>
            <button onClick={handleLogout} className="navbar-logout">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
