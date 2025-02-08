import React, { useState } from "react";
import "./PatientPage.css";

const PatientPortal = () => {
  const [activeSection, setActiveSection] = useState("consultations");

  const renderContent = () => {
    switch (activeSection) {
      case "consultations":
        return <Consultations />;
      case "book-appointment":
        return <BookAppointment />;
      case "prescriptions":
        return <Prescriptions />;
      case "payments":
        return <Payments />;
      case "communication":
        return <Communication />;
      case "support":
        return <Support />;
      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <span className="patient-name">John Doe</span>
          <button className="logout-button">Logout</button>
        </div>
        <img src="/placeholder.svg" alt="Hospital Logo" className="hospital-logo" />
      </header>

      <div className="main-layout">
        {/* Sidebar */}
        <nav className="sidebar">
          {["Consultations", "Book Appointment", "Prescriptions", "Payments", "Communication", "Support"].map(
            (item) => (
              <button
                key={item}
                className={`sidebar-button ${
                  activeSection === item.toLowerCase().replace(" ", "-") ? "active" : ""
                }`}
                onClick={() => setActiveSection(item.toLowerCase().replace(" ", "-"))}
              >
                {item}
              </button>
            )
          )}
        </nav>

        {/* Main Content */}
        <main className="main-content">
          <h2 className="section-title">{activeSection.replace("-", " ")}</h2>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Sections
const Consultations = () => (
  <div className="section">
    <h3>Upcoming Consultations</h3>
    <ul className="list">
      <li className="list-item">
        <p><strong>Dr. Smith - Cardiology</strong></p>
        <p>Date: 15th August 2023</p>
        <p>Time: 10:00 AM</p>
      </li>
      <li className="list-item">
        <p><strong>Dr. Johnson - Neurology</strong></p>
        <p>Date: 20th August 2023</p>
        <p>Time: 2:00 PM</p>
      </li>
    </ul>
  </div>
);

const BookAppointment = () => (
  <div className="section">
    <h3>Book a New Appointment</h3>
    <form className="form">
      <div className="form-group">
        <label htmlFor="department">Department</label>
        <select id="department">
          <option>Cardiology</option>
          <option>Neurology</option>
          <option>Orthopedics</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="date">Preferred Date</label>
        <input type="date" id="date" />
      </div>
      <button type="submit" className="submit-button">
        Book Appointment
      </button>
    </form>
  </div>
);

const Prescriptions = () => (
  <div className="section">
    <h3>Your Prescriptions</h3>
    <ul className="list">
      <li className="list-item">
        <p><strong>Amoxicillin</strong></p>
        <p>Dosage: 500mg</p>
        <p>Frequency: 3 times a day</p>
        <p>Duration: 7 days</p>
      </li>
      <li className="list-item">
        <p><strong>Ibuprofen</strong></p>
        <p>Dosage: 400mg</p>
        <p>Frequency: As needed</p>
        <p>Duration: 5 days</p>
      </li>
    </ul>
  </div>
);

const Payments = () => (
  <div className="section">
    <h3>Payment History</h3>
    <table className="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>2023-08-01</td>
          <td>Consultation - Dr. Smith</td>
          <td>$150</td>
        </tr>
        <tr>
          <td>2023-07-15</td>
          <td>Lab Tests</td>
          <td>$75</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const Communication = () => (
  <div className="section">
    <h3>Messages</h3>
    <ul className="list">
      <li className="list-item">
        <p><strong>Dr. Smith</strong></p>
        <p>Subject: Follow-up on your last visit</p>
        <p className="text-muted">Received: 2023-08-05</p>
      </li>
    </ul>
  </div>
);

const Support = () => (
  <div className="section">
    <h3>Support</h3>
    <form className="form">
      <div className="form-group">
        <label htmlFor="subject">Subject</label>
        <input type="text" id="subject" />
      </div>
      <div className="form-group">
        <label htmlFor="message">Message</label>
        <textarea id="message" rows={4}></textarea>
      </div>
      <button type="submit" className="submit-button">
        Send Message
      </button>
    </form>
  </div>
);

export default PatientPortal;
