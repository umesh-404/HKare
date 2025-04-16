import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientPage.css";
import axios from "axios";

const PatientPortal = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("consultations");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      // Redirect to login if no user data found
      navigate('/patient-login');
      return;
    }
    setUserData(user);
  }, [navigate]);

  const handleLogout = () => {
    setShowLogoutPopup(true);
    setTimeout(() => {
      localStorage.removeItem('user'); // Clear user data
      setShowLogoutPopup(false);
      navigate("/patient-login");
    }, 1500);
  };

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
      case "profile":
        return <Profile userData={userData} />;
      default:
        return <div>Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="patient-page">
      {/* Header */}
      <header className="patient-header">
        <div className="header-left">
          <img 
            src="/vite.svg" 
            alt="Hospital Logo" 
            className="header-logo"
          />
        </div>
        <div className="header-right">
          <div className="user-info">
            <i className="fas fa-user user-icon"></i>
            <span className="user-name">{userData ? `${userData.firstName} ${userData.lastName}` : 'Patient'}</span>
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
          {["Consultations", "Book Appointment", "Prescriptions", "Payments", "Communication", "Support", "Profile"].map(
            (item) => (
              <button
                key={item}
                className={`nav-button ${
                  activeSection === item.toLowerCase().replace(" ", "-") ? "active" : ""
                }`}
                onClick={() => setActiveSection(item.toLowerCase().replace(" ", "-"))}
              >
                {item}
              </button>
            )
          )}
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
    'consultations': 'fa-stethoscope',
    'book-appointment': 'fa-calendar-plus',
    'prescriptions': 'fa-prescription',
    'payments': 'fa-credit-card',
    'communication': 'fa-comments',
    'support': 'fa-headset',
    'profile': 'fa-user-circle'
  };
  return icons[section] || 'fa-circle';
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
    bloodGroup: '',
    height: '',
    weight: '',
    allergies: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    insuranceProvider: '',
    insuranceId: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (userData) {
      // Fetch detailed patient profile
      const fetchPatientDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/patients/${userData.roleId}`);
          const patientData = response.data;
          
          // Format date of birth if exists
          let formattedDob = '';
          if (patientData.user?.dateOfBirth) {
            const dob = new Date(patientData.user.dateOfBirth);
            formattedDob = dob.toISOString().split('T')[0]; // Format as YYYY-MM-DD
          }
          
          setFormData({
            firstName: patientData.firstName || '',
            lastName: patientData.lastName || '',
            email: patientData.user?.email || '',
            phoneNumber: patientData.user?.phoneNumber || '',
            address: patientData.user?.address || '',
            dateOfBirth: formattedDob,
            gender: patientData.user?.gender || '',
            bloodGroup: patientData.bloodGroup || '',
            height: patientData.height?.toString() || '',
            weight: patientData.weight?.toString() || '',
            allergies: patientData.allergies || '',
            emergencyContactName: patientData.emergencyContactName || '',
            emergencyContactPhone: patientData.emergencyContactPhone || '',
            insuranceProvider: patientData.insuranceProvider || '',
            insuranceId: patientData.insuranceId || ''
          });
        } catch (err) {
          console.error('Error fetching patient details:', err);
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
      
      fetchPatientDetails();
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
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null
      };
      
      // Send update request
      await axios.put(`http://localhost:8080/api/patients/${userData.roleId}`, updateData);
      
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
            <i className="fas fa-id-card"></i>
            <h3>Patient Profile</h3>
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
                  <label>Patient ID</label>
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
              <h4 className="profile-section-title">Medical Information</h4>
              <div className="profile-form-row">
                <div className="profile-form-group">
                  <label>Blood Group</label>
                  <select 
                    name="bloodGroup" 
                    value={formData.bloodGroup} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="profile-form-field"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div className="profile-form-group">
                  <label>Height (cm)</label>
                  <input 
                    type="number" 
                    name="height" 
                    value={formData.height} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="profile-form-field" 
                  />
                </div>
                <div className="profile-form-group">
                  <label>Weight (kg)</label>
                  <input 
                    type="number" 
                    name="weight" 
                    value={formData.weight} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="profile-form-field" 
                  />
                </div>
              </div>
              
              <div className="profile-form-row">
                <div className="profile-form-group wide">
                  <label>Allergies</label>
                  <textarea 
                    name="allergies" 
                    value={formData.allergies} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="profile-form-field" 
                    rows="2"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="profile-section">
              <h4 className="profile-section-title">Emergency Contact</h4>
              <div className="profile-form-row">
                <div className="profile-form-group">
                  <label>Contact Name</label>
                  <input 
                    type="text" 
                    name="emergencyContactName" 
                    value={formData.emergencyContactName} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="profile-form-field" 
                  />
                </div>
                <div className="profile-form-group">
                  <label>Contact Phone</label>
                  <input 
                    type="tel" 
                    name="emergencyContactPhone" 
                    value={formData.emergencyContactPhone} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="profile-form-field" 
                  />
                </div>
              </div>
            </div>
            
            <div className="profile-section">
              <h4 className="profile-section-title">Insurance Information</h4>
              <div className="profile-form-row">
                <div className="profile-form-group">
                  <label>Insurance Provider</label>
                  <input 
                    type="text" 
                    name="insuranceProvider" 
                    value={formData.insuranceProvider} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="profile-form-field" 
                  />
                </div>
                <div className="profile-form-group">
                  <label>Insurance ID</label>
                  <input 
                    type="text" 
                    name="insuranceId" 
                    value={formData.insuranceId} 
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="profile-form-field" 
                  />
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

// Consultations Section
const Consultations = () => (
  <div className="consultations-wrapper">
    <div className="consultations-grid">
      {/* Upcoming Consultations */}
      <div className="consultation-card">
        <div className="consultation-card-header">
          <i className="fas fa-calendar-check"></i>
          <h3>Upcoming Consultations</h3>
        </div>
        <div className="consultation-card-body">
          <div className="consultation-entry">
            <p className="consultation-doctor">Dr. Patel - Cardiology</p>
            <p className="consultation-datetime">
              <i className="far fa-clock"></i> Today, 10:00 AM
            </p>
            <p className="consultation-mode">
              <i className="fas fa-video"></i> Video Consultation
            </p>
            <div className="consultation-actions">
              <button className="consultation-btn primary">Join Video Call</button>
              <button className="consultation-btn secondary">View Details</button>
            </div>
          </div>
        </div>
      </div>

      {/* Past Consultations */}
      <div className="consultation-card">
        <div className="consultation-card-header">
          <i className="fas fa-history"></i>
          <h3>Past Consultations</h3>
        </div>
        <div className="consultation-card-body">
          <div className="consultation-entry">
            <p className="consultation-doctor">Dr. Sharma - Cardiology</p>
            <p className="consultation-datetime">
              <i className="far fa-calendar-alt"></i> August 20, 2023
            </p>
            <p className="consultation-mode">
              <i className="fas fa-video"></i> Video Consultation
            </p>
            <div className="consultation-actions">
              <button className="consultation-btn link">View Report</button>
              <button className="consultation-btn link">Download Prescription</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const BookAppointment = () => (
  <div className="appointment-wrapper">
    <div className="appointment-grid">
      {/* Schedule Appointment Card */}
      <div className="appointment-card">
        <div className="appointment-card-header">
          <i className="fas fa-calendar-plus"></i>
          <h3>Schedule New Appointment</h3>
        </div>
        <div className="appointment-card-body">
          <form className="appointment-form">
            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-user-md"></i> Select Department
              </label>
              <select className="form-input">
                <option value="">Choose Department</option>
                <option value="cardiology">Cardiology</option>
                <option value="neurology">Neurology</option>
                <option value="orthopedics">Orthopedics</option>
                <option value="pediatrics">Pediatrics</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-calendar"></i> Preferred Date
              </label>
              <input type="date" className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-clock"></i> Preferred Time
              </label>
              <select className="form-input">
                <option value="">Select Time Slot</option>
                <option value="morning">Morning (9 AM - 12 PM)</option>
                <option value="afternoon">Afternoon (2 PM - 5 PM)</option>
                <option value="evening">Evening (6 PM - 9 PM)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-comment-medical"></i> Reason for Visit
              </label>
              <textarea className="form-input" rows="3"></textarea>
            </div>
            <button type="submit" className="appointment-btn primary">
              <i className="fas fa-check"></i> Schedule Appointment
            </button>
          </form>
        </div>
      </div>

      {/* Available Slots Card */}
      <div className="appointment-card">
        <div className="appointment-card-header">
          <i className="fas fa-clock"></i>
          <h3>Available Time Slots</h3>
        </div>
        <div className="appointment-card-body">
          <div className="slots-container">
            <div className="date-group">
              <h4 className="date-heading">Today</h4>
              <div className="slot-grid">
                <button className="slot-btn">10:00 AM</button>
                <button className="slot-btn">11:30 AM</button>
                <button className="slot-btn disabled">2:00 PM</button>
                <button className="slot-btn">3:30 PM</button>
              </div>
            </div>
            <div className="date-group">
              <h4 className="date-heading">Tomorrow</h4>
              <div className="slot-grid">
                <button className="slot-btn">9:00 AM</button>
                <button className="slot-btn">11:00 AM</button>
                <button className="slot-btn">2:30 PM</button>
                <button className="slot-btn">4:00 PM</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Prescriptions = () => (
  <div className="prescriptions-wrapper">
    <div className="prescriptions-grid">
      {/* Active Prescriptions Card */}
      <div className="prescription-card">
        <div className="prescription-card-header">
          <i className="fas fa-prescription"></i>
          <h3>Active Prescriptions</h3>
        </div>
        <div className="prescription-card-body">
          <div className="prescription-entry">
            <div className="prescription-title">
              <h4>Amoxicillin</h4>
              <span className="prescription-date">Prescribed: Aug 20, 2023</span>
            </div>
            <div className="prescription-info">
              <p><i className="fas fa-pills"></i> Dosage: 500mg</p>
              <p><i className="fas fa-clock"></i> Frequency: 3 times a day</p>
              <p><i className="fas fa-calendar"></i> Duration: 7 days</p>
              <p><i className="fas fa-user-md"></i> Dr. Sharma - Cardiology</p>
            </div>
            <div className="prescription-actions">
              <button className="prescription-btn primary">
                <i className="fas fa-download"></i> Download Prescription
              </button>
              <button className="prescription-btn secondary">View Details</button>
            </div>
          </div>
        </div>
      </div>

      {/* Prescription History Card */}
      <div className="prescription-card">
        <div className="prescription-card-header">
          <i className="fas fa-history"></i>
          <h3>Prescription History</h3>
        </div>
        <div className="prescription-card-body">
          <div className="prescription-entry">
            <div className="prescription-title">
              <h4>Lisinopril</h4>
              <span className="prescription-date">Prescribed: Jul 15, 2023</span>
            </div>
            <div className="prescription-info">
              <p><i className="fas fa-pills"></i> Dosage: 10mg</p>
              <p><i className="fas fa-clock"></i> Frequency: Once daily</p>
              <p><i className="fas fa-calendar"></i> Duration: 30 days</p>
              <p><i className="fas fa-user-md"></i> Dr. Gupta - Internal Medicine</p>
            </div>
            <div className="prescription-actions">
              <button className="prescription-btn link">View Details</button>
              <button className="prescription-btn link">Download PDF</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Payments = () => (
  <div className="payments-wrapper">
    <div className="payments-grid">
      {/* Payment History Card */}
      <div className="payment-card">
        <div className="payment-card-header">
          <i className="fas fa-history"></i>
          <h3>Payment History</h3>
        </div>
        <div className="payment-card-body">
          <div className="payment-table-container">
            <table className="payment-table">
              <thead>
                <tr>
                  <th><i className="fas fa-calendar"></i> Date</th>
                  <th><i className="fas fa-file-invoice"></i> Description</th>
                  <th><i className="fas fa-dollar-sign"></i> Amount</th>
                  <th><i className="fas fa-info-circle"></i> Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2023-08-01</td>
                  <td>Consultation - Dr. Patel</td>
                  <td>$150</td>
                  <td><span className="payment-status paid">Paid</span></td>
                </tr>
                <tr>
                  <td>2023-07-15</td>
                  <td>Lab Tests</td>
                  <td>$75</td>
                  <td><span className="payment-status paid">Paid</span></td>
                </tr>
                <tr>
                  <td>2023-07-01</td>
                  <td>Prescription Medicines</td>
                  <td>$120</td>
                  <td><span className="payment-status pending">Pending</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Summary Card */}
      <div className="payment-card">
        <div className="payment-card-header">
          <i className="fas fa-chart-pie"></i>
          <h3>Payment Summary</h3>
        </div>
        <div className="payment-card-body">
          <div className="payment-summary">
            <div className="summary-item">
              <span className="summary-label">Total Paid</span>
              <span className="summary-value">$225</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Pending Payments</span>
              <span className="summary-value">$120</span>
            </div>
            <div className="summary-item total">
              <span className="summary-label">Total Amount</span>
              <span className="summary-value">$345</span>
            </div>
          </div>
          <button className="payment-btn primary">
            <i className="fas fa-credit-card"></i> Make Payment
          </button>
        </div>
      </div>
    </div>
  </div>
);

const Communication = () => (
  <div className="communication-wrapper">
    <div className="communication-grid">
      {/* Messages Card */}
      <div className="communication-card">
        <div className="communication-card-header">
          <i className="fas fa-inbox"></i>
          <h3>Inbox</h3>
        </div>
        <div className="communication-card-body">
          <div className="message-list">
            <div className="message-item unread">
              <div className="message-header">
                <div className="message-sender">
                  <i className="fas fa-user-md"></i>
                  <span>Dr. Patel - Cardiology</span>
                </div>
                <span className="message-date">Today, 10:30 AM</span>
              </div>
              <div className="message-content">
                <h4 className="message-subject">Follow-up on your last visit</h4>
                <p className="message-preview">Hello Mr. Kumar, I hope you're doing well. Regarding your last visit...</p>
              </div>
              <div className="message-actions">
                <button className="message-btn primary">Read Message</button>
                <button className="message-btn secondary">Reply</button>
              </div>
            </div>

            <div className="message-item">
              <div className="message-header">
                <div className="message-sender">
                  <i className="fas fa-user-nurse"></i>
                  <span>Nurse Mehra</span>
                </div>
                <span className="message-date">Yesterday</span>
              </div>
              <div className="message-content">
                <h4 className="message-subject">Appointment Reminder</h4>
                <p className="message-preview">This is a reminder for your upcoming appointment...</p>
              </div>
              <div className="message-actions">
                <button className="message-btn primary">Read Message</button>
                <button className="message-btn secondary">Reply</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Message Card */}
      <div className="communication-card">
        <div className="communication-card-header">
          <i className="fas fa-paper-plane"></i>
          <h3>New Message</h3>
        </div>
        <div className="communication-card-body">
          <form className="message-form">
            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-user-md"></i> Recipient
              </label>
              <select className="form-input">
                <option value="">Select Recipient</option>
                <option value="dr-patel">Dr. Patel - Cardiology</option>
                <option value="dr-verma">Dr. Verma - Neurology</option>
                <option value="nurse">Nurse Station</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-heading"></i> Subject
              </label>
              <input type="text" className="form-input" placeholder="Enter subject" />
            </div>
            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-envelope"></i> Message
              </label>
              <textarea className="form-input" rows="5" placeholder="Type your message here"></textarea>
            </div>
            <button type="submit" className="message-btn primary">
              <i className="fas fa-paper-plane"></i> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
);

const Support = () => (
  <div className="support-wrapper">
    <div className="support-grid">
      {/* Support Form Card */}
      <div className="support-card">
        <div className="support-card-header">
          <i className="fas fa-question-circle"></i>
          <h3>Contact Support</h3>
        </div>
        <div className="support-card-body">
          <form className="support-form">
            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-tag"></i> Category
              </label>
              <select className="form-input">
                <option value="">Select Category</option>
                <option value="technical">Technical Issue</option>
                <option value="appointment">Appointment Related</option>
                <option value="billing">Billing Query</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-heading"></i> Subject
              </label>
              <input type="text" className="form-input" placeholder="Enter subject" />
            </div>
            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-comment-alt"></i> Message
              </label>
              <textarea className="form-input" rows="5" placeholder="Describe your issue"></textarea>
            </div>
            <button type="submit" className="support-btn primary">
              <i className="fas fa-paper-plane"></i> Submit Ticket
            </button>
          </form>
        </div>
      </div>

      {/* FAQs Card */}
      <div className="support-card">
        <div className="support-card-header">
          <i className="fas fa-info-circle"></i>
          <h3>Frequently Asked Questions</h3>
        </div>
        <div className="support-card-body">
          <div className="faq-list">
            <div className="faq-item">
              <h4 className="faq-question">
                <i className="fas fa-question"></i>
                How do I schedule an appointment?
              </h4>
              <p className="faq-answer">
                You can schedule an appointment through the "Book Appointment" section. Select your preferred department, date, and time slot.
              </p>
            </div>
            <div className="faq-item">
              <h4 className="faq-question">
                <i className="fas fa-question"></i>
                How can I view my medical records?
              </h4>
              <p className="faq-answer">
                Your medical records can be accessed through the "Consultations" section under past consultations.
              </p>
            </div>
            <div className="faq-item">
              <h4 className="faq-question">
                <i className="fas fa-question"></i>
                What payment methods are accepted?
              </h4>
              <p className="faq-answer">
                We accept all major credit cards, debit cards, and insurance payments. Visit the "Payments" section for more details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PatientPortal;
