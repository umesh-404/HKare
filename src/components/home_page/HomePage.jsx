import React, { useState, useEffect } from "react";
import "./HomePage.css";

const HomePage = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`homepage-wrapper ${isScrolled ? 'scrolled' : ''}`}>
      <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
        <div className="header-content">
          <img src="/path/to/logo.png" alt="Hospital Logo" className="logo" />
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
        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#doctors">Doctors</a>
          <a href="#appointments">Appointments</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>
        <button className="login-btn">Login / Register</button>
      </div>
    </div>
  );
};

export default HomePage;