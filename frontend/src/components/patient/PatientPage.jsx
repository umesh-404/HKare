import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PatientPage.css";
import axios from "axios";

// Common styles for modal views
const modalStyles = {
  viewModal: {
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '90%',
    width: '750px',
    maxHeight: '85vh',
    overflowY: 'auto'
  },
  modalHeader: {
    borderBottom: '1px solid #e0e0e0',
    padding: '0 0 15px 0',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    margin: 0
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    color: '#7f8c8d'
  },
  detailSection: {
    marginBottom: '25px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#34495e',
    marginBottom: '15px',
    paddingBottom: '8px',
    borderBottom: '1px solid #ddd'
  },
  detailRow: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '0 -10px 10px -10px'
  },
  detailGroup: {
    flex: '1 0 calc(50% - 20px)',
    padding: '0 10px',
    marginBottom: '10px'
  },
  detailGroupWide: {
    flex: '1 0 calc(100% - 20px)',
    padding: '0 10px',
    marginBottom: '10px'
  },
  label: {
    fontWeight: '600',
    color: '#5f6368',
    marginBottom: '5px',
    fontSize: '0.9rem'
  },
  value: {
    margin: '0',
    color: '#333',
    wordBreak: 'break-word'
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalActions: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px'
  },
  button: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  primaryButton: {
    backgroundColor: '#4A90E2',
    color: 'white'
  },
  secondaryButton: {
    backgroundColor: '#e0e0e0',
    color: '#333'
  },
  medicationItem: {
    marginBottom: '15px',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  medicationTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#34495e',
    marginBottom: '5px'
  }
};

