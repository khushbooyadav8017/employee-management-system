import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Dashboard from './components/Dashboard.jsx';
import EmployeeDetail from './components/EmployeeDetail.jsx';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import Tasks from './components/Tasks.jsx';
import Calendar from './components/Calendar.jsx';
import Analytics from './components/Analytics.jsx';
import Team from './components/Team.jsx';
import Projects from './components/Projects.jsx';
import Settings from './components/Settings.jsx';
import Help from './components/Help.jsx';
import './index.css';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    // Persist Dark Mode setting across reloads globally
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-theme');
    }
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <BrowserRouter>
      {user ? (
        <div className="app-container">
          <Sidebar />
          <main className="main-content">
            <Header user={user} onLogout={handleLogout} />
            <div className="page-content">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard user={user} />} />
                <Route path="/employee/:id" element={<EmployeeDetail />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/team" element={<Team />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/settings" element={<Settings user={user} setUser={setUser} />} />
                <Route path="/help" element={<Help />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Routes>
            </div>
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
