import React from "react";
import "./DoctorPage.css";

const DoctorPage = () => {
  return (
    <div className="doctor-dashboard">
      
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Doctor Panel</h2>
        <nav className="nav-menu">
          <a href="#dashboard"><i class="fa-solid fa-user-md"></i> Dashboard</a>
          <a href="#appointments"><i class="fa-solid fa-calendar-alt"></i> Appointments</a>
          <a href="#patients"><i class="fa-solid fa-clipboard-list"></i> Patient Records</a>
          <a href="#messages"><i class="fa-solid fa-comment-dots"></i> Messages</a>
          <a href="#analytics"><i class="fa-solid fa-chart-line"></i> Analytics</a>
          <a href="/logout" className="logout"><i class="fa-solid fa-sign-out-alt"></i> Logout</a>
        </nav>
      </aside>

      {/* Main Dashboard Panel */}
      <main className="dashboard-content">
        
        {/* Doctor Profile */}
        <section className="doctor-profile">
          <img src="/path/to/doctor-profile.jpg" alt="Doctor" className="doctor-avatar" />
          <div>
            <h2>Dr. John Doe</h2>
            <p>Cardiologist | 10+ Years Experience</p>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="quick-stats">
          <div className="stat-card">
            <i class="fa-solid fa-calendar-alt stat-icon"></i>
            <h3>15</h3>
            <p>Today's Appointments</p>
          </div>
          <div className="stat-card">
            <i class="fa-solid fa-comment-dots stat-icon"></i>
            <h3>5</h3>
            <p>Unread Messages</p>
          </div>
          <div className="stat-card">
            <i class="fa-solid fa-clipboard-list stat-icon"></i>
            <h3>200</h3>
            <p>Total Patients</p>
          </div>
        </section>

        {/* Appointments Table */}
        <section className="appointments">
          <h2>Upcoming Appointments</h2>
          <table>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Alice Johnson</td>
                <td>Feb 10, 2025</td>
                <td>10:00 AM</td>
                <td>Confirmed</td>
              </tr>
              <tr>
                <td>Mark Spencer</td>
                <td>Feb 10, 2025</td>
                <td>11:30 AM</td>
                <td>Pending</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="other-sections">
          <div className="placeholder">📩 Messaging System (Coming Soon)</div>
          <div className="placeholder">📝 Prescription Management (Coming Soon)</div>
          <div className="placeholder">📊 Analytics (Coming Soon)</div>
        </section>
      
      </main>
    </div>
  );
};

export default DoctorPage;