const PatientPortal = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
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

  useEffect(() => {
    // Apply specific body class for this page
    document.body.classList.add('patient-page-body');
    
    // Cleanup function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('patient-page-body');
    };
  }, []);

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
      case "dashboard":
        return <Dashboard patientId={userData?.roleId} setActiveSection={setActiveSection} />;
      case "appointments":
        return <AppointmentManagement patientId={userData?.roleId} setActiveSection={setActiveSection} />;
      case "payments":
        return <PaymentManagement patientId={userData?.roleId} setActiveSection={setActiveSection} />;
      case "medical-records":
        return <MedicalRecordManagement patientId={userData?.roleId} setActiveSection={setActiveSection} />;
      case "prescriptions":
        return <PrescriptionManagement patientId={userData?.roleId} setActiveSection={setActiveSection} />;
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
          <div className="user-info" onClick={() => setActiveSection("profile")} style={{ cursor: 'pointer' }}>
            <i className="fas fa-user user-icon"></i>
            <span className="user-name">{userData ? `${userData.firstName} ${userData.lastName}` : 'Patient'}</span>
          </div>
          <button 
            className="logout-button" 
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </header>

      {/* Logout Popup */}
      {showLogoutPopup && (
        <div className="login-overlay">
          <div className="loading-spinner"></div>
          <p>Logging you out...</p>
        </div>
      )}

      {/* Sidebar */}
      <aside className="sidebar">
        {[
          { name: "Dashboard", icon: "fa-tachometer-alt" },
          { name: "Appointments", icon: "fa-calendar-check" },
          { name: "Payments", icon: "fa-credit-card" },
          { name: "Medical Records", icon: "fa-file-medical" },
          { name: "Prescriptions", icon: "fa-prescription" },
          { name: "Profile", icon: "fa-user-circle" }
        ].map((item) => (
          <button
            key={item.name}
            className={`nav-button ${
              activeSection === item.name.toLowerCase().replace(" ", "-") ? "active" : ""
            }`}
            onClick={() => setActiveSection(item.name.toLowerCase().replace(" ", "-"))}
          >
            <i className={`fas ${item.icon}`}></i>
            {item.name}
          </button>
        ))}
      </aside>

      {/* Content */}
      <main className="content">
        <div className="content-container">
          <h2 className="page-title">
            <i className={`fas ${getIconForSection(activeSection)}`}></i>
            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1).replace('-', ' ')}
          </h2>
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const getIconForSection = (section) => {
  const icons = {
    'dashboard': 'fa-tachometer-alt',
    'appointments': 'fa-calendar-check',
    'payments': 'fa-credit-card',
    'medical-records': 'fa-file-medical',
    'prescriptions': 'fa-prescription',
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

// Dashboard Component for Patients
const Dashboard = ({ patientId, setActiveSection }) => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    activePrescriptions: 0
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentPrescriptions, setRecentPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (patientId) {
      fetchDashboardData(patientId);
    }
  }, [patientId]);

  const fetchDashboardData = async (patientId) => {
    setLoading(true);
    try {
      // Fetch patient's upcoming appointments
      const appointmentsResponse = await axios.get(`http://localhost:8080/api/appointments/patient/${patientId}`);
      const appointments = appointmentsResponse.data;
      
      // Filter for upcoming appointments (those with status SCHEDULED)
      const upcoming = appointments.filter(apt => apt.status === 'SCHEDULED')
        .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
        .slice(0, 3); // Get only the next 3 appointments
      
      setUpcomingAppointments(upcoming);
      
      // Fetch patient's prescriptions
      const prescriptionsResponse = await axios.get(`http://localhost:8080/api/prescriptions/patient/${patientId}`);
      const prescriptions = prescriptionsResponse.data;
      
      // Filter for active prescriptions and get the most recent ones
      const active = prescriptions.filter(presc => presc.status === 'ACTIVE')
        .sort((a, b) => new Date(b.prescriptionDate) - new Date(a.prescriptionDate))
        .slice(0, 3); // Get only the 3 most recent prescriptions
      
      setRecentPrescriptions(active);
      
      // Set dashboard statistics
      setStats({
        totalAppointments: appointments.length,
        pendingAppointments: appointments.filter(apt => apt.status === 'SCHEDULED').length,
        completedAppointments: appointments.filter(apt => apt.status === 'COMPLETED').length,
        activePrescriptions: prescriptions.filter(presc => presc.status === 'ACTIVE').length
      });
      
      setError('');
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return "N/A";
    }
  };
  
  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return "N/A";
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-section">
      {error && <div className="error-message">{error}</div>}
      
      {/* Statistics Cards */}
      <div className="analytics-overview">
        <h3>Patient Overview</h3>
        <div className="analytics-cards">
          <div className="analytics-card">
            <div className="card-icon">
          <i className="fas fa-calendar-check"></i>
        </div>
            <div className="card-content">
              <h4>Total Appointments</h4>
              <p>{stats.totalAppointments}</p>
            </div>
          </div>
          
          <div className="analytics-card">
            <div className="card-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="card-content">
              <h4>Pending Appointments</h4>
              <p>{stats.pendingAppointments}</p>
        </div>
      </div>

          <div className="analytics-card">
            <div className="card-icon">
              <i className="fas fa-check-circle"></i>
        </div>
            <div className="card-content">
              <h4>Completed Visits</h4>
              <p>{stats.completedAppointments}</p>
            </div>
          </div>
          
          <div className="analytics-card">
            <div className="card-icon">
              <i className="fas fa-prescription"></i>
            </div>
            <div className="card-content">
              <h4>Active Prescriptions</h4>
              <p>{stats.activePrescriptions}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Upcoming Appointments */}
      <div className="dashboard-section-grid">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>
              <i className="fas fa-calendar-alt"></i> Upcoming Appointments
            </h3>
          </div>
          <div className="dashboard-card-body">
            {upcomingAppointments.length === 0 ? (
              <div className="no-data-message">
                <p>No upcoming appointments.</p>
              </div>
            ) : (
              <div className="appointments-list">
                {upcomingAppointments.map((appointment, index) => (
                  <div key={index} className="appointment-item">
                    <div className="appointment-date">
                      <i className="far fa-calendar"></i>
                      <span>{formatDate(appointment.appointmentDate)}</span>
                    </div>
                    <div className="appointment-time">
                      <i className="far fa-clock"></i>
                      <span>{formatTime(appointment.appointmentTime)}</span>
                    </div>
                    <div className="appointment-doctor">
                      <i className="fas fa-user-md"></i>
                      <span>Dr. {appointment.doctorName || "Unknown"}</span>
                    </div>
                    <div className="appointment-type">
                      <i className="fas fa-stethoscope"></i>
                      <span>{appointment.appointmentType || "General Check-up"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Recent Prescriptions */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>
              <i className="fas fa-prescription"></i> Recent Prescriptions
            </h3>
          </div>
          <div className="dashboard-card-body">
            {recentPrescriptions.length === 0 ? (
              <div className="no-data-message">
                <p>No active prescriptions.</p>
              </div>
            ) : (
              <div className="prescriptions-list">
                {recentPrescriptions.map((prescription, index) => (
                  <div key={index} className="prescription-item">
                    <div className="prescription-date">
                      <i className="far fa-calendar"></i>
                      <span>Prescribed: {formatDate(prescription.prescriptionDate)}</span>
                    </div>
                    <div className="prescription-doctor">
                      <i className="fas fa-user-md"></i>
                      <span>Dr. {prescription.doctorName || "Unknown"}</span>
                    </div>
                    <div className="prescription-meds">
                      <i className="fas fa-pills"></i>
                      <span>
                        {prescription.medications && prescription.medications.length > 0
                          ? prescription.medications.map(med => med.medicationName).join(', ')
                          : 'No medications listed'}
                      </span>
                    </div>
                    <div className="prescription-expiry">
                      <i className="fas fa-hourglass-end"></i>
                      <span>Expires: {formatDate(prescription.expiryDate)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Health Tips */}
      <div className="health-tips-section">
        <h3><i className="fas fa-heartbeat"></i> Health Tips</h3>
        <div className="health-tips-container">
          <div className="health-tip">
            <i className="fas fa-apple-alt tip-icon"></i>
            <h4>Healthy Eating</h4>
            <p>Incorporate a variety of fruits and vegetables in your daily diet for essential vitamins and minerals.</p>
          </div>
          <div className="health-tip">
            <i className="fas fa-walking tip-icon"></i>
            <h4>Regular Exercise</h4>
            <p>Aim for at least 30 minutes of moderate physical activity most days of the week.</p>
          </div>
          <div className="health-tip">
            <i className="fas fa-bed tip-icon"></i>
            <h4>Proper Sleep</h4>
            <p>Adults should get 7-9 hours of quality sleep per night for optimal health.</p>
          </div>
          <div className="health-tip">
            <i className="fas fa-tint tip-icon"></i>
            <h4>Stay Hydrated</h4>
            <p>Drink at least 8 glasses of water daily to maintain proper hydration.</p>
        </div>
      </div>
    </div>
  </div>
);
};

// Appointment Management for patients
const AppointmentManagement = ({ patientId, setActiveSection }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  
  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  // State for canceling appointments
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  
  // State for booking modal
  const [showBookModal, setShowBookModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    patientId: patientId,
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    appointmentType: 'GENERAL_CHECKUP',
    reasonForVisit: '',
    notes: ''
  });

  useEffect(() => {
    if (patientId) {
      fetchAppointments(patientId);
      fetchDoctors();
    }
  }, [patientId]);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/doctors');
      setDoctors(response.data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };
  
  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setIsBooking(true);
    setError('');
    
    try {
      // Set the form's patientId to the current patient
      const appointmentData = {
        ...bookingForm,
        patientId: patientId,
        status: 'SCHEDULED'
      };
      
      const response = await axios.post('http://localhost:8080/api/appointments', appointmentData);
      
      // Add the new appointment to the appointments list
      setAppointments(prev => [...prev, response.data]);
      
      // Show success message and reset form
      setBookingSuccess(true);
      
      // Reset form after delay
      setTimeout(() => {
        setBookingSuccess(false);
        setShowBookModal(false);
        setBookingForm({
          patientId: patientId,
          doctorId: '',
          appointmentDate: '',
          appointmentTime: '',
          appointmentType: 'GENERAL_CHECKUP',
          reasonForVisit: '',
          notes: ''
        });
      }, 2000);
      
    } catch (err) {
      console.error('Error booking appointment:', err);
      setError(err.response?.data?.message || 'Failed to book appointment. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };
  
  // Calculate min date (today) and max date (3 months from now) for date picker
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];
  
  // Generate available time slots (example: 9 AM to 5 PM with 30 min intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let i = 9; i < 17; i++) {
      slots.push(`${i.toString().padStart(2, '0')}:00`);
      slots.push(`${i.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };
  
  const timeSlots = generateTimeSlots();

  const fetchAppointments = async (patientId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/appointments/patient/${patientId}`);
      setAppointments(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowViewModal(true);
  };
  
  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };
  
  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;
    
    setIsCancelling(true);
    try {
      await axios.put(`http://localhost:8080/api/appointments/${selectedAppointment.appointmentId}/status`, {
        status: 'CANCELLED',
        cancellationReason: cancelReason
      });
      
      // Update local state
      setAppointments(appointments.map(apt => 
        apt.appointmentId === selectedAppointment.appointmentId 
          ? { ...apt, status: 'CANCELLED', cancellationReason: cancelReason } 
          : apt
      ));
      
      setShowCancelModal(false);
      setCancelReason('');
      alert('Appointment cancelled successfully.');
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      alert(err.response?.data?.message || 'Failed to cancel appointment. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return "N/A";
    }
  };
  
  const formatTime = (dateTimeStr) => {
    if (!dateTimeStr) return "N/A";
    try {
      const date = new Date(dateTimeStr);
      if (isNaN(date.getTime())) return "N/A";
      
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return "N/A";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'status-pending';
      case 'COMPLETED':
        return 'status-completed';
      case 'CANCELLED':
        return 'status-rejected';
      case 'IN_PROGRESS':
        return 'status-active';
      case 'NO_SHOW':
        return 'status-expired';
      default:
        return '';
    }
  };

  const getDoctorName = (doctorId) => {
    // This would typically fetch doctor info from context or make an API call
    // For simplicity, returning placeholder text
    return doctorId ? `Dr. ${doctorId}` : 'Unknown Doctor';
  };

  const getFilteredAppointments = () => {
    return appointments.filter(appointment => {
      // Filter by status
      if (statusFilter !== 'ALL' && appointment.status !== statusFilter) {
        return false;
      }
      
      // Filter by date
      if (dateFilter && appointment.appointmentDate) {
        const apptDate = new Date(appointment.appointmentDate).toISOString().split('T')[0];
        if (apptDate !== dateFilter) {
          return false;
        }
      }
      
      // Filter by search term
      if (searchTerm) {
        const doctorName = getDoctorName(appointment.doctorId).toLowerCase();
        const apptType = appointment.appointmentType?.toLowerCase() || '';
        
        return doctorName.includes(searchTerm.toLowerCase()) || 
               apptType.includes(searchTerm.toLowerCase());
      }
      
      return true;
    });
  };
  
  const canCancelAppointment = (appointment) => {
    // Only allow cancellation if appointment is scheduled and at least 24 hours away
    if (appointment.status !== 'SCHEDULED') return false;
    
    const now = new Date();
    const apptDateTime = new Date(appointment.appointmentDate);
    if (appointment.appointmentTime) {
      const [hours, minutes] = appointment.appointmentTime.split(':');
      apptDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    }
    
    // Calculate difference in hours
    const hoursDifference = (apptDateTime - now) / (1000 * 60 * 60);
    return hoursDifference >= 24;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading appointments...</p>
        </div>
    );
  }

  return (
    <div className="management-section">
      <div className="management-header">
        <div className="filters-container">
          <h3>Filters</h3>
          <div className="filters">
            <div className="filter-group">
              <label>Status:</label>
              <select 
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="NO_SHOW">No Show</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Date:</label>
              <input 
                type="date" 
                className="filter-date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Search:</label>
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder="Search by doctor, appointment type..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                <i className="fas fa-search search-icon"></i>
            </div>
            </div>
          </div>
        </div>
        
        <button className="add-btn" onClick={() => setShowBookModal(true)}>
          <i className="fas fa-plus"></i> Book New Appointment
            </button>
        </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Time</th>
              <th>Doctor</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredAppointments().length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">No appointments found</td>
              </tr>
            ) : (
              getFilteredAppointments().map(appointment => (
                <tr key={appointment.appointmentId}>
                  <td>{appointment.appointmentId}</td>
                  <td>{formatDate(appointment.appointmentDate)}</td>
                  <td>{formatTime(appointment.appointmentTime)}</td>
                  <td>{getDoctorName(appointment.doctorId)}</td>
                  <td>{appointment.appointmentType || 'General'}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button 
                      className="action-btn view" 
                      onClick={() => handleViewAppointment(appointment)}
                      title="View Details"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    
                    {canCancelAppointment(appointment) && (
                      <button 
                        className="action-btn delete" 
                        onClick={() => handleCancelClick(appointment)}
                        title="Cancel Appointment"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Appointment Modal */}
      {showViewModal && selectedAppointment && (
        <div className="modal-overlay">
          <div className="modal-container" style={modalStyles.viewModal}>
            <div className="modal-header" style={modalStyles.modalHeader}>
              <h3 style={modalStyles.modalTitle}>Appointment Details</h3>
              <button className="close-btn" onClick={() => setShowViewModal(false)} style={modalStyles.closeButton}>
                <i className="fas fa-times"></i>
              </button>
        </div>
            <div className="modal-body">
              <div className="detail-section" style={modalStyles.detailSection}>
                <h4 style={modalStyles.sectionTitle}>Basic Information</h4>
                <div className="detail-row" style={modalStyles.detailRow}>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={modalStyles.label}>Appointment ID:</label>
                    <p style={modalStyles.value}>{selectedAppointment.appointmentId}</p>
              </div>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={modalStyles.label}>Status:</label>
                    <p className={`status-badge ${getStatusClass(selectedAppointment.status)}`} style={modalStyles.value}>
                      {selectedAppointment.status}
                    </p>
            </div>
              </div>
                
                <div className="detail-row" style={modalStyles.detailRow}>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={modalStyles.label}>Date:</label>
                    <p style={modalStyles.value}>{formatDate(selectedAppointment.appointmentDate)}</p>
            </div>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={modalStyles.label}>Time:</label>
                    <p style={modalStyles.value}>{formatTime(selectedAppointment.appointmentTime)}</p>
          </div>
        </div>
                
                <div className="detail-row" style={modalStyles.detailRow}>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={modalStyles.label}>Doctor:</label>
                    <p style={modalStyles.value}>{getDoctorName(selectedAppointment.doctorId)}</p>
      </div>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={modalStyles.label}>Appointment Type:</label>
                    <p style={modalStyles.value}>{selectedAppointment.appointmentType || 'General'}</p>
    </div>
  </div>
              </div>
              
              <div className="detail-section" style={modalStyles.detailSection}>
                <h4 style={modalStyles.sectionTitle}>Additional Information</h4>
                <div className="detail-row" style={modalStyles.detailRow}>
                  <div className="detail-group wide" style={modalStyles.detailGroupWide}>
                    <label style={modalStyles.label}>Reason for Visit:</label>
                    <p style={modalStyles.value}>{selectedAppointment.reasonForVisit || 'Not specified'}</p>
        </div>
            </div>
                
                {selectedAppointment.status === 'CANCELLED' && (
                  <div className="detail-row" style={modalStyles.detailRow}>
                    <div className="detail-group wide" style={modalStyles.detailGroupWide}>
                      <label style={modalStyles.label}>Cancellation Reason:</label>
                      <p style={modalStyles.value}>{selectedAppointment.cancellationReason || 'Not specified'}</p>
            </div>
                  </div>
                )}
                
                {selectedAppointment.notes && (
                  <div className="detail-row" style={modalStyles.detailRow}>
                    <div className="detail-group wide" style={modalStyles.detailGroupWide}>
                      <label style={modalStyles.label}>Notes:</label>
                      <p style={modalStyles.value}>{selectedAppointment.notes}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="modal-actions" style={modalStyles.modalActions}>
                {canCancelAppointment(selectedAppointment) && (
                  <button 
                    onClick={() => {
                      setShowViewModal(false);
                      handleCancelClick(selectedAppointment);
                    }} 
                    className="danger-btn"
                    style={{...modalStyles.button, backgroundColor: '#d9534f', color: 'white'}}
                  >
                    <i className="fas fa-times"></i> Cancel Appointment
              </button>
                )}
                <button 
                  onClick={() => setShowViewModal(false)} 
                  className="secondary-btn"
                  style={{...modalStyles.button, ...modalStyles.secondaryButton}}
                >
                  Close
                </button>
            </div>
          </div>
        </div>
      </div>
      )}
      
      {/* Cancel Appointment Modal */}
      {showCancelModal && selectedAppointment && (
        <div className="modal-overlay">
          <div className="modal-container" style={{...modalStyles.viewModal, width: '500px'}}>
            <div className="modal-header" style={modalStyles.modalHeader}>
              <h3 style={modalStyles.modalTitle}>Cancel Appointment</h3>
              <button 
                className="close-btn" 
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                }} 
                style={modalStyles.closeButton}
              >
                <i className="fas fa-times"></i>
              </button>
        </div>
            <div className="modal-body">
              <p>Are you sure you want to cancel this appointment?</p>
              <div className="form-group" style={{marginTop: '15px'}}>
                <label>Reason for Cancellation:</label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="form-control"
                  rows="4"
                  placeholder="Please provide a reason for cancelling this appointment..."
                  required
                ></textarea>
            </div>
              
              <div className="modal-actions" style={modalStyles.modalActions}>
                <button 
                  onClick={handleCancelAppointment} 
                  className="danger-btn"
                  style={{...modalStyles.button, backgroundColor: '#d9534f', color: 'white'}}
                  disabled={isCancelling || !cancelReason.trim()}
                >
                  {isCancelling ? 'Processing...' : 'Confirm Cancellation'}
                </button>
                <button 
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelReason('');
                  }} 
                  className="secondary-btn"
                  style={{...modalStyles.button, ...modalStyles.secondaryButton}}
                  disabled={isCancelling}
                >
                  Back
                </button>
            </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Book Appointment Modal */}
      {showBookModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{...modalStyles.viewModal, width: '600px'}}>
            <div className="modal-header" style={modalStyles.modalHeader}>
              <h3 style={modalStyles.modalTitle}>Book New Appointment</h3>
              <button 
                className="close-btn" 
                onClick={() => setShowBookModal(false)} 
                style={modalStyles.closeButton}
                disabled={isBooking}
              >
                <i className="fas fa-times"></i>
              </button>
      </div>
            
            {bookingSuccess ? (
              <div className="modal-body" style={{textAlign: 'center', padding: '30px 20px'}}>
                <div style={{marginBottom: '20px', color: '#4CAF50'}}>
                  <i className="fas fa-check-circle" style={{fontSize: '50px'}}></i>
    </div>
                <h3 style={{fontSize: '24px', marginBottom: '20px', color: '#4CAF50'}}>Appointment Booked!</h3>
                <p style={{color: '#333', marginBottom: '30px', fontSize: '16px'}}>
                  Your appointment has been scheduled successfully.
                </p>
              </div>
            ) : (
              <div className="modal-body" style={{padding: '20px'}}>
                {error && <div className="error-message" style={{marginBottom: '15px'}}>{error}</div>}
                
                <form onSubmit={handleBookAppointment}>
                  <div className="form-section" style={{marginBottom: '20px'}}>
                    <h4 style={{...modalStyles.sectionTitle, borderBottom: '2px solid #4CAF50', paddingBottom: '8px', marginBottom: '15px'}}>
                      Appointment Details
                    </h4>
                    
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px'}}>
                      <div className="form-group">
                        <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Doctor*</label>
                        <select
                          name="doctorId"
                          value={bookingForm.doctorId}
                          onChange={handleBookingInputChange}
                          required
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '4px',
                            border: '1px solid #ddd'
                          }}
                        >
                          <option value="">Select Doctor</option>
                          {doctors.map(doctor => (
                            <option key={doctor.doctorId} value={doctor.doctorId}>
                              Dr. {doctor.firstName} {doctor.lastName} ({doctor.specialization})
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Appointment Type*</label>
                        <select
                          name="appointmentType"
                          value={bookingForm.appointmentType}
                          onChange={handleBookingInputChange}
                          required
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '4px',
                            border: '1px solid #ddd'
                          }}
                        >
                          <option value="GENERAL_CHECKUP">General Checkup</option>
                          <option value="FOLLOW_UP">Follow-up</option>
                          <option value="CONSULTATION">Consultation</option>
                          <option value="VACCINATION">Vaccination</option>
                          <option value="LAB_TEST">Lab Test</option>
                        </select>
                      </div>
                    </div>
                    
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px'}}>
                      <div className="form-group">
                        <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Date*</label>
                        <input
                          type="date"
                          name="appointmentDate"
                          value={bookingForm.appointmentDate}
                          onChange={handleBookingInputChange}
                          min={today}
                          max={maxDateStr}
                          required
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '4px',
                            border: '1px solid #ddd'
                          }}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Time*</label>
                        <select
                          name="appointmentTime"
                          value={bookingForm.appointmentTime}
                          onChange={handleBookingInputChange}
                          required
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '4px',
                            border: '1px solid #ddd'
                          }}
                        >
                          <option value="">Select Time</option>
                          {timeSlots.map(time => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="form-group" style={{marginBottom: '15px'}}>
                      <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Reason for Visit*</label>
                      <textarea
                        name="reasonForVisit"
                        value={bookingForm.reasonForVisit}
                        onChange={handleBookingInputChange}
                        required
                        rows="3"
                        placeholder="Please describe briefly why you're making this appointment..."
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '4px',
                          border: '1px solid #ddd',
                          resize: 'vertical'
                        }}
                      ></textarea>
                    </div>
                    
                    <div className="form-group">
                      <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Additional Notes</label>
                      <textarea
                        name="notes"
                        value={bookingForm.notes}
                        onChange={handleBookingInputChange}
                        rows="2"
                        placeholder="Any additional information for the doctor or staff..."
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '4px',
                          border: '1px solid #ddd',
                          resize: 'vertical'
                        }}
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="form-section" style={{marginBottom: '10px'}}>
                    <p style={{fontSize: '0.9rem', color: '#666', fontStyle: 'italic'}}>
                      <i className="fas fa-info-circle" style={{marginRight: '5px'}}></i>
                      Please note that all appointments are subject to confirmation by the hospital staff.
                    </p>
                  </div>
                  
                  <div className="modal-actions" style={{...modalStyles.modalActions, marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px'}}>
                    <button 
                      type="button"
                      onClick={() => setShowBookModal(false)} 
                      className="secondary-btn"
                      style={{...modalStyles.button, ...modalStyles.secondaryButton}}
                      disabled={isBooking}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="primary-btn"
                      style={{
                        ...modalStyles.button,
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none'
                      }}
                      disabled={isBooking}
                    >
                      {isBooking ? (
                        <>
                          <i className="fas fa-spinner fa-spin" style={{marginRight: '8px'}}></i>
                          Booking...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-calendar-check" style={{marginRight: '8px'}}></i>
                          Book Appointment
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
  </div>
);
};

// Payment Management Component
const PaymentManagement = ({ patientId, setActiveSection }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  
  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    if (patientId) {
      fetchPayments(patientId);
    }
  }, [patientId]);

  const fetchPayments = async (patientId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/payments/patient/${patientId}`);
      setPayments(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load payments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setShowViewModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return "N/A";
    }
  };
  
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'PAID':
        return 'status-completed';
      case 'PENDING':
        return 'status-pending';
      case 'OVERDUE':
        return 'status-rejected';
      case 'CANCELLED':
        return 'status-expired';
      case 'REFUNDED':
        return 'status-info';
      default:
        return '';
    }
  };

  const getFilteredPayments = () => {
    return payments.filter(payment => {
      // Filter by status
      if (statusFilter !== 'ALL' && payment.status !== statusFilter) {
        return false;
      }
      
      // Filter by date
      if (dateFilter && payment.invoiceDate) {
        const paymentDate = new Date(payment.invoiceDate).toISOString().split('T')[0];
        if (paymentDate !== dateFilter) {
          return false;
        }
      }
      
      // Filter by search term
      if (searchTerm) {
        const paymentId = payment.paymentId?.toString().toLowerCase() || '';
        const description = payment.description?.toLowerCase() || '';
        
        return paymentId.includes(searchTerm.toLowerCase()) || 
               description.includes(searchTerm.toLowerCase());
      }
      
      return true;
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading payments...</p>
        </div>
    );
  }

  return (
    <div className="management-section">
      <div className="management-header">
        <div className="filters-container">
          <h3>Filters</h3>
          <div className="filters">
            <div className="filter-group">
              <label>Status:</label>
              <select 
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="OVERDUE">Overdue</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Date:</label>
              <input 
                type="date" 
                className="filter-date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Search:</label>
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder="Search by ID, description..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                <i className="fas fa-search search-icon"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="table-container">
        <table className="data-table">
              <thead>
                <tr>
              <th>Invoice #</th>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
                </tr>
              </thead>
              <tbody>
            {getFilteredPayments().length === 0 ? (
                <tr>
                <td colSpan="7" className="no-data">No payments found</td>
                </tr>
            ) : (
              getFilteredPayments().map(payment => (
                <tr key={payment.paymentId}>
                  <td>{payment.paymentId}</td>
                  <td>{formatDate(payment.invoiceDate)}</td>
                  <td>{payment.description || 'N/A'}</td>
                  <td>{formatCurrency(payment.amount)}</td>
                  <td>{formatDate(payment.dueDate)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button 
                      className="action-btn view" 
                      onClick={() => handleViewPayment(payment)}
                      title="View Details"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
              </tbody>
            </table>
          </div>
      
      {/* View Payment Modal */}
      {showViewModal && selectedPayment && (
        <div className="modal-overlay">
          <div className="modal-container" style={modalStyles.viewModal}>
            <div className="modal-header" style={modalStyles.modalHeader}>
              <h3 style={modalStyles.modalTitle}>Payment Details</h3>
              <button className="close-btn" onClick={() => setShowViewModal(false)} style={modalStyles.closeButton}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section" style={modalStyles.detailSection}>
                <h4 style={modalStyles.sectionTitle}>Invoice Information</h4>
                <div className="detail-row" style={modalStyles.detailRow}>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={modalStyles.label}>Invoice Number:</label>
                    <p style={modalStyles.value}>{selectedPayment.paymentId}</p>
                  </div>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={modalStyles.label}>Status:</label>
                    <p style={modalStyles.value}>
                      <span className={`status-badge ${getStatusClass(selectedPayment.status)}`}>
                        {selectedPayment.status}
                      </span>
                    </p>
        </div>
      </div>

                <div className="detail-row" style={modalStyles.detailRow}>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={modalStyles.label}>Invoice Date:</label>
                    <p style={modalStyles.value}>{formatDate(selectedPayment.invoiceDate)}</p>
        </div>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={modalStyles.label}>Due Date:</label>
                    <p style={modalStyles.value}>{formatDate(selectedPayment.dueDate)}</p>
            </div>
            </div>
                
                <div className="detail-row" style={modalStyles.detailRow}>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={modalStyles.label}>Amount:</label>
                    <p style={{...modalStyles.value, fontWeight: 'bold'}}>
                      {formatCurrency(selectedPayment.amount)}
                    </p>
            </div>
                  {selectedPayment.status === 'PAID' && (
                    <div className="detail-group" style={modalStyles.detailGroup}>
                      <label style={modalStyles.label}>Payment Date:</label>
                      <p style={modalStyles.value}>{formatDate(selectedPayment.paymentDate)}</p>
          </div>
                  )}
                </div>
                
                <div className="detail-row" style={modalStyles.detailRow}>
                  <div className="detail-group wide" style={modalStyles.detailGroupWide}>
                    <label style={modalStyles.label}>Description:</label>
                    <p style={modalStyles.value}>{selectedPayment.description || 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <div className="modal-actions" style={modalStyles.modalActions}>
                <button 
                  onClick={() => setShowViewModal(false)} 
                  className="secondary-btn"
                  style={{...modalStyles.button, ...modalStyles.secondaryButton}}
                >
                  Close
          </button>
        </div>
      </div>
    </div>
        </div>
      )}
  </div>
);
};

// MedicalRecordManagement for patients
const MedicalRecordManagement = ({ patientId, setActiveSection }) => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [recordTypeFilter, setRecordTypeFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  
  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    if (patientId) {
      fetchMedicalRecords(patientId);
    }
  }, [patientId]);

  const fetchMedicalRecords = async (patientId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/medical-records/patient/${patientId}`);
      setMedicalRecords(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching medical records:', err);
      setError('Failed to load medical records. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not Specified";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return "Date Error";
    }
  };
  
  const getRecordTypeClass = (recordType) => {
    const classes = {
      'GENERAL_CHECKUP': 'status-pending',
      'EMERGENCY': 'status-rejected',
      'FOLLOW_UP': 'status-completed',
      'SURGERY': 'status-rejected',
      'LAB_TEST': 'status-pending',
      'IMAGING': 'status-pending',
      'VACCINATION': 'status-completed',
      'CONSULTATION': 'status-completed'
    };
    return classes[recordType] || 'status-pending';
  };

  const getDoctorName = (doctorId) => {
    // This would typically fetch doctor info from context or make an API call
    // For simplicity, returning placeholder text
    return doctorId ? `Dr. ${doctorId}` : 'Unknown Doctor';
  };

  const getFilteredRecords = () => {
    return medicalRecords.filter(record => {
      // Filter by record type
      if (recordTypeFilter !== 'ALL' && record.recordType !== recordTypeFilter) {
        return false;
      }
      
      // Filter by date
      if (dateFilter && record.recordDate) {
        const recordDate = new Date(record.recordDate).toISOString().split('T')[0];
        if (recordDate !== dateFilter) {
          return false;
        }
      }
      
      // Apply search term to doctor name, diagnosis, or record ID
      if (searchTerm) {
        const doctorName = getDoctorName(record.doctorId).toLowerCase();
        const recordId = record.recordId?.toString().toLowerCase() || '';
        const diagnosis = record.diagnosis?.toLowerCase() || '';
        
        return doctorName.includes(searchTerm.toLowerCase()) || 
               recordId.includes(searchTerm.toLowerCase()) ||
               diagnosis.includes(searchTerm.toLowerCase());
      }
      
      return true;
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading medical records...</p>
        </div>
    );
  }

  return (
    <div className="management-section">
      <div className="management-header">
        <div className="filters-container">
          <h3>Filters</h3>
          <div className="filters">
            <div className="filter-group">
              <label>Record Type:</label>
              <select 
                className="filter-select"
                value={recordTypeFilter}
                onChange={(e) => setRecordTypeFilter(e.target.value)}
              >
                <option value="ALL">All Types</option>
                <option value="GENERAL_CHECKUP">General Checkup</option>
                <option value="EMERGENCY">Emergency</option>
                <option value="FOLLOW_UP">Follow-up</option>
                <option value="SURGERY">Surgery</option>
                <option value="LAB_TEST">Lab Test</option>
                <option value="IMAGING">Imaging</option>
                <option value="VACCINATION">Vaccination</option>
                <option value="CONSULTATION">Consultation</option>
              </select>
                </div>
            <div className="filter-group">
              <label>Date:</label>
              <input 
                type="date" 
                className="filter-date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
              </div>
            <div className="filter-group">
              <label>Search:</label>
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder="Search by doctor, ID, or diagnosis..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                <i className="fas fa-search search-icon"></i>
              </div>
            </div>
          </div>
              </div>
            </div>

      {error && <div className="error-message">{error}</div>}
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Doctor</th>
              <th>Record Type</th>
              <th>Diagnosis</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredRecords().length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">No medical records found</td>
              </tr>
            ) : (
              getFilteredRecords().map(record => (
                <tr key={record.recordId}>
                  <td>{record.recordId}</td>
                  <td>{formatDate(record.recordDate)}</td>
                  <td>{getDoctorName(record.doctorId)}</td>
                  <td>
                    <span 
                      className={`status-badge ${getRecordTypeClass(record.recordType)}`}
                    >
                      {record.recordType.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>{record.diagnosis ? record.diagnosis.substring(0, 30) + (record.diagnosis.length > 30 ? '...' : '') : 'Not recorded'}</td>
                  <td className="actions-cell">
                    <button 
                      className="action-btn view" 
                      onClick={() => handleViewRecord(record)}
                      title="View Details"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
                </div>
      
      {/* View Medical Record Modal */}
      {showViewModal && selectedRecord && (
        <div className="modal-overlay">
          <div className="modal-container large-modal" style={modalStyles.viewModal}>
            <div className="modal-header" style={modalStyles.modalHeader}>
              <h3 style={modalStyles.modalTitle}>Medical Record Details</h3>
              <button className="close-btn" onClick={() => setShowViewModal(false)} style={modalStyles.closeButton}>
                <i className="fas fa-times"></i>
              </button>
              </div>
            <div className="modal-body" style={{ padding: '10px' }}>
              <div className="detail-section" style={{...modalStyles.detailSection, marginBottom: '20px'}}>
                <h4 style={{...modalStyles.sectionTitle, borderBottom: '2px solid #4CAF50'}}>Basic Information</h4>
                <div className="detail-row" style={modalStyles.detailRow}>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={{...modalStyles.label, color: '#2c3e50'}}>Record ID:</label>
                    <p style={{...modalStyles.value, fontWeight: '500'}}>{selectedRecord.recordId}</p>
              </div>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={{...modalStyles.label, color: '#2c3e50'}}>Doctor Name:</label>
                    <p style={{...modalStyles.value, fontWeight: '500'}}>{getDoctorName(selectedRecord.doctorId)}</p>
              </div>
            </div>
                
                <div className="detail-row" style={modalStyles.detailRow}>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={{...modalStyles.label, color: '#2c3e50'}}>Record Type:</label>
                    <p style={{...modalStyles.value, ...modalStyles.statusBadge, fontSize: '0.9rem'}}>
                      {selectedRecord.recordType.replace(/_/g, ' ')}
                    </p>
          </div>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={{...modalStyles.label, color: '#2c3e50'}}>Record Date:</label>
                    <p style={{...modalStyles.value, fontWeight: '500'}}>{formatDate(selectedRecord.recordDate)}</p>
        </div>
      </div>

                <div className="detail-row" style={modalStyles.detailRow}>
                  <div className="detail-group wide" style={modalStyles.detailGroupWide}>
                    <label style={{...modalStyles.label, color: '#2c3e50'}}>Next Appointment:</label>
                    <p style={{...modalStyles.value, fontWeight: selectedRecord.nextAppointment ? '500' : '400', 
                      color: selectedRecord.nextAppointment ? '#1e1e1e' : '#666'}}>
                      {formatDate(selectedRecord.nextAppointment)}
                    </p>
        </div>
            </div>
            </div>
              
              <div className="detail-section" style={{...modalStyles.detailSection, marginBottom: '20px'}}>
                <h4 style={{...modalStyles.sectionTitle, borderBottom: '2px solid #4CAF50'}}>Medical Details</h4>
                
                <div className="medical-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div className="detail-card" style={{ padding: '15px', backgroundColor: '#fff', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <label style={{...modalStyles.label, color: '#2c3e50', display: 'block', marginBottom: '8px'}}>Symptoms:</label>
                    <p style={{...modalStyles.value, minHeight: '60px'}}>{selectedRecord.symptoms || 'None recorded'}</p>
            </div>
                  
                  <div className="detail-card" style={{ padding: '15px', backgroundColor: '#fff', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <label style={{...modalStyles.label, color: '#2c3e50', display: 'block', marginBottom: '8px'}}>Diagnosis:</label>
                    <p style={{...modalStyles.value, minHeight: '60px'}}>{selectedRecord.diagnosis || 'None recorded'}</p>
                  </div>
                </div>

                <div className="medical-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                  <div className="detail-card" style={{ padding: '15px', backgroundColor: '#fff', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <label style={{...modalStyles.label, color: '#2c3e50', display: 'block', marginBottom: '8px'}}>Treatment:</label>
                    <p style={{...modalStyles.value, minHeight: '60px'}}>{selectedRecord.treatment || 'None recorded'}</p>
                  </div>
                  
                  <div className="detail-card" style={{ padding: '15px', backgroundColor: '#fff', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <label style={{...modalStyles.label, color: '#2c3e50', display: 'block', marginBottom: '8px'}}>Prescription:</label>
                    <p style={{...modalStyles.value, minHeight: '60px'}}>{selectedRecord.prescription || 'None recorded'}</p>
                  </div>
                </div>

                <div className="medical-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="detail-card" style={{ padding: '15px', backgroundColor: '#fff', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <label style={{...modalStyles.label, color: '#2c3e50', display: 'block', marginBottom: '8px'}}>Test Results:</label>
                    <p style={{...modalStyles.value, minHeight: '60px'}}>{selectedRecord.testResults || 'None recorded'}</p>
                  </div>
                  
                  <div className="detail-card" style={{ padding: '15px', backgroundColor: '#fff', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <label style={{...modalStyles.label, color: '#2c3e50', display: 'block', marginBottom: '8px'}}>Notes:</label>
                    <p style={{...modalStyles.value, minHeight: '60px'}}>{selectedRecord.notes || 'None recorded'}</p>
                  </div>
                </div>

                <div className="detail-row" style={{...modalStyles.detailRow, marginTop: '20px'}}>
                  <div className="detail-group wide" style={modalStyles.detailGroupWide}>
                    <label style={{...modalStyles.label, color: '#2c3e50', display: 'block', marginBottom: '8px'}}>Medical History:</label>
                    <p style={{...modalStyles.value, padding: '15px', backgroundColor: '#fff', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'}}>{selectedRecord.medicalHistory || 'None recorded'}</p>
                  </div>
                </div>
              </div>
              
              <div className="modal-actions" style={{...modalStyles.modalActions, borderTop: '2px solid #e0e0e0', paddingTop: '20px'}}>
                <button 
                  onClick={() => setShowViewModal(false)} 
                  className="secondary-btn"
                  style={{...modalStyles.button, ...modalStyles.secondaryButton, padding: '10px 20px', borderRadius: '6px'}}
                >
                  <i className="fas fa-times" style={{marginRight: '8px'}}></i> Close
            </button>
        </div>
      </div>
    </div>
        </div>
      )}
  </div>
);
};

// PrescriptionManagement for patients
const PrescriptionManagement = ({ patientId, setActiveSection }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  
  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    if (patientId) {
      fetchPrescriptions(patientId);
    }
  }, [patientId]);

  const fetchPrescriptions = async (patientId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/prescriptions/patient/${patientId}`);
      setPrescriptions(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
      setError('Failed to load prescriptions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setShowViewModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not Specified";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return "Date Error";
    }
  };
  
  const getStatusClass = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'status-pending';
      case 'COMPLETED':
        return 'status-completed';
      case 'EXPIRED':
        return 'status-rejected';
      case 'REFILLED':
        return 'status-info';
      default:
        return '';
    }
  };

  const getDoctorName = (doctorId) => {
    // This would typically fetch doctor info from context or make an API call
    // For simplicity, returning placeholder text
    return doctorId ? `Dr. ${doctorId}` : 'Unknown Doctor';
  };

  const getFilteredPrescriptions = () => {
    return prescriptions.filter(prescription => {
      // Filter by status
      if (statusFilter !== 'ALL' && prescription.status !== statusFilter) {
        return false;
      }
      
      // Filter by date
      if (dateFilter && prescription.prescriptionDate) {
        const prescDate = new Date(prescription.prescriptionDate).toISOString().split('T')[0];
        if (prescDate !== dateFilter) {
          return false;
        }
      }
      
      // Apply search term to doctor name or medication names
      if (searchTerm) {
        const doctorName = getDoctorName(prescription.doctorId).toLowerCase();
        const medicationNames = prescription.medications 
          ? prescription.medications.map(m => m.medicationName.toLowerCase()).join(' ') 
          : '';
        
        return doctorName.includes(searchTerm.toLowerCase()) || 
               medicationNames.includes(searchTerm.toLowerCase());
      }
      
      return true;
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading prescriptions...</p>
        </div>
    );
  }

  return (
    <div className="management-section">
      <div className="management-header">
        <div className="filters-container">
          <h3>Filters</h3>
          <div className="filters">
            <div className="filter-group">
              <label>Status:</label>
              <select 
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="EXPIRED">Expired</option>
                <option value="REFILLED">Refilled</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Date:</label>
              <input 
                type="date" 
                className="filter-date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label>Search:</label>
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder="Search by doctor, medications..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                <i className="fas fa-search search-icon"></i>
            </div>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Prescribed Date</th>
              <th>Doctor</th>
              <th>Medications</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredPrescriptions().length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">No prescriptions found</td>
              </tr>
            ) : (
              getFilteredPrescriptions().map(prescription => (
                <tr key={prescription.prescriptionId}>
                  <td>{prescription.prescriptionId}</td>
                  <td>{formatDate(prescription.prescriptionDate)}</td>
                  <td>{getDoctorName(prescription.doctorId)}</td>
                  <td>
                    {prescription.medications && prescription.medications.length > 0 
                      ? prescription.medications.map(med => med.medicationName).join(', ').substring(0, 30) + 
                        (prescription.medications.map(med => med.medicationName).join(', ').length > 30 ? '...' : '')
                      : 'No medications listed'}
                  </td>
                  <td>{formatDate(prescription.expiryDate)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(prescription.status)}`}>
                      {prescription.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button 
                      className="action-btn view" 
                      onClick={() => handleViewPrescription(prescription)}
                      title="View Details"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      
      {/* View Prescription Modal */}
      {showViewModal && selectedPrescription && (
        <div className="modal-overlay">
          <div className="modal-container large-modal" style={modalStyles.viewModal}>
            <div className="modal-header" style={modalStyles.modalHeader}>
              <h3 style={modalStyles.modalTitle}>Prescription Details</h3>
              <button className="close-btn" onClick={() => setShowViewModal(false)} style={modalStyles.closeButton}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body" style={{ padding: '10px' }}>
              <div className="detail-section" style={{...modalStyles.detailSection, marginBottom: '20px'}}>
                <h4 style={{...modalStyles.sectionTitle, borderBottom: '2px solid #4CAF50'}}>Prescription Information</h4>
                <div className="detail-row" style={modalStyles.detailRow}>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={{...modalStyles.label, color: '#2c3e50'}}>Prescription ID:</label>
                    <p style={{...modalStyles.value, fontWeight: '500'}}>{selectedPrescription.prescriptionId}</p>
            </div>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={{...modalStyles.label, color: '#2c3e50'}}>Status:</label>
                    <p style={{...modalStyles.value, ...modalStyles.statusBadge, display: 'inline-block', fontSize: '0.9rem'}}>
                      {selectedPrescription.status}
              </p>
            </div>
          </div>
                
                <div className="detail-row" style={modalStyles.detailRow}>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={{...modalStyles.label, color: '#2c3e50'}}>Prescribed By:</label>
                    <p style={{...modalStyles.value, fontWeight: '500'}}>{getDoctorName(selectedPrescription.doctorId)}</p>
        </div>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={{...modalStyles.label, color: '#2c3e50'}}>Prescribed Date:</label>
                    <p style={{...modalStyles.value, fontWeight: '500'}}>{formatDate(selectedPrescription.prescriptionDate)}</p>
      </div>
    </div>
                
                <div className="detail-row" style={modalStyles.detailRow}>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={{...modalStyles.label, color: '#2c3e50'}}>Expiry Date:</label>
                    <p style={{...modalStyles.value, fontWeight: '500'}}>{formatDate(selectedPrescription.expiryDate)}</p>
                  </div>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={{...modalStyles.label, color: '#2c3e50'}}>Refillable:</label>
                    <p style={{...modalStyles.value, fontWeight: '500'}}>{selectedPrescription.isRefillable ? 'Yes' : 'No'}</p>
                  </div>
                </div>
                
                {selectedPrescription.isRefillable && (
                  <div className="detail-row" style={modalStyles.detailRow}>
                    <div className="detail-group" style={modalStyles.detailGroup}>
                      <label style={{...modalStyles.label, color: '#2c3e50'}}>Total Refills:</label>
                      <p style={{...modalStyles.value, fontWeight: '500'}}>{selectedPrescription.totalRefills}</p>
                    </div>
                    <div className="detail-group" style={modalStyles.detailGroup}>
                      <label style={{...modalStyles.label, color: '#2c3e50'}}>Refills Used:</label>
                      <p style={{...modalStyles.value, fontWeight: '500'}}>{selectedPrescription.refillsUsed || 0}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="detail-section" style={{...modalStyles.detailSection, marginBottom: '20px'}}>
                <h4 style={{...modalStyles.sectionTitle, borderBottom: '2px solid #4CAF50'}}>Medications</h4>
                
                {selectedPrescription.medications && selectedPrescription.medications.length > 0 ? (
                  <div className="medications-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {selectedPrescription.medications.map((medication, index) => (
                      <div key={index} className="medication-item" style={modalStyles.medicationItem}>
                        <h5 style={modalStyles.medicationTitle}>{medication.medicationName}</h5>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <div>
                            <label style={{...modalStyles.label, color: '#2c3e50', fontSize: '0.85rem'}}>Dosage:</label>
                            <p style={{...modalStyles.value, margin: '0 0 8px 0'}}>{medication.dosage || 'Not specified'}</p>
                          </div>
                          <div>
                            <label style={{...modalStyles.label, color: '#2c3e50', fontSize: '0.85rem'}}>Frequency:</label>
                            <p style={{...modalStyles.value, margin: '0 0 8px 0'}}>{medication.frequency || 'Not specified'}</p>
                          </div>
                          <div>
                            <label style={{...modalStyles.label, color: '#2c3e50', fontSize: '0.85rem'}}>Duration:</label>
                            <p style={{...modalStyles.value, margin: '0 0 8px 0'}}>{medication.duration || 'Not specified'}</p>
                          </div>
                          <div>
                            <label style={{...modalStyles.label, color: '#2c3e50', fontSize: '0.85rem'}}>Quantity:</label>
                            <p style={{...modalStyles.value, margin: '0 0 8px 0'}}>{medication.quantity || 'Not specified'}</p>
                          </div>
                        </div>
                        <div>
                          <label style={{...modalStyles.label, color: '#2c3e50', fontSize: '0.85rem'}}>Instructions:</label>
                          <p style={{...modalStyles.value, margin: '0'}}>{medication.instructions || 'No special instructions'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No medications listed for this prescription.</p>
                )}
              </div>
              
              {selectedPrescription.notes && (
                <div className="detail-section" style={{...modalStyles.detailSection, marginBottom: '20px'}}>
                  <h4 style={{...modalStyles.sectionTitle, borderBottom: '2px solid #4CAF50'}}>Additional Notes</h4>
                  <p style={{...modalStyles.value, padding: '10px'}}>{selectedPrescription.notes}</p>
                </div>
              )}
              
              <div className="modal-actions" style={{...modalStyles.modalActions, borderTop: '2px solid #e0e0e0', paddingTop: '20px'}}>
                <button 
                  onClick={() => setShowViewModal(false)} 
                  className="secondary-btn"
                  style={{...modalStyles.button, ...modalStyles.secondaryButton, padding: '10px 20px', borderRadius: '6px'}}
                >
                  <i className="fas fa-times" style={{marginRight: '8px'}}></i> Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
  </div>
);
};

export default PatientPortal;
