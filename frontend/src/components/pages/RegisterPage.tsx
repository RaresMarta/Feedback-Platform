import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import { TUserRegister } from "../../lib/types";
import { registerUser } from "../apis/userApi";
import { useToast } from "../ToastContext";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    
    if (!username || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    
    try {
      setIsLoading(true);
      const credentials: TUserRegister = {username: username, email: email, password: password}
      console.log("Registering with:", credentials);
      await registerUser(credentials); // throws error if registration fails

      // Show success toast
      showToast("Registration successful! Please log in.", "success");

      // Reset form
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      
      // Redirect to login page after successful registration
      navigate("/login");
      
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-box">
          <h1 className="auth-title">Register</h1>
          
          {errorMessage && (
            <div className="auth-error">
              <button className="auth-error-close" onClick={() => setErrorMessage("")}>×</button>
              {errorMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="username">Username</label>
              <i className="fas fa-user auth-icon"></i>
              <input 
                id="username"
                className="auth-input" 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
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
            
            <div className="auth-field">
              <label className="auth-label" htmlFor="confirm-password">Confirm Password</label>
              <i className="fas fa-lock auth-icon"></i>
              <input 
                id="confirm-password"
                className="auth-input" 
                type="password" 
                placeholder="Confirm Password"
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <button 
              className={`auth-button ${isLoading ? 'is-loading' : ''}`} 
              type="submit"
              disabled={isLoading}
            >
              Register
            </button>
          </form>
          
          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" className="auth-link">Log in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}