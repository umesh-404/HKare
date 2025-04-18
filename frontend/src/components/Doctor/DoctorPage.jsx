import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DoctorPage.css";
import axios from "axios";
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
    fontSize: '1rem',
    color: '#1e1e1e',
    wordBreak: 'break-word'
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
    paddingTop: '15px',
    borderTop: '1px solid #e0e0e0'
  },
  button: {
    padding: '8px 16px',
    borderRadius: '4px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none'
  },
  secondaryButton: {
    backgroundColor: '#f5f5f5',
    color: '#333',
    border: '1px solid #ddd'
  },
  statusBadge: {
    display: 'inline-block',
    padding: '3px 8px',
    borderRadius: '12px',
    fontWeight: '500',
    fontSize: '0.85rem',
    textAlign: 'center'
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

const DoctorPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
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

  useEffect(() => {
    // Apply specific body class for this page
    document.body.classList.add('doctor-page-body');
    
    // Cleanup function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('doctor-page-body');
    };
  }, []);

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
      case "dashboard":
        return <Dashboard doctorId={userData?.roleId} />;
      case "patients":
        return <PatientManagement doctorId={userData?.roleId} />;
      case "appointments":
        return <AppointmentManagement doctorId={userData?.roleId} />;
      case "medical-records":
        return <MedicalRecordManagement doctorId={userData?.roleId} />;
      case "prescriptions":
        return <PrescriptionManagement doctorId={userData?.roleId} />;
      case "medications":
        return <MedicationManagement />;
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
          <div className="user-info" onClick={() => setActiveSection("profile")} style={{ cursor: 'pointer' }}>
            <i className="fas fa-user-md user-icon"></i>
            <span className="user-name">Dr. {userData ? `${userData.firstName} ${userData.lastName}` : 'Doctor'}</span>
          </div>
          <button className="logout-button" onClick={handleLogout}>
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
          { name: "Patients", icon: "fa-hospital-user" },
          { name: "Appointments", icon: "fa-calendar-check" },
          { name: "Medical Records", icon: "fa-file-medical" },
          { name: "Prescriptions", icon: "fa-prescription" },
          { name: "Medications", icon: "fa-pills" },
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
    'patients': 'fa-hospital-user',
    'appointments': 'fa-calendar-check',
    'medical-records': 'fa-file-medical',
    'prescriptions': 'fa-prescription',
    'medications': 'fa-pills',
    'profile': 'fa-user-circle'
  };
  return icons[section] || "fa-circle";
};

