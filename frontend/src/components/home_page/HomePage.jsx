import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [redirectTarget, setRedirectTarget] = useState('');
    const [loginNotification, setLoginNotification] = useState({ show: false, message: '', type: '' });
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [logoutRedirectRole, setLogoutRedirectRole] = useState('');

    // Updated cardContent with specific icons for each card
    const cardContent = {
        "Overview of the HKare": {
            icon: "fa-solid fa-hospital",
            text: `Our Hospital Management System (HKare) is a cutting-edge digital platform designed to streamline hospital operations, enhance patient care, and optimize administrative efficiency. With an intuitive interface and powerful backend capabilities, the system seamlessly integrates various hospital functions, including patient registration, appointment scheduling, medical records management, and billing. Whether for small clinics or large healthcare institutions, Hkare ensures smooth workflows, reducing manual workload and eliminating operational inefficiencies.`
        },
        
        "Key Features & Functionalities": {
            icon: "fa-solid fa-list-check",
            text: `The system offers a comprehensive set of features tailored to meet the diverse needs of healthcare facilities. It includes modules for patient management, doctor and staff portals, appointment scheduling, medical history tracking, prescription management, billing, and real-time reporting. Additionally, it supports automated notifications, role-based access control, and seamless data synchronization across departments. These features collectively contribute to a more organized, efficient, and technology-driven healthcare environment.`
        },
        
        "User Roles & Access Control": {
            icon: "fa-solid fa-user-shield",
            text: `Our HKare implements a robust role-based access control (RBAC) system, ensuring that each user has access only to relevant information and functionalities. The platform includes separate dashboards for doctors, nurses, receptionists, staff, and administrators, each designed with specific tools and permissions. Doctors can access patient records and prescribe treatments, while receptionists manage appointments and patient registration. The system ensures secure, streamlined access for every user, protecting sensitive medical data from unauthorized access.`
        },
        
        "Benefits for Hospitals & Clinics": {
            icon: "fa-solid fa-chart-line",
            text: `Implementing our HKare brings significant advantages to healthcare institutions. It improves patient care by reducing waiting times, enabling quick access to medical records, and streamlining communication between departments. Hospitals benefit from automated workflows, which minimize paperwork, reduce human errors, and enhance financial management. Additionally, real-time analytics provide hospital administrators with actionable insights, aiding in better resource allocation and operational decision-making.`
        },
        
        "How Our System Works": {
            icon: "fa-solid fa-gears",
            text: `The HKare operates through a centralized digital platform that connects various hospital departments, ensuring a seamless flow of information. Patients can register online or at the reception, book appointments with available doctors, and access their medical history. Doctors receive real-time patient data, update prescriptions, and communicate with other medical professionals. The system also automates invoicing, inventory management, and compliance tracking, making hospital administration more efficient and error-free.`
        },
        
        "Security & Compliance Measures": {
            icon: "fa-solid fa-shield-halved",
            text: `We prioritize data security and regulatory compliance to ensure patient confidentiality and system integrity. The HKare incorporates end-to-end encryption, multi-factor authentication, and regular security audits to safeguard sensitive information. It complies with healthcare industry standards such as HIPAA and GDPR, ensuring that patient records remain protected from unauthorized access or breaches. Additionally, role-based permissions and secure cloud storage further enhance data protection measures.`
        },
        
        "Success Stories & Testimonials": {
            icon: "fa-solid fa-comments",
            text: `Several hospitals and clinics have successfully implemented our HKare and witnessed remarkable transformations in their operations. Healthcare professionals appreciate the system's user-friendly interface, automation capabilities, and improved efficiency in managing patient records. Patients experience reduced waiting times and better appointment scheduling. Our testimonials highlight real-world success stories, showcasing how our HKare has revolutionized hospital management and elevated the quality of healthcare services.`
        },
        
        "Get in Touch with Us": {
            icon: "fa-solid fa-phone",
            text: `Are you looking to optimize your hospital's operations with a smart and efficient management system? Our team is here to assist you with tailored solutions that meet your healthcare facility's specific needs. Contact us today for a free demo and consultation! Whether you're a small clinic or a multi-specialty hospital, our HKare is designed to help you enhance efficiency, security, and patient satisfaction. Reach out to us via email, phone, or our online contact form to learn more.`
        }
    };

    useEffect(() => {
        // Check if user is already logged in
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.role) {
                setLoggedInUser(user);
            }
        } catch (error) {
            console.error("Error checking user login:", error);
            localStorage.removeItem('user');
        }
    }, []);

    useEffect(() => {
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

    const handleCardClick = (title) => {
        setSelectedCard(title);
    };

    const handleLogout = (redirectToLogin = false, role = '') => {
        setIsRedirecting(true);
        setRedirectTarget('logout');
        
        setTimeout(() => {
            localStorage.removeItem('user');
            setLoggedInUser(null);
            
            if (redirectToLogin && role) {
                navigate(`/${role.toLowerCase()}-login`);
            } else {
                setIsRedirecting(false);
                window.location.reload(); // Refresh the page after logout
            }
        }, 1500);
    };

    const handleLoginClick = (role) => {
        // Check if already logged in
        if (loggedInUser) {
            const currentRole = loggedInUser.role;
            
            // If trying to access the same role they're logged in as
            if (currentRole === role.toUpperCase()) {
                setLoginNotification({
                    show: true,
                    message: `You are already logged in as ${currentRole}. Redirecting to dashboard...`,
                    type: 'info'
                });
                
                // Show the loading overlay for consistent user experience
                setIsRedirecting(true);
                setRedirectTarget(role);
                
                setTimeout(() => {
                    navigate(`/${role.toLowerCase()}-dashboard`);
                }, 2000);
                return;
            } 
            // If trying to access a different role than currently logged in
            else {
                setLogoutRedirectRole(role);
                setShowLogoutConfirm(true);
                return;
            }
        }
        
        // Normal login flow if not logged in
        setIsRedirecting(true);
        setRedirectTarget(role);
        setTimeout(() => {
            navigate(`/${role.toLowerCase()}-login`);
        }, 1500);
    };

    const handleDoctorLogin = () => {
        handleLoginClick('DOCTOR');
    };

    const handlePatientLogin = () => {
        handleLoginClick('PATIENT');
    };

    const handleStaffLogin = () => {
        handleLoginClick('STAFF');
    };

    return (
        <>
            {isRedirecting && (
                <div className="redirect-overlay">
                    <div className="loading-spinner"></div>
                    <p>
                        {redirectTarget === 'logout' 
                            ? 'Logging out...' 
                            : `Redirecting to ${redirectTarget.toLowerCase()} login...`}
                    </p>
                </div>
            )}
            
            {loginNotification.show && (
                <div className={`login-notification ${loginNotification.type}`}>
                    <i className={`fas ${loginNotification.type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}`}></i>
                    <p>{loginNotification.message}</p>
                </div>
            )}

            {showLogoutConfirm && (
                <div className="popup-overlay">
                    <div className="popup-content logout-confirm">
                        <h2>You are already logged in</h2>
                        <p>You are currently logged in as {loggedInUser.role}. Would you like to:</p>
                        <div className="logout-actions">
                            <button className="logout-btn" onClick={() => handleLogout(true, logoutRedirectRole)}>
                                Logout and go to {logoutRedirectRole} Login
                            </button>
                            <button className="cancel-btn" onClick={() => setShowLogoutConfirm(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="home-page">
                <div className={`homepage-wrapper ${isScrolled ? 'scrolled' : ''}`}>
                    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
                        <div className="header-content">
                            <img src="/main-logo.png" alt="Hospital Logo" className="logo" />
                            <div className="login-buttons">
                                <div className="DOCTOR" onClick={handleDoctorLogin}>
                                    <img src="doctor-image.svg" alt="Doctor" className="card-image" />
                                    <div className="label">DOCTOR</div>
                                </div>

                                <div className="PATIENT" onClick={handlePatientLogin}>
                                    <img src="patient-image.svg" alt="Patient" className="card-image" />
                                    <div className="label">PATIENT</div>
                                </div>

                                <div className="STAFF" onClick={handleStaffLogin}>
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
                                    {Object.entries(cardContent).slice(0, 4).map(([title, content]) => (
                                        <div key={title} className="info-card" onClick={() => handleCardClick(title)}>
                                            <h3>{title}</h3>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="cards-column right-column">
                                    {Object.entries(cardContent).slice(4).map(([title, content]) => (
                                        <div key={title} className="info-card" onClick={() => handleCardClick(title)}>
                                            <h3>{title}</h3>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Popup */}
                    {selectedCard && (
                        <div className="popup-overlay" onClick={() => setSelectedCard(null)}>
                            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                                <button className="close-button" onClick={() => setSelectedCard(null)}>×</button>
                                <div className="popup-header">
                                    <i className={`${cardContent[selectedCard].icon} popup-icon`}></i>
                                    <h2 className="popup-title">{selectedCard}</h2>
                                </div>
                                <p>{cardContent[selectedCard].text}</p>
                            </div>
                        </div>
                    )}
                </div>

                <footer className="footer">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h4>Contact Us</h4>
                            <p><i className="fa-solid fa-phone"></i> +1 (555) 123-4567</p>
                            <p><i className="fa-solid fa-envelope"></i> info@hospital.com</p>
                        </div>
                        <div className="footer-section">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><a href="#about">About Us</a></li>
                                <li><a href="#services">Services</a></li>
                                <li><a href="#contact">Contact</a></li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h4>Follow Us</h4>
                            <div className="social-links">
                                <a href="#"><i className="fa-brands fa-facebook"></i></a>
                                <a href="#"><i className="fa-brands fa-twitter"></i></a>
                                <a href="#"><i className="fa-brands fa-linkedin"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2024 Hospital Management System. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default HomePage;