import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  Plus,
  UserPlus
} from 'lucide-react';

function Sidebar() {
  const location = useLocation();

  const mainMenuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Tasks', icon: <CheckSquare size={20} />, path: '/tasks' },
    { name: 'Projects', icon: <UserPlus size={20} />, path: '/projects' },
    { name: 'Calendar', icon: <CalendarDays size={20} />, path: '/calendar' },
    { name: 'Analytics', icon: <BarChart3 size={20} />, path: '/analytics' },
    { name: 'Team', icon: <Users size={20} />, path: '/team' },
  ];

  const generalItems = [
    { name: 'Setting', icon: <Settings size={20} />, path: '/settings' },
    { name: 'Help', icon: <HelpCircle size={20} />, path: '/help' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <LayoutDashboard className="logo-icon" size={28} />
        <span>HR</span>
      </div>



      <div className="sidebar-menu">
        <div className="menu-section">MAIN MENU</div>
        {mainMenuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}

        <div className="menu-section">GENERAL</div>
        {generalItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </div>

      <div className="sidebar-footer">
        <Link to="/projects" style={{ textDecoration: 'none' }}>
          <button className="add-project-btn" style={{ width: '100%', marginBottom: '1rem' }}>
            <Plus size={20} />
            <span>Add Project</span>
          </button>
        </Link>
        <Link to="/team" style={{ textDecoration: 'none' }}>
          <button className="add-member-btn" style={{ width: '100%', marginTop: 0 }}>
            <UserPlus size={20} />
            <span>Add Member</span>
          </button>
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;
