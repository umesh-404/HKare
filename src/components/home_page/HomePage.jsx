import React from "react";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="homepage-wrapper">
      
      {/* Navigation Bar */}
      <header className="header">
        <img src="/path/to/logo.png" alt="Hospital Logo" className="logo" />
        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#doctors">Doctors</a>
          <a href="#appointments">Appointments</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>
        <button className="login-btn">Login / Register</button>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-text">
          <h1>Your Health, Our Priority</h1>
          <p>Providing world-class healthcare services at your fingertips.</p>
          <div className="hero-buttons">
            <button className="secondary-btn">Learn More</button>
          </div>
        </div>
      </section>

      <div className="home-container">
      <h2>Who Are You?</h2>
        <div className="login-buttons">
          <div className="DOCTOR">
            <img src="doctor-image.svg" alt="Doctor" className="card-image" />
            <div className="label">DOCTOR</div>
          </div>

          <div className="PATIENT">
            <img src="patient-image.svg" alt="Patient" className="card-image" />
            <div className="label">PATIENT</div>
          </div>

          <div className="STAFF">
            <img src="staff-image.svg" alt="Staff" className="card-image" />
            <div className="label">STAFF</div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>© 2025 HKare. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;
