import React, { useState, useEffect } from 'react';
import './AdminPage.css';
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
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

const AdminPage = () => {
    const [activeSection, setActiveSection] = useState("dashboard");
    const navigate = useNavigate();
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Apply specific body class for this page
        document.body.classList.add('admin-page-body');
        
        // Cleanup function to remove the class when component unmounts
        return () => {
            document.body.classList.remove('admin-page-body');
        };
    }, []);

    useEffect(() => {
        // Get user data from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            // Redirect to login if no user data found
            navigate('/staff-login');
            return;
        }
        setUserData(user);
    }, [navigate]);

    const handleLogout = () => {
        setShowLogoutPopup(true);
        setTimeout(() => {
            localStorage.removeItem('user'); // Clear user data
            setShowLogoutPopup(false);
            navigate('/staff-login');
        }, 1500);
    };

    const renderContent = () => {
        switch (activeSection) {
            case "dashboard":
                return <Dashboard />;
            case "staff":
                return <StaffManagement />;
            case "patients":
                return <PatientManagement />;
            case "doctors":
                return <DoctorManagement />;
            case "appointments":
                return <AppointmentManagement />;
            case "payments":
                return <PaymentManagement />;
            case "departments":
                return <DepartmentManagement />;
            case "medical-records":
                return <MedicalRecordManagement />;
            case "prescriptions":
                return <PrescriptionManagement />;
            case "medications":
                return <MedicationManagement />;
            case "notifications":
                return <NotificationManagement />;
            case "login-history":
                return <LoginHistoryManagement />;
            case "audit-logs":
                return <AuditLogManagement />;
            case "profile":
                return <Profile userData={userData} />;
            case "settings":
                return <Settings />;
            default:
                return <div>Select a section from the sidebar</div>;
        }
    };

    // Get nav items for admin dashboard
    const getNavItems = () => {
        return [
            { name: "Dashboard", icon: "fa-tachometer-alt" },
            { name: "Staff", icon: "fa-users-cog" },
            { name: "Doctors", icon: "fa-user-md" },
            { name: "Patients", icon: "fa-hospital-user" },
            { name: "Appointments", icon: "fa-calendar-check" },
            { name: "Payments", icon: "fa-credit-card" },
            { name: "Departments", icon: "fa-hospital" },
            { name: "Medical Records", icon: "fa-file-medical" },
            { name: "Prescriptions", icon: "fa-prescription" },
            { name: "Medications", icon: "fa-pills" },
            { name: "Notifications", icon: "fa-bell" },
            { name: "Login History", icon: "fa-history" },
            { name: "Audit Logs", icon: "fa-clipboard-list" },
            { name: "Profile", icon: "fa-user-circle" },
            { name: "Settings", icon: "fa-cog" }
        ];
    };

    return (
        <div className="admin-page">
            {/* Header */}
            <header className="admin-header">
                <div className="header-left">
                    <img src="/vite.svg" alt="Hospital Logo" className="header-logo" />
                </div>
                <div className="header-right">
                    <div className="user-info" onClick={() => setActiveSection("profile")} style={{ cursor: 'pointer' }}>
                        <i className="fas fa-user-shield user-icon"></i>
                        <span className="user-name">{userData ? `${userData.firstName} ${userData.lastName}` : 'Administrator'}</span>
                    </div>
                    <button 
                        className="logout-button" 
                        onClick={handleLogout}
                    >
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </header>

            {/* Logout Overlay */}
            {showLogoutPopup && (
                <div className="overlay">
                    <div className="loading-text">
                        <div className="spinner"></div>
                        Logging You Out...
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <aside className="sidebar">
                {getNavItems().map(
                    (item) => (
                        <button
                            key={item.name}
                            className={`nav-button ${activeSection === item.name.toLowerCase().replace(' ', '-') ? "active" : ""}`}
                            onClick={() => setActiveSection(item.name.toLowerCase().replace(' ', '-'))}
                        >
                            <i className={`fas ${item.icon}`}></i>
                            {item.name}
                        </button>
                    )
                )}
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
        'staff': 'fa-users-cog',
        'doctors': 'fa-user-md',
        'patients': 'fa-hospital-user',
        'appointments': 'fa-calendar-check',
        'payments': 'fa-credit-card',
        'departments': 'fa-hospital',
        'medical-records': 'fa-file-medical',
        'prescriptions': 'fa-prescription',
        'medications': 'fa-pills',
        'notifications': 'fa-bell',
        'login-history': 'fa-history',
        'audit-logs': 'fa-clipboard-list',
        'profile': 'fa-user-circle',
        'settings': 'fa-cog'
    };
    return icons[section] || 'fa-circle';
};

// Dashboard Section with Analytics and Graphs
const Dashboard = () => {
    // Sample data for patient visits graph
    const patientVisitsData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Patient Visits',
                data: [65, 59, 80, 81, 56, 55],
                fill: false,
                borderColor: '#0066ff',
                tension: 0.4,
                pointBackgroundColor: '#0066ff'
            }
        ]
    };
    
    // Sample data for revenue graph
    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Revenue',
                data: [12500, 15000, 13800, 16200, 14500, 17500],
                backgroundColor: '#4CAF50',
                borderColor: '#388E3C',
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
    
    const barOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: function(context) {
                        return `$${context.raw.toLocaleString()}`;
                    }
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#e0e0e0'
                },
                ticks: {
                    callback: function(value) {
                        return '$' + value.toLocaleString();
                    }
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    return (
        <div className="dashboard-section">
            {/* Analytics Cards */}
            <div className="analytics-overview">
                <h3>Hospital Overview</h3>
                <div className="analytics-cards">
                    <div className="analytics-card">
                        <div className="card-icon">
                            <i className="fas fa-hospital-user"></i>
                        </div>
                        <div className="card-content">
                            <h4>Active Patients</h4>
                            <p>287</p>
                            <span className="trend up">
                                <i className="fas fa-arrow-up"></i> 12% from last month
                            </span>
                        </div>
                    </div>
                    
                    <div className="analytics-card">
                        <div className="card-icon">
                            <i className="fas fa-user-md"></i>
                        </div>
                        <div className="card-content">
                            <h4>Active Doctors</h4>
                            <p>43</p>
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
                            <p>32</p>
                            <span className="trend down">
                                <i className="fas fa-arrow-down"></i> 3% from yesterday
                            </span>
                        </div>
                    </div>
                    
                    <div className="analytics-card">
                        <div className="card-icon">
                            <i className="fas fa-money-bill-wave"></i>
                        </div>
                        <div className="card-content">
                            <h4>Monthly Revenue</h4>
                            <p>$85,720</p>
                            <span className="trend up">
                                <i className="fas fa-arrow-up"></i> 8% from last month
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Charts */}
            <div className="dashboard-charts">
                <div className="chart-container">
                    <h3>Patient Visits</h3>
                    <div className="chart-wrapper">
                        <Line data={patientVisitsData} options={lineOptions} />
                    </div>
                </div>
                
                <div className="chart-container">
                    <h3>Monthly Revenue</h3>
                    <div className="chart-wrapper">
                        <Bar data={revenueData} options={barOptions} />
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
                        <div className="activity-details">
                            <h4>New Doctor Added</h4>
                            <p>Dr. Rajesh Kumar joined Cardiology department</p>
                            <span className="activity-time">Today, 10:30 AM</span>
                        </div>
                    </div>
                    
                    <div className="activity-item">
                        <div className="activity-icon">
                            <i className="fas fa-credit-card"></i>
                        </div>
                        <div className="activity-details">
                            <h4>Payment Received</h4>
                            <p>Payment of $450 received from patient Anjali Patel</p>
                            <span className="activity-time">Today, 9:15 AM</span>
                        </div>
                    </div>
                    
                    <div className="activity-item">
                        <div className="activity-icon">
                            <i className="fas fa-calendar-plus"></i>
                        </div>
                        <div className="activity-details">
                            <h4>New Appointment</h4>
                            <p>Appointment scheduled for patient Priya Sharma with Dr. Neha Gupta</p>
                            <span className="activity-time">Yesterday, 4:45 PM</span>
                        </div>
                    </div>
                    
                    <div className="activity-item">
                        <div className="activity-icon">
                            <i className="fas fa-hospital"></i>
                        </div>
                        <div className="activity-details">
                            <h4>Department Updated</h4>
                            <p>Pediatrics department information updated</p>
                            <span className="activity-time">Yesterday, 2:30 PM</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Staff Management Section
const StaffManagement = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        dateOfBirth: '',
        gender: '',
        departmentId: '',
        position: '',
        hireDate: new Date().toISOString().split('T')[0],
        isAdmin: false
    });

    useEffect(() => {
        fetchStaff();
        fetchDepartments();
    }, []);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/staff/profiles');
            
            if (response.status === 200) {
                setStaff(response.data);
                setError('');
            } else {
                console.error('Failed to fetch staff data');
                setError('Failed to load staff data. Please try again later.');
            }
        } catch (err) {
            console.error('Error fetching staff:', err);
            setError('Network error while fetching staff data.');
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/departments');
            
            if (response.status === 200) {
                setDepartments(response.data);
            } else {
                console.error('Failed to fetch departments');
            }
        } catch (err) {
            console.error('Error fetching departments:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleOpenAddModal = () => {
        setFormData({
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            dateOfBirth: '',
            gender: '',
            departmentId: '',
            position: '',
            hireDate: new Date().toISOString().split('T')[0],
            isAdmin: false
        });
        setShowAddModal(true);
    };

    const handleViewStaff = (staffMember) => {
        setSelectedStaff(staffMember);
        setShowViewModal(true);
    };

    const handleAddStaff = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:8080/api/staff/create', formData);
            
            if (response.status === 201 || response.status === 200) {
                // Refresh the staff list
                fetchStaff();
                setShowAddModal(false);
                
                // Success notification
                alert(`Staff member added successfully! Staff ID: ${response.data.roleId}`);
            } else {
                console.error('Failed to add staff member');
                alert('Failed to add staff member. Please try again.');
            }
        } catch (err) {
            console.error('Error adding staff:', err);
            alert(err.response?.data?.message || 'Failed to add staff member. Please try again.');
        }
    };

    const handleDeleteStaff = async (staffId) => {
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            try {
                const response = await axios.delete(`http://localhost:8080/api/staff/${staffId}`);
                
                if (response.status === 200 || response.status === 204) {
                    // Refresh the staff list
                    fetchStaff();
                    
                    // Success notification
                    alert('Staff member deleted successfully!');
                } else {
                    console.error('Failed to delete staff member');
                    alert('Failed to delete staff member. Please try again.');
                }
            } catch (err) {
                console.error('Error deleting staff:', err);
                alert(err.response?.data?.message || 'Failed to delete staff member. Please try again.');
            }
        }
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading staff data...</p>
            </div>
        );
    }

    return (
        <div className="management-container">
            <div className="management-header">
                <h2>Staff Management</h2>
                <button className="add-btn" onClick={handleOpenAddModal}>
                    <i className="fas fa-plus"></i> Add New Staff
                </button>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="management-content">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Staff ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Position</th>
                            <th>Department</th>
                            <th>Admin</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.length > 0 ? (
                            staff.map(staffMember => (
                                <tr key={staffMember.staffId}>
                                    <td>{staffMember.staffId}</td>
                                    <td>{`${staffMember.firstName} ${staffMember.lastName}`}</td>
                                    <td>{staffMember.email}</td>
                                    <td>{staffMember.position}</td>
                                    <td>{staffMember.departmentName || 'N/A'}</td>
                                    <td>
                                        <span className={`status-badge ${staffMember.admin ? 'active' : 'inactive'}`}>
                                            {staffMember.admin ? 'Admin' : 'Staff'}
                                        </span>
                                    </td>
                                    <td className="actions-cell">
                                        <button 
                                            className="action-btn view-btn" 
                                            title="View Details"
                                            onClick={() => handleViewStaff(staffMember)}
                                        >
                                            <i className="fas fa-eye"></i>
                                        </button>
                                        <button className="action-btn edit-btn" title="Edit">
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button 
                                            className="action-btn delete-btn" 
                                            title="Delete"
                                            onClick={() => handleDeleteStaff(staffMember.staffId)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="no-data">No staff members found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Add Staff Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Add New Staff Member</h3>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleAddStaff}>
                                <div className="form-section">
                                    <h4>Account Information</h4>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="email">Email*</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">Password*</label>
                                            <input
                                                type="password"
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    name="isAdmin"
                                                    checked={formData.isAdmin}
                                                    onChange={handleInputChange}
                                                />
                                                Is Admin
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="form-section">
                                    <h4>Personal Information</h4>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="firstName">First Name*</label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="lastName">Last Name*</label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="phoneNumber">Phone</label>
                                            <input
                                                type="tel"
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="address">Address</label>
                                            <input
                                                type="text"
                                                id="address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="dateOfBirth">Date of Birth</label>
                                            <input
                                                type="date"
                                                id="dateOfBirth"
                                                name="dateOfBirth"
                                                value={formData.dateOfBirth}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="gender">Gender</label>
                                            <select
                                                id="gender"
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="MALE">Male</option>
                                                <option value="FEMALE">Female</option>
                                                <option value="OTHER">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="form-section">
                                    <h4>Professional Information</h4>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="departmentId">Department*</label>
                                            <select
                                                id="departmentId"
                                                name="departmentId"
                                                value={formData.departmentId}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select Department</option>
                                                {departments.map(dept => (
                                                    <option key={dept.departmentId} value={dept.departmentId}>
                                                        {dept.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="position">Position*</label>
                                            <input
                                                type="text"
                                                id="position"
                                                name="position"
                                                value={formData.position}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="hireDate">Hire Date*</label>
                                            <input
                                                type="date"
                                                id="hireDate"
                                                name="hireDate"
                                                value={formData.hireDate}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="form-actions">
                                    <button 
                                        type="button" 
                                        className="cancel-btn"
                                        onClick={() => setShowAddModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="submit-btn">Add Staff</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            
            {/* View Staff Modal */}
            {showViewModal && selectedStaff && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Staff Details</h3>
                            <button className="close-btn" onClick={() => setShowViewModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="staff-profile">
                                <div className="profile-header">
                                    <div className="profile-avatar">
                                        <i className="fas fa-user-circle"></i>
                                    </div>
                                    <div className="profile-title">
                                        <h3>{`${selectedStaff.firstName} ${selectedStaff.lastName}`}</h3>
                                        <p>{selectedStaff.position}</p>
                                        <span className={`role-badge ${selectedStaff.admin ? 'admin' : 'staff'}`}>
                                            {selectedStaff.admin ? 'Admin' : 'Staff'}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="staff-details">
                                    <div className="details-section">
                                        <h4>Basic Information</h4>
                                        <div className="details-grid">
                                            <div className="detail-item">
                                                <span className="detail-label">Staff ID:</span>
                                                <span className="detail-value">{selectedStaff.staffId}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Email:</span>
                                                <span className="detail-value">{selectedStaff.email}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Phone:</span>
                                                <span className="detail-value">{selectedStaff.phoneNumber || 'N/A'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Address:</span>
                                                <span className="detail-value">{selectedStaff.address || 'N/A'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Date of Birth:</span>
                                                <span className="detail-value">{selectedStaff.dateOfBirth ? formatDate(selectedStaff.dateOfBirth) : 'N/A'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Gender:</span>
                                                <span className="detail-value">{selectedStaff.gender || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="details-section">
                                        <h4>Professional Information</h4>
                                        <div className="details-grid">
                                            <div className="detail-item">
                                                <span className="detail-label">Department:</span>
                                                <span className="detail-value">{selectedStaff.departmentName || 'N/A'}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Position:</span>
                                                <span className="detail-value">{selectedStaff.position}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Hire Date:</span>
                                                <span className="detail-value">{selectedStaff.hireDate ? formatDate(selectedStaff.hireDate) : 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="modal-actions">
                                    <button 
                                        type="button" 
                                        className="cancel-btn"
                                        onClick={() => setShowViewModal(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Replace the DoctorManagement placeholder with this implementation
const DoctorManagement = () => {
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        gender: '',
        departmentId: '',
        specialization: '',
        licenseNumber: '',
        qualification: '',
        experience: ''
    });

    useEffect(() => {
        fetchDoctors();
        fetchDepartments();
    }, []);

    const fetchDoctors = async () => {
        setIsLoading(true);
        try {
            console.log("Fetching doctors from:", 'http://localhost:8080/api/doctors');
            // First try with /api prefix
            try {
                const response = await axios.get('http://localhost:8080/api/doctors');
                console.log("Doctors response:", response.data);
                setDoctors(response.data);
            } catch (apiError) {
                console.log("Trying alternate URL without /api prefix");
                // If that fails, try without /api prefix
                const response = await axios.get('http://localhost:8080/doctors');
                console.log("Doctors response (alternate URL):", response.data);
                setDoctors(response.data);
            }
        } catch (err) {
            console.error('Error fetching doctors:', err);
            const errorMessage = err.response ? 
                `Failed to load doctors. Status: ${err.response.status}, Message: ${err.response.statusText}` : 
                'Failed to load doctors. Server might be unreachable. Please try again later.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            // First try with /api prefix
            try {
                const response = await axios.get('http://localhost:8080/api/departments');
                setDepartments(response.data);
            } catch (apiError) {
                // If that fails, try without /api prefix
                const response = await axios.get('http://localhost:8080/departments');
                setDepartments(response.data);
            }
        } catch (err) {
            console.error('Error fetching departments:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const openAddModal = () => {
        setFormData({
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            departmentId: '',
            specialization: '',
            licenseNumber: '',
            qualification: '',
            experience: ''
        });
        setShowAddModal(true);
    };

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        try {
            // Convert date string to ISO format for backend
            const dateOfBirth = formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null;
            
            const doctorData = {
                ...formData,
                dateOfBirth,
                departmentId: formData.departmentId ? Number(formData.departmentId) : null
            };
            
            console.log("Creating doctor with data:", doctorData);
            try {
                const response = await axios.post('http://localhost:8080/api/doctors', doctorData);
                console.log("Doctor creation response:", response.data);
                setShowAddModal(false);
                fetchDoctors(); // Refresh the list
            } catch (apiError) {
                console.log("Trying alternate URL without /api prefix");
                const response = await axios.post('http://localhost:8080/doctors', doctorData);
                console.log("Doctor creation response (alternate URL):", response.data);
                setShowAddModal(false);
                fetchDoctors(); // Refresh the list
            }
        } catch (err) {
            console.error('Error adding doctor:', err);
            setError(err.response?.data?.message || 'Failed to add doctor. Please try again.');
        }
    };

    const handleDeleteDoctor = async (doctorId) => {
        if (window.confirm('Are you sure you want to delete this doctor?')) {
            try {
                console.log(`Deleting doctor: ${doctorId}`);
                try {
                    await axios.delete(`http://localhost:8080/api/doctors/${doctorId}`);
                    console.log(`Doctor ${doctorId} deleted successfully`);
                    fetchDoctors(); // Refresh the list
                } catch (apiError) {
                    console.log("Trying alternate URL without /api prefix");
                    await axios.delete(`http://localhost:8080/doctors/${doctorId}`);
                    console.log(`Doctor ${doctorId} deleted successfully (alternate URL)`);
                    fetchDoctors(); // Refresh the list
                }
            } catch (err) {
                console.error('Error deleting doctor:', err);
                setError(err.response?.data?.message || 'Failed to delete doctor. Please try again.');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading doctors...</p>
            </div>
        );
    }

    return (
        <div className="doctor-management">
            {error && <div className="error-message">{error}</div>}
            
            <div className="management-header">
                <button className="add-btn" onClick={openAddModal}>
                    <i className="fas fa-plus"></i> Add Doctor
                </button>
            </div>
            
            <div className="management-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Specialization</th>
                            <th>Department</th>
                            <th>License #</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.map(doctor => (
                            <tr key={doctor.doctorId}>
                                <td>{doctor.doctorId}</td>
                                <td>Dr. {doctor.firstName} {doctor.lastName}</td>
                                <td>{doctor.email}</td>
                                <td>{doctor.specialization || 'N/A'}</td>
                                <td>{doctor.department ? doctor.department.name : 'N/A'}</td>
                                <td>{doctor.licenseNumber || 'N/A'}</td>
                                <td className="actions-cell">
                                    <button className="action-btn view">
                                        <i className="fas fa-eye"></i>
                                    </button>
                                    <button className="action-btn edit">
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className="action-btn delete" onClick={() => handleDeleteDoctor(doctor.doctorId)}>
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {doctors.length === 0 && (
                            <tr>
                                <td colSpan="7" className="no-data">No doctors found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Add Doctor Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Add New Doctor</h3>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleAddDoctor}>
                            <div className="form-section">
                                <h4>Account Information</h4>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            value={formData.email} 
                                            onChange={handleInputChange} 
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input 
                                            type="password" 
                                            name="password" 
                                            value={formData.password} 
                                            onChange={handleInputChange} 
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-section">
                                <h4>Personal Information</h4>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input 
                                            type="text" 
                                            name="firstName" 
                                            value={formData.firstName} 
                                            onChange={handleInputChange} 
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input 
                                            type="text" 
                                            name="lastName" 
                                            value={formData.lastName} 
                                            onChange={handleInputChange} 
                                            required 
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input 
                                            type="tel" 
                                            name="phoneNumber" 
                                            value={formData.phoneNumber} 
                                            onChange={handleInputChange} 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Date of Birth</label>
                                        <input 
                                            type="date" 
                                            name="dateOfBirth" 
                                            value={formData.dateOfBirth} 
                                            onChange={handleInputChange} 
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Gender</label>
                                        <select 
                                            name="gender" 
                                            value={formData.gender} 
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>
                                    <div className="form-group wide">
                                        <label>Address</label>
                                        <textarea 
                                            name="address" 
                                            value={formData.address} 
                                            onChange={handleInputChange} 
                                            rows="2"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-section">
                                <h4>Professional Information</h4>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Department</label>
                                        <select 
                                            name="departmentId" 
                                            value={formData.departmentId} 
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map(dept => (
                                                <option key={dept.departmentId} value={dept.departmentId}>
                                                    {dept.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Specialization</label>
                                        <input 
                                            type="text" 
                                            name="specialization" 
                                            value={formData.specialization} 
                                            onChange={handleInputChange} 
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>License Number</label>
                                        <input 
                                            type="text" 
                                            name="licenseNumber" 
                                            value={formData.licenseNumber} 
                                            onChange={handleInputChange} 
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Qualification</label>
                                        <input 
                                            type="text" 
                                            name="qualification" 
                                            value={formData.qualification} 
                                            onChange={handleInputChange} 
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Years of Experience</label>
                                        <input 
                                            type="number" 
                                            name="experience" 
                                            value={formData.experience} 
                                            onChange={handleInputChange} 
                                            min="0"
                                        />
                                    </div>
                                    <div className="form-group">
                                        {/* Empty space for alignment */}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="save-btn">
                                    <i className="fas fa-save"></i> Add Doctor
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Replace the PatientManagement placeholder with this implementation
const PatientManagement = () => {
    const [patients, setPatients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        gender: '',
        dateOfBirth: '',
        bloodGroup: '',
        insuranceInfo: '',
        emergencyContact: '',
        medicalHistory: ''
    });

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        setIsLoading(true);
        try {
            console.log("Fetching patients from:", 'http://localhost:8080/api/patients');
            // First try with /api prefix
            try {
                const response = await axios.get('http://localhost:8080/api/patients');
                console.log("Patients response:", response.data);
                setPatients(response.data);
            } catch (apiError) {
                console.log("Trying alternate URL without /api prefix");
                // If that fails, try without /api prefix
                const response = await axios.get('http://localhost:8080/patients');
                console.log("Patients response (alternate URL):", response.data);
                setPatients(response.data);
            }
        } catch (err) {
            console.error('Error fetching patients:', err);
            const errorMessage = err.response ? 
                `Failed to load patients. Status: ${err.response.status}, Message: ${err.response.statusText}` : 
                'Failed to load patients. Server might be unreachable. Please try again later.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const openAddModal = () => {
        setFormData({
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            dateOfBirth: '',
            bloodGroup: '',
            insuranceInfo: '',
            emergencyContact: '',
            medicalHistory: ''
        });
        setShowAddModal(true);
    };

    const handleAddPatient = async (e) => {
        e.preventDefault();
        try {
            // Convert date string to ISO format for backend
            const dateOfBirth = formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null;
            
            const patientData = {
                ...formData,
                dateOfBirth
            };
            
            console.log("Creating patient with data:", patientData);
            try {
                const response = await axios.post('http://localhost:8080/api/patients', patientData);
                console.log("Patient creation response:", response.data);
                setShowAddModal(false);
                fetchPatients(); // Refresh the list
            } catch (apiError) {
                console.log("Trying alternate URL without /api prefix");
                const response = await axios.post('http://localhost:8080/patients', patientData);
                console.log("Patient creation response (alternate URL):", response.data);
                setShowAddModal(false);
                fetchPatients(); // Refresh the list
            }
        } catch (err) {
            console.error('Error adding patient:', err);
            setError(err.response?.data?.message || 'Failed to add patient. Please try again.');
        }
    };

    const handleDeletePatient = async (patientId) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            try {
                console.log(`Deleting patient: ${patientId}`);
                try {
                    await axios.delete(`http://localhost:8080/api/patients/${patientId}`);
                    console.log(`Patient ${patientId} deleted successfully`);
                    fetchPatients(); // Refresh the list
                } catch (apiError) {
                    console.log("Trying alternate URL without /api prefix");
                    await axios.delete(`http://localhost:8080/patients/${patientId}`);
                    console.log(`Patient ${patientId} deleted successfully (alternate URL)`);
                    fetchPatients(); // Refresh the list
                }
            } catch (err) {
                console.error('Error deleting patient:', err);
                setError(err.response?.data?.message || 'Failed to delete patient. Please try again.');
            }
        }
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
        <div className="patient-management">
            {error && <div className="error-message">{error}</div>}
            
            <div className="management-header">
                <button className="add-btn" onClick={openAddModal}>
                    <i className="fas fa-plus"></i> Add Patient
                </button>
            </div>
            
            <div className="management-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Blood Group</th>
                            <th>Gender</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map(patient => (
                            <tr key={patient.patientId}>
                                <td>{patient.patientId}</td>
                                <td>{patient.firstName} {patient.lastName}</td>
                                <td>{patient.email}</td>
                                <td>{patient.phoneNumber || 'N/A'}</td>
                                <td>{patient.bloodGroup || 'N/A'}</td>
                                <td>{patient.gender || 'N/A'}</td>
                                <td className="actions-cell">
                                    <button className="action-btn view">
                                        <i className="fas fa-eye"></i>
                                    </button>
                                    <button className="action-btn edit">
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className="action-btn delete" onClick={() => handleDeletePatient(patient.patientId)}>
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {patients.length === 0 && (
                            <tr>
                                <td colSpan="7" className="no-data">No patients found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Add Patient Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Add New Patient</h3>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleAddPatient}>
                            <div className="form-section">
                                <h4>Account Information</h4>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input 
                                            type="email" 
                                            name="email" 
                                            value={formData.email} 
                                            onChange={handleInputChange} 
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input 
                                            type="password" 
                                            name="password" 
                                            value={formData.password} 
                                            onChange={handleInputChange} 
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-section">
                                <h4>Personal Information</h4>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input 
                                            type="text" 
                                            name="firstName" 
                                            value={formData.firstName} 
                                            onChange={handleInputChange} 
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input 
                                            type="text" 
                                            name="lastName" 
                                            value={formData.lastName} 
                                            onChange={handleInputChange} 
                                            required 
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input 
                                            type="tel" 
                                            name="phoneNumber" 
                                            value={formData.phoneNumber} 
                                            onChange={handleInputChange} 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Date of Birth</label>
                                        <input 
                                            type="date" 
                                            name="dateOfBirth" 
                                            value={formData.dateOfBirth} 
                                            onChange={handleInputChange} 
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Gender</label>
                                        <select 
                                            name="gender" 
                                            value={formData.gender} 
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Blood Group</label>
                                        <select 
                                            name="bloodGroup" 
                                            value={formData.bloodGroup} 
                                            onChange={handleInputChange}
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
                                </div>
                                
                                <div className="form-group wide">
                                    <label>Address</label>
                                    <textarea 
                                        name="address" 
                                        value={formData.address} 
                                        onChange={handleInputChange} 
                                        rows="2"
                                    ></textarea>
                                </div>
                            </div>
                            
                            <div className="form-section">
                                <h4>Medical Information</h4>
                                <div className="form-row">
                                    <div className="form-group wide">
                                        <label>Insurance Information</label>
                                        <input 
                                            type="text" 
                                            name="insuranceInfo" 
                                            value={formData.insuranceInfo} 
                                            onChange={handleInputChange} 
                                            placeholder="Insurance provider and policy number"
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group wide">
                                        <label>Emergency Contact</label>
                                        <input 
                                            type="text" 
                                            name="emergencyContact" 
                                            value={formData.emergencyContact} 
                                            onChange={handleInputChange} 
                                            placeholder="Name and phone number"
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-group wide">
                                    <label>Medical History</label>
                                    <textarea 
                                        name="medicalHistory" 
                                        value={formData.medicalHistory} 
                                        onChange={handleInputChange} 
                                        rows="3"
                                        placeholder="Allergies, chronic conditions, past surgeries, etc."
                                    ></textarea>
                                </div>
                            </div>
                            
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="save-btn">
                                    <i className="fas fa-save"></i> Add Patient
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Placeholder components for other sections
const AppointmentManagement = () => <div className="placeholder-section">Appointment Management coming soon...</div>;
const PaymentManagement = () => <div className="placeholder-section">Payment Management coming soon...</div>;
const DepartmentManagement = () => <div className="placeholder-section">Department Management coming soon...</div>;
const MedicalRecordManagement = () => <div className="placeholder-section">Medical Record Management coming soon...</div>;
const PrescriptionManagement = () => <div className="placeholder-section">Prescription Management coming soon...</div>;
const MedicationManagement = () => {
    const [medications, setMedications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showStockModal, setShowStockModal] = useState(false);
    
    // Form data for adding/editing medications
    const [formData, setFormData] = useState({
        name: '',
        genericName: '',
        brand: '',
        manufacturer: '',
        type: '',
        dosageForm: '',
        strength: '',
        stockQuantity: '',
        requiresPrescription: false,
        description: '',
        sideEffects: '',
        contraindications: '',
        price: ''
    });
    
    // Selected medication for edit/delete operations
    const [selectedMedication, setSelectedMedication] = useState(null);
    
    // Stock update form
    const [stockForm, setStockForm] = useState({
        medicationId: '',
        quantity: '',
        updateType: 'ADD' // ADD or SUBTRACT
    });

    useEffect(() => {
        fetchMedications();
    }, []);

    const fetchMedications = async () => {
        setLoading(true);
        try {
            let response;
            try {
                response = await axios.get('http://localhost:8080/api/medications');
            } catch (err) {
                // Try alternate endpoint if the first one fails
                response = await axios.get('http://localhost:8080/medications');
            }
            
            if (response.data) {
                setMedications(response.data);
                setError('');
            }
        } catch (err) {
            console.error('Error fetching medications:', err);
            setError('Failed to load medications. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleStockInputChange = (e) => {
        const { name, value } = e.target;
        setStockForm({
            ...stockForm,
            [name]: value
        });
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const openAddModal = () => {
        setFormData({
            name: '',
            genericName: '',
            brand: '',
            manufacturer: '',
            type: '',
            dosageForm: '',
            strength: '',
            stockQuantity: '',
            requiresPrescription: false,
            description: '',
            sideEffects: '',
            contraindications: '',
            price: ''
        });
        setShowAddModal(true);
    };

    const openEditModal = (medication) => {
        setSelectedMedication(medication);
        setFormData({
            name: medication.name,
            genericName: medication.genericName,
            brand: medication.brand || '',
            manufacturer: medication.manufacturer || '',
            type: medication.type || '',
            dosageForm: medication.dosageForm || '',
            strength: medication.strength || '',
            stockQuantity: medication.stockQuantity.toString(),
            requiresPrescription: medication.requiresPrescription,
            description: medication.description || '',
            sideEffects: medication.sideEffects || '',
            contraindications: medication.contraindications || '',
            price: medication.price ? medication.price.toString() : ''
        });
        setShowEditModal(true);
    };

    const openStockModal = (medication) => {
        setSelectedMedication(medication);
        setStockForm({
            medicationId: medication.id,
            quantity: '',
            updateType: 'ADD'
        });
        setShowStockModal(true);
    };

    const handleAddMedication = async (e) => {
        e.preventDefault();
        try {
            let response;
            try {
                response = await axios.post('http://localhost:8080/api/medications', formData);
            } catch (err) {
                // Try alternate endpoint if the first one fails
                response = await axios.post('http://localhost:8080/medications', formData);
            }
            
            if (response.data) {
                setMedications([...medications, response.data]);
                setShowAddModal(false);
                alert('Medication added successfully!');
            }
        } catch (err) {
            console.error('Error adding medication:', err);
            alert(err.response?.data?.message || 'Failed to add medication. Please try again.');
        }
    };

    const handleUpdateMedication = async (e) => {
        e.preventDefault();
        if (!selectedMedication) return;
        
        try {
            let response;
            try {
                response = await axios.put(`http://localhost:8080/api/medications/${selectedMedication.id}`, formData);
            } catch (err) {
                // Try alternate endpoint if the first one fails
                response = await axios.put(`http://localhost:8080/medications/${selectedMedication.id}`, formData);
            }
            
            if (response.data) {
                const updatedMedications = medications.map(med => 
                    med.id === selectedMedication.id ? response.data : med
                );
                setMedications(updatedMedications);
                setShowEditModal(false);
                alert('Medication updated successfully!');
            }
        } catch (err) {
            console.error('Error updating medication:', err);
            alert(err.response?.data?.message || 'Failed to update medication. Please try again.');
        }
    };

    const handleUpdateStock = async (e) => {
        e.preventDefault();
        if (!selectedMedication) return;
        
        try {
            const endpoint = `http://localhost:8080/api/medications/${selectedMedication.id}/stock`;
            const altEndpoint = `http://localhost:8080/medications/${selectedMedication.id}/stock`;
            const payload = {
                quantity: parseInt(stockForm.quantity),
                action: stockForm.updateType
            };
            
            let response;
            try {
                response = await axios.patch(endpoint, payload);
            } catch (err) {
                // Try alternate endpoint if the first one fails
                response = await axios.patch(altEndpoint, payload);
            }
            
            if (response.data) {
                const updatedMedications = medications.map(med => 
                    med.id === selectedMedication.id ? response.data : med
                );
                
                setMedications(updatedMedications);
                setShowStockModal(false);
                alert('Stock updated successfully!');
            }
        } catch (err) {
            console.error('Error updating stock:', err);
            alert(err.response?.data?.message || 'Failed to update stock. Please try again.');
        }
    };

    const handleDeleteMedication = async (medicationId) => {
        if (window.confirm('Are you sure you want to delete this medication?')) {
            try {
                let response;
                try {
                    response = await axios.delete(`http://localhost:8080/api/medications/${medicationId}`);
                } catch (err) {
                    // Try alternate endpoint if the first one fails
                    response = await axios.delete(`http://localhost:8080/medications/${medicationId}`);
                }
                
                setMedications(medications.filter(med => med.id !== medicationId));
                alert('Medication deleted successfully!');
            } catch (err) {
                console.error('Error deleting medication:', err);
                alert(err.response?.data?.message || 'Failed to delete medication. Please try again.');
            }
        }
    };

    // Filter medications based on search term
    const filteredMedications = medications.filter(med => {
        const searchLower = searchTerm.toLowerCase();
        return (
            med.name.toLowerCase().includes(searchLower) ||
            (med.genericName && med.genericName.toLowerCase().includes(searchLower)) ||
            (med.brand && med.brand.toLowerCase().includes(searchLower))
        );
    });

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading medications...</p>
            </div>
        );
    }

    return (
        <div className="medications-container">
            <div className="medications-header">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search medications..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    <i className="fas fa-search search-icon"></i>
                </div>
                <button className="add-btn" onClick={openAddModal}>
                    <i className="fas fa-plus"></i> Add Medication
                </button>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="medications-list">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Generic Name</th>
                            <th>Type</th>
                            <th>Dosage Form</th>
                            <th>Stock</th>
                            <th>Requires Rx</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMedications.length > 0 ? (
                            filteredMedications.map(med => (
                                <tr key={med.id} className={med.stockQuantity < 10 ? "low-stock" : ""}>
                                    <td>{med.name}</td>
                                    <td>{med.genericName || 'N/A'}</td>
                                    <td>{med.type || 'N/A'}</td>
                                    <td>{med.dosageForm || 'N/A'}</td>
                                    <td className={med.stockQuantity < 10 ? "low-stock-cell" : ""}>
                                        {med.stockQuantity}
                                        {med.stockQuantity < 10 && 
                                            <span className="low-stock-warning">
                                                <i className="fas fa-exclamation-triangle"></i> Low
                                            </span>
                                        }
                                    </td>
                                    <td>
                                        {med.requiresPrescription ? 
                                            <span className="requires-rx">Yes</span> : 
                                            <span className="no-rx">No</span>
                                        }
                                    </td>
                                    <td className="actions-cell">
                                        <button 
                                            className="action-btn edit-btn" 
                                            title="Edit"
                                            onClick={() => openEditModal(med)}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button 
                                            className="action-btn stock-btn" 
                                            title="Update Stock"
                                            onClick={() => openStockModal(med)}
                                        >
                                            <i className="fas fa-cubes"></i>
                                        </button>
                                        <button 
                                            className="action-btn delete-btn" 
                                            title="Delete"
                                            onClick={() => handleDeleteMedication(med.id)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="no-data">
                                    {searchTerm ? 'No medications match your search' : 'No medications found'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Add Medication Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Add New Medication</h3>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleAddMedication}>
                                <div className="form-section">
                                    <h4>Basic Information</h4>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="name">Name*</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="genericName">Generic Name*</label>
                                            <input
                                                type="text"
                                                id="genericName"
                                                name="genericName"
                                                value={formData.genericName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="brand">Brand</label>
                                            <input
                                                type="text"
                                                id="brand"
                                                name="brand"
                                                value={formData.brand}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="manufacturer">Manufacturer</label>
                                            <input
                                                type="text"
                                                id="manufacturer"
                                                name="manufacturer"
                                                value={formData.manufacturer}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="form-section">
                                    <h4>Medication Details</h4>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="type">Type*</label>
                                            <select
                                                id="type"
                                                name="type"
                                                value={formData.type}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select Type</option>
                                                <option value="ANALGESIC">Analgesic</option>
                                                <option value="ANTIBIOTIC">Antibiotic</option>
                                                <option value="ANTIDEPRESSANT">Antidepressant</option>
                                                <option value="ANTIVIRAL">Antiviral</option>
                                                <option value="ANTIHISTAMINE">Antihistamine</option>
                                                <option value="STEROID">Steroid</option>
                                                <option value="VACCINE">Vaccine</option>
                                                <option value="VITAMIN">Vitamin</option>
                                                <option value="MINERAL">Mineral</option>
                                                <option value="OTHER">Other</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="dosageForm">Dosage Form*</label>
                                            <select
                                                id="dosageForm"
                                                name="dosageForm"
                                                value={formData.dosageForm}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select Form</option>
                                                <option value="TABLET">Tablet</option>
                                                <option value="CAPSULE">Capsule</option>
                                                <option value="LIQUID">Liquid</option>
                                                <option value="INJECTION">Injection</option>
                                                <option value="TOPICAL">Topical</option>
                                                <option value="INHALER">Inhaler</option>
                                                <option value="SUPPOSITORY">Suppository</option>
                                                <option value="PATCH">Patch</option>
                                                <option value="OTHER">Other</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="strength">Strength</label>
                                            <input
                                                type="text"
                                                id="strength"
                                                name="strength"
                                                value={formData.strength}
                                                onChange={handleInputChange}
                                                placeholder="e.g. 500mg, 10ml"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="price">Price</label>
                                            <input
                                                type="number"
                                                id="price"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="stockQuantity">Initial Stock*</label>
                                            <input
                                                type="number"
                                                id="stockQuantity"
                                                name="stockQuantity"
                                                value={formData.stockQuantity}
                                                onChange={handleInputChange}
                                                min="0"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    name="requiresPrescription"
                                                    checked={formData.requiresPrescription}
                                                    onChange={handleInputChange}
                                                />
                                                Requires Prescription
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="form-section">
                                    <h4>Additional Information</h4>
                                    <div className="form-group">
                                        <label htmlFor="description">Description</label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows="3"
                                        ></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="sideEffects">Side Effects</label>
                                        <textarea
                                            id="sideEffects"
                                            name="sideEffects"
                                            value={formData.sideEffects}
                                            onChange={handleInputChange}
                                            rows="3"
                                        ></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="contraindications">Contraindications</label>
                                        <textarea
                                            id="contraindications"
                                            name="contraindications"
                                            value={formData.contraindications}
                                            onChange={handleInputChange}
                                            rows="3"
                                        ></textarea>
                                    </div>
                                </div>
                                
                                <div className="form-actions">
                                    <button 
                                        type="button" 
                                        className="cancel-btn"
                                        onClick={() => setShowAddModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="submit-btn">Add Medication</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Edit Medication Modal */}
            {showEditModal && selectedMedication && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Edit Medication</h3>
                            <button className="close-btn" onClick={() => setShowEditModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleUpdateMedication}>
                                <div className="form-section">
                                    <h4>Basic Information</h4>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="edit-name">Name*</label>
                                            <input
                                                type="text"
                                                id="edit-name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="edit-genericName">Generic Name*</label>
                                            <input
                                                type="text"
                                                id="edit-genericName"
                                                name="genericName"
                                                value={formData.genericName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="edit-brand">Brand</label>
                                            <input
                                                type="text"
                                                id="edit-brand"
                                                name="brand"
                                                value={formData.brand}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="edit-manufacturer">Manufacturer</label>
                                            <input
                                                type="text"
                                                id="edit-manufacturer"
                                                name="manufacturer"
                                                value={formData.manufacturer}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="form-section">
                                    <h4>Medication Details</h4>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="edit-type">Type*</label>
                                            <select
                                                id="edit-type"
                                                name="type"
                                                value={formData.type}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select Type</option>
                                                <option value="ANALGESIC">Analgesic</option>
                                                <option value="ANTIBIOTIC">Antibiotic</option>
                                                <option value="ANTIDEPRESSANT">Antidepressant</option>
                                                <option value="ANTIVIRAL">Antiviral</option>
                                                <option value="ANTIHISTAMINE">Antihistamine</option>
                                                <option value="STEROID">Steroid</option>
                                                <option value="VACCINE">Vaccine</option>
                                                <option value="VITAMIN">Vitamin</option>
                                                <option value="MINERAL">Mineral</option>
                                                <option value="OTHER">Other</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="edit-dosageForm">Dosage Form*</label>
                                            <select
                                                id="edit-dosageForm"
                                                name="dosageForm"
                                                value={formData.dosageForm}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select Form</option>
                                                <option value="TABLET">Tablet</option>
                                                <option value="CAPSULE">Capsule</option>
                                                <option value="LIQUID">Liquid</option>
                                                <option value="INJECTION">Injection</option>
                                                <option value="TOPICAL">Topical</option>
                                                <option value="INHALER">Inhaler</option>
                                                <option value="SUPPOSITORY">Suppository</option>
                                                <option value="PATCH">Patch</option>
                                                <option value="OTHER">Other</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="edit-strength">Strength</label>
                                            <input
                                                type="text"
                                                id="edit-strength"
                                                name="strength"
                                                value={formData.strength}
                                                onChange={handleInputChange}
                                                placeholder="e.g. 500mg, 10ml"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="edit-price">Price</label>
                                            <input
                                                type="number"
                                                id="edit-price"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    name="requiresPrescription"
                                                    checked={formData.requiresPrescription}
                                                    onChange={handleInputChange}
                                                />
                                                Requires Prescription
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="form-section">
                                    <h4>Additional Information</h4>
                                    <div className="form-group">
                                        <label htmlFor="edit-description">Description</label>
                                        <textarea
                                            id="edit-description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows="3"
                                        ></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="edit-sideEffects">Side Effects</label>
                                        <textarea
                                            id="edit-sideEffects"
                                            name="sideEffects"
                                            value={formData.sideEffects}
                                            onChange={handleInputChange}
                                            rows="3"
                                        ></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="edit-contraindications">Contraindications</label>
                                        <textarea
                                            id="edit-contraindications"
                                            name="contraindications"
                                            value={formData.contraindications}
                                            onChange={handleInputChange}
                                            rows="3"
                                        ></textarea>
                                    </div>
                                </div>
                                
                                <div className="form-actions">
                                    <button 
                                        type="button" 
                                        className="cancel-btn"
                                        onClick={() => setShowEditModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="submit-btn">Update Medication</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Update Stock Modal */}
            {showStockModal && selectedMedication && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Update Stock: {selectedMedication.name}</h3>
                            <button className="close-btn" onClick={() => setShowStockModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="stock-info">
                                <p>Current Stock: <strong>{selectedMedication.stockQuantity}</strong></p>
                            </div>
                            
                            <form onSubmit={handleUpdateStock}>
                                <div className="form-section">
                                    <div className="form-group">
                                        <label htmlFor="updateType">Action</label>
                                        <select
                                            id="updateType"
                                            name="updateType"
                                            value={stockForm.updateType}
                                            onChange={handleStockInputChange}
                                            required
                                        >
                                            <option value="ADD">Add to Stock</option>
                                            <option value="SUBTRACT">Remove from Stock</option>
                                        </select>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="quantity">Quantity</label>
                                        <input
                                            type="number"
                                            id="quantity"
                                            name="quantity"
                                            value={stockForm.quantity}
                                            onChange={handleStockInputChange}
                                            min="1"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-actions">
                                    <button 
                                        type="button" 
                                        className="cancel-btn"
                                        onClick={() => setShowStockModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="submit-btn">Update Stock</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Replace the NotificationManagement placeholder with this implementation
const NotificationManagement = () => <div className="placeholder-section">Notification Management coming soon...</div>;
const LoginHistoryManagement = () => <div className="placeholder-section">Login History coming soon...</div>;
const AuditLogManagement = () => <div className="placeholder-section">Audit Log Management coming soon...</div>;
const Settings = () => <div className="placeholder-section">Settings coming soon...</div>;

// Profile component implementation
const Profile = ({ userData }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
    });
    const [changePassword, setChangePassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        if (userData) {
            setFormData({
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                email: userData.email || '',
                phoneNumber: userData.phoneNumber || ''
            });
        }
    }, [userData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value
        });
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        // Reset form data when canceling edit
        if (isEditing) {
            setFormData({
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                email: userData.email || '',
                phoneNumber: userData.phoneNumber || ''
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setMessage({ text: 'Profile updated successfully!', type: 'success' });
            setIsEditing(false);
            
            // In a real app, we would update the userData in localStorage and/or send to the server
            // This is a simplified example
            console.log('Updated profile data:', formData);
            
            // Update user data in localStorage to reflect changes
            const updatedUserData = {
                ...userData,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber
            };
            
            localStorage.setItem('user', JSON.stringify(updatedUserData));
            
            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ text: 'Failed to update profile. Please try again.', type: 'error' });
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ text: 'New passwords do not match!', type: 'error' });
            return;
        }
        
        // Check if this is the hardcoded admin user
        if (userData.roleId === 'ADMIN001' && passwordData.currentPassword !== 'admin') {
            setMessage({ text: 'Current password is incorrect!', type: 'error' });
            return;
        }
        
        try {
            // In a real app, we would send a request to the server to update the password
            setMessage({ text: 'Password updated successfully!', type: 'success' });
            setChangePassword(false);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            
            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 3000);
        } catch (error) {
            console.error('Error updating password:', error);
            setMessage({ text: 'Failed to update password. Please try again.', type: 'error' });
        }
    };

    if (!userData) {
        return (
            <div className="profile-container">
                <div className="error-message">No user data available.</div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            {message.text && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}
            
            <div className="profile-header">
                <div className="profile-avatar">
                    <i className="fas fa-user-shield"></i>
                </div>
                <div className="profile-title">
                    <h3>{userData.firstName} {userData.lastName}</h3>
                    <p className="role-badge">{userData.role}</p>
                </div>
                <div className="profile-actions">
                    <button className="edit-profile-btn" onClick={handleEditToggle}>
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                    {!isEditing && (
                        <button className="change-password-btn" onClick={() => setChangePassword(true)}>
                            Change Password
                        </button>
                    )}
                </div>
            </div>
            
            <div className="profile-content">
                {!isEditing ? (
                    <div className="profile-info">
                        <div className="info-group">
                            <h4>Personal Information</h4>
                            <div className="info-row">
                                <span className="info-label">ID:</span>
                                <span className="info-value">{userData.roleId}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Full Name:</span>
                                <span className="info-value">{userData.firstName} {userData.lastName}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Email:</span>
                                <span className="info-value">{userData.email}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Phone:</span>
                                <span className="info-value">{userData.phoneNumber || 'Not provided'}</span>
                            </div>
                        </div>
                        
                        <div className="info-group">
                            <h4>Account Information</h4>
                            <div className="info-row">
                                <span className="info-label">Role:</span>
                                <span className="info-value">{userData.role}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Last Login:</span>
                                <span className="info-value">
                                    {userData.loginTime ? new Date(userData.loginTime).toLocaleString() : 'Unknown'}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="edit-profile-form">
                        <div className="form-section">
                            <h4>Edit Personal Information</h4>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input 
                                        type="text" 
                                        name="firstName" 
                                        value={formData.firstName} 
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input 
                                        type="text" 
                                        name="lastName" 
                                        value={formData.lastName} 
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Email</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input 
                                        type="tel" 
                                        name="phoneNumber" 
                                        value={formData.phoneNumber} 
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={handleEditToggle}>
                                Cancel
                            </button>
                            <button type="submit" className="save-btn">
                                Save Changes
                            </button>
                        </div>
                    </form>
                )}
            </div>
            
            {/* Change Password Modal */}
            {changePassword && (
                <div className="modal-overlay">
                    <div className="modal-content password-modal">
                        <div className="modal-header">
                            <h3>Change Password</h3>
                            <button className="close-btn" onClick={() => setChangePassword(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="form-group">
                                <label>Current Password</label>
                                <input 
                                    type="password" 
                                    name="currentPassword" 
                                    value={passwordData.currentPassword} 
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>New Password</label>
                                <input 
                                    type="password" 
                                    name="newPassword" 
                                    value={passwordData.newPassword} 
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Confirm New Password</label>
                                <input 
                                    type="password" 
                                    name="confirmPassword" 
                                    value={passwordData.confirmPassword} 
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setChangePassword(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="save-btn">
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage; 