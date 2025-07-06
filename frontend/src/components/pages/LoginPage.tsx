import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import { TUserLogin } from "../../lib/types";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { login, loading: isLoading } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    if (!email || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }
    
    try {
      const credentials: TUserLogin = {email: email, password: password}
      console.log("Logging in with:", credentials.email);
      await login(credentials, rememberMe);
    
      // Reset form
      setEmail("");
      setPassword("");
    
      // Redirect to home page after successful login
      navigate("/");

    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Invalid email or password");
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-box">
          <h1 className="auth-title">Login</h1>
          
          {/* Print error message if it exists */}
          {errorMessage && (
            <div className="auth-error">
              {errorMessage}
            </div>
          )}
          
          {/* Login form */}
          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="email">Email</label>
              <i className="fas fa-envelope auth-icon"></i>
              <input 
                id="email"
                className="auth-input" 
                type="email" 
                placeholder="Email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="auth-field">
              <label className="auth-label" htmlFor="password">Password</label>
              <i className="fas fa-lock auth-icon"></i>
              <input 
                id="password"
                className="auth-input" 
                type="password" 
                placeholder="Password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="auth-checkbox-container">
              <input 
                type="checkbox" 
                className="auth-checkbox" 
                id="remember" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <p className="auth-checkbox-label">Remember me</p>
            </div>
            
            <button 
              className={`auth-button ${isLoading ? 'is-loading' : ''}`} 
              type="submit"
              disabled={isLoading}
            >
              Login
            </button>
          </form>
          
          <div className="auth-footer">
            <p>Don't have an account? <Link to="/register" className="auth-link">Sign up</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}   