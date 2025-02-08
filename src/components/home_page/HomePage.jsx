import React, { useState, useEffect } from "react";
import "./HomePage.css";

const HomePage = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCard, setSelectedCard] = useState(null);

    // Card content mapping
    const cardContent = {
        "Overview of the Hospital Management System": `Our Hospital Management System (HMS) is a cutting-edge digital platform designed to streamline hospital operations, enhance patient care, and optimize administrative efficiency. With an intuitive interface and powerful backend capabilities, the system seamlessly integrates various hospital functions, including patient registration, appointment scheduling, medical records management, and billing. Whether for small clinics or large healthcare institutions, our HMS ensures smooth workflows, reducing manual workload and eliminating operational inefficiencies.`,
        
        "Key Features & Functionalities": `The system offers a comprehensive set of features tailored to meet the diverse needs of healthcare facilities. It includes modules for patient management, doctor and staff portals, appointment scheduling, medical history tracking, prescription management, billing, and real-time reporting. Additionally, it supports automated notifications, role-based access control, and seamless data synchronization across departments. These features collectively contribute to a more organized, efficient, and technology-driven healthcare environment.`,
        
        "User Roles & Access Control": `Our HMS implements a robust role-based access control (RBAC) system, ensuring that each user has access only to relevant information and functionalities. The platform includes separate dashboards for doctors, nurses, receptionists, staff, and administrators, each designed with specific tools and permissions. Doctors can access patient records and prescribe treatments, while receptionists manage appointments and patient registration. The system ensures secure, streamlined access for every user, protecting sensitive medical data from unauthorized access.`,
        
        "Benefits for Hospitals & Clinics": `Implementing our HMS brings significant advantages to healthcare institutions. It improves patient care by reducing waiting times, enabling quick access to medical records, and streamlining communication between departments. Hospitals benefit from automated workflows, which minimize paperwork, reduce human errors, and enhance financial management. Additionally, real-time analytics provide hospital administrators with actionable insights, aiding in better resource allocation and operational decision-making.`,
        
        "How Our System Works": `The HMS operates through a centralized digital platform that connects various hospital departments, ensuring a seamless flow of information. Patients can register online or at the reception, book appointments with available doctors, and access their medical history. Doctors receive real-time patient data, update prescriptions, and communicate with other medical professionals. The system also automates invoicing, inventory management, and compliance tracking, making hospital administration more efficient and error-free.`,
        
        "Security & Compliance Measures": `We prioritize data security and regulatory compliance to ensure patient confidentiality and system integrity. The HMS incorporates end-to-end encryption, multi-factor authentication, and regular security audits to safeguard sensitive information. It complies with healthcare industry standards such as HIPAA and GDPR, ensuring that patient records remain protected from unauthorized access or breaches. Additionally, role-based permissions and secure cloud storage further enhance data protection measures.`,
        
        "Success Stories & Testimonials": `Several hospitals and clinics have successfully implemented our HMS and witnessed remarkable transformations in their operations. Healthcare professionals appreciate the system's user-friendly interface, automation capabilities, and improved efficiency in managing patient records. Patients experience reduced waiting times and better appointment scheduling. Our testimonials highlight real-world success stories, showcasing how our HMS has revolutionized hospital management and elevated the quality of healthcare services.`,
        
        "Get in Touch with Us": `Are you looking to optimize your hospital’s operations with a smart and efficient management system? Our team is here to assist you with tailored solutions that meet your healthcare facility’s specific needs. Contact us today for a free demo and consultation! Whether you’re a small clinic or a multi-specialty hospital, our HMS is designed to help you enhance efficiency, security, and patient satisfaction. Reach out to us via email, phone, or our online contact form to learn more.`
    };

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

    const handleCardClick = (title) => {
        setSelectedCard(title);
    };

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
                                {Object.keys(cardContent).slice(0, 4).map((title) => (
                                    <div key={title} className="info-card" onClick={() => handleCardClick(title)}>
                                        <h3>{title}</h3>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="cards-column right-column">
                                {Object.keys(cardContent).slice(4).map((title) => (
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
                            <h2>{selectedCard}</h2>
                            <p>{cardContent[selectedCard]}</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default HomePage;