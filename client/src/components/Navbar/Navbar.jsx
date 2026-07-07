import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, Menu, X, PenLine, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  // Close mobile menu on resize
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth > 768) setMobileOpen(false);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const getInitial = () =>
    user?.username?.[0]?.toUpperCase() || '?';

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" aria-label="Roots home">
          Roots
        </Link>

        {/* Desktop nav links */}
        <ul className="navbar-links" role="list">
          {[
            { to: '/',        label: 'Home'    },
            { to: '/blog',    label: 'Blog'    },
            { to: '/about',   label: 'About'   },
            { to: '/contact', label: 'Contact' },
            { to: '/archive', label: 'Archive' },
          ].map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="navbar-actions">
          {/* Search */}
          <div className={`search-wrap ${searchOpen ? 'open' : ''}`}>
            {searchOpen ? (
              <form onSubmit={handleSearch} className="search-form">
                <input
                  ref={searchRef}
                  id="navbar-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search posts…"
                  className="search-input"
                  aria-label="Search posts"
                />
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                >
                  <X size={18} />
                </button>
              </form>
            ) : (
              <button
                className="icon-btn"
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
                id="navbar-search-toggle"
              >
                <Search size={18} />
              </button>
            )}
          </div>

          {/* Theme toggle */}
          <button
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            id="theme-toggle"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Auth area */}
          {user ? (
            <div className="avatar-dropdown" ref={dropdownRef}>
              <button
                className="avatar-btn"
                onClick={() => setDropdownOpen((o) => !o)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
                id="user-menu-btn"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.username} className="avatar avatar-sm" />
                ) : (
                  <span className="avatar-placeholder avatar-sm">{getInitial()}</span>
                )}
                <ChevronDown size={14} className={`chevron ${dropdownOpen ? 'up' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu" role="menu">
                  <div className="dropdown-user">
                    <span className="dropdown-username">@{user.username}</span>
                    <span className="dropdown-email">{user.email}</span>
                  </div>
                  <div className="dropdown-divider" />
                  <Link to="/write" className="dropdown-item" onClick={() => setDropdownOpen(false)} role="menuitem">
                    <PenLine size={15} /> Write a post
                  </Link>
                  <Link to={`/u/${user.username}`} className="dropdown-item" onClick={() => setDropdownOpen(false)} role="menuitem">
                    <User size={15} /> My Profile
                  </Link>
                  <Link to="/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)} role="menuitem">
                    <Settings size={15} /> Settings
                  </Link>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item danger" onClick={handleLogout} role="menuitem">
                    <LogOut size={15} /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/auth?tab=login" className="btn btn-ghost btn-sm">Log in</Link>
              <Link to="/auth?tab=signup" className="btn btn-primary btn-sm">Sign up</Link>
            </div>
          )}

          {/* Hamburger */}
          <button
            className="hamburger icon-btn"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            id="mobile-menu-btn"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu" role="dialog" aria-label="Mobile navigation">
          <ul className="mobile-links">
            {[
              { to: '/',        label: 'Home'    },
              { to: '/blog',    label: 'Blog'    },
              { to: '/about',   label: 'About'   },
              { to: '/contact', label: 'Contact' },
              { to: '/archive', label: 'Archive' },
            ].map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) => `mobile-link${isActive ? ' active' : ''}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
          <form onSubmit={handleSearch} className="mobile-search">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts…"
              className="form-input"
              aria-label="Mobile search"
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
          {!user && (
            <div className="mobile-auth">
              <Link to="/auth?tab=login" className="btn btn-outline" onClick={() => setMobileOpen(false)}>Log in</Link>
              <Link to="/auth?tab=signup" className="btn btn-primary" onClick={() => setMobileOpen(false)}>Sign up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
