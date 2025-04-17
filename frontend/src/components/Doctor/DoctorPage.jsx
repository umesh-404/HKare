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
      case "consultations":
        return <Consultations />;
      case "appointments":
        return <Appointments />;
      case "patients":
        return <Patients />;
      case "prescriptions":
        return <Prescriptions />;
      case "medications":
        return <Medications />;
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
          "Consultations",
          "Appointments",
          "Patients",
          "Prescriptions",
          "Medications",
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
  );
};

const getIconForSection = (section) => {
  const icons = {
    consultations: "fa-stethoscope",
    appointments: "fa-calendar-plus",
    patients: "fa-users",
    prescriptions: "fa-prescription",
    medications: "fa-pills",
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

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [patients, setPatients] = useState([]);
  const [medications, setMedications] = useState([]);
  const [userData, setUserData] = useState(null);
  const [prescriptionForm, setPrescriptionForm] = useState({
    patientId: "",
    prescriptionDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    notes: "",
    isRefillable: false,
    totalRefills: 0,
    medications: [{ medicationName: "", dosage: "", frequency: "", instructions: "", quantity: 1, duration: "" }]
  });

  useEffect(() => {
    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserData(user);
      fetchPrescriptions(user.roleId);
    }
    fetchPatients();
    fetchMedications();
  }, []);

  const fetchPrescriptions = async (doctorId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/prescriptions/doctor/${doctorId}`);
      setPrescriptions(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load prescriptions");
      console.error("Error fetching prescriptions:", err);
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/patients");
      setPatients(response.data);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  const fetchMedications = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/medications");
      setMedications(response.data);
    } catch (err) {
      console.error("Error fetching medications:", err);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPrescriptionForm({
      ...prescriptionForm,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...prescriptionForm.medications];
    updatedMedications[index][field] = value;
    setPrescriptionForm({
      ...prescriptionForm,
      medications: updatedMedications
    });
  };

  const addMedicationRow = () => {
    setPrescriptionForm({
      ...prescriptionForm,
      medications: [
        ...prescriptionForm.medications,
        { medicationName: "", dosage: "", frequency: "", instructions: "", quantity: 1, duration: "" }
      ]
    });
  };

  const removeMedicationRow = (index) => {
    const updatedMedications = [...prescriptionForm.medications];
    updatedMedications.splice(index, 1);
    setPrescriptionForm({
      ...prescriptionForm,
      medications: updatedMedications
    });
  };

  const handleCreatePrescription = async (e) => {
    e.preventDefault();
    try {
      const prescriptionData = {
        ...prescriptionForm,
        doctorId: userData.roleId
      };
      
      await axios.post("http://localhost:8080/api/prescriptions", prescriptionData);
      setShowCreateModal(false);
      fetchPrescriptions(userData.roleId);
      
      // Reset form
      setPrescriptionForm({
        patientId: "",
        prescriptionDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        notes: "",
        isRefillable: false,
        totalRefills: 0,
        medications: [{ medicationName: "", dosage: "", frequency: "", instructions: "", quantity: 1, duration: "" }]
      });
    } catch (err) {
      setError("Failed to create prescription");
      console.error("Error creating prescription:", err);
    }
  };

  const handleProcessRefill = async (prescriptionId) => {
    try {
      await axios.post(`http://localhost:8080/api/prescriptions/${prescriptionId}/refill`);
      fetchPrescriptions(userData.roleId);
    } catch (err) {
      setError("Failed to process refill");
      console.error("Error processing refill:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const filteredPrescriptions = prescriptions.filter(
    (prescription) =>
      prescription.patientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="prescriptions-container">
      {error && <div className="error-message">{error}</div>}

      <div className="prescriptions-header">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by patient name..."
            value={search}
            onChange={handleSearchChange}
          />
          <i className="fas fa-search"></i>
        </div>
        <button className="add-button" onClick={() => setShowCreateModal(true)}>
          <i className="fas fa-plus"></i> New Prescription
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading prescriptions...</div>
      ) : (
        <div className="prescriptions-list">
          {filteredPrescriptions.length > 0 ? (
            <table>
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
                {filteredPrescriptions.map((prescription) => (
                  <tr key={prescription.prescriptionId}>
                    <td>{prescription.prescriptionId}</td>
                    <td>{prescription.patientName}</td>
                    <td>{formatDate(prescription.prescriptionDate)}</td>
                    <td>{formatDate(prescription.expiryDate)}</td>
                    <td>
                      <span className={`status ${prescription.status.toLowerCase()}`}>
                        {prescription.status}
                      </span>
                    </td>
                    <td>
                      {prescription.isRefillable
                        ? `Yes (${prescription.refillsRemaining}/${prescription.totalRefills})`
                        : "No"}
                    </td>
                    <td>
                      {prescription.status === "ACTIVE" &&
                        prescription.isRefillable &&
                        prescription.refillsRemaining > 0 && (
                          <button
                            onClick={() => handleProcessRefill(prescription.prescriptionId)}
                            className="refill-btn"
                            title="Process Refill"
                          >
                            <i className="fas fa-sync"></i> Refill
                          </button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data">No prescriptions found</div>
          )}
        </div>
      )}

      {/* Create Prescription Modal */}
      {showCreateModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Create New Prescription</h3>
            <span className="close" onClick={() => setShowCreateModal(false)}>
              &times;
            </span>
            <form onSubmit={handleCreatePrescription}>
              <div className="form-group">
                <label>Patient*</label>
                <select
                  name="patientId"
                  value={prescriptionForm.patientId}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map((patient) => (
                    <option key={patient.patientId} value={patient.patientId}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Prescription Date*</label>
                  <input
                    type="date"
                    name="prescriptionDate"
                    value={prescriptionForm.prescriptionDate}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Expiry Date*</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={prescriptionForm.expiryDate}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="isRefillable"
                    name="isRefillable"
                    checked={prescriptionForm.isRefillable}
                    onChange={handleFormChange}
                  />
                  <label htmlFor="isRefillable">Refillable</label>
                </div>
                {prescriptionForm.isRefillable && (
                  <div className="form-group">
                    <label>Total Refills</label>
                    <input
                      type="number"
                      name="totalRefills"
                      min="1"
                      value={prescriptionForm.totalRefills}
                      onChange={handleFormChange}
                      required={prescriptionForm.isRefillable}
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={prescriptionForm.notes}
                  onChange={handleFormChange}
                  rows="2"
                />
              </div>

              <h4>Medications</h4>
              {prescriptionForm.medications.map((med, index) => (
                <div key={index} className="medication-item">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Medication Name*</label>
                      <input
                        type="text"
                        value={med.medicationName}
                        onChange={(e) =>
                          handleMedicationChange(index, "medicationName", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Dosage*</label>
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={(e) =>
                          handleMedicationChange(index, "dosage", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Frequency*</label>
                      <input
                        type="text"
                        value={med.frequency}
                        onChange={(e) =>
                          handleMedicationChange(index, "frequency", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={med.quantity}
                        onChange={(e) =>
                          handleMedicationChange(index, "quantity", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Instructions</label>
                    <textarea
                      value={med.instructions}
                      onChange={(e) =>
                        handleMedicationChange(index, "instructions", e.target.value)
                      }
                      rows="2"
                    />
                  </div>
                  {prescriptionForm.medications.length > 1 && (
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeMedicationRow(index)}
                    >
                      <i className="fas fa-minus-circle"></i> Remove
                    </button>
                  )}
                  {index === prescriptionForm.medications.length - 1 && (
                    <button type="button" className="add-btn" onClick={addMedicationRow}>
                      <i className="fas fa-plus-circle"></i> Add Another Medication
                    </button>
                  )}
                </div>
              ))}

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Medications = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/medications");
      setMedications(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load medications");
      console.error("Error fetching medications:", err);
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredMedications = medications.filter(
    (medication) =>
      medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (medication.genericName && medication.genericName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="medications-container">
      {error && <div className="error-message">{error}</div>}

      <div className="medications-header">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search medications..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <i className="fas fa-search"></i>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading medications...</div>
      ) : (
        <div className="medications-list">
          {filteredMedications.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Generic Name</th>
                  <th>Type</th>
                  <th>Dosage Form</th>
                  <th>Requires Prescription</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedications.map((medication) => (
                  <tr key={medication.medicationId}>
                    <td>{medication.name}</td>
                    <td>{medication.genericName || "N/A"}</td>
                    <td>{medication.type || "N/A"}</td>
                    <td>{medication.dosageForm || "N/A"}</td>
                    <td>{medication.requiresPrescription ? "Yes" : "No"}</td>
                    <td>
                      <span className={medication.isLowStock ? "low-stock" : ""}>
                        {medication.stockQuantity || 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data">No medications found</div>
          )}
        </div>
      )}
    </div>
  );
};

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