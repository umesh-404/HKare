import './StaffLogin.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import viteLogo from '/vite.svg'

const StaffLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    staffId: '',
    password: ''
  });
  const [showLoginOverlay, setShowLoginOverlay] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowLoginOverlay(true);
    setTimeout(() => {
      setShowLoginOverlay(false);
      navigate('/staff-dashboard');
    }, 1500);
  };

  const handleNewUser = (e) => {
    e.preventDefault();
    alert("Please contact the administrator to create a new account.");
  };

  return (
    <>
      <header className="login-header">
        <img src={viteLogo} alt="Hospital Logo" className="header-logo" />
        <a href="#" onClick={() => navigate('/')} className="home-link">
          Go Back to Home
          <i className="fa-solid fa-right-from-bracket"></i>
        </a>
      </header>

      {/* Login Overlay */}
      {showLoginOverlay && (
        <div className="login-overlay">
          <div className="loading-spinner"></div>
          <p>Logging you in...</p>
        </div>
      )}

      <div className="login-container">
        <div className="login-section">
          {/* Left Side - Features */}
          <div className="features-section">
            <h3 className="features-title">Staff Portal Features</h3>
            
            <div className="feature-item">
              <i className="fa-solid fa-user-check feature-icon"></i>
              <div className="feature-text">
                <h4>Patient Registration</h4>
                <p>Register new patients and manage patient information efficiently</p>
              </div>
            </div>

            <div className="feature-item">
              <i className="fa-solid fa-calendar-days feature-icon"></i>
              <div className="feature-text">
                <h4>Schedule Management</h4>
                <p>Manage appointments and coordinate with different departments</p>
              </div>
            </div>

            <div className="feature-item">
              <i className="fa-solid fa-boxes-stacked feature-icon"></i>
              <div className="feature-text">
                <h4>Inventory Control</h4>
                <p>Track and manage hospital supplies and equipment</p>
              </div>
            </div>

            <div className="feature-item">
              <i className="fa-solid fa-file-invoice feature-icon"></i>
              <div className="feature-text">
                <h4>Billing Management</h4>
                <p>Process payments and handle insurance claims</p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="login-card">
            <h2 className="login-title">Staff Login</h2>
            <p className="login-subtitle">Please enter your details to login</p>
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="staffId">Staff ID</label>
                <input 
                  type="text" 
                  id="staffId" 
                  name="staffId" 
                  placeholder="Enter your Staff ID" 
                  required 
                  value={formData.staffId}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder="Enter your password" 
                  required 
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="form-links">
                <a href="/forgot-password">Forgot Password?</a>
                <a href="#" onClick={handleNewUser}>New User?</a>
              </div>

              <button type="submit" className="login-button">LOGIN</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffLogin;
