import './DoctorLogin.css';

const DoctorLogin = () => {
  return (
    <div className="login-container">
      <div className="login-section">
        {/* Left Side - Features */}
        <div className="features-section">
          <h3 className="features-title">Doctor Portal Features</h3>
          
          <div className="feature-item">
            <i className="fa-solid fa-calendar-check feature-icon"></i>
            <div className="feature-text">
              <h4>Appointment Management</h4>
              <p>View and manage your daily appointments with real-time updates</p>
            </div>
          </div>

          <div className="feature-item">
            <i className="fa-solid fa-notes-medical feature-icon"></i>
            <div className="feature-text">
              <h4>Patient Records</h4>
              <p>Access and update patient medical histories and treatment plans</p>
            </div>
          </div>

          <div className="feature-item">
            <i className="fa-solid fa-prescription feature-icon"></i>
            <div className="feature-text">
              <h4>Prescription Management</h4>
              <p>Create and manage digital prescriptions efficiently</p>
            </div>
          </div>

          <div className="feature-item">
            <i className="fa-solid fa-chart-line feature-icon"></i>
            <div className="feature-text">
              <h4>Analytics Dashboard</h4>
              <p>Track patient progress and view performance metrics</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-card">
          <h2 className="login-title">Doctor Login</h2>
          <p className="login-subtitle">Please enter your details to login</p>
          <form className="login-form">
            <div className="form-group">
              <label htmlFor="doctorId">Doctor ID</label>
              <input 
                type="text" 
                id="doctorId" 
                name="doctorId" 
                placeholder="Enter your Doctor ID" 
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

export default DoctorLogin;
