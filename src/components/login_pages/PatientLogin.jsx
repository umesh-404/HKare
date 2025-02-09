import './PatientLogin.css';
import { useNavigate } from 'react-router-dom';

const PatientLogin = () => {
  const navigate = useNavigate();

  const handleNewUser = (e) => {
    e.preventDefault();
    alert("Please contact the administrator to create a new account.");
  };

  return (
    <>
      <header className="login-header">
        <img src="vite.svg" alt="Hospital Logo" className="header-logo" />
        <a href="#" onClick={() => navigate('/')} className="home-link">
          Go Back to Home
          <i className="fa-solid fa-right-from-bracket"></i>
        </a>
      </header>

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

export default PatientLogin;
