import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DoctorPage.css";

const DoctorPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("consultations");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const handleLogout = () => {
    setShowLogoutPopup(true);
    setTimeout(() => {
      setShowLogoutPopup(false);
      navigate("/doctor-login");
    }, 1000);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "consultations":
        return <Consultations />;
      case "appointments":
        return <Appointments />;
      case "patients":
        return <Patients />;
      case "prescriptions":
        return <Prescriptions />;
      case "communication":
        return <Communications />;
      case "support":
        return <Support />;
      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="doctor-page">
      {/* Header */}
      <header className="doctor-header">
        <div className="header-left">
          <img 
            src="vite.svg" 
            alt="Hospital Logo" 
            className="header-logo"
          />
        </div>
        <div className="header-right">
          <div className="user-info">
            <i className="fas fa-user-md user-icon"></i>
            <span className="user-name">Dr. John Smith</span>
            <button className="logout-button" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Logout Popup */}
      {showLogoutPopup && (
        <div className="logout-popup">
          <i className="fas fa-spinner fa-spin"></i>
          Logging out...
        </div>
      )}

      {/* Main Content Area */}
      <div className="main-area">
        {/* Sidebar */}
        <aside className="sidebar">
          {[
            "Consultations",
            "Appointments",
            "Patients",
            "Prescriptions",
            "Communication",
            "Support"
          ].map((item) => (
            <button
              key={item}
              className={`nav-button ${
                activeSection === item.toLowerCase() ? "active" : ""
              }`}
              onClick={() => setActiveSection(item.toLowerCase())}
            >
              {item}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="content">
          <div className="content-container">
            <h2 className="page-title">
              <i className={`fas ${getIconForSection(activeSection)}`}></i>
              {activeSection}
            </h2>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

const getIconForSection = (section) => {
  const icons = {
    consultations: "fa-stethoscope",
    appointments: "fa-calendar-plus",
    patients: "fa-users",
    prescriptions: "fa-prescription",
    communication: "fa-comments",
    support: "fa-headset"
  };
  return icons[section] || "fa-circle";
};

// Enhanced Consultations Section with Video Call Feature
const Consultations = () => (
  <div className="consultations-wrapper">
    <div className="consultations-grid">
      {/* Live Consultations - Simplified */}
      <div className="consultation-card">
        <div className="card-header">
          <i className="fas fa-video"></i>
          <h3>Live Consultations</h3>
        </div>
        <div className="card-content">
          <div className="consultation-entry active">
            <div className="patient-status online"></div>
            <h3 className="patient-name">John Doe</h3>
            <p className="consultation-type">Heart Checkup</p>
            <p className="consultation-time">
              <i className="far fa-clock"></i> In Progress (Started 10 mins ago)
            </p>
            <button className="join-call-btn">Join Call</button>
          </div>
          <div className="notes-section">
            <textarea 
              className="quick-notes" 
              placeholder="Type your consultation notes here..."
            ></textarea>
            <div className="quick-actions">
              <button className="action-btn template">
                <i className="fas fa-file-medical"></i> Use Template
              </button>
              <button className="action-btn save">
                <i className="fas fa-save"></i> Save Notes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Consultations */}
      <div className="consultation-card">
        <div className="card-header">
          <i className="fas fa-calendar-check"></i>
          <h3>Upcoming Consultations</h3>
        </div>
        <div className="card-content">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="consultation-entry">
              <h3 className="patient-name">Emma Thompson</h3>
              <p className="consultation-type">First Consultation</p>
              <div className="time-slot">
                <i className="far fa-calendar"></i>
                <span>Tomorrow, 10:00 AM</span>
              </div>
              <button className="view-details-btn">View Details</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Enhanced Patients Section with Analytics
const Patients = () => (
  <div className="patients-grid">
    {/* Active Patients */}
    <div className="patient-card">
      <div className="card-header">
        <i className="fas fa-user-circle" style={{ color: '#0066ff' }}></i>
        <h3>Active Patients</h3>
      </div>
      <div className="card-content">
        <div className="patient-entry">
          <h3 className="patient-name">Sarah Parker</h3>
          <p className="patient-info">Age: 28 | Female</p>
          <p className="patient-condition">Chronic Migraine</p>
          <div className="last-visit">
            <i className="far fa-calendar"></i>
            <span>Last Visit: 2 weeks ago</span>
          </div>
          <div className="patient-actions">
            <button className="view-history-btn">View History</button>
            <button className="schedule-btn">Schedule Visit</button>
          </div>
        </div>
      </div>
    </div>

    {/* New Patient Requests */}
    <div className="patient-card">
      <div className="card-header">
        <i className="fas fa-user-plus" style={{ color: '#0066ff' }}></i>
        <h3>New Patient Requests</h3>
      </div>
      <div className="card-content">
        <div className="patient-entry">
          <h3 className="patient-name">Emma Thompson</h3>
          <p className="patient-info">Age: 35 | Female</p>
          <p className="request-reason">Reason: Initial Consultation</p>
          <div className="preferred-time">
            <i className="far fa-clock"></i>
            <span>Preferred: Morning Sessions</span>
          </div>
          <div className="request-actions">
            <button className="accept-btn">Accept</button>
            <button className="reject-btn">Decline</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Appointments = () => (
  <div className="appointments-grid">
    {/* Today's Schedule */}
    <div className="appointment-card">
      <div className="card-header">
        <i className="fas fa-calendar" style={{ color: '#0066ff' }}></i>
        <h3>Today's Schedule</h3>
      </div>
      <div className="card-content">
        <div className="appointment-entry">
          <h3 className="patient-name">Sarah Parker</h3>
          <p className="appointment-type">Follow-up</p>
          <div className="time-slot">
            <i className="far fa-clock"></i>
            <span>Today, 11:30 AM</span>
          </div>
          <button className="view-details-btn">View Details</button>
        </div>
      </div>
    </div>

    {/* New Requests */}
    <div className="appointment-card">
      <div className="card-header">
        <i className="fas fa-inbox" style={{ color: '#0066ff' }}></i>
        <h3>New Requests</h3>
      </div>
      <div className="card-content">
        <div className="appointment-entry">
          <h3 className="patient-name">Emma Thompson</h3>
          <p className="appointment-type">First Consultation</p>
          <div className="time-slot">
            <i className="far fa-clock"></i>
            <span>Tomorrow, 10:00 AM</span>
          </div>
          <div className="request-actions">
            <button className="accept-btn">Accept</button>
            <button className="reject-btn">Decline</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Prescriptions = () => (
  <div className="prescriptions-grid">
    {/* Active Prescriptions */}
    <div className="prescription-card">
      <div className="card-header">
        <i className="fas fa-prescription" style={{ color: '#0066ff' }}></i>
        <h3>Active Prescriptions</h3>
      </div>
      <div className="card-content">
        <div className="prescription-entry">
          <h3 className="patient-name">Sarah Parker</h3>
          <p className="medication-name">Amoxicillin 500mg</p>
          <div className="prescription-details">
            <div className="dosage">
              <i className="fas fa-pills"></i>
              <span>1 tablet, twice daily</span>
            </div>
            <div className="duration">
              <i className="far fa-calendar"></i>
              <span>7 days (ends 20 Mar)</span>
            </div>
          </div>
          <div className="prescription-actions">
            <button className="view-details-btn">View Details</button>
            <button className="renew-btn">Renew</button>
          </div>
        </div>
      </div>
    </div>

    {/* New Prescription Requests */}
    <div className="prescription-card">
      <div className="card-header">
        <i className="fas fa-file-medical" style={{ color: '#0066ff' }}></i>
        <h3>Prescription Requests</h3>
      </div>
      <div className="card-content">
        <div className="prescription-entry">
          <h3 className="patient-name">Emma Thompson</h3>
          <p className="medication-name">Lisinopril 10mg</p>
          <div className="request-info">
            <i className="far fa-clock"></i>
            <span>Requested: Today, 9:30 AM</span>
          </div>
          <div className="request-actions">
            <button className="accept-btn">Approve</button>
            <button className="reject-btn">Decline</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Communications = () => (
  <div className="communications-grid">
    {/* Messages */}
    <div className="communication-card">
      <div className="card-header">
        <i className="fas fa-envelope" style={{ color: '#0066ff' }}></i>
        <h3>Messages</h3>
      </div>
      <div className="card-content">
        <div className="message-entry">
          <div className="message-header">
            <h3 className="sender-name">Sarah Parker</h3>
            <span className="message-time">Today, 10:30 AM</span>
          </div>
          <p className="message-preview">Question about medication side effects...</p>
          <div className="message-status">
            <i className="fas fa-circle" style={{ color: '#dc3545' }}></i>
            <span>Urgent</span>
          </div>
          <div className="message-actions">
            <button className="reply-btn">Reply</button>
            <button className="view-thread-btn">View Thread</button>
          </div>
        </div>
        <div className="message-entry">
          <div className="message-header">
            <h3 className="sender-name">Emma Thompson</h3>
            <span className="message-time">Yesterday, 3:45 PM</span>
          </div>
          <p className="message-preview">Follow-up appointment request...</p>
          <div className="message-status">
            <i className="fas fa-circle" style={{ color: '#28a745' }}></i>
            <span>General</span>
          </div>
          <div className="message-actions">
            <button className="reply-btn">Reply</button>
            <button className="view-thread-btn">View Thread</button>
          </div>
        </div>
      </div>
    </div>

    {/* Notifications */}
    <div className="communication-card">
      <div className="card-header">
        <i className="fas fa-bell" style={{ color: '#0066ff' }}></i>
        <h3>Notifications</h3>
      </div>
      <div className="card-content">
        <div className="notification-entry">
          <div className="notification-icon">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="notification-content">
            <h3 className="notification-title">Appointment Confirmed</h3>
            <p className="notification-message">Dr. Review scheduled for tomorrow at 2:30 PM</p>
            <span className="notification-time">30 minutes ago</span>
          </div>
          <button className="mark-read-btn">
            <i className="fas fa-check"></i>
          </button>
        </div>
        <div className="notification-entry">
          <div className="notification-icon">
            <i className="fas fa-file-medical"></i>
          </div>
          <div className="notification-content">
            <h3 className="notification-title">Lab Results Available</h3>
            <p className="notification-message">New test results ready for review</p>
            <span className="notification-time">2 hours ago</span>
          </div>
          <button className="mark-read-btn">
            <i className="fas fa-check"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
);

const Support = () => (
  <div className="support-grid">
    {/* Help Center */}
    <div className="support-card">
      <div className="card-header">
        <i className="fas fa-question-circle" style={{ color: '#0066ff' }}></i>
        <h3>Help Center</h3>
      </div>
      <div className="card-content">
        <div className="faq-entry">
          <h3 className="faq-title">Common Questions</h3>
          <div className="faq-item">
            <div className="faq-question">
              <i className="fas fa-caret-right"></i>
              <span>How do I schedule multiple appointments?</span>
            </div>
            <button className="view-answer-btn">View Answer</button>
          </div>
          <div className="faq-item">
            <div className="faq-question">
              <i className="fas fa-caret-right"></i>
              <span>How to update patient records?</span>
            </div>
            <button className="view-answer-btn">View Answer</button>
          </div>
          <div className="help-actions">
            <button className="support-btn">
              <i className="fas fa-book"></i>
              View All FAQs
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Contact Support */}
    <div className="support-card">
      <div className="card-header">
        <i className="fas fa-headset" style={{ color: '#0066ff' }}></i>
        <h3>Contact Support</h3>
      </div>
      <div className="card-content">
        <div className="support-options">
          <div className="support-option">
            <i className="fas fa-comments"></i>
            <h3>Live Chat</h3>
            <p>Chat with our support team</p>
            <button className="chat-btn">Start Chat</button>
          </div>
          <div className="support-option">
            <i className="fas fa-envelope"></i>
            <h3>Email Support</h3>
            <p>Get help via email</p>
            <button className="email-btn">Send Email</button>
          </div>
          <div className="support-contact">
            <i className="fas fa-phone"></i>
            <div className="contact-info">
              <h3>Phone Support</h3>
              <p>Available 24/7</p>
              <span className="phone-number">1-800-HEALTH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DoctorPage;