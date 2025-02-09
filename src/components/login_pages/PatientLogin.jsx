import './PatientLogin.css';

const PatientLogin = () => {
  return (
    <div className="login-container">
      <div className="login-section">
        {/* Left Side - Features */}
        <div className="features-section">
          <h3 className="features-title">Patient Portal Features</h3>
          
          <div className="feature-item">
            <i className="fa-solid fa-calendar-plus feature-icon"></i>
            <div className="feature-text">
              <h4>Book Appointments</h4>
              <p>Schedule appointments with doctors at your convenience</p>
            </div>
          </div>

          <div className="feature-item">
            <i className="fa-solid fa-file-medical feature-icon"></i>
            <div className="feature-text">
              <h4>Medical Records</h4>
              <p>Access your complete medical history and test results</p>
            </div>
          </div>

          <div className="feature-item">
            <i className="fa-solid fa-pills feature-icon"></i>
            <div className="feature-text">
              <h4>Prescription History</h4>
              <p>View and download your prescriptions and medications</p>
            </div>
          </div>

          <div className="feature-item">
            <i className="fa-solid fa-comments feature-icon"></i>
            <div className="feature-text">
              <h4>Online Consultation</h4>
              <p>Connect with doctors through virtual consultations</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-card">
          <h2 className="login-title">Patient Login</h2>
          <p className="login-subtitle">Please enter your details to login</p>
          <form className="login-form">
            <div className="form-group">
              <label htmlFor="patientId">Patient ID</label>
              <input 
                type="text" 
                id="patientId" 
                name="patientId" 
                placeholder="Enter your Patient ID" 
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

export default PatientLogin;
