import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import { loginUser } from "../apis/userApi";
import { TUserLogin } from "../../lib/types";
import { useToast } from "../ToastContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    if (!email || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }
    
    try {
      setIsLoading(true);
      const credentials: TUserLogin = {email: email, password: password}
      console.log("Logging in with:", credentials);
      const response = await loginUser(credentials); // throws error if login fails

      if (rememberMe) {
        // Persistent storage
        localStorage.setItem("token", response.access_token);
        localStorage.setItem("user", JSON.stringify(response.user));
      } else {
        // Session-only storage
        sessionStorage.setItem("token", response.access_token);
        sessionStorage.setItem("user", JSON.stringify(response.user));
      }

      // Show success toast
      showToast(`Welcome back, ${response.user.username}!`, "success");

      // Reset form
      setEmail("");
      setPassword("");
    
      // Redirect to home page after successful login
      navigate("/");

    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Invalid email or password");
    } finally {
      setIsLoading(false);  
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-box">
          <h1 className="auth-title">Login</h1>
          
          {errorMessage && (
            <div className="auth-error">
              <button className="auth-error-close" onClick={() => setErrorMessage("")}>×</button>
              {errorMessage}
            </div>
          )}
          
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
              <label htmlFor="remember" className="auth-checkbox-label">Remember me</label>
              <p>Remember me</p>
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