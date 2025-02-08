import React, { useState, useEffect } from "react";
import "./HomePage.css";

const HomePage = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Initial loading animation
        setTimeout(() => {
            setIsLoading(false);
        }, 100); // Small delay to ensure everything is ready

        const handleScroll = () => {
            if (window.scrollY > 1) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <div className={`initial-loader ${!isLoading ? 'fade-out' : ''}`}>
                <img src="vite.svg" alt="Hospital Logo" className="logo" />
            </div>

            <div className={`homepage-wrapper ${isScrolled ? 'scrolled' : ''} ${!isLoading ? 'loaded' : ''}`}>
                <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
                    <div className="header-content">
                        <img src="vite.svg" alt="Hospital Logo" className="logo" />
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
                    <div className="hero-section-div1">
                        <p className="scroll-indicator">Scroll down for Info</p>
                        <img src="down-arrow.png" alt="down-arrow-1" className="down-arrow" />
                    </div>
                    <div className="hero-section-div2">
                        <i className="fa-solid fa-heart heart-icon"></i>
                        <h1>Your Health, Our Priority</h1><br />
                        <p>Providing world-class healthcare services at your fingertips.</p><br />
                        
                        <div className="info-cards-container">
                            <div className="cards-column left-column">
                                <div className="info-card">
                                    <h3>Overview of the Hospital Management System</h3>
                                </div>
                                <div className="info-card">
                                    <h3>Key Features & Functionalities</h3>
                                </div>
                                <div className="info-card">
                                    <h3>User Roles & Access Control</h3>
                                </div>
                                <div className="info-card">
                                    <h3>Benefits for Hospitals & Clinics</h3>
                                </div>
                            </div>
                            
                            <div className="cards-column right-column">
                                <div className="info-card">
                                    <h3>How Our System Works</h3>
                                </div>
                                <div className="info-card">
                                    <h3>Security & Compliance Measures</h3>
                                </div>
                                <div className="info-card">
                                    <h3>Success Stories & Testimonials</h3>
                                </div>
                                <div className="info-card">
                                    <h3>Get in Touch with Us</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default HomePage;