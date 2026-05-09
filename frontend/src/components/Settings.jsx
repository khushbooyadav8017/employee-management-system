import { useState, useEffect, useRef } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Check } from 'lucide-react';

function Settings({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Split user name simply by space, fallback to default if missing
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarStr, setAvatarStr] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      const nameParts = (user.name || 'Admin User').split(' ');
      setFirstName(nameParts[0]);
      setLastName(nameParts.slice(1).join(' '));
      setEmail(user.email || 'admin@opndoo.com');
      setAvatarStr(user.avatar || '');
    }
  }, [user]);

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 800000) { // 800KB roughly
        alert('File is too large! Maximum size is 800KB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setAvatarStr(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call to save settings
    setTimeout(() => {
      const updatedUser = {
        ...user,
        name: `${firstName} ${lastName}`.trim(),
        email: email,
        avatar: avatarStr
      };
      
      // Update local storage and app state
      localStorage.setItem('user', JSON.stringify(updatedUser));
      if (setUser) setUser(updatedUser);
      
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  const currentAvatarSrc = avatarStr 
    ? avatarStr 
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'AdminUser'}`;

  return (
    <div className="dashboard-card" style={{ background: 'transparent', boxShadow: 'none', padding: 0 }}>
      <div className="dashboard-toolbar" style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="toolbar-title">
          <SettingsIcon className="toolbar-icon" size={24} />
          <span>System Settings</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '1.5rem' }}>
        <div style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '1.25rem' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { id: 'profile', label: 'My Profile', icon: User },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'appearance', label: 'Appearance', icon: Palette }
            ].map(tab => (
              <li key={tab.id} style={{ marginBottom: '0.5rem' }}>
                <button 
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    background: activeTab === tab.id ? 'rgba(67, 24, 255, 0.1)' : 'transparent',
                    color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: activeTab === tab.id ? 600 : 500,
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ background: 'var(--card-bg)', padding: '2rem', borderRadius: '1.25rem', minHeight: '400px' }}>
          {activeTab === 'profile' && (
            <form onSubmit={handleSave}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Profile Information</h2>
              <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                <img 
                  src={currentAvatarSrc} 
                  alt="Avatar" 
                  style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--bg-color)', objectFit: 'cover' }}
                />
                <div>
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg, image/gif" 
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    onChange={handleAvatarUpload}
                  />
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    style={{ marginBottom: '0.5rem' }}
                    onClick={() => fileInputRef.current.click()}
                  >
                    Change Avatar
                  </button>
                  <p className="text-muted text-sm">JPG, GIF or PNG. Max size of 800K.</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                {saveSuccess && (
                  <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
                    <Check size={16} /> Profile updated successfully
                  </span>
                )}
              </div>
            </form>
          )}

          {activeTab === 'appearance' && (
            <div>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Interface Appearance</h2>
              
              <div style={{ padding: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>Dark Mode</h4>
                  <p className="text-muted text-sm" style={{ margin: 0 }}>Switch the entire workspace to dark-themed colors.</p>
                </div>
                
                <button 
                  onClick={() => {
                    const isDark = document.body.classList.contains('dark-theme');
                    if (isDark) {
                      document.body.classList.remove('dark-theme');
                      localStorage.setItem('theme', 'light');
                    } else {
                      document.body.classList.add('dark-theme');
                      localStorage.setItem('theme', 'dark');
                    }
                    // Force a re-render purely for the button state visually
                    setActiveTab('appearance'); 
                  }}
                  style={{
                    background: document.body.classList.contains('dark-theme') ? 'var(--primary)' : 'var(--border-color)',
                    border: 'none',
                    width: '50px',
                    height: '24px',
                    borderRadius: '12px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '2px',
                    left: document.body.classList.contains('dark-theme') ? '28px' : '2px',
                    width: '20px',
                    height: '20px',
                    background: 'white',
                    borderRadius: '50%',
                    transition: 'all 0.3s'
                  }}></div>
                </button>
              </div>
            </div>
          )}

          {activeTab !== 'profile' && activeTab !== 'appearance' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <SettingsIcon size={64} className="text-muted" style={{ marginBottom: '1rem', opacity: 0.2 }} />
              <h3 className="text-muted">Configuration Panel</h3>
              <p className="text-muted text-sm">This settings pane is currently under construction.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
