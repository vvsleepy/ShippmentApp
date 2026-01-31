import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ 
      background: 'rgba(10, 10, 12, 0.8)', 
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '80px'
        }}
      >
        
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #f9a8d4, #f472b6)',
              padding: '8px',
              borderRadius: '12px',
              display: 'flex',
              boxShadow: '0 8px 20px rgba(244,114,182,0.25)'
            }}
          >
            <Package color="black" size={24} />
          </div>
          <span>
            Shippment
            <span style={{ color: '#f472b6' }}>App</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div
          className="desktop-menu"
          style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'center'
          }}
        >
          <Link to="/" style={{ color: 'var(--text-secondary)' }}>
            Track
          </Link>
          
          {user ? (
            <>
              <Link to="/dashboard" style={{ color: 'var(--text-secondary)' }}>
                Dashboard
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Hi, {user.name || user.email}
                </span>

                <button
                  onClick={handleLogout}
                  className="btn btn-secondary"
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    background: 'rgba(244,114,182,0.1)',
                    color: '#f472b6',
                    border: '1px solid rgba(244,114,182,0.25)'
                  }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: 'var(--text-primary)' }}>
                Login
              </Link>

              <Link
                to="/register"
                className="btn btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #f9a8d4, #f472b6)',
                  color: 'black',
                  boxShadow: '0 8px 20px rgba(244,114,182,0.3)'
                }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          style={{ display: 'none', background: 'transparent' }}
        >
          {isOpen ? <X color="white" /> : <Menu color="white" />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
