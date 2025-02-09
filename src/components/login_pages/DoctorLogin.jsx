import './DoctorLogin.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        doctorId: '',
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
            navigate('/doctor-dashboard');
        }, 1500);
    };

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
                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="form-group">
                                <label htmlFor="doctorId">Doctor ID</label>
                                <input 
                                    type="text" 
                                    id="doctorId" 
                                    name="doctorId" 
                                    value={formData.doctorId}
                                    onChange={handleChange}
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
                                    value={formData.password}
                                    onChange={handleChange}
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

export default DoctorLogin;