// Dashboard Section with Analytics and Graphs
const Dashboard = ({ doctorId }) => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    appointmentsToday: 0,
    pendingPrescriptions: 0,
    completedAppointments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sample data for patient visits graph (will be replaced with real data)
  const patientVisitsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Patient Visits',
        data: [15, 22, 18, 25, 20, 28],
        fill: false,
        borderColor: '#0066ff',
        tension: 0.4,
        pointBackgroundColor: '#0066ff'
      }
    ]
  };
  
  // Sample data for appointment types
  const appointmentTypesData = {
    labels: ['Follow-up', 'New Patient', 'Emergency', 'Consultation', 'Checkup'],
    datasets: [
      {
        label: 'Appointment Types',
        data: [25, 18, 5, 15, 37],
        backgroundColor: [
          '#4CAF50',
          '#2196F3',
          '#F44336',
          '#FF9800',
          '#9C27B0'
        ],
        borderColor: '#fff',
        borderWidth: 1
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#e0e0e0'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };
  
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  useEffect(() => {
    if (doctorId) {
      fetchDashboardData(doctorId);
    }
  }, [doctorId]);

  const fetchDashboardData = async (doctorId) => {
    setLoading(true);
    try {
      // Fetch statistics for the dashboard
      const today = new Date().toISOString().split('T')[0];
      
      // In a real application, these would be API calls to get actual counts
      // For now, we'll simulate the data for demonstration purposes
      
      // Example API calls (commented out for now)
      /*
      const patientsResponse = await axios.get(`http://localhost:8080/api/patients/doctor/${doctorId}/count`);
      const todayAppointmentsResponse = await axios.get(`http://localhost:8080/api/appointments/doctor/${doctorId}?date=${today}`);
      const pendingPrescriptionsResponse = await axios.get(`http://localhost:8080/api/prescriptions/doctor/${doctorId}?status=pending`);
      const completedAppointmentsResponse = await axios.get(`http://localhost:8080/api/appointments/doctor/${doctorId}/completed`);
      
      setStats({
        totalPatients: patientsResponse.data,
        appointmentsToday: todayAppointmentsResponse.data.length,
        pendingPrescriptions: pendingPrescriptionsResponse.data.length,
        completedAppointments: completedAppointmentsResponse.data
      });
      */
      
      // Simulated data for demonstration
      setStats({
        totalPatients: 78,
        appointmentsToday: 8,
        pendingPrescriptions: 5,
        completedAppointments: 345
      });
      
      setError('');
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-section">
      {error && <div className="error-message">{error}</div>}
      
      {/* Statistics Cards */}
      <div className="analytics-overview">
        <h3>Doctor Overview</h3>
        <div className="analytics-cards">
          <div className="analytics-card">
            <div className="card-icon">
              <i className="fas fa-hospital-user"></i>
            </div>
            <div className="card-content">
              <h4>My Patients</h4>
              <p>{stats.totalPatients}</p>
              <span className="trend up">
                <i className="fas fa-arrow-up"></i> 5% from last month
              </span>
            </div>
          </div>
          
          <div className="analytics-card">
            <div className="card-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="card-content">
              <h4>Today's Appointments</h4>
              <p>{stats.appointmentsToday}</p>
              <span className="trend neutral">
                <i className="fas fa-equals"></i> Same as yesterday
              </span>
            </div>
          </div>
          
          <div className="analytics-card">
            <div className="card-icon">
              <i className="fas fa-prescription"></i>
            </div>
            <div className="card-content">
              <h4>Pending Prescriptions</h4>
              <p>{stats.pendingPrescriptions}</p>
              <span className="trend down">
                <i className="fas fa-arrow-down"></i> 2 fewer than yesterday
              </span>
            </div>
          </div>
          
          <div className="analytics-card">
            <div className="card-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="card-content">
              <h4>Completed Consultations</h4>
              <p>{stats.completedAppointments}</p>
              <span className="trend up">
                <i className="fas fa-arrow-up"></i> 8 more this week
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="dashboard-charts">
        <div className="chart-container">
          <h3>Monthly Patient Visits</h3>
          <div className="chart-wrapper">
            <Line data={patientVisitsData} options={lineOptions} />
          </div>
        </div>
        
        <div className="chart-container">
          <h3>Appointment Types</h3>
          <div className="chart-wrapper">
            <Bar data={appointmentTypesData} options={pieOptions} />
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">
              <i className="fas fa-user-plus"></i>
            </div>
            <div className="activity-content">
              <p>New patient referral from Dr. Sharma</p>
              <span className="activity-time">30 minutes ago</span>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon">
              <i className="fas fa-file-medical"></i>
            </div>
            <div className="activity-content">
              <p>Updated medical records for patient ID 12345</p>
              <span className="activity-time">2 hours ago</span>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="activity-content">
              <p>Completed appointment with Anjali Gupta</p>
              <span className="activity-time">Yesterday</span>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon">
              <i className="fas fa-prescription"></i>
            </div>
            <div className="activity-content">
              <p>Issued prescription for Rahul Patel</p>
              <span className="activity-time">Yesterday</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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
        // Fix date format for the backend - remove time portion that causes parsing error
        dateOfBirth: formData.dateOfBirth ? `${formData.dateOfBirth}` : null
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

// Let's implement the Patient Management component for doctors
const PatientManagement = ({ doctorId }) => {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    if (doctorId) {
      fetchPatients(doctorId);
    }
  }, [doctorId]);

  const fetchPatients = async (doctorId) => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch only patients assigned to this doctor
      // For now, we'll fetch all patients as a demonstration
      const response = await axios.get('http://localhost:8080/api/patients'); 
      setPatients(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Failed to load patients. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowViewModal(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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

  const getFilteredPatients = () => {
    return patients.filter(patient => {
      const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase()) || 
             (patient.patientId && patient.patientId.toString().includes(searchTerm));
    });
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading patients...</p>
        </div>
    );
  }

  return (
    <div className="management-section">
      <div className="management-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Contact</th>
              <th>DOB</th>
              <th>Gender</th>
              <th>Blood Group</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredPatients().length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">No patients found</td>
              </tr>
            ) : (
              getFilteredPatients().map(patient => (
                <tr key={patient.patientId}>
                  <td>{patient.patientId}</td>
                  <td>{patient.firstName} {patient.lastName}</td>
                  <td>{patient.phoneNumber || patient.user?.phoneNumber || 'N/A'}</td>
                  <td>{formatDate(patient.dateOfBirth || patient.user?.dateOfBirth)}</td>
                  <td>{patient.gender || patient.user?.gender || 'N/A'}</td>
                  <td>{patient.bloodGroup || 'N/A'}</td>
                  <td className="actions-cell">
                    <button 
                      className="action-btn view" 
                      onClick={() => handleViewPatient(patient)}
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
      
      {/* View Patient Modal */}
      {showViewModal && selectedPatient && (
        <div className="modal-overlay">
          <div className="modal-container" style={modalStyles.viewModal}>
            <div className="modal-header" style={modalStyles.modalHeader}>
              <h3 style={modalStyles.modalTitle}>Patient Details</h3>
              <button className="close-btn" onClick={() => setShowViewModal(false)} style={modalStyles.closeButton}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="patient-details">
                <div className="detail-section" style={modalStyles.detailSection}>
                  <h4 style={modalStyles.sectionTitle}>Personal Information</h4>
                  <div className="detail-row" style={modalStyles.detailRow}>
                    <div className="detail-group" style={modalStyles.detailGroup}>
                      <label style={modalStyles.label}>Patient ID:</label>
                      <p style={modalStyles.value}>{selectedPatient.patientId}</p>
                    </div>
                    <div className="detail-group" style={modalStyles.detailGroup}>
                      <label style={modalStyles.label}>Name:</label>
                      <p style={modalStyles.value}>{selectedPatient.firstName} {selectedPatient.lastName}</p>
                    </div>
                  </div>

                  <div className="detail-row" style={modalStyles.detailRow}>
                    <div className="detail-group" style={modalStyles.detailGroup}>
                      <label style={modalStyles.label}>Date of Birth:</label>
                      <p style={modalStyles.value}>{formatDate(selectedPatient.dateOfBirth || selectedPatient.user?.dateOfBirth)}</p>
                    </div>
                    <div className="detail-group" style={modalStyles.detailGroup}>
                      <label style={modalStyles.label}>Gender:</label>
                      <p style={modalStyles.value}>{selectedPatient.gender || selectedPatient.user?.gender || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="detail-row" style={modalStyles.detailRow}>
                    <div className="detail-group" style={modalStyles.detailGroup}>
                      <label style={modalStyles.label}>Phone:</label>
                      <p style={modalStyles.value}>{selectedPatient.phoneNumber || selectedPatient.user?.phoneNumber || 'N/A'}</p>
                    </div>
                    <div className="detail-group" style={modalStyles.detailGroup}>
                      <label style={modalStyles.label}>Email:</label>
                      <p style={modalStyles.value}>{selectedPatient.email || selectedPatient.user?.email || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="detail-row" style={modalStyles.detailRow}>
                    <div className="detail-group wide" style={modalStyles.detailGroupWide}>
                      <label style={modalStyles.label}>Address:</label>
                      <p style={modalStyles.value}>{selectedPatient.address || selectedPatient.user?.address || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section" style={modalStyles.detailSection}>
                  <h4 style={modalStyles.sectionTitle}>Medical Information</h4>
                  <div className="detail-row" style={modalStyles.detailRow}>
                    <div className="detail-group" style={modalStyles.detailGroup}>
                      <label style={modalStyles.label}>Blood Group:</label>
                      <p style={modalStyles.value}>{selectedPatient.bloodGroup || 'N/A'}</p>
                    </div>
                    <div className="detail-group" style={modalStyles.detailGroup}>
                      <label style={modalStyles.label}>Height:</label>
                      <p style={modalStyles.value}>{selectedPatient.height ? `${selectedPatient.height} cm` : 'N/A'}</p>
                    </div>
                    <div className="detail-group" style={modalStyles.detailGroup}>
                      <label style={modalStyles.label}>Weight:</label>
                      <p style={modalStyles.value}>{selectedPatient.weight ? `${selectedPatient.weight} kg` : 'N/A'}</p>
                    </div>
                  </div>

                  <div className="detail-row" style={modalStyles.detailRow}>
                    <div className="detail-group wide" style={modalStyles.detailGroupWide}>
                      <label style={modalStyles.label}>Allergies:</label>
                      <p style={modalStyles.value}>{selectedPatient.allergies || 'None reported'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section" style={modalStyles.detailSection}>
                  <h4 style={modalStyles.sectionTitle}>Emergency Contact</h4>
                  <div className="detail-row" style={modalStyles.detailRow}>
                    <div className="detail-group" style={modalStyles.detailGroup}>
                      <label style={modalStyles.label}>Name:</label>
                      <p style={modalStyles.value}>{selectedPatient.emergencyContactName || 'N/A'}</p>
                    </div>
                    <div className="detail-group" style={modalStyles.detailGroup}>
                      <label style={modalStyles.label}>Phone:</label>
                      <p style={modalStyles.value}>{selectedPatient.emergencyContactPhone || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section" style={modalStyles.detailSection}>
                  <h4 style={modalStyles.sectionTitle}>Insurance Information</h4>
                  <div className="detail-row" style={modalStyles.detailRow}>
                    <div className="detail-group" style={modalStyles.detailGroup}>
                      <label style={modalStyles.label}>Provider:</label>
                      <p style={modalStyles.value}>{selectedPatient.insuranceProvider || 'N/A'}</p>
                    </div>
                    <div className="detail-group" style={modalStyles.detailGroup}>
                      <label style={modalStyles.label}>Policy ID:</label>
                      <p style={modalStyles.value}>{selectedPatient.insuranceId || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-actions" style={modalStyles.modalActions}>
                <button 
                  className="secondary-btn" 
                  onClick={() => setShowViewModal(false)}
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

// We'll implement other components later
const AppointmentManagement = ({ doctorId }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [patients, setPatients] = useState([]);
  
  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Selected appointment for operations
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  // Form data for editing appointments
  const [formData, setFormData] = useState({
    status: '',
    notes: ''
  });
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (doctorId) {
      fetchAppointments(doctorId);
    fetchPatients();
    }
  }, [doctorId]);

  const fetchAppointments = async (doctorId) => {
    setLoading(true);
    try {
      // Fetch only appointments for this doctor
      const response = await axios.get(`http://localhost:8080/api/appointments/doctor/${doctorId}`);
      setAppointments(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/patients');
      setPatients(response.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowViewModal(true);
  };

  const handleOpenEditModal = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      status: appointment.status || 'SCHEDULED',
      notes: appointment.notes || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateAppointment = async (e) => {
    e.preventDefault();
    try {
      const updatedAppointment = {
        ...selectedAppointment,
        status: formData.status,
        notes: formData.notes
      };
      
      await axios.put(`http://localhost:8080/api/appointments/${selectedAppointment.appointmentId}`, updatedAppointment);
      
      setAppointments(appointments.map(app => 
        app.appointmentId === selectedAppointment.appointmentId ? updatedAppointment : app
      ));
      
      setShowEditModal(false);
      alert('Appointment updated successfully!');
    } catch (err) {
      console.error('Error updating appointment:', err);
      alert(err.response?.data?.message || 'Failed to update appointment. Please try again.');
    }
  };

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return 'N/A';
    try {
      const date = new Date(dateTimeStr);
      if (isNaN(date.getTime())) return 'N/A';
      
      return date.toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting date time:', error);
      return 'N/A';
    }
  };

  const formatTimeOnly = (dateTimeStr) => {
    if (!dateTimeStr) return 'N/A';
    try {
      const date = new Date(dateTimeStr);
      if (isNaN(date.getTime())) return 'N/A';
      
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'N/A';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'status-scheduled';
      case 'COMPLETED':
        return 'status-completed';
      case 'CANCELLED':
        return 'status-cancelled';
      case 'IN_PROGRESS':
        return 'status-in-progress';
      case 'NO_SHOW':
        return 'status-no-show';
      default:
        return '';
    }
  };

  const getFilteredAppointments = () => {
    return appointments.filter(appointment => {
      // Filter by status
      if (statusFilter !== 'ALL' && appointment.status !== statusFilter) {
        return false;
      }
      
      // Filter by date
      if (dateFilter && appointment.appointmentDate) {
        if (appointment.appointmentDate !== dateFilter) {
          return false;
        }
      }
      
      // Filter by search term (patient name or ID)
      if (searchTerm) {
        const patientName = getPatientName(appointment.patientId).toLowerCase();
        const patientId = appointment.patientId?.toString() || '';
        
        return patientName.includes(searchTerm.toLowerCase()) || 
               patientId.includes(searchTerm);
      }
      
      return true;
    });
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.patientId === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
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
                  placeholder="Search by patient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Reason</th>
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
                  <td>{getPatientName(appointment.patientId)}</td>
                  <td>{appointment.appointmentDate || 'N/A'}</td>
                  <td>{formatTimeOnly(appointment.startTime)}</td>
                  <td>{appointment.reason || 'N/A'}</td>
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
                    <button 
                      className="action-btn edit" 
                      onClick={() => handleOpenEditModal(appointment)}
                      title="Update Status"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
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
                <h4 style={modalStyles.sectionTitle}>Appointment Information</h4>
                <div className="detail-row" style={modalStyles.detailRow}>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={modalStyles.label}>Appointment ID:</label>
                    <p style={modalStyles.value}>{selectedAppointment.appointmentId}</p>
                  </div>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={modalStyles.label}>Status:</label>
                    <p className={`status-text ${getStatusClass(selectedAppointment.status)}`} style={{...modalStyles.value, ...modalStyles.statusBadge}}>
                      {selectedAppointment.status}
                    </p>
                  </div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-group">
                    <label>Date:</label>
                    <p>{selectedAppointment.appointmentDate || 'N/A'}</p>
                  </div>
                  <div className="detail-group">
                    <label>Time:</label>
                    <p>{formatTimeOnly(selectedAppointment.startTime)}</p>
                  </div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-group wide">
                    <label>Reason for Visit:</label>
                    <p>{selectedAppointment.reason || 'No reason provided'}</p>
                  </div>
                </div>
                
                <div className="detail-row">
                  <div className="detail-group wide">
                    <label>Notes:</label>
                    <p>{selectedAppointment.notes || 'No notes available'}</p>
                  </div>
                </div>
              </div>
              
              <div className="detail-section">
                <h4>Patient Information</h4>
                <div className="detail-row">
                  <div className="detail-group">
                    <label>Patient:</label>
                    <p>{getPatientName(selectedAppointment.patientId)}</p>
                  </div>
                  <div className="detail-group">
                    <label>Patient ID:</label>
                    <p>{selectedAppointment.patientId}</p>
                  </div>
                </div>
              </div>
              
              <div className="modal-actions">
                <button onClick={() => {
                  setShowViewModal(false);
                  handleOpenEditModal(selectedAppointment);
                }} className="primary-btn">
                  Edit Appointment
                </button>
                <button onClick={() => setShowViewModal(false)} className="secondary-btn">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Appointment Modal */}
      {showEditModal && selectedAppointment && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Update Appointment Status</h3>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdateAppointment}>
                <div className="form-section">
                  <h4>Appointment Details</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Patient:</label>
                      <input 
                        type="text" 
                        value={getPatientName(selectedAppointment.patientId)} 
                        disabled 
                      />
                    </div>
                    <div className="form-group">
                      <label>Date & Time:</label>
                      <input 
                        type="text" 
                        value={`${selectedAppointment.appointmentDate || 'N/A'} ${selectedAppointment.startTime || ''}`} 
                        disabled 
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="status">Status:*</label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="NO_SHOW">No Show</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="notes">Notes:</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="button" onClick={() => setShowEditModal(false)} className="cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    Update Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MedicalRecordManagement = ({ doctorId }) => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [patients, setPatients] = useState([]);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  // Filter states
  const [patientFilter, setPatientFilter] = useState('');
  const [recordTypeFilter, setRecordTypeFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    recordType: 'GENERAL_CHECKUP',
    diagnosis: '',
    symptoms: '',
    treatment: '',
    notes: '',
    prescription: '',
    testResults: '',
    medicalHistory: '',
    recordDate: new Date().toISOString().split('T')[0],
    nextAppointment: ''
  });
  
  useEffect(() => {
    if (doctorId) {
      fetchMedicalRecords(doctorId);
      fetchPatients();
    }
  }, [doctorId]);
  
  const fetchMedicalRecords = async (doctorId) => {
    setIsLoading(true);
    try {
      // Fetch medical records for this doctor
      const response = await axios.get(`http://localhost:8080/api/medical-records/doctor/${doctorId}`);
      
      // Process and format the data to ensure proper date handling
      const processedRecords = response.data.map(record => {
        // Set default date - today's date if record has no date
        let defaultDate = new Date().toISOString().split('.')[0];
        
        // Create a processed record with guaranteed date values
        return {
          ...record,
          // Ensure dates are present
          recordDate: record.recordDate || defaultDate,
          nextAppointment: record.nextAppointment || ''
        };
      });
      
      setMedicalRecords(processedRecords);
      setError('');
    } catch (err) {
      console.error('Error fetching medical records:', err);
      setError('Failed to load medical records. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/patients');
      setPatients(response.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const openAddModal = () => {
    setFormData({
      patientId: '',
      doctorId: doctorId, // Preset with current doctor ID
      recordType: 'GENERAL_CHECKUP',
      diagnosis: '',
      symptoms: '',
      treatment: '',
      notes: '',
      prescription: '',
      testResults: '',
      medicalHistory: '',
      recordDate: new Date().toISOString().split('T')[0],
      nextAppointment: ''
    });
    setShowAddModal(true);
  };
  
  const openEditModal = (record) => {
    setSelectedRecord(record);
    
    // Helper function to safely format date
    const formatDateForInput = (dateString) => {
      if (!dateString) return '';
      
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
      } catch (e) {
        console.error('Error formatting date:', e);
        return '';
      }
    };
    
    setFormData({
      patientId: record.patientId || '',
      doctorId: record.doctorId || doctorId,
      recordType: record.recordType || 'GENERAL_CHECKUP',
      diagnosis: record.diagnosis || '',
      symptoms: record.symptoms || '',
      treatment: record.treatment || '',
      notes: record.notes || '',
      prescription: record.prescription || '',
      testResults: record.testResults || '',
      medicalHistory: record.medicalHistory || '',
      recordDate: formatDateForInput(record.recordDate),
      nextAppointment: formatDateForInput(record.nextAppointment)
    });
    setShowEditModal(true);
  };
  
  const openViewModal = (record) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };
  
  const handleAddRecord = async (e) => {
    e.preventDefault();
    try {
      // Create a copy of formData
      const formDataToSend = { ...formData };
      
      // Keep dates in native YYYY-MM-DD format without adding time
      if (formDataToSend.recordDate) {
        formDataToSend.recordDate = formDataToSend.recordDate;
      }
      
      if (formDataToSend.nextAppointment) {
        formDataToSend.nextAppointment = formDataToSend.nextAppointment;
      }
      
      const newRecord = {
        ...formDataToSend,
        doctorId: doctorId
      };
      
      const response = await axios.post('http://localhost:8080/api/medical-records', newRecord);
      
      // Add the returned data to the medical records list
      setMedicalRecords([...medicalRecords, response.data]);
      
      setShowAddModal(false);
      alert('Medical record added successfully!');
      
      // Refresh data from server to ensure we have the latest
      fetchMedicalRecords(doctorId);
    } catch (err) {
      console.error('Error adding medical record:', err);
      alert(err.response?.data?.message || 'Failed to add medical record. Please try again.');
    }
  };
  
  const handleUpdateRecord = async (e) => {
    e.preventDefault();
    try {
      // Create a copy of formData
      const formDataToSend = { ...formData };
      
      // Format date fields to be compatible with backend's LocalDate format
      if (formDataToSend.recordDate) {
        // Use just the date part without the time component
        formDataToSend.recordDate = formDataToSend.recordDate;
      }
      
      if (formDataToSend.nextAppointment) {
        // Use just the date part without the time component
        formDataToSend.nextAppointment = formDataToSend.nextAppointment;
      }
      
      const updatedRecord = {
        ...formDataToSend,
        doctorId: doctorId
      };
      
      const response = await axios.put(`http://localhost:8080/api/medical-records/${selectedRecord.recordId}`, updatedRecord);
      
      // Update the medical records list with the returned data from the server
      setMedicalRecords(medicalRecords.map(record => 
        record.recordId === selectedRecord.recordId ? response.data : record
      ));
      
      setShowEditModal(false);
      alert('Medical record updated successfully!');
      
      // Refresh data from server to ensure we have the latest
      fetchMedicalRecords(doctorId);
    } catch (err) {
      console.error('Error updating medical record:', err);
      alert(err.response?.data?.message || 'Failed to update medical record. Please try again.');
    }
  };

  // Format date for display
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

  // Styles for the component
  const styles = {
    recordType: {
      color: '#000',
      fontWeight: 'bold',
      padding: '4px 8px',
      borderRadius: '4px',
      display: 'inline-block',
      textAlign: 'center'
    }
  };
  
  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.patientId === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
  };
  
  const getFilteredRecords = () => {
    return medicalRecords.filter(record => {
      // Filter by patient
      if (patientFilter && record.patientId !== patientFilter) {
        return false;
      }
      
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
      
      // Apply search term to patient name, diagnosis, or record ID
      if (searchTerm) {
        const patientName = getPatientName(record.patientId).toLowerCase();
        const recordId = record.recordId?.toString().toLowerCase() || '';
        const diagnosis = record.diagnosis?.toLowerCase() || '';
        
        return patientName.includes(searchTerm.toLowerCase()) || 
               recordId.includes(searchTerm.toLowerCase()) ||
               diagnosis.includes(searchTerm.toLowerCase());
      }
      
      return true;
    });
  };
  
  if (isLoading) {
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
              <label>Patient:</label>
              <select 
                className="filter-select"
                value={patientFilter}
                onChange={(e) => setPatientFilter(e.target.value)}
              >
                <option value="">All Patients</option>
                {patients.map(patient => (
                  <option key={patient.patientId} value={patient.patientId}>
                    {patient.firstName} {patient.lastName}
                  </option>
                ))}
              </select>
            </div>
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
                  placeholder="Search by patient, ID, or diagnosis..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                />
              </div>
            </div>
          </div>
        </div>
        <button className="add-btn" onClick={openAddModal}>
          <i className="fas fa-plus"></i>
          New Medical Record
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <div className="table-container">
        <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
              <th>Record Type</th>
                  <th>Date</th>
              <th>Diagnosis</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
            {getFilteredRecords().length > 0 ? (
              getFilteredRecords().map(record => (
                <tr key={record.recordId}>
                  <td>{record.recordId}</td>
                  <td>{getPatientName(record.patientId)}</td>
                  <td>
                    <span 
                      className={`status-badge ${getRecordTypeClass(record.recordType)}`}
                      style={styles.recordType}
                    >
                      {record.recordType.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>
                    {record.recordDate ? formatDate(record.recordDate) : formatDate(new Date().toISOString())}
                  </td>
                  <td>{record.diagnosis ? record.diagnosis.substring(0, 30) + (record.diagnosis.length > 30 ? '...' : '') : 'N/A'}</td>
                  <td className="actions-cell">
                          <button
                      className="action-btn view" 
                      onClick={() => openViewModal(record)}
                      title="View Details"
                    >
                      <i className="fas fa-eye"></i>
                          </button>
                    <button 
                      className="action-btn edit" 
                      onClick={() => openEditModal(record)}
                      title="Edit"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    </td>
                  </tr>
              ))
          ) : (
              <tr>
                <td colSpan="6" className="no-data">No medical records found</td>
              </tr>
          )}
          </tbody>
        </table>
        </div>
      
      {/* Add Medical Record Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-container large-modal">
            <div className="modal-header">
              <h3>Add New Medical Record</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddRecord}>
                <div className="form-section">
                  <h4>Basic Information</h4>
                  <div className="form-grid">
              <div className="form-group">
                      <label htmlFor="patientId">Patient*</label>
                <select
                        id="patientId"
                  name="patientId"
                        value={formData.patientId}
                        onChange={handleInputChange}
                  required
                >
                  <option value="">Select Patient</option>
                        {patients.map(patient => (
                    <option key={patient.patientId} value={patient.patientId}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
                    </div>
              </div>

                  <div className="form-grid">
                <div className="form-group">
                      <label htmlFor="recordType">Record Type*</label>
                      <select
                        id="recordType"
                        name="recordType"
                        value={formData.recordType}
                        onChange={handleInputChange}
                        required
                      >
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
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="recordDate">Record Date*</label>
                  <input
                    type="date"
                        id="recordDate"
                        name="recordDate"
                        value={formData.recordDate}
                        onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                      <label htmlFor="nextAppointment">Next Appointment</label>
                  <input
                    type="date"
                        id="nextAppointment"
                        name="nextAppointment"
                        value={formData.nextAppointment}
                        onChange={handleInputChange}
                      />
                    </div>
                </div>
              </div>

                <div className="form-section">
                  <h4>Medical Details</h4>
                  <div className="form-group">
                    <label htmlFor="symptoms">Symptoms</label>
                    <textarea
                      id="symptoms"
                      name="symptoms"
                      value={formData.symptoms}
                      onChange={handleInputChange}
                      rows="2"
                    ></textarea>
                </div>
                  <div className="form-group">
                    <label htmlFor="diagnosis">Diagnosis</label>
                    <textarea
                      id="diagnosis"
                      name="diagnosis"
                      value={formData.diagnosis}
                      onChange={handleInputChange}
                      rows="2"
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="treatment">Treatment</label>
                    <textarea
                      id="treatment"
                      name="treatment"
                      value={formData.treatment}
                      onChange={handleInputChange}
                      rows="2"
                    ></textarea>
              </div>
              <div className="form-group">
                    <label htmlFor="notes">Notes</label>
                <textarea
                      id="notes"
                  name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                  rows="2"
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="prescription">Prescription</label>
                    <textarea
                      id="prescription"
                      name="prescription"
                      value={formData.prescription}
                      onChange={handleInputChange}
                      rows="2"
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="testResults">Test Results</label>
                    <textarea
                      id="testResults"
                      name="testResults"
                      value={formData.testResults}
                      onChange={handleInputChange}
                      rows="2"
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="medicalHistory">Medical History</label>
                    <textarea
                      id="medicalHistory"
                      name="medicalHistory"
                      value={formData.medicalHistory}
                      onChange={handleInputChange}
                      rows="2"
                    ></textarea>
                  </div>
              </div>

                <div className="form-actions">
                  <button type="button" onClick={() => setShowAddModal(false)} className="cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    Add Medical Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Medical Record Modal */}
      {showEditModal && selectedRecord && (
        <div className="modal-overlay">
          <div className="modal-container large-modal">
            <div className="modal-header">
              <h3>Edit Medical Record</h3>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdateRecord}>
                <div className="form-section">
                  <h4>Basic Information</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="patientId">Patient*</label>
                      <select
                        id="patientId"
                        name="patientId"
                        value={formData.patientId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Patient</option>
                        {patients.map(patient => (
                          <option key={patient.patientId} value={patient.patientId}>
                            {patient.firstName} {patient.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="recordType">Record Type*</label>
                      <select
                        id="recordType"
                        name="recordType"
                        value={formData.recordType}
                        onChange={handleInputChange}
                        required
                      >
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
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="recordDate">Record Date*</label>
                      <input
                        type="date"
                        id="recordDate"
                        name="recordDate"
                        value={formData.recordDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="nextAppointment">Next Appointment</label>
                      <input
                        type="date"
                        id="nextAppointment"
                        name="nextAppointment"
                        value={formData.nextAppointment}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="form-section">
                  <h4>Medical Details</h4>
                  <div className="form-group">
                    <label htmlFor="symptoms">Symptoms</label>
                    <textarea
                      id="symptoms"
                      name="symptoms"
                      value={formData.symptoms}
                      onChange={handleInputChange}
                      rows="2"
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="diagnosis">Diagnosis</label>
                    <textarea
                      id="diagnosis"
                      name="diagnosis"
                      value={formData.diagnosis}
                      onChange={handleInputChange}
                      rows="2"
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="treatment">Treatment</label>
                    <textarea
                      id="treatment"
                      name="treatment"
                      value={formData.treatment}
                      onChange={handleInputChange}
                      rows="2"
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="notes">Notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="2"
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="prescription">Prescription</label>
                    <textarea
                      id="prescription"
                      name="prescription"
                      value={formData.prescription}
                      onChange={handleInputChange}
                      rows="2"
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="testResults">Test Results</label>
                    <textarea
                      id="testResults"
                      name="testResults"
                      value={formData.testResults}
                      onChange={handleInputChange}
                      rows="2"
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="medicalHistory">Medical History</label>
                    <textarea
                      id="medicalHistory"
                      name="medicalHistory"
                      value={formData.medicalHistory}
                      onChange={handleInputChange}
                      rows="2"
                    ></textarea>
                  </div>
                </div>

              <div className="form-actions">
                  <button type="button" onClick={() => setShowEditModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                    Update Medical Record
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      )}
      
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
            <div className="modal-body">
              <div className="detail-section" style={modalStyles.detailSection}>
                <h4 style={modalStyles.sectionTitle}>Basic Information</h4>
                <div className="detail-row" style={modalStyles.detailRow}>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={modalStyles.label}>Record ID:</label>
                    <p style={modalStyles.value}>{selectedRecord.recordId}</p>
                  </div>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={modalStyles.label}>Patient Name:</label>
                    <p style={modalStyles.value}>{getPatientName(selectedRecord.patientId)}</p>
                  </div>
                </div>
                
                <div className="detail-row" style={modalStyles.detailRow}>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={modalStyles.label}>Record Type:</label>
                    <p style={{...modalStyles.value, ...modalStyles.statusBadge, ...styles.recordType}}>
                      {selectedRecord.recordType.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={modalStyles.label}>Record Date:</label>
                    <p style={modalStyles.value}>{formatDate(selectedRecord.recordDate)}</p>
                  </div>
                </div>
                
                <div className="detail-row" style={modalStyles.detailRow}>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={modalStyles.label}>Next Appointment:</label>
                    <p style={modalStyles.value}>{formatDate(selectedRecord.nextAppointment)}</p>
                  </div>
                </div>
              </div>
              
              <div className="detail-section" style={modalStyles.detailSection}>
                <h4 style={modalStyles.sectionTitle}>Medical Details</h4>
                <div className="detail-row" style={modalStyles.detailRow}>
                  <div className="detail-group wide" style={modalStyles.detailGroupWide}>
                    <label style={modalStyles.label}>Symptoms:</label>
                    <p style={modalStyles.value}>{selectedRecord.symptoms || 'None recorded'}</p>
                  </div>
                </div>
                
                <div className="detail-row" style={modalStyles.detailRow}>
                  <div className="detail-group wide" style={modalStyles.detailGroupWide}>
                    <label style={modalStyles.label}>Diagnosis:</label>
                    <p style={modalStyles.value}>{selectedRecord.diagnosis || 'None recorded'}</p>
                  </div>
                </div>
                
                <div className="detail-row" style={modalStyles.detailRow}>
                  <div className="detail-group wide" style={modalStyles.detailGroupWide}>
                    <label style={modalStyles.label}>Treatment:</label>
                    <p style={modalStyles.value}>{selectedRecord.treatment || 'None recorded'}</p>
                  </div>
                </div>
                
                <div className="detail-row" style={modalStyles.detailRow}>
                  <div className="detail-group wide" style={modalStyles.detailGroupWide}>
                    <label style={modalStyles.label}>Notes:</label>
                    <p style={modalStyles.value}>{selectedRecord.notes || 'None recorded'}</p>
                  </div>
                </div>
                
                <div className="detail-row" style={modalStyles.detailRow}>
                  <div className="detail-group wide" style={modalStyles.detailGroupWide}>
                    <label style={modalStyles.label}>Prescription:</label>
                    <p style={modalStyles.value}>{selectedRecord.prescription || 'None recorded'}</p>
                  </div>
                </div>
                
                <div className="detail-row" style={modalStyles.detailRow}>
                  <div className="detail-group wide" style={modalStyles.detailGroupWide}>
                    <label style={modalStyles.label}>Test Results:</label>
                    <p style={modalStyles.value}>{selectedRecord.testResults || 'None recorded'}</p>
                  </div>
                </div>
                
                <div className="detail-row" style={modalStyles.detailRow}>
                  <div className="detail-group wide" style={modalStyles.detailGroupWide}>
                    <label style={modalStyles.label}>Medical History:</label>
                    <p style={modalStyles.value}>{selectedRecord.medicalHistory || 'None recorded'}</p>
                  </div>
                </div>
              </div>
              
              <div className="modal-actions" style={modalStyles.modalActions}>
                <button 
                  onClick={() => {
                    setShowViewModal(false);
                    openEditModal(selectedRecord);
                  }} 
                  className="primary-btn"
                  style={{...modalStyles.button, ...modalStyles.primaryButton}}
                >
                  Edit Record
                </button>
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

const PrescriptionManagement = ({ doctorId }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  
  // Selected prescription for operations
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    prescriptionDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    status: 'ACTIVE',
    notes: '',
    isRefillable: false,
    totalRefills: 0,
    medications: [
      {
        medicationName: '',
        dosage: '',
        frequency: '',
        instructions: '',
        quantity: 1,
        duration: ''
      }
    ]
  });

  useEffect(() => {
    if (doctorId) {
      fetchPrescriptions(doctorId);
      fetchPatients();
      fetchMedications();
    }
  }, [doctorId]);

  const fetchPrescriptions = async (doctorId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/prescriptions/doctor/${doctorId}`);
      setPrescriptions(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
      setError('Failed to load prescriptions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/patients');
      setPatients(response.data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  const fetchMedications = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/medications');
      setMedications(response.data);
    } catch (err) {
      console.error('Error fetching medications:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...formData.medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      medications: updatedMedications
    });
  };

  const addMedicationField = () => {
    setFormData({
      ...formData,
      medications: [
        ...formData.medications,
        {
          medicationName: '',
          dosage: '',
          frequency: '',
          instructions: '',
          quantity: 1,
          duration: ''
        }
      ]
    });
  };

  const removeMedicationField = (index) => {
    const updatedMedications = [...formData.medications];
    updatedMedications.splice(index, 1);
    
    setFormData({
      ...formData,
      medications: updatedMedications
    });
  };

  const openAddModal = () => {
    setFormData({
      patientId: '',
      doctorId: doctorId,
      prescriptionDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
      status: 'ACTIVE',
      notes: '',
      isRefillable: false,
      totalRefills: 0,
      medications: [
        {
          medicationName: '',
          dosage: '',
          frequency: '',
          instructions: '',
          quantity: 1,
          duration: ''
        }
      ]
    });
    setShowAddModal(true);
  };

  const openEditModal = (prescription) => {
    setSelectedPrescription(prescription);
    
    // Convert prescription to form data format
    const expiryDate = prescription.expiryDate ? new Date(prescription.expiryDate).toISOString().split('T')[0] : '';
    const prescriptionDate = prescription.prescriptionDate ? new Date(prescription.prescriptionDate).toISOString().split('T')[0] : '';
    
    setFormData({
      patientId: prescription.patientId || '',
      doctorId: prescription.doctorId || doctorId,
      prescriptionDate: prescriptionDate,
      expiryDate: expiryDate,
      status: prescription.status || 'ACTIVE',
      notes: prescription.notes || '',
      isRefillable: prescription.isRefillable || false,
      totalRefills: prescription.totalRefills || 0,
      medications: prescription.medications && prescription.medications.length > 0 
        ? prescription.medications.map(med => ({
            medicationName: med.medicationName || '',
            dosage: med.dosage || '',
            frequency: med.frequency || '',
            instructions: med.instructions || '',
            quantity: med.quantity || 1,
            duration: med.duration || ''
          }))
        : [
            {
              medicationName: '',
              dosage: '',
              frequency: '',
              instructions: '',
              quantity: 1,
              duration: ''
            }
          ]
    });
    
    setShowEditModal(true);
  };

  const openViewModal = (prescription) => {
    setSelectedPrescription(prescription);
    setShowViewModal(true);
  };

  const handleAddPrescription = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare data for API - using native format without time component
      const prescriptionData = {
        ...formData,
        doctorId: doctorId,
        // Keep dates in native YYYY-MM-DD format without adding time
        prescriptionDate: formData.prescriptionDate,
        expiryDate: formData.expiryDate
      };
      
      const response = await axios.post('http://localhost:8080/api/prescriptions', prescriptionData);
      
      setPrescriptions([...prescriptions, response.data]);
      setShowAddModal(false);
      alert('Prescription created successfully!');
    } catch (err) {
      console.error('Error creating prescription:', err);
      alert(err.response?.data?.message || 'Failed to create prescription. Please try again.');
    }
  };

  const handleUpdatePrescription = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare data for API - using native format without time component
      const prescriptionData = {
        ...formData,
        doctorId: doctorId,
        // Keep dates in native YYYY-MM-DD format without adding time
        prescriptionDate: formData.prescriptionDate,
        expiryDate: formData.expiryDate
      };
      
      const response = await axios.put(`http://localhost:8080/api/prescriptions/${selectedPrescription.prescriptionId}`, prescriptionData);
      
      // Update the prescriptions list with the returned data
      setPrescriptions(prescriptions.map(p => 
        p.prescriptionId === selectedPrescription.prescriptionId ? response.data : p
      ));
      
      setShowEditModal(false);
      alert('Prescription updated successfully!');
      
      // Refresh data from server
      fetchPrescriptions(doctorId);
    } catch (err) {
      console.error('Error updating prescription:', err);
      alert(err.response?.data?.message || 'Failed to update prescription. Please try again.');
    }
  };

  const handleProcessRefill = async (prescriptionId) => {
    try {
      await axios.post(`http://localhost:8080/api/prescriptions/${prescriptionId}/refill`);
      
      // Refresh prescriptions after refill
      fetchPrescriptions(doctorId);
      alert('Prescription refilled successfully!');
    } catch (err) {
      console.error('Error processing refill:', err);
      alert(err.response?.data?.message || 'Failed to process refill. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'status-active';
      case 'COMPLETED':
        return 'status-completed';
      case 'EXPIRED':
        return 'status-expired';
      case 'CANCELLED':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.patientId === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
  };

  const getFilteredPrescriptions = () => {
    return prescriptions.filter(prescription => {
      // Apply status filter
      if (statusFilter !== 'ALL' && prescription.status !== statusFilter) {
        return false;
      }
      
      // Apply date filter
      if (dateFilter && prescription.prescriptionDate) {
        const prescDate = new Date(prescription.prescriptionDate).toISOString().split('T')[0];
        if (prescDate !== dateFilter) {
          return false;
        }
      }
      
      // Apply search term to patient name or prescription ID
      if (searchTerm) {
        const patientName = getPatientName(prescription.patientId).toLowerCase();
        const prescriptionId = prescription.prescriptionId?.toString().toLowerCase() || '';
        
        return patientName.includes(searchTerm.toLowerCase()) || 
               prescriptionId.includes(searchTerm.toLowerCase());
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
                <option value="CANCELLED">Cancelled</option>
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
                  placeholder="Search by patient or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <i className="fas fa-search search-icon"></i>
              </div>
            </div>
          </div>
        </div>
        <button className="add-btn" onClick={openAddModal}>
          <i className="fas fa-plus"></i>
          New Prescription
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Date</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Refillable</th>
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
                  <td>{getPatientName(prescription.patientId)}</td>
                  <td>{formatDate(prescription.prescriptionDate)}</td>
                  <td>{formatDate(prescription.expiryDate)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(prescription.status)}`}>
                      {prescription.status}
                    </span>
                  </td>
                  <td>
                    {prescription.isRefillable ? (
                      <span className="refill-info">
                        Yes ({prescription.refillsRemaining}/{prescription.totalRefills})
                      </span>
                    ) : (
                      <span>No</span>
                    )}
                  </td>
                  <td className="actions-cell">
                    <button 
                      className="action-btn view" 
                      onClick={() => openViewModal(prescription)}
                      title="View Details"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button 
                      className="action-btn edit" 
                      onClick={() => openEditModal(prescription)}
                      title="Edit"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    {prescription.status === 'ACTIVE' && prescription.isRefillable && prescription.refillsRemaining > 0 && (
                      <button 
                        className="action-btn refill" 
                        onClick={() => handleProcessRefill(prescription.prescriptionId)}
                        title="Process Refill"
                      >
                        <i className="fas fa-sync"></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Add Prescription Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-container large-modal">
            <div className="modal-header">
              <h3>Add New Prescription</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddPrescription}>
                <div className="form-section">
                  <h4>Basic Information</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="patientId">Patient*</label>
                      <select
                        id="patientId"
                        name="patientId"
                        value={formData.patientId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Patient</option>
                        {patients.map(patient => (
                          <option key={patient.patientId} value={patient.patientId}>
                            {patient.firstName} {patient.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="prescriptionDate">Prescription Date*</label>
                      <input
                        type="date"
                        id="prescriptionDate"
                        name="prescriptionDate"
                        value={formData.prescriptionDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="expiryDate">Expiry Date*</label>
                      <input
                        type="date"
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="status">Status*</label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="EXPIRED">Expired</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                    <div className="form-group checkbox-group">
                      <input
                        type="checkbox"
                        id="isRefillable"
                        name="isRefillable"
                        checked={formData.isRefillable}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="isRefillable">Refillable</label>
                      
                      {formData.isRefillable && (
                        <div className="refill-count">
                          <label htmlFor="totalRefills">Total Refills:</label>
                          <input
                            type="number"
                            id="totalRefills"
                            name="totalRefills"
                            min="1"
                            value={formData.totalRefills}
                            onChange={handleInputChange}
                            required={formData.isRefillable}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="notes">Notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                
                <div className="form-section">
                  <h4>Medications</h4>
                  {formData.medications.map((medication, index) => (
                    <div className="medication-item" key={index}>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Medication Name*</label>
                          <input
                            type="text"
                            value={medication.medicationName}
                            onChange={(e) => handleMedicationChange(index, 'medicationName', e.target.value)}
                            required
                            list="medications-list"
                          />
                          <datalist id="medications-list">
                            {medications.map(med => (
                              <option key={med.medicationId} value={med.name} />
                            ))}
                          </datalist>
                        </div>
                        <div className="form-group">
                          <label>Dosage*</label>
                          <input
                            type="text"
                            value={medication.dosage}
                            onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                            required
                            placeholder="e.g., 10mg"
                          />
                        </div>
                      </div>
                      
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Frequency*</label>
                          <input
                            type="text"
                            value={medication.frequency}
                            onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                            required
                            placeholder="e.g., 3 times daily"
                          />
                        </div>
                        <div className="form-group">
                          <label>Quantity</label>
                          <input
                            type="number"
                            min="1"
                            value={medication.quantity}
                            onChange={(e) => handleMedicationChange(index, 'quantity', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Duration</label>
                          <input
                            type="text"
                            value={medication.duration}
                            onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                            placeholder="e.g., 7 days"
                          />
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label>Instructions</label>
                        <textarea
                          value={medication.instructions}
                          onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                          rows="2"
                          placeholder="Special instructions for taking this medication"
                        ></textarea>
                      </div>
                      
                      {formData.medications.length > 1 && (
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => removeMedicationField(index)}
                        >
                          <i className="fas fa-minus-circle"></i> Remove Medication
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button 
                    type="button" 
                    className="add-btn"
                    onClick={addMedicationField}
                  >
                    <i className="fas fa-plus-circle"></i> Add Medication
                  </button>
                </div>
                
                <div className="form-actions">
                  <button type="button" onClick={() => setShowAddModal(false)} className="cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    Create Prescription
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Prescription Modal */}
      {showEditModal && selectedPrescription && (
        <div className="modal-overlay">
          <div className="modal-container large-modal">
            <div className="modal-header">
              <h3>Edit Prescription</h3>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdatePrescription}>
                <div className="form-section">
                  <h4>Basic Information</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="patientId">Patient*</label>
                      <select
                        id="patientId"
                        name="patientId"
                        value={formData.patientId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Patient</option>
                        {patients.map(patient => (
                          <option key={patient.patientId} value={patient.patientId}>
                            {patient.firstName} {patient.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="prescriptionDate">Prescription Date*</label>
                      <input
                        type="date"
                        id="prescriptionDate"
                        name="prescriptionDate"
                        value={formData.prescriptionDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="expiryDate">Expiry Date*</label>
                      <input
                        type="date"
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="status">Status*</label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="EXPIRED">Expired</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                    <div className="form-group checkbox-group">
                      <input
                        type="checkbox"
                        id="isRefillable"
                        name="isRefillable"
                        checked={formData.isRefillable}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="isRefillable">Refillable</label>
                      
                      {formData.isRefillable && (
                        <div className="refill-count">
                          <label htmlFor="totalRefills">Total Refills:</label>
                          <input
                            type="number"
                            id="totalRefills"
                            name="totalRefills"
                            min="1"
                            value={formData.totalRefills}
                            onChange={handleInputChange}
                            required={formData.isRefillable}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="notes">Notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                
                <div className="form-section">
                  <h4>Medications</h4>
                  {formData.medications.map((medication, index) => (
                    <div className="medication-item" key={index}>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Medication Name*</label>
                          <input
                            type="text"
                            value={medication.medicationName}
                            onChange={(e) => handleMedicationChange(index, 'medicationName', e.target.value)}
                            required
                            list="medications-list"
                          />
                          <datalist id="medications-list">
                            {medications.map(med => (
                              <option key={med.medicationId} value={med.name} />
                            ))}
                          </datalist>
                        </div>
                        <div className="form-group">
                          <label>Dosage*</label>
                          <input
                            type="text"
                            value={medication.dosage}
                            onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                            required
                            placeholder="e.g., 10mg"
                          />
                        </div>
                      </div>
                      
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Frequency*</label>
                          <input
                            type="text"
                            value={medication.frequency}
                            onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                            required
                            placeholder="e.g., 3 times daily"
                          />
                        </div>
                        <div className="form-group">
                          <label>Quantity</label>
                          <input
                            type="number"
                            min="1"
                            value={medication.quantity}
                            onChange={(e) => handleMedicationChange(index, 'quantity', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="form-grid">
                        <div className="form-group">
                          <label>Duration</label>
                          <input
                            type="text"
                            value={medication.duration}
                            onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                            placeholder="e.g., 7 days"
                          />
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label>Instructions</label>
                        <textarea
                          value={medication.instructions}
                          onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                          rows="2"
                          placeholder="Special instructions for taking this medication"
                        ></textarea>
                      </div>
                      
                      {formData.medications.length > 1 && (
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => removeMedicationField(index)}
                        >
                          <i className="fas fa-minus-circle"></i> Remove Medication
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button 
                    type="button" 
                    className="add-btn"
                    onClick={addMedicationField}
                  >
                    <i className="fas fa-plus-circle"></i> Add Medication
                  </button>
                </div>
                
                <div className="form-actions">
                  <button type="button" onClick={() => setShowEditModal(false)} className="cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    Update Prescription
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
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
            <div className="modal-body">
              <div className="detail-section" style={modalStyles.detailSection}>
                <h4 style={modalStyles.sectionTitle}>General Information</h4>
                <div className="detail-row" style={modalStyles.detailRow}>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={modalStyles.label}>Prescription ID:</label>
                    <p style={modalStyles.value}>{selectedPrescription.prescriptionId}</p>
                  </div>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={modalStyles.label}>Patient:</label>
                    <p style={modalStyles.value}>{getPatientName(selectedPrescription.patientId)}</p>
                  </div>
                </div>
                
                <div className="detail-row" style={modalStyles.detailRow}>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={modalStyles.label}>Prescription Date:</label>
                    <p style={modalStyles.value}>{formatDate(selectedPrescription.prescriptionDate)}</p>
                  </div>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={modalStyles.label}>Expiry Date:</label>
                    <p style={modalStyles.value}>{formatDate(selectedPrescription.expiryDate)}</p>
                  </div>
                </div>
                
                <div className="detail-row" style={modalStyles.detailRow}>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={modalStyles.label}>Status:</label>
                    <span className={`status-badge ${getStatusClass(selectedPrescription.status)}`} style={modalStyles.value}>
                      {selectedPrescription.status}
                    </span>
                  </div>
                  <div className="detail-group" style={modalStyles.detailGroup}>
                    <label style={modalStyles.label}>Refillable:</label>
                    <p style={modalStyles.value}>{selectedPrescription.isRefillable ? 'Yes' : 'No'}</p>
                  </div>
                </div>
                
                <div className="detail-row" style={modalStyles.detailRow}>
                  <div className="detail-group wide" style={modalStyles.detailGroupWide}>
                    <label style={modalStyles.label}>Notes:</label>
                    <p style={modalStyles.value}>{selectedPrescription.notes || 'None'}</p>
                  </div>
                </div>
              </div>
              
              <div className="detail-section" style={modalStyles.detailSection}>
                <h4 style={modalStyles.sectionTitle}>Medications</h4>
                {selectedPrescription.medications && selectedPrescription.medications.map((med, index) => (
                  <div key={index} className="medication-item" style={modalStyles.medicationItem}>
                    <h5 style={modalStyles.medicationTitle}>{med.medicationName} {med.dosage}</h5>
                    <div className="detail-row" style={modalStyles.detailRow}>
                      <div className="detail-group" style={modalStyles.detailGroup}>
                        <label style={modalStyles.label}>Frequency:</label>
                        <p style={modalStyles.value}>{med.frequency}</p>
                      </div>
                      <div className="detail-group" style={modalStyles.detailGroup}>
                        <label style={modalStyles.label}>Quantity:</label>
                        <p style={modalStyles.value}>{med.quantity}</p>
                      </div>
                    </div>
                    <div className="detail-row" style={modalStyles.detailRow}>
                      <div className="detail-group" style={modalStyles.detailGroup}>
                        <label style={modalStyles.label}>Duration:</label>
                        <p style={modalStyles.value}>{med.duration}</p>
                      </div>
                    </div>
                    <div className="detail-row" style={modalStyles.detailRow}>
                      <div className="detail-group wide" style={modalStyles.detailGroupWide}>
                        <label style={modalStyles.label}>Instructions:</label>
                        <p style={modalStyles.value}>{med.instructions || 'None provided'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="modal-actions" style={modalStyles.modalActions}>
                <button 
                  onClick={() => {
                    setShowViewModal(false);
                    openEditModal(selectedPrescription);
                  }} 
                  className="primary-btn"
                  style={{...modalStyles.button, ...modalStyles.primaryButton}}
                >
                  Edit Prescription
                </button>
                {selectedPrescription.status === 'ACTIVE' && 
                 selectedPrescription.isRefillable && 
                 selectedPrescription.refillsRemaining > 0 && (
                  <button 
                    onClick={() => {
                      handleProcessRefill(selectedPrescription.prescriptionId);
                      setShowViewModal(false);
                    }} 
                    className="refill-btn"
                    style={{...modalStyles.button, ...modalStyles.primaryButton, backgroundColor: '#28a745'}}
                  >
                    Process Refill
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
    </div>
  );
};

const MedicationManagement = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/medications');
      setMedications(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching medications:', err);
      setError('Failed to load medications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getFilteredMedications = () => {
    return medications.filter(med => {
      const searchLower = searchTerm.toLowerCase();
      return (
        med.name?.toLowerCase().includes(searchLower) ||
        (med.genericName && med.genericName.toLowerCase().includes(searchLower)) ||
        (med.brand && med.brand.toLowerCase().includes(searchLower))
      );
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading medications...</p>
      </div>
    );
  }

  return (
    <div className="management-section">
      <div className="management-header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search medications..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Generic Name</th>
              <th>Brand</th>
              <th>Type</th>
              <th>Dosage Form</th>
              <th>Requires Prescription</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredMedications().length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">No medications found</td>
              </tr>
            ) : (
              getFilteredMedications().map(medication => (
                <tr key={medication.medicationId}>
                  <td>{medication.name}</td>
                  <td>{medication.genericName || 'N/A'}</td>
                  <td>{medication.brand || 'N/A'}</td>
                  <td>{medication.type || 'N/A'}</td>
                  <td>{medication.dosageForm || 'N/A'}</td>
                  <td>{medication.requiresPrescription ? 'Yes' : 'No'}</td>
                  <td className={medication.isLowStock ? 'low-stock' : ''}>
                    {medication.stockQuantity || 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorPage;