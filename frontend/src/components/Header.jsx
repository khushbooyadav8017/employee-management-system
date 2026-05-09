import { useState } from 'react';
import { Search, Bell, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Header({ user, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      
      if (searchQuery.trim()) {
        navigate(`/dashboard?search=${encodeURIComponent(searchQuery)}`);
      } else {
        navigate(`/dashboard`);
      }
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    navigate('/dashboard');
  };

  return (
    <header className="header">
      <div className="header-title">
        <h1>Employees Management System</h1>
        <p>Manage and oversee your organization's workforce effectively.</p>
      </div>

      <div className="header-actions">
        <div className="header-search">
          <Search size={18} color="#A3AED0" />
          <input
            type="text"
            placeholder="Search anything (Press Enter)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {searchQuery && (
            <X size={16} color="#A3AED0" style={{ cursor: 'pointer' }} onClick={handleClear} title="Clear search" />
          )}
        </div>

        <div className="header-icons">
          <button className="icon-btn">
            <Bell size={20} />
          </button>

          <div className="user-profile">
            <img
              src={user?.avatar ? user.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
              alt="Profile"
              className="avatar"
              onClick={onLogout}
              style={{ cursor: 'pointer', background: '#F4F7FE', objectFit: 'cover' }}
              title="Click to logout"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
