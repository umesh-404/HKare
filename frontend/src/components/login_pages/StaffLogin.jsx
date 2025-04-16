import './StaffLogin.css';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const StaffLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    department: '',
    position: '',
    employeeId: ''
  });
  const [showLoginOverlay, setShowLoginOverlay] = useState(false);
  const [overlayMessage, setOverlayMessage] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    // Check if there's a success message from registration
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('This feature is under implementation. Please contact support if you need assistance.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setShowLoginOverlay(true);
    setOverlayMessage('Logging in...');
    
    try {
      console.log('Sending login request:', formData);
      const response = await axios.post('http://localhost:8080/api/auth/staff/login', formData);
      console.log('Login response:', response.data);
      console.log('authenticated value:', response.data.authenticated);
      
      // Additional debugging to see all properties
      for (const key in response.data) {
        console.log(`${key}: ${response.data[key]}`);
      }
      
      if (response.data.authenticated === true) {
        // Store user data in localStorage for session management
        const userData = {
          ...response.data,
          role: 'STAFF'
        };
        console.log('Setting user data in localStorage:', userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log('Navigating to /staff-dashboard');
        setOverlayMessage('Login successful! Redirecting...');
        // Use direct navigation instead of React Router
        setTimeout(() => {
          window.location.href = '/staff-dashboard';
        }, 1500);
      } else {
        console.log('Authentication failed:', response.data.message);
        setShowLoginOverlay(false);
        setError(response.data.message || 'Authentication failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setShowLoginOverlay(false);
      setError(err.response?.data?.message || 'Failed to connect to the server');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    // Basic validation
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setShowLoginOverlay(true);
    setOverlayMessage('Registering...');
    
    try {
      // Prepare data for API
      const registrationData = {
        email: registerData.email,
        password: registerData.password,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        phoneNumber: registerData.phoneNumber || null,
        dateOfBirth: registerData.dateOfBirth ? new Date(registerData.dateOfBirth).toISOString() : null,
        gender: registerData.gender || null,
        department: registerData.department,
        position: registerData.position || null,
        employeeId: registerData.employeeId || null
      };
      
      // Send registration request
      const response = await axios.post('http://localhost:8080/api/auth/staff/register', registrationData);
      
      setShowLoginOverlay(false);
      
      if (response.data.success) {
        setSuccessMessage(`Registration successful! Your Staff ID is: ${response.data.roleId}. Please use this ID and your password to login.`);
        setIsRegistering(false);
        // Reset form data
        setRegisterData({
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          phoneNumber: '',
          dateOfBirth: '',
          gender: '',
          department: '',
          position: '',
          employeeId: ''
        });
      } else {
        setError(response.data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setShowLoginOverlay(false);
      setError(err.response?.data?.message || 'An error occurred during registration.');
    }
  };

  return (
    <>
      <header className="login-header">
        <img src="/vite.svg" alt="Hospital Logo" className="header-logo" />
        <a href="#" onClick={() => navigate('/')} className="home-link">
          Go Back to Home
          <i className="fa-solid fa-right-from-bracket"></i>
        </a>
      </header>

      {/* Login Overlay */}
      {showLoginOverlay && (
        <div className="login-overlay">
          <div className="loading-spinner"></div>
          <p>{overlayMessage}</p>
        </div>
      )}

      <div className="login-container">
        <div className="login-section">
          {/* Left Side - Features */}
          <div className="features-section">
            <h3 className="features-title">Staff Portal Features</h3>
            
            <div className="feature-item">
              <i className="fa-solid fa-calendar-day feature-icon"></i>
              <div className="feature-text">
                <h4>Appointment Scheduling</h4>
                <p>Schedule and manage patient appointments efficiently</p>
              </div>
            </div>

            <div className="feature-item">
              <i className="fa-solid fa-hospital-user feature-icon"></i>
              <div className="feature-text">
                <h4>Patient Management</h4>
                <p>Register new patients and update patient information</p>
              </div>
            </div>

            <div className="feature-item">
              <i className="fa-solid fa-file-invoice feature-icon"></i>
              <div className="feature-text">
                <h4>Billing & Payments</h4>
                <p>Process patient payments and generate invoices</p>
              </div>
            </div>

            <div className="feature-item">
              <i className="fa-solid fa-clipboard-list feature-icon"></i>
              <div className="feature-text">
                <h4>Inventory Management</h4>
                <p>Track and manage hospital supplies and equipment</p>
              </div>
            </div>
          </div>

          {/* Right Side - Login/Register Form */}
          <div className="login-card">
            <h2 className="login-title">
              {isRegistering ? 'Staff Registration' : 'Staff Login'}
            </h2>
            <p className="login-subtitle">
              {isRegistering 
                ? 'Please complete the form to create your account' 
                : 'Please enter your details to login'}
            </p>
            
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
            
            {error && (
              <div className="error-message">{error}</div>
            )}
            
            {!isRegistering ? (
              // Login Form
              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="identifier">Staff ID</label>
                  <input 
                    type="text" 
                    id="identifier" 
                    name="identifier" 
                    value={formData.identifier}
                    onChange={handleChange}
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
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password" 
                    required 
                  />
                </div>

                <div className="form-links">
                  <a href="#" onClick={handleForgotPassword}>Forgot Password?</a>
                  <a href="#" onClick={(e) => {
                    e.preventDefault();
                    setIsRegistering(true);
                    setError('');
                    setSuccessMessage('');
                  }}>New User?</a>
                </div>

                <button type="submit" className="login-button">LOGIN</button>
              </form>
            ) : (
              // Registration Form
              <form onSubmit={handleRegisterSubmit} className="login-form register-form">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="Enter your email" 
                    required 
                    value={registerData.email}
                    onChange={handleRegisterChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      name="firstName" 
                      placeholder="First name" 
                      required 
                      value={registerData.firstName}
                      onChange={handleRegisterChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      name="lastName" 
                      placeholder="Last name" 
                      required 
                      value={registerData.lastName}
                      onChange={handleRegisterChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phoneNumber" 
                      name="phoneNumber" 
                      placeholder="Phone number" 
                      value={registerData.phoneNumber}
                      onChange={handleRegisterChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <input 
                      type="date" 
                      id="dateOfBirth" 
                      name="dateOfBirth" 
                      value={registerData.dateOfBirth}
                      onChange={handleRegisterChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select 
                    id="gender" 
                    name="gender" 
                    value={registerData.gender}
                    onChange={handleRegisterChange}
                    className="gender-select"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="department">Department</label>
                    <input 
                      type="text" 
                      id="department" 
                      name="department" 
                      placeholder="Department" 
                      required
                      value={registerData.department}
                      onChange={handleRegisterChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="position">Position</label>
                    <input 
                      type="text" 
                      id="position" 
                      name="position" 
                      placeholder="Job position" 
                      value={registerData.position}
                      onChange={handleRegisterChange}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="employeeId">Employee ID (if available)</label>
                  <input 
                    type="text" 
                    id="employeeId" 
                    name="employeeId" 
                    placeholder="Employee ID" 
                    value={registerData.employeeId}
                    onChange={handleRegisterChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="register-password">Password</label>
                  <input 
                    type="password" 
                    id="register-password" 
                    name="password" 
                    placeholder="Create a password" 
                    required 
                    value={registerData.password}
                    onChange={handleRegisterChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    placeholder="Confirm your password" 
                    required 
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                  />
                </div>

                <div className="form-links">
                  <a href="#" onClick={(e) => {
                    e.preventDefault();
                    setIsRegistering(false);
                    setError('');
                    setSuccessMessage('');
                  }}>Already have an account? Login</a>
                </div>

                <button type="submit" className="login-button">REGISTER</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffLogin;
