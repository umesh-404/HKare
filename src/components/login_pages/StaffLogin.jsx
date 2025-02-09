import './StaffLogin.css';

const StaffLogin = () => {
  return (
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
          <form className="login-form">
            <div className="form-group">
              <label htmlFor="staffId">Staff ID</label>
              <input 
                type="text" 
                id="staffId" 
                name="staffId" 
                placeholder="Enter your Staff ID" 
                required 
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
              />
            </div>

            <div className="forgot-password">
              <a href="/forgot-password">Forgot Password?</a>
            </div>

            <button type="submit" className="login-button">LOGIN</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;
