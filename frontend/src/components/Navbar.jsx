import { Link } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          EMS
        </Link>
        <div className="navbar-menu">
          <span className="navbar-user">Hello, {user.name}</span>
          <button className="btn btn-outline" onClick={onLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
