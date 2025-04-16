import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DoctorPage.css";
import axios from "axios";

const DoctorPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("consultations");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      // Redirect to login if no user data found
      navigate('/doctor-login');
      return;
    }
    setUserData(user);
  }, [navigate]);

  const handleLogout = () => {
    setShowLogoutPopup(true);
    setTimeout(() => {
      localStorage.removeItem('user'); // Clear user data
      setShowLogoutPopup(false);
      navigate("/doctor-login");
    }, 1500);
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
      case "profile":
        return <Profile userData={userData} />;
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
            src="/vite.svg" 
            alt="Hospital Logo" 
            className="header-logo"
          />
        </div>
        <div className="header-right">
          <div className="user-info">
            <i className="fas fa-user-md user-icon"></i>
            <span className="user-name">Dr. {userData ? `${userData.firstName} ${userData.lastName}` : 'Doctor'}</span>
            <button className="logout-button" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Logout Popup */}
      {showLogoutPopup && (
        <div className="login-overlay">
          <div className="loading-spinner"></div>
          <p>Logging you out...</p>
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
            "Support",
            "Profile"
          ].map((item) => (
            <button
              key={item}
              className={`nav-button ${
                activeSection === item.toLowerCase().replace(" ", "-") ? "active" : ""
              }`}
              onClick={() => setActiveSection(item.toLowerCase().replace(" ", "-"))}
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
              {activeSection.replace("-", " ")}
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
    support: "fa-headset",
    profile: "fa-user-circle"
  };
  return icons[section] || "fa-circle";
};

// Profile Section
const Profile = ({ userData }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    specialization: '',
    qualification: '',
    experienceYears: '',
    licenseNumber: '',
    consultationFee: '',
    bio: '',
    departmentId: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    // Fetch departments for dropdown
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/departments');
        setDepartments(response.data);
      } catch (err) {
        console.error('Error fetching departments:', err);
      }
    };
    
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (userData) {
      // Fetch detailed doctor profile
      const fetchDoctorDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/doctors/${userData.roleId}`);
          const doctorData = response.data;
          
          // Format date of birth if exists
          let formattedDob = '';
          if (doctorData.user?.dateOfBirth) {
            const dob = new Date(doctorData.user.dateOfBirth);
            formattedDob = dob.toISOString().split('T')[0]; // Format as YYYY-MM-DD
          }
          
          setFormData({
            firstName: doctorData.firstName || '',
            lastName: doctorData.lastName || '',
            email: doctorData.user?.email || '',
            phoneNumber: doctorData.user?.phoneNumber || '',
            address: doctorData.user?.address || '',
            dateOfBirth: formattedDob,
            gender: doctorData.user?.gender || '',
            specialization: doctorData.specialization || '',
            qualification: doctorData.qualification || '',
            experienceYears: doctorData.experienceYears?.toString() || '',
            licenseNumber: doctorData.licenseNumber || '',
            consultationFee: doctorData.consultationFee?.toString() || '',
            bio: doctorData.bio || '',
            departmentId: doctorData.department?.departmentId?.toString() || ''
          });
        } catch (err) {
          console.error('Error fetching doctor details:', err);
          setError('Failed to load profile information. Please try again later.');
          
          // Fall back to basic user data if available
          if (userData) {
            setFormData(prevData => ({
              ...prevData,
              firstName: userData.firstName || '',
              lastName: userData.lastName || '',
              email: userData.email || ''
            }));
          }
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchDoctorDetails();
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);
    
    try {
      // Prepare data for API
      const updateData = {
        ...formData,
        experienceYears: formData.experienceYears ? parseInt(formData.experienceYears) : null,
        consultationFee: formData.consultationFee ? parseFloat(formData.consultationFee) : null,
        departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null
      };
      
      // Send update request
      await axios.put(`http://localhost:8080/api/doctors/${userData.roleId}`, updateData);
      
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !formData.firstName) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading profile information...</p>
      </div>
    );
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <div className="profile-card-header">
          <div className="profile-header-left">
            <i className="fas fa-user-md"></i>
            <h3>Doctor Profile</h3>
          </div>
          <div className="profile-header-right">
            <button 
              className={`profile-edit-btn ${isEditing ? 'cancel' : ''}`}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <i className="fas fa-times"></i> Cancel
                </>
              ) : (
                <>
                  <i className="fas fa-edit"></i> Edit Profile
                </>
              )}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="profile-message error">
            <i className="fas fa-exclamation-circle"></i> {error}
          </div>
        )}
        
        {successMessage && (
          <div className="profile-message success">
            <i className="fas fa-check-circle"></i> {successMessage}
          </div>
        )}
        
        <div className="profile-card-body">
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="profile-section">
              <h4 className="profile-section-title">Basic Information</h4>
              <div className="profile-form-row">
                <div className="profile-form-group">
                  <label>Doctor ID</label>
                  <input 
                    type="text" 
                    value={userData?.roleId || ''} 
                    disabled 
                    className="profile-form-field" 
                  />
                </div>
                <div className="profile-form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange}
                    disabled={true} // Email cannot be changed
                    className="profile-form-field" 
                  />
                </div>
              </div>
              
              <div className="profile-form-row">
                <div className="profile-form-group">
                  <label>First Name</label>
                  <input 
                    type="text" 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="profile-form-field" 
                    required
                  />
                </div>
                <div className="profile-form-group">
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="profile-form-field" 
                    required
                  />
                </div>
              </div>
              
              <div className="profile-form-row">
                <div className="profile-form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    name="phoneNumber" 
                    value={formData.phoneNumber} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="profile-form-field" 
                  />
                </div>
                <div className="profile-form-group">
                  <label>Date of Birth</label>
                  <input 
                    type="date" 
                    name="dateOfBirth" 
                    value={formData.dateOfBirth} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="profile-form-field" 
                  />
                </div>
              </div>
              
              <div className="profile-form-row">
                <div className="profile-form-group">
                  <label>Gender</label>
                  <select 
                    name="gender" 
                    value={formData.gender} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="profile-form-field"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="profile-form-group wide">
                  <label>Address</label>
                  <textarea 
                    name="address" 
                    value={formData.address} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="profile-form-field" 
                    rows="2"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="profile-section">
              <h4 className="profile-section-title">Professional Information</h4>
              <div className="profile-form-row">
                <div className="profile-form-group">
                  <label>Specialization</label>
                  <input 
                    type="text" 
                    name="specialization" 
                    value={formData.specialization} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="profile-form-field" 
                  />
                </div>
                <div className="profile-form-group">
                  <label>Department</label>
                  <select 
                    name="departmentId" 
                    value={formData.departmentId} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="profile-form-field"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.departmentId} value={dept.departmentId}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="profile-form-row">
                <div className="profile-form-group">
                  <label>Experience (Years)</label>
                  <input 
                    type="number" 
                    name="experienceYears" 
                    value={formData.experienceYears} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="profile-form-field" 
                  />
                </div>
                <div className="profile-form-group">
                  <label>Consultation Fee</label>
                  <input 
                    type="number" 
                    name="consultationFee" 
                    value={formData.consultationFee} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="profile-form-field" 
                  />
                </div>
              </div>
              
              <div className="profile-form-row">
                <div className="profile-form-group">
                  <label>Qualification</label>
                  <input 
                    type="text" 
                    name="qualification" 
                    value={formData.qualification} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="profile-form-field" 
                  />
                </div>
                <div className="profile-form-group">
                  <label>License Number</label>
                  <input 
                    type="text" 
                    name="licenseNumber" 
                    value={formData.licenseNumber} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="profile-form-field" 
                  />
                </div>
              </div>
              
              <div className="profile-form-row">
                <div className="profile-form-group wide">
                  <label>Professional Bio</label>
                  <textarea 
                    name="bio" 
                    value={formData.bio} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="profile-form-field" 
                    rows="4"
                  ></textarea>
                </div>
              </div>
            </div>
            
            {isEditing && (
              <div className="profile-actions">
                <button type="submit" className="profile-save-btn">
                  <i className="fas fa-save"></i> Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
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
            <h3 className="patient-name">Arun Patel</h3>
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
              <h3 className="patient-name">Priya Sharma</h3>
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
          <h3 className="patient-name">Meera Kapoor</h3>
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
          <h3 className="patient-name">Anjali Gupta</h3>
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
          <h3 className="patient-name">Meera Kapoor</h3>
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
          <h3 className="patient-name">Anjali Gupta</h3>
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
          <h3 className="patient-name">Meera Kapoor</h3>
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
          <h3 className="patient-name">Anjali Gupta</h3>
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
            <h3 className="sender-name">Meera Kapoor</h3>
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
            <h3 className="sender-name">Anjali Gupta</h3>
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