import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiUsers, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={isAdmin ? '/admin' : '/profile'} className="navbar-brand">
          <img src="/logo.png" alt="UserHub logo" className="brand-logo" />
        </Link>

        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <div className="navbar-links">
            {isAdmin && (
              <Link
                to="/admin"
                className={`navbar-link ${isActive('/admin') ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                <FiUsers />
                <span>Users</span>
              </Link>
            )}
            <Link
              to="/profile"
              className={`navbar-link ${isActive('/profile') ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <FiUser />
              <span>Profile</span>
            </Link>
          </div>

          <div className="navbar-user">
            <div className="user-info">
              <span className="user-name">{user?.fullName}</span>
              <span className={`user-role role-${user?.role}`}>
                {user?.role}
              </span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
