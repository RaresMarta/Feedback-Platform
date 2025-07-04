import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";
import { TUserResponse } from "../../lib/types";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<TUserResponse | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");
    if (token && userString) {
      try {
        const userData = JSON.parse(userString);
        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

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
                    <button onClick={handleLogout}>Logout</button>
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