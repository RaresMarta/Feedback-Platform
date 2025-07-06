import { Link } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="nav-section">
          <Link to="/" className="nav-brand">
            <img src="https://bytegrad.com/course-assets/js/1/logo.svg" alt="logo" />
          </Link>
          <div className="nav-links">
            {/* Account Dropdown */}
            <div className="dropdown">
              <button className="dropdown-button">
                Account
              </button>
              <div className="dropdown-content">
                {isLoggedIn ? (
                  <>
                    <div className="username">{user?.username}</div>
                    <Link to="/account">My Account</Link>
                    <button onClick={logout}>Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 