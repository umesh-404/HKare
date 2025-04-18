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
            case "doctors":
                return <DoctorManagement />;
            case "patients":
                return <PatientManagement />;
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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [dateFilter, setDateFilter] = useState('');
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
        setIsLoading(true);
        setError('');
        try {
            console.log('Fetching staff from API...');
            let response;
            try {
                response = await axios.get('http://localhost:8080/api/staff/profiles', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000 // 10 second timeout
                });
            } catch (err) {
                // If first attempt fails, try without /api prefix
                response = await axios.get('http://localhost:8080/staff/profiles', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                });
            }
            
            console.log('Staff data received:', response.data);
            setStaff(response.data || []);
                setError('');
        } catch (err) {
            console.error('Error fetching staff:', err);
            const errorMessage = err.response?.data?.message || 
                                err.message || 
                                'Failed to load staff data. Please try again later.';
            setError(`Error: ${errorMessage}`);
            setStaff([]); // Set empty array instead of undefined
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            console.log('Fetching departments from API...');
            let response;
            try {
                response = await axios.get('http://localhost:8080/api/departments', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                });
            } catch (err) {
                // If first attempt fails, try without /api prefix
                response = await axios.get('http://localhost:8080/departments', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                });
            }
            
            console.log('Departments data received:', response.data);
            setDepartments(response.data || []);
        } catch (err) {
            console.error('Error fetching departments:', err);
            // We don't set a general error here as it's not critical for the page to function
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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

    const handleOpenEditModal = (staffMember) => {
        setSelectedStaff(staffMember);
        let dateOfBirth = '';
        let hireDate = '';
        
        try {
            if (staffMember.dateOfBirth) {
                const dobDate = new Date(staffMember.dateOfBirth);
                if (!isNaN(dobDate.getTime())) {
                    dateOfBirth = dobDate.toISOString().split('T')[0];
                }
            }
            
            if (staffMember.hireDate) {
                const hireDateObj = new Date(staffMember.hireDate);
                if (!isNaN(hireDateObj.getTime())) {
                    hireDate = hireDateObj.toISOString().split('T')[0];
                }
            }
        } catch (error) {
            console.error("Date parsing error:", error);
        }

        setFormData({
            email: staffMember.email || '',
            firstName: staffMember.firstName || '',
            lastName: staffMember.lastName || '',
            phoneNumber: staffMember.phoneNumber || '',
            address: staffMember.address || '',
            position: staffMember.position || '',
            departmentId: staffMember.departmentId || '',
            hireDate: hireDate,
            gender: staffMember.gender || '',
            dateOfBirth: dateOfBirth,
            admin: staffMember.admin || false
        });
        setShowEditModal(true);
    };

    const handleViewStaff = (staffMember) => {
        setSelectedStaff(staffMember);
        setShowViewModal(true);
    };

    const handleAddStaff = async (e) => {
        e.preventDefault();
        
        try {
            console.log('Adding new staff member with data:', formData);
            let response;
            try {
                response = await axios.post('http://localhost:8080/api/staff/create', formData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } catch (err) {
                // If first attempt fails, try without /api prefix
                response = await axios.post('http://localhost:8080/staff/create', formData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
            
            if (response.status === 201 || response.status === 200) {
                // Refresh the staff list
                fetchStaff();
                setShowAddModal(false);
                
                // Success notification
                alert(`Staff member added successfully! Staff ID: ${response.data.roleId}`);
            }
        } catch (err) {
            console.error('Error adding staff:', err);
            alert(err.response?.data?.message || 'Failed to add staff member. Please try again.');
        }
    };

    const handleUpdateStaff = async (e) => {
        e.preventDefault();
        if (!selectedStaff) return;
        
        try {
            console.log('Updating staff member with data:', formData);
            let response;
            try {
                response = await axios.put(`http://localhost:8080/api/staff/${selectedStaff.staffId}`, formData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } catch (err) {
                // If first attempt fails, try without /api prefix
                response = await axios.put(`http://localhost:8080/staff/${selectedStaff.staffId}`, formData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
            
            if (response.status === 200) {
                setShowEditModal(false);
                fetchStaff();
                alert('Staff member updated successfully!');
            }
        } catch (err) {
            console.error('Error updating staff:', err);
            alert(err.response?.data?.message || 'Failed to update staff member. Please try again.');
        }
    };

    const handleDeleteStaff = async (staffId) => {
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            try {
                console.log(`Deleting staff member with ID: ${staffId}`);
                let response;
                try {
                    response = await axios.delete(`http://localhost:8080/api/staff/${staffId}`);
                } catch (err) {
                    // If first attempt fails, try without /api prefix
                    response = await axios.delete(`http://localhost:8080/staff/${staffId}`);
                }
                
                if (response.status === 200 || response.status === 204) {
                    // Refresh the staff list
                    fetchStaff();
                    
                    // Success notification
                    alert('Staff member deleted successfully!');
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
            month: 'short', 
            day: 'numeric'
        });
    };

    const getAdminStatusClass = (isAdmin) => {
        return isAdmin ? 'status-completed' : 'status-pending';
    };

    const getFilteredStaff = () => {
        return staff.filter(staffMember => {
            // Filter by status (admin/staff)
            if (statusFilter !== 'ALL') {
                const isAdmin = staffMember.admin;
                if (statusFilter === 'ADMIN' && !isAdmin) return false;
                if (statusFilter === 'STAFF' && isAdmin) return false;
            }
            
            // Filter by hire date if date filter is set
            if (dateFilter && staffMember.hireDate) {
                const hireDate = new Date(staffMember.hireDate).toISOString().split('T')[0];
                if (hireDate !== dateFilter) {
                    return false;
                }
            }
            
            return true;
        });
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading staff data...</p>
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
                                <option value="ALL">All Staff</option>
                                <option value="ADMIN">Admin</option>
                                <option value="STAFF">Staff</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Hire Date:</label>
                            <input 
                                type="date" 
                                className="filter-date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <button className="add-btn" onClick={handleOpenAddModal}>
                    <i className="fas fa-plus"></i>
                    New Staff
                </button>
            </div>
            
            {error && (
                <div className="error-container">
                    <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        <span>{error}</span>
                    </div>
                    <button 
                        className="retry-btn" 
                        onClick={() => {
                            setError('');
                            fetchStaff();
                        }}
                    >
                        <i className="fas fa-sync"></i> Retry
                    </button>
                </div>
            )}
            
            <div className="table-responsive">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Staff ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Position</th>
                            <th>Department</th>
                            <th>Hire Date</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getFilteredStaff().length > 0 ? (
                            getFilteredStaff().map(staffMember => (
                                <tr key={staffMember.staffId}>
                                    <td>{staffMember.staffId}</td>
                                    <td>{`${staffMember.firstName} ${staffMember.lastName}`}</td>
                                    <td>{staffMember.email}</td>
                                    <td>{staffMember.position || 'N/A'}</td>
                                    <td>{staffMember.departmentName || 'N/A'}</td>
                                    <td>{formatDate(staffMember.hireDate)}</td>
                                    <td>
                                        <span className={`status-badge ${getAdminStatusClass(staffMember.admin)}`}>
                                            {staffMember.admin ? 'Admin' : 'Staff'}
                                        </span>
                                    </td>
                                    <td className="actions-cell">
                                        <button 
                                            className="action-btn view" 
                                            onClick={() => handleViewStaff(staffMember)}
                                            title="View Details"
                                        >
                                            <i className="fas fa-eye"></i>
                                        </button>
                                        <button 
                                            className="action-btn edit" 
                                            onClick={() => handleOpenEditModal(staffMember)}
                                            title="Edit"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button 
                                            className="action-btn delete" 
                                            onClick={() => handleDeleteStaff(staffMember.staffId)}
                                            title="Delete"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="no-data">No staff members found</td>
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
            
            {/* Edit Staff Modal */}
            {showEditModal && selectedStaff && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Edit Staff Member</h3>
                            <button className="close-btn" onClick={() => setShowEditModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleUpdateStaff}>
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
                                        onClick={() => setShowEditModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="submit-btn">Update Staff</button>
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
                                    <button 
                                        type="button" 
                                        className="edit-btn"
                                        onClick={() => {
                                            setShowViewModal(false);
                                            handleOpenEditModal(selectedStaff);
                                        }}
                                    >
                                        Edit Staff
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
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        gender: '',
        dateOfBirth: '',
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
        setError('');
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
            dateOfBirth: '',
            departmentId: '',
            specialization: '',
            licenseNumber: '',
            qualification: '',
            experience: ''
        });
        setShowAddModal(true);
    };
    
    const openEditModal = (doctor) => {
        setSelectedDoctor(doctor);
        let dateOfBirth = '';
        
        try {
            if (doctor.dateOfBirth) {
                const dobDate = new Date(doctor.dateOfBirth);
                if (!isNaN(dobDate.getTime())) {
                    dateOfBirth = dobDate.toISOString().split('T')[0];
                }
            }
        } catch (error) {
            console.error("Date parsing error:", error);
        }
        
        setFormData({
            email: doctor.email || '',
            firstName: doctor.firstName || '',
            lastName: doctor.lastName || '',
            phoneNumber: doctor.phoneNumber || '',
            address: doctor.address || '',
            gender: doctor.gender || '',
            dateOfBirth: dateOfBirth,
            departmentId: doctor.departmentId || '',
            specialization: doctor.specialization || '',
            experience: doctor.experience || '',
            qualification: doctor.qualification || '',
            licenseNumber: doctor.licenseNumber || '',
            consultationFee: doctor.consultationFee || ''
        });
        setShowEditModal(true);
    };
    
    const openViewModal = (doctor) => {
        setSelectedDoctor(doctor);
        setShowViewModal(true);
    };

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        try {
            // Convert date string to ISO format for backend
            const dateOfBirth = formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null;
            
            const doctorData = {
                ...formData,
                dateOfBirth,
                departmentId: formData.departmentId ? Number(formData.departmentId) : null,
                experienceYears: formData.experience ? Number(formData.experience) : null
            };
            
            console.log("Creating doctor with data:", doctorData);
            try {
                const response = await axios.post('http://localhost:8080/api/doctors', doctorData);
                console.log("Doctor creation response:", response.data);
                setShowAddModal(false);
                fetchDoctors(); // Refresh the list
                alert('Doctor added successfully!');
            } catch (apiError) {
                console.log("Trying alternate URL without /api prefix");
                const response = await axios.post('http://localhost:8080/doctors', doctorData);
                console.log("Doctor creation response (alternate URL):", response.data);
                setShowAddModal(false);
                fetchDoctors(); // Refresh the list
                alert('Doctor added successfully!');
            }
        } catch (err) {
            console.error('Error adding doctor:', err);
            alert(err.response?.data?.message || 'Failed to add doctor. Please try again.');
        }
    };
    
    const handleUpdateDoctor = async (e) => {
        e.preventDefault();
        if (!selectedDoctor) return;
        
        try {
            // Convert date string to ISO format for backend
            const dateOfBirth = formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null;
            
            const doctorData = {
                ...formData,
                dateOfBirth,
                departmentId: formData.departmentId ? Number(formData.departmentId) : null,
                experienceYears: formData.experience ? Number(formData.experience) : null
            };
            
            try {
                const response = await axios.put(`http://localhost:8080/api/doctors/${selectedDoctor.doctorId}`, doctorData);
                setShowEditModal(false);
                fetchDoctors(); // Refresh the list
                alert('Doctor updated successfully!');
            } catch (apiError) {
                const response = await axios.put(`http://localhost:8080/doctors/${selectedDoctor.doctorId}`, doctorData);
                setShowEditModal(false);
                fetchDoctors(); // Refresh the list
                alert('Doctor updated successfully!');
            }
        } catch (err) {
            console.error('Error updating doctor:', err);
            alert(err.response?.data?.message || 'Failed to update doctor. Please try again.');
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
                    alert('Doctor deleted successfully!');
                } catch (apiError) {
                    console.log("Trying alternate URL without /api prefix");
                    await axios.delete(`http://localhost:8080/doctors/${doctorId}`);
                    console.log(`Doctor ${doctorId} deleted successfully (alternate URL)`);
                    fetchDoctors(); // Refresh the list
                    alert('Doctor deleted successfully!');
                }
            } catch (err) {
                console.error('Error deleting doctor:', err);
                alert(err.response?.data?.message || 'Failed to delete doctor. Please try again.');
            }
        }
    };
    
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch (error) {
            return dateString;
        }
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading doctors...</p>
            </div>
        );
    }

    return (
        <div className="management-section">
            <div className="management-header">
                <h2>Doctor Management</h2>
                <button className="add-btn" onClick={openAddModal}>
                    <i className="fas fa-plus"></i> Add New Doctor
                </button>
            </div>
            
            {error && (
                <div className="error-container">
                    <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        <span>{error}</span>
                    </div>
                    <button 
                        className="retry-btn" 
                        onClick={() => {
                            setError('');
                            fetchDoctors();
                        }}
                    >
                        <i className="fas fa-sync"></i> Retry
                    </button>
                </div>
            )}
            
            <div className="table-responsive">
                <table className="data-table">
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
                        {doctors.length > 0 ? (
                            doctors.map(doctor => (
                                <tr key={doctor.doctorId}>
                                    <td>{doctor.doctorId}</td>
                                    <td>Dr. {doctor.firstName} {doctor.lastName}</td>
                                    <td>{doctor.email}</td>
                                    <td>{doctor.specialization || 'N/A'}</td>
                                    <td>{doctor.department ? doctor.department.name : 'N/A'}</td>
                                    <td>{doctor.licenseNumber || 'N/A'}</td>
                                    <td className="actions-cell">
                                        <button 
                                            className="action-btn view-btn" 
                                            title="View Details"
                                            onClick={() => openViewModal(doctor)}
                                        >
                                            <i className="fas fa-eye"></i>
                                        </button>
                                        <button 
                                            className="action-btn edit-btn" 
                                            title="Edit"
                                            onClick={() => openEditModal(doctor)}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button 
                                            className="action-btn delete-btn" 
                                            title="Delete"
                                            onClick={() => handleDeleteDoctor(doctor.doctorId)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
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
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Add New Doctor</h3>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleAddDoctor}>
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
                                            <label htmlFor="phoneNumber">Phone Number</label>
                                            <input
                                                type="text"
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
                                    </div>
                                </div>
                                
                                <div className="form-section">
                                    <h4>Professional Information</h4>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="departmentId">Department</label>
                                            <select 
                                                id="departmentId"
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
                                            <label htmlFor="specialization">Specialization*</label>
                                            <input 
                                                type="text" 
                                                id="specialization"
                                                name="specialization" 
                                                value={formData.specialization} 
                                                onChange={handleInputChange} 
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="licenseNumber">License Number*</label>
                                            <input 
                                                type="text" 
                                                id="licenseNumber"
                                                name="licenseNumber" 
                                                value={formData.licenseNumber} 
                                                onChange={handleInputChange} 
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="qualification">Qualification*</label>
                                            <input 
                                                type="text" 
                                                id="qualification"
                                                name="qualification" 
                                                value={formData.qualification} 
                                                onChange={handleInputChange} 
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="experience">Years of Experience</label>
                                            <input 
                                                type="number" 
                                                id="experience"
                                                name="experience" 
                                                value={formData.experience} 
                                                onChange={handleInputChange} 
                                                min="0"
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
                                    <button type="submit" className="submit-btn">
                                        <i className="fas fa-save"></i> Add Doctor
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Edit Doctor Modal */}
            {showEditModal && selectedDoctor && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Edit Doctor</h3>
                            <button className="close-btn" onClick={() => setShowEditModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleUpdateDoctor}>
                                <div className="form-section">
                                    <h4>Account Information</h4>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="email">Email*</label>
                                            <input 
                                                type="email" 
                                                id="edit-email"
                                                name="email" 
                                                value={formData.email} 
                                                onChange={handleInputChange} 
                                                required 
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">New Password (leave blank to keep current)</label>
                                            <input 
                                                type="password" 
                                                id="edit-password"
                                                name="password" 
                                                value={formData.password} 
                                                onChange={handleInputChange}
                                            />
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
                                                id="edit-firstName"
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
                                                id="edit-lastName"
                                                name="lastName" 
                                                value={formData.lastName} 
                                                onChange={handleInputChange} 
                                                required 
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="gender">Gender</label>
                                            <select
                                                id="edit-gender"
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
                                            <label htmlFor="dateOfBirth">Date of Birth</label>
                                            <input 
                                                type="date"
                                                id="edit-dateOfBirth"
                                                name="dateOfBirth"
                                                value={formData.dateOfBirth}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="phoneNumber">Phone Number</label>
                                            <input
                                                type="text"
                                                id="edit-phoneNumber"
                                                name="phoneNumber" 
                                                value={formData.phoneNumber} 
                                                onChange={handleInputChange} 
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="address">Address</label>
                                            <input 
                                                type="text"
                                                id="edit-address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange} 
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="form-section">
                                    <h4>Professional Information</h4>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="departmentId">Department</label>
                                            <select 
                                                id="edit-departmentId"
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
                                            <label htmlFor="specialization">Specialization*</label>
                                            <input 
                                                type="text" 
                                                id="edit-specialization"
                                                name="specialization" 
                                                value={formData.specialization} 
                                                onChange={handleInputChange} 
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="licenseNumber">License Number*</label>
                                            <input 
                                                type="text" 
                                                id="edit-licenseNumber"
                                                name="licenseNumber" 
                                                value={formData.licenseNumber} 
                                                onChange={handleInputChange} 
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="qualification">Qualification*</label>
                                            <input 
                                                type="text" 
                                                id="edit-qualification"
                                                name="qualification" 
                                                value={formData.qualification} 
                                                onChange={handleInputChange} 
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="experience">Years of Experience</label>
                                            <input 
                                                type="number" 
                                                id="edit-experience"
                                                name="experience" 
                                                value={formData.experience} 
                                                onChange={handleInputChange} 
                                                min="0"
                                            />
                                        </div>
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
                                    <button type="submit" className="submit-btn">
                                        <i className="fas fa-save"></i> Update Doctor
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            
            {/* View Doctor Modal */}
            {showViewModal && selectedDoctor && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Doctor Details</h3>
                            <button className="close-btn" onClick={() => setShowViewModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-sections">
                                <div className="profile-header">
                                    <div className="profile-avatar">
                                        <i className="fas fa-user-md fa-3x"></i>
                                    </div>
                                    <div className="profile-info">
                                        <h3>Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</h3>
                                        <p className="specialization">{selectedDoctor.specialization || 'No Specialization'}</p>
                                        {selectedDoctor.department && (
                                            <span className="department-badge">{selectedDoctor.department.name}</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="detail-section">
                                    <h4><i className="fas fa-id-card"></i> Basic Information</h4>
                                    <div className="details-grid">
                                        <div className="detail-item">
                                            <span className="detail-label">Doctor ID:</span>
                                            <span className="detail-value">{selectedDoctor.doctorId}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Email:</span>
                                            <span className="detail-value">{selectedDoctor.email}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Phone:</span>
                                            <span className="detail-value">{selectedDoctor.phoneNumber || 'N/A'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Address:</span>
                                            <span className="detail-value">{selectedDoctor.address || 'N/A'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Date of Birth:</span>
                                            <span className="detail-value">{selectedDoctor.dateOfBirth ? formatDate(selectedDoctor.dateOfBirth) : 'N/A'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Gender:</span>
                                            <span className="detail-value">{selectedDoctor.gender || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="detail-section">
                                    <h4><i className="fas fa-stethoscope"></i> Professional Information</h4>
                                    <div className="details-grid">
                                        <div className="detail-item">
                                            <span className="detail-label">Department:</span>
                                            <span className="detail-value">{selectedDoctor.department ? selectedDoctor.department.name : 'N/A'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Specialization:</span>
                                            <span className="detail-value">{selectedDoctor.specialization || 'N/A'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">License Number:</span>
                                            <span className="detail-value">{selectedDoctor.licenseNumber || 'N/A'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Qualification:</span>
                                            <span className="detail-value">{selectedDoctor.qualification || 'N/A'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Years of Experience:</span>
                                            <span className="detail-value">{selectedDoctor.experienceYears || 'N/A'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Consultation Fee:</span>
                                            <span className="detail-value">{selectedDoctor.consultationFee ? `$${selectedDoctor.consultationFee}` : 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {selectedDoctor.bio && (
                                    <div className="detail-section">
                                        <h4><i className="fas fa-book-open"></i> Biography</h4>
                                        <p className="bio-text">{selectedDoctor.bio}</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="modal-actions">
                                <button 
                                    className="cancel-btn"
                                    onClick={() => setShowViewModal(false)}
                                >
                                    Close
                                </button>
                                <button 
                                    className="edit-btn"
                                    onClick={() => {
                                        setShowViewModal(false);
                                        openEditModal(selectedDoctor);
                                    }}
                                >
                                    <i className="fas fa-edit"></i> Edit Doctor
                                </button>
                            </div>
                        </div>
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
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
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
        height: '',
        weight: '',
        allergies: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        insuranceProvider: '',
        insuranceId: ''
    });

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        setIsLoading(true);
        setError('');
        try {
            console.log('Fetching patients from API...');
            // Note that the endpoint already includes /api in the controller
            const response = await axios.get('http://localhost:8080/api/patients', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                timeout: 10000 // 10 second timeout
            });
            
            console.log('Patient data received:', response.data);
            setPatients(response.data || []);
            setIsLoading(false);
        } catch (err) {
            console.error('Error fetching patients:', err);
            const errorMessage = err.response?.data?.message || 
                                err.message || 
                                'Failed to load patients. Please try again later.';
            setError(`Error: ${errorMessage}`);
            setIsLoading(false);
            setPatients([]); // Set empty array instead of undefined
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
            height: '',
            weight: '',
            allergies: '',
            emergencyContactName: '',
            emergencyContactPhone: '',
            insuranceProvider: '',
            insuranceId: ''
        });
        setShowAddModal(true);
    };

    const openEditModal = (patient) => {
        setSelectedPatient(patient);
        let dateOfBirth = '';
        
        try {
            if (patient.dateOfBirth) {
                const dobDate = new Date(patient.dateOfBirth);
                if (!isNaN(dobDate.getTime())) {
                    dateOfBirth = dobDate.toISOString().split('T')[0];
                }
            }
        } catch (error) {
            console.error("Date parsing error:", error);
        }
        
        setFormData({
            email: patient.email || '',
            firstName: patient.firstName || '',
            lastName: patient.lastName || '',
            phoneNumber: patient.phoneNumber || '',
            address: patient.address || '',
            gender: patient.gender || '',
            dateOfBirth: dateOfBirth,
            bloodGroup: patient.bloodGroup || '',
            height: patient.height || '',
            weight: patient.weight || '',
            allergies: patient.allergies || '',
            emergencyContactName: patient.emergencyContactName || '',
            emergencyContactPhone: patient.emergencyContactPhone || '',
            insuranceProvider: patient.insuranceProvider || '',
            insuranceId: patient.insuranceId || ''
        });
        setShowEditModal(true);
    };

    const openViewModal = (patient) => {
        setSelectedPatient(patient);
        setShowViewModal(true);
    };

    const handleAddPatient = async (e) => {
        e.preventDefault();
        try {
            const patientData = {
                ...formData
            };
            
                const response = await axios.post('http://localhost:8080/api/patients', patientData);
            if (response.status === 201 || response.status === 200) {
                setShowAddModal(false);
                fetchPatients();
                alert('Patient added successfully!');
            }
        } catch (err) {
            console.error('Error adding patient:', err);
            alert(err.response?.data?.message || 'Failed to add patient. Please try again.');
        }
    };

    const handleUpdatePatient = async (e) => {
        e.preventDefault();
        if (!selectedPatient) return;
        
        try {
            const patientData = {
                ...formData
            };
            
            const response = await axios.put(`http://localhost:8080/api/patients/${selectedPatient.patientId}`, patientData);
            if (response.status === 200) {
                setShowEditModal(false);
                fetchPatients();
                alert('Patient updated successfully!');
            }
        } catch (err) {
            console.error('Error updating patient:', err);
            alert(err.response?.data?.message || 'Failed to update patient. Please try again.');
        }
    };

    const handleDeletePatient = async (patientId) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            try {
                const response = await axios.delete(`http://localhost:8080/api/patients/${patientId}`);
                if (response.status === 200 || response.status === 204) {
                    fetchPatients();
                    alert('Patient deleted successfully!');
                }
            } catch (err) {
                console.error('Error deleting patient:', err);
                alert(err.response?.data?.message || 'Failed to delete patient. Please try again.');
            }
        }
    };

    // Format date for display
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
                <h2>Patient Management</h2>
                <button className="add-btn" onClick={openAddModal}>
                    <i className="fas fa-plus"></i> Add New Patient
                </button>
            </div>
            
            {error && (
                <div className="error-container">
                    <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        <span>{error}</span>
                    </div>
                    <button 
                        className="retry-btn" 
                        onClick={() => {
                            setError('');
                            fetchPatients();
                        }}
                    >
                        <i className="fas fa-sync"></i> Retry
                    </button>
                </div>
            )}
            
            <div className="management-content">
                <table className="data-table">
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
                        {patients.length > 0 ? (
                            patients.map(patient => (
                            <tr key={patient.patientId}>
                                <td>{patient.patientId}</td>
                                <td>{patient.firstName} {patient.lastName}</td>
                                <td>{patient.email}</td>
                                <td>{patient.phoneNumber || 'N/A'}</td>
                                <td>{patient.bloodGroup || 'N/A'}</td>
                                <td>{patient.gender || 'N/A'}</td>
                                <td className="actions-cell">
                                        <button 
                                            className="action-btn view-btn" 
                                            title="View Details"
                                            onClick={() => openViewModal(patient)}
                                        >
                                        <i className="fas fa-eye"></i>
                                    </button>
                                        <button 
                                            className="action-btn edit-btn" 
                                            title="Edit"
                                            onClick={() => openEditModal(patient)}
                                        >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                        <button 
                                            className="action-btn delete-btn" 
                                            title="Delete"
                                            onClick={() => handleDeletePatient(patient.patientId)}
                                        >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                            ))
                        ) : (
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
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Add New Patient</h3>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                        <form onSubmit={handleAddPatient}>
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
                                            <label htmlFor="phoneNumber">Phone Number</label>
                                            <input
                                                type="text"
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
                                    </div>
                                </div>
                                
                                <div className="form-section">
                                    <h4>Medical Information</h4>
                                    <div className="form-grid">
                                    <div className="form-group">
                                            <label htmlFor="bloodGroup">Blood Group</label>
                                        <select 
                                                id="bloodGroup"
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
                                        <div className="form-group">
                                            <label htmlFor="height">Height (cm)</label>
                                            <input
                                                type="number"
                                                id="height"
                                                name="height"
                                                value={formData.height}
                                                onChange={handleInputChange}
                                                min="0"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="weight">Weight (kg)</label>
                                            <input
                                                type="number"
                                                id="weight"
                                                name="weight"
                                                value={formData.weight}
                                                onChange={handleInputChange}
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="allergies">Allergies</label>
                                        <textarea
                                            id="allergies"
                                            name="allergies"
                                            value={formData.allergies}
                                            onChange={handleInputChange}
                                            rows="3"
                                        ></textarea>
                                    </div>
                                </div>
                                
                                <div className="form-section">
                                    <h4>Emergency Contact</h4>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="emergencyContactName">Contact Name</label>
                                            <input
                                                type="text"
                                                id="emergencyContactName"
                                                name="emergencyContactName"
                                                value={formData.emergencyContactName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="emergencyContactPhone">Contact Phone</label>
                                            <input
                                                type="text"
                                                id="emergencyContactPhone"
                                                name="emergencyContactPhone"
                                                value={formData.emergencyContactPhone}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="form-section">
                                    <h4>Insurance Information</h4>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="insuranceProvider">Insurance Provider</label>
                                            <input
                                                type="text"
                                                id="insuranceProvider"
                                                name="insuranceProvider"
                                                value={formData.insuranceProvider}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="insuranceId">Insurance ID</label>
                                            <input
                                                type="text"
                                                id="insuranceId"
                                                name="insuranceId"
                                                value={formData.insuranceId}
                                                onChange={handleInputChange}
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
                                    <button type="submit" className="submit-btn">
                                        Add Patient
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Edit Patient Modal */}
            {showEditModal && selectedPatient && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Edit Patient</h3>
                            <button className="close-btn" onClick={() => setShowEditModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleUpdatePatient}>
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
                                            <label htmlFor="phoneNumber">Phone Number</label>
                                            <input
                                                type="text"
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
                                    </div>
                                </div>
                                
                                <div className="form-section">
                                    <h4>Medical Information</h4>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="bloodGroup">Blood Group</label>
                                        <select 
                                                id="bloodGroup"
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
                                        <div className="form-group">
                                            <label htmlFor="height">Height (cm)</label>
                                            <input
                                                type="number"
                                                id="height"
                                                name="height"
                                                value={formData.height}
                                                onChange={handleInputChange}
                                                min="0"
                                            />
                                </div>
                                        <div className="form-group">
                                            <label htmlFor="weight">Weight (kg)</label>
                                            <input
                                                type="number"
                                                id="weight"
                                                name="weight"
                                                value={formData.weight}
                                                onChange={handleInputChange}
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="allergies">Allergies</label>
                                    <textarea 
                                            id="allergies"
                                            name="allergies"
                                            value={formData.allergies}
                                        onChange={handleInputChange} 
                                            rows="3"
                                    ></textarea>
                                </div>
                            </div>
                            
                            <div className="form-section">
                                    <h4>Emergency Contact</h4>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="emergencyContactName">Contact Name</label>
                                        <input 
                                            type="text" 
                                                id="emergencyContactName"
                                                name="emergencyContactName"
                                                value={formData.emergencyContactName}
                                            onChange={handleInputChange} 
                                        />
                                    </div>
                                        <div className="form-group">
                                            <label htmlFor="emergencyContactPhone">Contact Phone</label>
                                        <input 
                                            type="text" 
                                                id="emergencyContactPhone"
                                                name="emergencyContactPhone"
                                                value={formData.emergencyContactPhone}
                                            onChange={handleInputChange} 
                                        />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="form-section">
                                    <h4>Insurance Information</h4>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="insuranceProvider">Insurance Provider</label>
                                        <input 
                                            type="text" 
                                                id="insuranceProvider"
                                                name="insuranceProvider"
                                                value={formData.insuranceProvider}
                                            onChange={handleInputChange} 
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="insuranceId">Insurance ID</label>
                                            <input
                                                type="text"
                                                id="insuranceId"
                                                name="insuranceId"
                                                value={formData.insuranceId}
                                                onChange={handleInputChange}
                                            />
                                        </div>
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
                                    <button type="submit" className="submit-btn">
                                        Update Patient
                                </button>
                            </div>
                        </form>
                        </div>
                    </div>
                </div>
            )}
            
            {/* View Patient Modal */}
            {showViewModal && selectedPatient && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Patient Details</h3>
                            <button className="close-btn" onClick={() => setShowViewModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-sections">
                                <div className="profile-header">
                                    <div className="profile-avatar">
                                        <i className="fas fa-user fa-3x"></i>
                                    </div>
                                    <div className="profile-info">
                                        <h3>{selectedPatient.firstName} {selectedPatient.lastName}</h3>
                                        <p>Patient ID: {selectedPatient.patientId}</p>
                                        {selectedPatient.bloodGroup && (
                                            <span className="blood-group-badge">Blood Group: {selectedPatient.bloodGroup}</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="detail-section">
                                    <h4><i className="fas fa-id-card"></i> Basic Information</h4>
                                    <div className="details-grid">
                                        <div className="detail-item">
                                            <span className="detail-label">Email:</span>
                                            <span className="detail-value">{selectedPatient.email}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Phone:</span>
                                            <span className="detail-value">{selectedPatient.phoneNumber || 'N/A'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Address:</span>
                                            <span className="detail-value">{selectedPatient.address || 'N/A'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Date of Birth:</span>
                                            <span className="detail-value">{selectedPatient.dateOfBirth ? formatDate(selectedPatient.dateOfBirth) : 'N/A'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Gender:</span>
                                            <span className="detail-value">{selectedPatient.gender || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="detail-section">
                                    <h4><i className="fas fa-notes-medical"></i> Medical Information</h4>
                                    <div className="details-grid">
                                        <div className="detail-item">
                                            <span className="detail-label">Blood Group:</span>
                                            <span className="detail-value">{selectedPatient.bloodGroup || 'N/A'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Height:</span>
                                            <span className="detail-value">{selectedPatient.height ? `${selectedPatient.height} cm` : 'N/A'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Weight:</span>
                                            <span className="detail-value">{selectedPatient.weight ? `${selectedPatient.weight} kg` : 'N/A'}</span>
                                        </div>
                                        <div className="detail-item wide">
                                            <span className="detail-label">Allergies:</span>
                                            <span className="detail-value">{selectedPatient.allergies || 'None reported'}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="detail-section">
                                    <h4><i className="fas fa-phone-alt"></i> Emergency Contact</h4>
                                    <div className="details-grid">
                                        <div className="detail-item">
                                            <span className="detail-label">Name:</span>
                                            <span className="detail-value">{selectedPatient.emergencyContactName || 'N/A'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Phone:</span>
                                            <span className="detail-value">{selectedPatient.emergencyContactPhone || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="detail-section">
                                    <h4><i className="fas fa-file-medical"></i> Insurance Information</h4>
                                    <div className="details-grid">
                                        <div className="detail-item">
                                            <span className="detail-label">Provider:</span>
                                            <span className="detail-value">{selectedPatient.insuranceProvider || 'N/A'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Policy Number:</span>
                                            <span className="detail-value">{selectedPatient.insuranceId || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="modal-actions">
                                <button 
                                    className="cancel-btn"
                                    onClick={() => setShowViewModal(false)}
                                >
                                    Close
                                </button>
                                <button 
                                    className="edit-btn"
                                    onClick={() => {
                                        setShowViewModal(false);
                                        openEditModal(selectedPatient);
                                    }}
                                >
                                    <i className="fas fa-edit"></i> Edit Patient
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Placeholder components for other sections
const AppointmentManagement = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    
    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    
    // Form data for adding/editing appointments
    const [formData, setFormData] = useState({
        patientId: '',
        doctorId: '',
        appointmentDate: '',
        appointmentTime: '',
        status: 'SCHEDULED',
        reason: '',
        notes: '',
        appointmentFee: '',
        isPaid: false
    });
    
    // Selected appointment for view/edit/delete operations
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    
    // Filter states
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [dateFilter, setDateFilter] = useState('');

    // Add these new state variables within the AppointmentManagement component
    const [patientSearchTerm, setPatientSearchTerm] = useState('');
    const [doctorSearchTerm, setDoctorSearchTerm] = useState('');

    useEffect(() => {
        fetchAppointments();
        fetchDoctors();
        fetchPatients();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            let response;
            try {
                response = await axios.get('http://localhost:8080/api/appointments', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000 // 10 second timeout
                });
            } catch (err) {
                // Fall back to without /api prefix if needed
                response = await axios.get('http://localhost:8080/appointments', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                });
            }
            
            if (response.data) {
                setAppointments(response.data);
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching appointments:', err);
            setError('Failed to load appointments. Please try again later.');
            setLoading(false);
        }
    };

    const fetchDoctors = async () => {
        try {
            let response;
            try {
                response = await axios.get('http://localhost:8080/api/doctors');
            } catch (err) {
                response = await axios.get('http://localhost:8080/doctors');
            }
            
            if (response.data) {
                setDoctors(response.data);
            }
        } catch (err) {
            console.error('Error fetching doctors:', err);
        }
    };

    const fetchPatients = async () => {
        try {
            let response;
            try {
                // First try with /api prefix
                response = await axios.get('http://localhost:8080/api/patients', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000 // 10 second timeout
                });
            } catch (err) {
                // Fall back to without /api prefix if needed
                response = await axios.get('http://localhost:8080/patients', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                });
            }
            
            if (response.data) {
                setPatients(response.data);
            }
        } catch (err) {
            console.error('Error fetching patients:', err);
            // Don't set error state here to avoid UI disruption in payment management
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleOpenAddModal = () => {
        // Reset form data
        setFormData({
            patientId: '',
            doctorId: '',
            appointmentDate: '',
            appointmentTime: '',
            status: 'SCHEDULED',
            reason: '',
            notes: '',
            appointmentFee: '',
            isPaid: false
        });
        // Reset search terms
        setPatientSearchTerm('');
        setDoctorSearchTerm('');
        setShowAddModal(true);
    };

    const handleOpenEditModal = (appointment) => {
        setSelectedAppointment(appointment);
        
        // Parse dates properly
        let date = '';
        let time = '';
        
        try {
            if (appointment.appointmentDate) {
                date = appointment.appointmentDate;
            }
            
            if (appointment.startTime) {
                time = appointment.startTime;
            }
        } catch (error) {
            console.error("Date parsing error:", error);
        }
        
        setFormData({
            patientId: appointment.patientId || '',
            doctorId: appointment.doctorId || '',
            appointmentDate: date,
            appointmentTime: time,
            status: appointment.status || 'SCHEDULED',
            reason: appointment.reason || '',
            notes: appointment.notes || '',
            appointmentFee: appointment.appointmentFee ? appointment.appointmentFee.toString() : '',
            isPaid: appointment.isPaid || false
        });
        setShowEditModal(true);
    };

    const handleViewAppointment = (appointment) => {
        setSelectedAppointment(appointment);
        setShowViewModal(true);
    };

    const handleAddAppointment = async (e) => {
        e.preventDefault();
        try {
            const appointmentData = {
                patientId: formData.patientId,
                doctorId: formData.doctorId,
                appointmentDate: formData.appointmentDate,
                startTime: formData.appointmentTime,
                endTime: formData.appointmentTime, // For simplicity, setting end time same as start time
                status: formData.status,
                reason: formData.reason,
                notes: formData.notes,
                appointmentFee: formData.appointmentFee ? parseFloat(formData.appointmentFee) : null,
                isPaid: Boolean(formData.isPaid)
            };
            
            let response;
            try {
                response = await axios.post('http://localhost:8080/api/appointments', appointmentData);
            } catch (err) {
                response = await axios.post('http://localhost:8080/appointments', appointmentData);
            }
            
            if (response.status === 201 || response.status === 200) {
                alert('Appointment added successfully!');
                fetchAppointments();
                setShowAddModal(false);
            }
        } catch (err) {
            console.error('Error adding appointment:', err);
            alert('Failed to add appointment. Please try again.');
        }
    };

    const handleUpdateAppointment = async (e) => {
        e.preventDefault();
        if (!selectedAppointment) return;
        
        try {
            const appointmentData = {
                patientId: formData.patientId,
                doctorId: formData.doctorId,
                appointmentDate: formData.appointmentDate,
                startTime: formData.appointmentTime,
                endTime: formData.appointmentTime, // For simplicity, setting end time same as start time
                status: formData.status,
                reason: formData.reason,
                notes: formData.notes,
                appointmentFee: formData.appointmentFee ? parseFloat(formData.appointmentFee) : null,
                isPaid: Boolean(formData.isPaid)
            };
            
            let response;
            try {
                response = await axios.put(`http://localhost:8080/api/appointments/${selectedAppointment.appointmentId}`, appointmentData);
            } catch (err) {
                response = await axios.put(`http://localhost:8080/appointments/${selectedAppointment.appointmentId}`, appointmentData);
            }
            
            if (response.status === 200) {
                alert('Appointment updated successfully!');
                fetchAppointments();
                setShowEditModal(false);
            }
        } catch (err) {
            console.error('Error updating appointment:', err);
            alert('Failed to update appointment. Please try again.');
        }
    };

    const handleDeleteAppointment = async (id) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            try {
                let response;
                try {
                    response = await axios.delete(`http://localhost:8080/api/appointments/${id}`);
                } catch (err) {
                    response = await axios.delete(`http://localhost:8080/appointments/${id}`);
                }
                
                if (response.status === 200 || response.status === 204) {
                    alert('Appointment cancelled successfully!');
                    fetchAppointments();
                }
            } catch (err) {
                console.error('Error cancelling appointment:', err);
                alert('Failed to cancel appointment. Please try again.');
            }
        }
    };

    const formatDateTime = (dateTimeStr) => {
        if (!dateTimeStr) {
            return { date: 'Not set', time: 'Not set' };
        }
        try {
            const dateTime = new Date(dateTimeStr);
            if (isNaN(dateTime.getTime())) {
                return { date: 'Invalid Date', time: 'Invalid Time' };
            }
            return {
                date: dateTime.toLocaleDateString(),
                time: dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
        } catch (error) {
            console.error('Error formatting date/time:', error);
            return { date: 'Invalid Date', time: 'Invalid Time' };
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
            
            return true;
        });
    };
    
    // If data is still loading, show a loading spinner
    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading appointments...</p>
            </div>
        );
    }

    // Add these helper functions to filter patients and doctors
    const getFilteredPatients = () => {
        if (!patientSearchTerm) return patients;
        
        return patients.filter(patient => 
            patient.patientId.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
            `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(patientSearchTerm.toLowerCase())
        );
    };

    const getFilteredDoctors = () => {
        if (!doctorSearchTerm) return doctors;
        
        return doctors.filter(doctor => 
            doctor.doctorId.toLowerCase().includes(doctorSearchTerm.toLowerCase()) ||
            `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(doctorSearchTerm.toLowerCase())
        );
    };

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
                                <option value="COMPLETED">Completed</option>
                                <option value="PENDING">Pending</option>
                                <option value="REFUNDED">Refunded</option>
                                <option value="FAILED">Failed</option>
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
                    </div>
                </div>
                <button className="add-btn" onClick={handleOpenAddModal}>
                    <i className="fas fa-plus"></i>
                    New Appointment
                </button>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="table-responsive">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                            <th>Reason</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getFilteredAppointments().length > 0 ? (
                            getFilteredAppointments().map(appointment => {
                                let date = 'Not set';
                                let time = 'Not set';
                                
                                // Format date correctly if it exists
                                if (appointment.appointmentDate) {
                                    try {
                                        const dateObj = new Date(appointment.appointmentDate);
                                        if (!isNaN(dateObj.getTime())) {
                                            date = dateObj.toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            });
                                        } else {
                                            date = appointment.appointmentDate;
                                        }
                                    } catch (err) {
                                        date = appointment.appointmentDate;
                                    }
                                }
                                
                                // Format time correctly if it exists
                                if (appointment.startTime) {
                                    try {
                                        // If it's just a time string like "13:45"
                                        if (appointment.startTime.includes(':')) {
                                            time = appointment.startTime;
                                        } else {
                                            // If it's a full datetime string
                                            const timeObj = new Date(`2000-01-01T${appointment.startTime}`);
                                            if (!isNaN(timeObj.getTime())) {
                                                time = timeObj.toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                });
                                            } else {
                                                time = appointment.startTime;
                                            }
                                        }
                                    } catch (err) {
                                        time = appointment.startTime;
                                    }
                                }
                                
                                return (
                                    <tr key={appointment.appointmentId}>
                                        <td>{appointment.appointmentId}</td>
                                        <td>{appointment.patientName || 'Unknown Patient'}</td>
                                        <td>{appointment.doctorName || 'Unknown Doctor'}</td>
                                        <td>{date}</td>
                                        <td>{time}</td>
                                        <td>
                                            <span className={`status-badge ${getStatusClass(appointment.status)}`}>
                                                {appointment.status || 'Unknown'}
                                            </span>
                                        </td>
                                        <td>{appointment.reason || ''}</td>
                                        <td className="actions-cell">
                                            <button 
                                                className="action-btn view" 
                                                onClick={() => handleViewAppointment(appointment)}
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            <button 
                                                className="action-btn edit" 
                                                onClick={() => handleOpenEditModal(appointment)}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button 
                                                className="action-btn delete" 
                                                onClick={() => handleDeleteAppointment(appointment.appointmentId)}
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="8" className="no-data">No appointments found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Add Appointment Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Schedule New Appointment</h3>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleAddAppointment}>
                                <div className="form-section">
                                    <div className="form-group">
                                        <label htmlFor="patientSearch">Patient* (ID or Name)</label>
                                        <div className="searchable-dropdown">
                                            <div className="search-input-container">
                                                <input
                                                    type="text"
                                                    id="patientSearch"
                                                    placeholder="Search by patient ID or name..."
                                                    value={patientSearchTerm}
                                                    onChange={(e) => setPatientSearchTerm(e.target.value)}
                                                    className="search-input"
                                                />
                                                <i className="fas fa-search search-icon"></i>
                                            </div>
                                            <select
                                                id="patientId"
                                                name="patientId"
                                                value={formData.patientId}
                                                onChange={handleInputChange}
                                                required
                                                className="dropdown-select"
                                            >
                                                <option value="">Select Patient</option>
                                                {getFilteredPatients().map(patient => (
                                                    <option key={patient.patientId} value={patient.patientId}>
                                                        {patient.patientId} - {patient.firstName} {patient.lastName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="doctorSearch">Doctor* (ID or Name)</label>
                                        <div className="searchable-dropdown">
                                            <div className="search-input-container">
                                                <input
                                                    type="text"
                                                    id="doctorSearch"
                                                    placeholder="Search by doctor ID or name..."
                                                    value={doctorSearchTerm}
                                                    onChange={(e) => setDoctorSearchTerm(e.target.value)}
                                                    className="search-input"
                                                />
                                                <i className="fas fa-search search-icon"></i>
                                            </div>
                                            <select
                                                id="doctorId"
                                                name="doctorId"
                                                value={formData.doctorId}
                                                onChange={handleInputChange}
                                                required
                                                className="dropdown-select"
                                            >
                                                <option value="">Select Doctor</option>
                                                {getFilteredDoctors().map(doctor => (
                                                    <option key={doctor.doctorId} value={doctor.doctorId}>
                                                        {doctor.doctorId} - Dr. {doctor.firstName} {doctor.lastName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="appointmentDate">Date*</label>
                                            <input
                                                type="date"
                                                id="appointmentDate"
                                                name="appointmentDate"
                                                value={formData.appointmentDate}
                                                onChange={handleInputChange}
                                                required
                                                className="date-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="appointmentTime">Time*</label>
                                            <input
                                                type="time"
                                                id="appointmentTime"
                                                name="appointmentTime"
                                                value={formData.appointmentTime}
                                                onChange={handleInputChange}
                                                required
                                                className="time-input"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="status">Status*</label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            required
                                            className="status-select"
                                        >
                                            <option value="SCHEDULED">Scheduled</option>
                                            <option value="COMPLETED">Completed</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="CANCELLED">Cancelled</option>
                                            <option value="NO_SHOW">No Show</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="reason">Reason*</label>
                                        <input 
                                            type="text" 
                                            id="reason"
                                            name="reason"
                                            value={formData.reason}
                                            onChange={handleInputChange} 
                                            required
                                            className="text-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="notes">Notes</label>
                                        <textarea
                                            id="notes"
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                            rows="3"
                                            className="textarea-input"
                                        ></textarea>
                                </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="appointmentFee">Fee ($)</label>
                                            <input
                                                type="number"
                                                id="appointmentFee"
                                                name="appointmentFee"
                                                value={formData.appointmentFee || ''}
                                                onChange={handleInputChange}
                                                min="0"
                                                step="0.01"
                                                className="number-input"
                                            />
                                        </div>
                                        <div className="form-group checkbox-group">
                                            <label className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    name="isPaid"
                                                    checked={formData.isPaid || false}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        isPaid: e.target.checked
                                                    })}
                                                    className="checkbox-input"
                                                />
                                                <span>Paid</span>
                                            </label>
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
                                    <button type="submit" className="submit-btn">
                                        Schedule Appointment
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Edit Appointment Modal */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Edit Appointment</h3>
                            <button className="close-btn" onClick={() => setShowEditModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleUpdateAppointment}>
                                <div className="form-section">
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
                                    <div className="form-group">
                                        <label htmlFor="doctorId">Doctor*</label>
                                        <select
                                            id="doctorId"
                                            name="doctorId"
                                            value={formData.doctorId}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Doctor</option>
                                            {doctors.map(doctor => (
                                                <option key={doctor.doctorId} value={doctor.doctorId}>
                                                    Dr. {doctor.firstName} {doctor.lastName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="appointmentDate">Date*</label>
                                        <input
                                            type="date"
                                            id="appointmentDate"
                                            name="appointmentDate"
                                            value={formData.appointmentDate}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="appointmentTime">Time*</label>
                                        <input
                                            type="time"
                                            id="appointmentTime"
                                            name="appointmentTime"
                                            value={formData.appointmentTime}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="status">Status*</label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="COMPLETED">Completed</option>
                                            <option value="PENDING">Pending</option>
                                            <option value="REFUNDED">Refunded</option>
                                            <option value="FAILED">Failed</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="reason">Reason*</label>
                                        <input
                                            type="text"
                                            id="reason"
                                            name="reason"
                                            value={formData.reason}
                                            onChange={handleInputChange}
                                            required
                                        />
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
                                <div className="form-actions">
                                    <button 
                                        type="button" 
                                        className="cancel-btn"
                                        onClick={() => setShowEditModal(false)}
                                    >
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
            
            {/* View Appointment Modal */}
            {showViewModal && selectedAppointment && (
                <div className="modal-overlay">
                    <div className="modal-container view-appointment-modal">
                        <div className="modal-header">
                            <h3>Appointment Details</h3>
                            <button className="close-btn" onClick={() => setShowViewModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="appointment-details">
                                <div className="appointment-id-section">
                                    <span className="appointment-id">Appointment ID: {selectedAppointment.appointmentId}</span>
                                    <span className={`status-badge large ${getStatusClass(selectedAppointment.status)}`}>
                                        {selectedAppointment.status || 'Not set'}
                                    </span>
                                </div>

                                <div className="detail-section">
                                    <h4 className="section-title"><i className="fas fa-calendar-alt"></i> Appointment Information</h4>
                                    <div className="detail-content">
                                        <div className="detail-row">
                                            <span className="detail-label">Date:</span>
                                            <span className="detail-value">
                                                {formatDateTime(selectedAppointment.appointmentDate).date || 'Not set'}
                                            </span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Time:</span>
                                            <span className="detail-value">
                                                {formatDateTime(selectedAppointment.startTime).time || 'Not set'}
                                            </span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Reason:</span>
                                            <span className="detail-value">{selectedAppointment.reason || 'N/A'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Notes:</span>
                                            <span className="detail-value">{selectedAppointment.notes || 'N/A'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Fee:</span>
                                            <span className="detail-value">{selectedAppointment.appointmentFee ? `$${selectedAppointment.appointmentFee}` : 'Not set'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Payment Status:</span>
                                            <span className="detail-value">
                                                <span className={`payment-badge ${selectedAppointment.isPaid ? 'paid' : 'unpaid'}`}>
                                                    {selectedAppointment.isPaid ? 'Paid' : 'Unpaid'}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="detail-section">
                                    <h4 className="section-title"><i className="fas fa-user-injured"></i> Patient Information</h4>
                                    <div className="detail-content">
                                        <div className="detail-row">
                                            <span className="detail-label">Patient ID:</span>
                                            <span className="detail-value">{selectedAppointment.patientId || 'N/A'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Name:</span>
                                            <span className="detail-value">{selectedAppointment.patientName || 'N/A'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Email:</span>
                                            <span className="detail-value">{selectedAppointment.patientEmail || 'N/A'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Phone:</span>
                                            <span className="detail-value">{selectedAppointment.patientPhone || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="detail-section">
                                    <h4 className="section-title"><i className="fas fa-user-md"></i> Doctor Information</h4>
                                    <div className="detail-content">
                                        <div className="detail-row">
                                            <span className="detail-label">Doctor ID:</span>
                                            <span className="detail-value">{selectedAppointment.doctorId || 'N/A'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Name:</span>
                                            <span className="detail-value">{selectedAppointment.doctorName || 'N/A'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Specialization:</span>
                                            <span className="detail-value">{selectedAppointment.doctorSpecialization || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button 
                                    className="edit-appointment-btn"
                                    onClick={() => {
                                        setShowViewModal(false);
                                        handleOpenEditModal(selectedAppointment);
                                    }}
                                >
                                    <i className="fas fa-edit"></i> Edit Appointment
                                </button>
                                <button 
                                    className="close-button"
                                    onClick={() => setShowViewModal(false)}
                                >
                                    <i className="fas fa-times"></i> Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const PaymentManagement = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    
    // Form data for adding/editing payments
    const [formData, setFormData] = useState({
        appointmentId: '',
        amount: '',
        paymentDate: '',
        paymentMethod: 'CASH',
        status: 'COMPLETED',
        type: 'CONSULTATION', // Add payment type
        notes: ''
    });
    
    // Filter states
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [dateFilter, setDateFilter] = useState('');
    
    // Add appointment search state
    const [appointmentSearchTerm, setAppointmentSearchTerm] = useState('');
    
    useEffect(() => {
        fetchPayments();
        fetchPatients();
        fetchAppointments();
    }, []);
    
    const fetchPayments = async () => {
        setLoading(true);
        try {
            let response;
            try {
                // First try with /api prefix
                response = await axios.get('http://localhost:8080/api/payments', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000 // 10 second timeout
                });
            } catch (err) {
                // Fall back to without /api prefix if needed
                response = await axios.get('http://localhost:8080/payments', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                });
            }
            
            if (response.data) {
                // Process the payments to ensure dates are properly formatted
                const processedPayments = response.data.map(payment => {
                    // For Dec 13, 2005 format as in the screenshot
                    if (payment.paymentDate && payment.paymentDate.includes("urkee")) {
                        // This is likely a string like "Dec 13, 2005 - urkee"
                        return {
                            ...payment,
                            // Keep the original format for display
                            displayDate: payment.paymentDate
                        };
                    }
                    return payment;
                });
                
                setPayments(processedPayments);
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching payments:', err);
            setError('Failed to load payments. Please try again later.');
            setLoading(false);
        }
    };
    
    const fetchPatients = async () => {
        try {
            let response;
            try {
                // First try with /api prefix
                response = await axios.get('http://localhost:8080/api/patients', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000 // 10 second timeout
                });
            } catch (err) {
                // Fall back to without /api prefix if needed
                response = await axios.get('http://localhost:8080/patients', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                });
            }
            
            if (response.data) {
                setPatients(response.data);
            }
        } catch (err) {
            console.error('Error fetching patients:', err);
            // Don't set error state here to avoid UI disruption in payment management
        }
    };
    
    const fetchAppointments = async () => {
        try {
            let response;
            try {
                // First try with /api prefix
                response = await axios.get('http://localhost:8080/api/appointments', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000 // 10 second timeout
                });
            } catch (err) {
                // Fall back to without /api prefix if needed
                response = await axios.get('http://localhost:8080/appointments', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                });
            }
            
            if (response.data) {
                setAppointments(response.data);
            }
        } catch (err) {
            console.error('Error fetching appointments:', err);
        }
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    const openAddModal = () => {
        setFormData({
            appointmentId: '',
            amount: '',
            paymentDate: new Date().toISOString().split('T')[0],
            paymentMethod: 'CASH',
            status: 'COMPLETED',
            type: 'CONSULTATION', // Add payment type
            notes: ''
        });
        setShowAddModal(true);
    };
    
    const openEditModal = (payment) => {
        setSelectedPayment(payment);
        
        // Safely format date with validation
        let formattedDate = '';
        if (payment.paymentDate) {
            const dateObj = new Date(payment.paymentDate);
            // Check if the date is valid before using toISOString
            formattedDate = !isNaN(dateObj.getTime()) ? dateObj.toISOString().split('T')[0] : '';
        }
        
        setFormData({
            appointmentId: payment.appointmentId || '',
            amount: payment.amount ? payment.amount.toString() : '',
            paymentDate: formattedDate,
            paymentMethod: payment.paymentMethod || 'CASH',
            status: payment.status || 'COMPLETED',
            type: payment.type || 'CONSULTATION', // Add payment type
            notes: payment.notes || ''
        });
        setShowEditModal(true);
    };
    
    const openViewModal = (payment) => {
        setSelectedPayment(payment);
        setShowViewModal(true);
    };
    
    const handleAddPayment = async (e) => {
        e.preventDefault();
        
        // Get the selected appointment
        const selectedAppointment = appointments.find(a => a.appointmentId.toString() === formData.appointmentId.toString());
        if (!selectedAppointment) {
            alert('Please select a valid appointment');
            return;
        }
        
        try {
            const paymentData = {
                patientId: selectedAppointment.patientId,  // Get patientId from the selected appointment
                appointmentId: formData.appointmentId,
                amount: parseFloat(formData.amount),
                paymentDate: formData.paymentDate ? `${formData.paymentDate}T00:00:00` : null, // Add time component
                paymentMethod: formData.paymentMethod,
                status: formData.status,
                type: formData.type || 'CONSULTATION', // Add payment type
                notes: formData.notes
            };
            
            let response;
            try {
                response = await axios.post('http://localhost:8080/api/payments', paymentData, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
            } catch (err) {
                response = await axios.post('http://localhost:8080/payments', paymentData, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
            }
            
            if (response.status === 201 || response.status === 200) {
                alert('Payment added successfully!');
                fetchPayments();
                setShowAddModal(false);
            }
        } catch (err) {
            console.error('Error adding payment:', err);
            alert('Failed to add payment: ' + (err.response?.data?.message || err.message || 'Please try again.'));
        }
    };
    
    const handleUpdatePayment = async (e) => {
        e.preventDefault();
        if (!selectedPayment) return;
        
        // Get the selected appointment
        const selectedAppointment = appointments.find(a => a.appointmentId.toString() === formData.appointmentId.toString());
        if (!selectedAppointment) {
            alert('Please select a valid appointment');
            return;
        }
        
        try {
            // Safely format the payment date
            let formattedPaymentDate = null;
            if (formData.paymentDate) {
                formattedPaymentDate = `${formData.paymentDate}T00:00:00`;
            }
            
            const paymentData = {
                patientId: selectedAppointment.patientId,  // Get patientId from the selected appointment
                appointmentId: formData.appointmentId,
                amount: parseFloat(formData.amount),
                paymentDate: formattedPaymentDate, // Use safely formatted date
                paymentMethod: formData.paymentMethod,
                status: formData.status,
                type: formData.type || 'CONSULTATION', // Add payment type 
                notes: formData.notes
            };
            
            let response;
            try {
                response = await axios.put(`http://localhost:8080/api/payments/${selectedPayment.paymentId}`, paymentData, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
            } catch (err) {
                response = await axios.put(`http://localhost:8080/payments/${selectedPayment.paymentId}`, paymentData, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
            }
            
            if (response.status === 200) {
                alert('Payment updated successfully!');
                fetchPayments();
                setShowEditModal(false);
            }
        } catch (err) {
            console.error('Error updating payment:', err);
            alert('Failed to update payment: ' + (err.response?.data?.message || err.message || 'Please try again.'));
        }
    };
    
    const handleDeletePayment = async (paymentId) => {
        if (window.confirm('Are you sure you want to delete this payment?')) {
            try {
                let response;
                try {
                    response = await axios.delete(`http://localhost:8080/api/payments/${paymentId}`, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    });
                } catch (err) {
                    response = await axios.delete(`http://localhost:8080/payments/${paymentId}`, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    });
                }
                
                if (response.status === 200 || response.status === 204) {
                    alert('Payment deleted successfully!');
                    fetchPayments();
                }
            } catch (err) {
                console.error('Error deleting payment:', err);
                alert('Failed to delete payment: ' + (err.response?.data?.message || err.message || 'Please try again.'));
            }
        }
    };
    
    const formatDateTime = (dateTimeStr) => {
        // If it's null or undefined
        if (!dateTimeStr) {
            return { date: 'N/A', time: 'N/A' };
        }
        
        try {
            // Try to parse the date
            const date = new Date(dateTimeStr);
            
            // Check if the date is valid
            if (isNaN(date.getTime())) {
                return { date: 'N/A', time: 'N/A' };
            }
            
            // Format the date and time
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            const formattedTime = date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            return { date: formattedDate, time: formattedTime };
        } catch (error) {
            console.error("Error formatting date/time:", error);
            return { date: 'N/A', time: 'N/A' };
        }
    };
    
    const getStatusClass = (status) => {
        switch (status) {
            case 'COMPLETED':
                return 'status-badge payment-badge paid';
            case 'PENDING':
                return 'status-badge payment-badge status-scheduled';
            case 'REFUNDED':
                return 'status-badge payment-badge status-cancelled';
            case 'FAILED':
                return 'status-badge payment-badge status-no-show';
            case 'CANCELLED':
                return 'status-badge payment-badge status-cancelled';
            default:
                return 'status-badge';
        }
    };
    
    const getPatientName = (patientId) => {
        const patient = patients.find(p => p.patientId === patientId);
        return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
    };
    
    const getAppointmentDetails = (appointmentId) => {
        const appointment = appointments.find(a => a.appointmentId === appointmentId);
        if (!appointment) return 'N/A';
        
        let dateStr = 'N/A';
        if (appointment.appointmentDate) {
            try {
                const date = new Date(appointment.appointmentDate);
                // Check if date is valid
                if (!isNaN(date.getTime())) {
                    dateStr = date.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                    });
                }
            } catch (error) {
                console.error("Error formatting appointment date:", error);
            }
        }
            
        return `${dateStr} - ${appointment.reason || 'No reason provided'}`;
    };
    
    const getFilteredPayments = () => {
        let filtered = [...payments];
        
        // Filter by status
        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(payment => payment.status === statusFilter);
        }
        
        // Filter by date
        if (dateFilter) {
            filtered = filtered.filter(payment => {
                if (!payment.paymentDate) return false;
                return payment.paymentDate.includes(dateFilter);
            });
        }
        
        return filtered;
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
                                <option value="COMPLETED">Completed</option>
                                <option value="PENDING">Pending</option>
                                <option value="REFUNDED">Refunded</option>
                                <option value="FAILED">Failed</option>
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
                    </div>
                </div>
                <button className="add-btn" onClick={openAddModal}>
                    <i className="fas fa-plus"></i>
                    New Payment
                </button>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="table-responsive">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Patient</th>
                            <th>Appointment</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Method</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getFilteredPayments().length > 0 ? (
                            getFilteredPayments().map(payment => (
                                <tr key={payment.paymentId}>
                                    <td>{payment.paymentId}</td>
                                    <td>{getPatientName(payment.patientId)}</td>
                                    <td>{getAppointmentDetails(payment.appointmentId)}</td>
                                    <td>${payment.amount?.toFixed(2) || '0.00'}</td>
                                    <td>{formatDateTime(payment.paymentDate).date}</td>
                                    <td>{payment.paymentMethod}</td>
                                    <td>
                                        <span className={getStatusClass(payment.status)}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="actions-cell">
                                        <button 
                                            className="action-btn view-btn" 
                                            title="View"
                                            onClick={() => openViewModal(payment)}
                                        >
                                            <i className="fas fa-eye"></i>
                                        </button>
                                        <button 
                                            className="action-btn edit-btn" 
                                            title="Edit"
                                            onClick={() => openEditModal(payment)}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button 
                                            className="action-btn delete-btn" 
                                            title="Delete"
                                            onClick={() => handleDeletePayment(payment.paymentId)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="no-data">No payments found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Add Payment Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Add New Payment</h3>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleAddPayment}>
                                <div className="form-section">
                                    <h4>Payment Details</h4>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="appointmentSearch">Appointment* (ID, Patient, or Reason)</label>
                                            <div className="searchable-dropdown">
                                                <div className="search-input-container">
                                                    <input
                                                        type="text"
                                                        id="appointmentSearch"
                                                        placeholder="Search by ID, patient, or reason..."
                                                        value={appointmentSearchTerm}
                                                        onChange={(e) => setAppointmentSearchTerm(e.target.value)}
                                                        className="search-input"
                                                    />
                                                    <i className="fas fa-search search-icon"></i>
                                                </div>
                                                <select
                                                    id="appointmentId"
                                                    name="appointmentId"
                                                    value={formData.appointmentId}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="dropdown-select"
                                                >
                                                    <option value="">Select Appointment</option>
                                                    {appointments.map(appointment => (
                                                        <option key={appointment.appointmentId} value={appointment.appointmentId}>
                                                            {appointment.appointmentId} - {appointment.patientName || 'Unknown'} - {new Date(appointment.appointmentDate).toLocaleDateString()} - {appointment.reason || 'No reason'}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Amount ($)</label>
                                            <input 
                                                type="number" 
                                                name="amount" 
                                                value={formData.amount} 
                                                onChange={handleInputChange}
                                                min="0.01" 
                                                step="0.01" 
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Payment Date</label>
                                            <input 
                                                type="date" 
                                                name="paymentDate" 
                                                value={formData.paymentDate} 
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Payment Method</label>
                                            <select 
                                                name="paymentMethod" 
                                                value={formData.paymentMethod} 
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="CASH">Cash</option>
                                                <option value="CREDIT_CARD">Credit Card</option>
                                                <option value="DEBIT_CARD">Debit Card</option>
                                                <option value="INSURANCE">Insurance</option>
                                                <option value="BANK_TRANSFER">Bank Transfer</option>
                                                <option value="OTHER">Other</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Payment Status</label>
                                            <select 
                                                name="status" 
                                                value={formData.status} 
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="COMPLETED">Completed</option>
                                                <option value="PENDING">Pending</option>
                                                <option value="REFUNDED">Refunded</option>
                                                <option value="FAILED">Failed</option>
                                                <option value="CANCELLED">Cancelled</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Payment Type</label>
                                            <select 
                                                name="type" 
                                                value={formData.type} 
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="CONSULTATION">Consultation</option>
                                                <option value="PROCEDURE">Procedure</option>
                                                <option value="MEDICATION">Medication</option>
                                                <option value="LABORATORY">Laboratory</option>
                                                <option value="IMAGING">Imaging</option>
                                                <option value="OTHER">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Notes</label>
                                        <textarea 
                                            name="notes" 
                                            value={formData.notes} 
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
                                    <button type="submit" className="submit-btn">
                                        Add Payment
                                </button>
                            </div>
                        </form>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Edit Payment Modal */}
            {showEditModal && selectedPayment && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Edit Payment</h3>
                            <button className="close-btn" onClick={() => setShowEditModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleUpdatePayment}>
                                <div className="form-section">
                                    <h4>Payment Details</h4>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="appointmentSearch">Appointment* (ID, Patient, or Reason)</label>
                                            <div className="searchable-dropdown">
                                                <div className="search-input-container">
                                                    <input
                                                        type="text"
                                                        id="appointmentSearch"
                                                        placeholder="Search by ID, patient, or reason..."
                                                        value={appointmentSearchTerm}
                                                        onChange={(e) => setAppointmentSearchTerm(e.target.value)}
                                                        className="search-input"
                                                    />
                                                    <i className="fas fa-search search-icon"></i>
                                                </div>
                                                <select
                                                    id="appointmentId"
                                                    name="appointmentId"
                                                    value={formData.appointmentId}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="dropdown-select"
                                                >
                                                    <option value="">Select Appointment</option>
                                                    {appointments.map(appointment => (
                                                        <option key={appointment.appointmentId} value={appointment.appointmentId}>
                                                            {appointment.appointmentId} - {appointment.patientName || 'Unknown'} - {new Date(appointment.appointmentDate).toLocaleDateString()} - {appointment.reason || 'No reason'}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label>Amount ($)</label>
                                            <input 
                                                type="number" 
                                                name="amount" 
                                                value={formData.amount} 
                                                onChange={handleInputChange}
                                                min="0.01" 
                                                step="0.01" 
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Payment Date</label>
                                            <input 
                                                type="date" 
                                                name="paymentDate" 
                                                value={formData.paymentDate} 
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Payment Method</label>
                                            <select 
                                                name="paymentMethod" 
                                                value={formData.paymentMethod} 
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="CASH">Cash</option>
                                                <option value="CREDIT_CARD">Credit Card</option>
                                                <option value="DEBIT_CARD">Debit Card</option>
                                                <option value="INSURANCE">Insurance</option>
                                                <option value="BANK_TRANSFER">Bank Transfer</option>
                                                <option value="OTHER">Other</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Payment Status</label>
                                            <select 
                                                name="status" 
                                                value={formData.status} 
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="COMPLETED">Completed</option>
                                                <option value="PENDING">Pending</option>
                                                <option value="REFUNDED">Refunded</option>
                                                <option value="FAILED">Failed</option>
                                                <option value="CANCELLED">Cancelled</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Payment Type</label>
                                            <select 
                                                name="type" 
                                                value={formData.type} 
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="CONSULTATION">Consultation</option>
                                                <option value="PROCEDURE">Procedure</option>
                                                <option value="MEDICATION">Medication</option>
                                                <option value="LABORATORY">Laboratory</option>
                                                <option value="IMAGING">Imaging</option>
                                                <option value="OTHER">Other</option>
                                            </select>
                                        </div>
                                        </div>
                                        <div className="form-group">
                                        <label>Notes</label>
                                        <textarea 
                                            name="notes" 
                                            value={formData.notes} 
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
                                    <button type="submit" className="submit-btn">
                                        Update Payment
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            
            {/* View Payment Modal */}
            {showViewModal && selectedPayment && (
                <div className="modal-overlay">
                    <div className="modal-container view-appointment-modal">
                        <div className="modal-header">
                            <h3>Payment Details</h3>
                            <button className="close-btn" onClick={() => setShowViewModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="appointment-id-section">
                                <span className="appointment-id">Payment ID: {selectedPayment.paymentId}</span>
                                <span className={getStatusClass(selectedPayment.status) + " large"}>
                                    {selectedPayment.status}
                                </span>
                            </div>
                            
                            <div className="detail-section">
                                <h4 className="section-title">
                                    <i className="fas fa-money-bill-wave"></i> Payment Information
                                </h4>
                                <div className="detail-content">
                                    <div className="detail-row">
                                        <span className="detail-label">Amount:</span>
                                        <span className="detail-value">
                                            ${selectedPayment.amount?.toFixed(2) || '0.00'}
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Payment Date:</span>
                                        <span className="detail-value">
                                            {formatDateTime(selectedPayment.paymentDate).date || 'Not set'}
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Payment Method:</span>
                                        <span className="detail-value">
                                            {selectedPayment.paymentMethod || 'Not specified'}
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Payment Type:</span>
                                        <span className="detail-value">
                                            {selectedPayment.type || 'Consultation'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="detail-section">
                                <h4 className="section-title">
                                    <i className="fas fa-user"></i> Patient Information
                                </h4>
                                <div className="detail-content">
                                    <div className="detail-row">
                                        <span className="detail-label">Patient:</span>
                                        <span className="detail-value">
                                            {getPatientName(selectedPayment.patientId)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="detail-section">
                                <h4 className="section-title">
                                    <i className="fas fa-calendar-check"></i> Appointment Information
                                </h4>
                                <div className="detail-content">
                                    <div className="detail-row">
                                        <span className="detail-label">Appointment:</span>
                                        <span className="detail-value">
                                            {getAppointmentDetails(selectedPayment.appointmentId)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {selectedPayment.notes && (
                                <div className="detail-section">
                                    <h4 className="section-title">
                                        <i className="fas fa-sticky-note"></i> Notes
                                    </h4>
                                    <div className="detail-content">
                                        <div className="detail-row">
                                            <span className="detail-value">
                                                {selectedPayment.notes}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="modal-actions">
                                <button 
                                    className="close-button"
                                    onClick={() => setShowViewModal(false)}
                                >
                                    <i className="fas fa-times"></i> Close
                                </button>
                                <button 
                                    className="edit-appointment-btn"
                                    onClick={() => {
                                        setShowViewModal(false);
                                        openEditModal(selectedPayment);
                                    }}
                                >
                                    <i className="fas fa-edit"></i> Edit Payment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const DepartmentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        headDoctorId: ''
    });
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        fetchDepartments();
        fetchDoctors();
    }, []);

    // Fetch all departments
    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/api/departments');
            if (response.data) {
                setDepartments(response.data);
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching departments:', err);
            setError('Failed to load departments. Please try again later.');
            setLoading(false);
        }
    };

    // Fetch doctors for head doctor selection
    const fetchDoctors = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/doctors');
            if (response.data) {
                setDoctors(response.data);
            }
        } catch (err) {
            console.error('Error fetching doctors:', err);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Open add department modal
    const openAddModal = () => {
        setFormData({
            name: '',
            description: '',
            headDoctorId: ''
        });
        setShowAddModal(true);
    };

    // Open edit department modal
    const openEditModal = (department) => {
        setFormData({
            name: department.name,
            description: department.description,
            headDoctorId: department.headDoctorId || ''
        });
        setShowEditModal(true);
    };

    // Handle add department form submission
    const handleAddDepartment = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/departments', formData);
            
            if (response.status === 201 || response.status === 200) {
                fetchDepartments();
                setShowAddModal(false);
                alert('Department added successfully!');
            }
        } catch (err) {
            console.error('Error adding department:', err);
            alert(err.response?.data || 'Failed to add department. Please try again.');
        }
    };

    // Handle edit department form submission
    const handleUpdateDepartment = async (e, departmentId) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8080/api/departments/${departmentId}`, formData);
            
            if (response.status === 200) {
                fetchDepartments();
                setShowEditModal(false);
                alert('Department updated successfully!');
            }
        } catch (err) {
            console.error('Error updating department:', err);
            alert(err.response?.data || 'Failed to update department. Please try again.');
        }
    };

    // Handle delete department
    const handleDeleteDepartment = async (departmentId) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            try {
                const response = await axios.delete(`http://localhost:8080/api/departments/${departmentId}`);
                
                if (response.status === 200 || response.status === 204) {
                    fetchDepartments();
                    alert('Department deleted successfully!');
                }
            } catch (err) {
                console.error('Error deleting department:', err);
                alert(err.response?.data || 'Failed to delete department. Please try again.');
            }
        }
    };

    // Get doctor name by ID
    const getDoctorName = (doctorId) => {
        if (!doctorId) return 'None';
        const doctor = doctors.find(doc => doc.doctorId === doctorId);
        return doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Unknown';
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading departments...</p>
            </div>
        );
    }

    return (
        <div className="management-section">
            <div className="management-header">
                <h2>Department Management</h2>
                <button className="add-btn" onClick={openAddModal}>
                    <i className="fas fa-plus"></i> Add New Department
                </button>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="management-content">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Head Doctor</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.length > 0 ? (
                            departments.map(department => (
                                <tr key={department.departmentId}>
                                    <td>{department.departmentId}</td>
                                    <td>{department.name}</td>
                                    <td>{department.description}</td>
                                    <td>{getDoctorName(department.headDoctorId)}</td>
                                    <td className="actions-cell">
                                        <button 
                                            className="action-btn edit-btn" 
                                            title="Edit"
                                            onClick={() => openEditModal(department)}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button 
                                            className="action-btn delete-btn" 
                                            title="Delete"
                                            onClick={() => handleDeleteDepartment(department.departmentId)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="no-data">No departments found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Add Department Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Add New Department</h3>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleAddDepartment}>
                                <div className="form-section">
                                    <h4>Department Information</h4>
                                    <div className="form-group">
                                        <label htmlFor="name">Department Name*</label>
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
                                        <label htmlFor="description">Description*</label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            required
                                            rows="4"
                                        ></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="headDoctorId">Head Doctor</label>
                                            <select 
                                            id="headDoctorId"
                                            name="headDoctorId"
                                            value={formData.headDoctorId}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">None</option>
                                            {doctors.map(doctor => (
                                                <option key={doctor.doctorId} value={doctor.doctorId}>
                                                    Dr. {doctor.firstName} {doctor.lastName}
                                                </option>
                                            ))}
                                        </select>
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
                                    <button type="submit" className="submit-btn">
                                        Add Department
                                </button>
                            </div>
                        </form>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Edit Department Modal */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Edit Department</h3>
                            <button className="close-btn" onClick={() => setShowEditModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={(e) => handleUpdateDepartment(e, departments.find(d => d.name === formData.name)?.departmentId)}>
                                <div className="form-section">
                                    <h4>Department Information</h4>
                                    <div className="form-group">
                                        <label htmlFor="name">Department Name*</label>
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
                                        <label htmlFor="description">Description*</label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            required
                                            rows="4"
                                        ></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="headDoctorId">Head Doctor</label>
                                        <select
                                            id="headDoctorId"
                                            name="headDoctorId"
                                            value={formData.headDoctorId}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">None</option>
                                            {doctors.map(doctor => (
                                                <option key={doctor.doctorId} value={doctor.doctorId}>
                                                    Dr. {doctor.firstName} {doctor.lastName}
                                                </option>
                                            ))}
                                        </select>
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
                                    <button type="submit" className="submit-btn">
                                        Update Department
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
const MedicalRecordManagement = () => {
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    
    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    
    // Filter states
    const [patientFilter, setPatientFilter] = useState('');
    const [recordTypeFilter, setRecordTypeFilter] = useState('ALL');
    const [dateFilter, setDateFilter] = useState('');
    
    // Form data
    const [formData, setFormData] = useState({
        patientId: '',
        doctorId: '',
        appointmentId: '',
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
        fetchMedicalRecords();
        fetchPatients();
        fetchDoctors();
        fetchAppointments();
    }, []);
    
    const fetchMedicalRecords = async () => {
        setIsLoading(true);
        setError('');
        try {
            let response;
            try {
                response = await axios.get('http://localhost:8080/api/medical-records', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000 // 10 second timeout
                });
            } catch (err) {
                // Try without /api prefix if first attempt fails
                response = await axios.get('http://localhost:8080/medical-records', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                });
            }
            
            console.log('Medical records data received:', response.data);
            setMedicalRecords(response.data || []);
            setError('');
        } catch (err) {
            console.error('Error fetching medical records:', err);
            const errorMessage = err.response?.data?.message || 
                                err.message || 
                                'Failed to load medical records. Please try again later.';
            setError(`Error: ${errorMessage}`);
            setMedicalRecords([]); // Set empty array instead of undefined
        } finally {
            setIsLoading(false);
        }
    };
    
    const fetchPatients = async () => {
        try {
            let response;
            try {
                response = await axios.get('http://localhost:8080/api/patients');
            } catch (err) {
                response = await axios.get('http://localhost:8080/patients');
            }
            
            if (response.data) {
                setPatients(response.data);
            }
        } catch (err) {
            console.error('Error fetching patients:', err);
        }
    };
    
    const fetchDoctors = async () => {
        try {
            let response;
            try {
                response = await axios.get('http://localhost:8080/api/doctors');
            } catch (err) {
                response = await axios.get('http://localhost:8080/doctors');
            }
            
            if (response.data) {
                setDoctors(response.data);
            }
        } catch (err) {
            console.error('Error fetching doctors:', err);
        }
    };
    
    const fetchAppointments = async () => {
        try {
            let response;
            try {
                response = await axios.get('http://localhost:8080/api/appointments');
            } catch (err) {
                response = await axios.get('http://localhost:8080/appointments');
            }
            
            if (response.data) {
                setAppointments(response.data);
            }
        } catch (err) {
            console.error('Error fetching appointments:', err);
        }
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    const openAddModal = () => {
        setFormData({
            patientId: '',
            doctorId: '',
            appointmentId: '',
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
        
        let recordDate = '';
        let nextAppointment = '';
        
        try {
            if (record.recordDate) {
                const recordDateObj = new Date(record.recordDate);
                if (!isNaN(recordDateObj.getTime())) {
                    recordDate = recordDateObj.toISOString().split('T')[0];
                }
            }
            
            if (record.nextAppointment) {
                const nextAppointmentObj = new Date(record.nextAppointment);
                if (!isNaN(nextAppointmentObj.getTime())) {
                    nextAppointment = nextAppointmentObj.toISOString().split('T')[0];
                }
            }
        } catch (error) {
            console.error("Date parsing error:", error);
        }
        
        setFormData({
            patientId: record.patientId || '',
            doctorId: record.doctorId || '',
            appointmentId: record.appointmentId || '',
            recordType: record.recordType || 'GENERAL_CHECKUP',
            diagnosis: record.diagnosis || '',
            symptoms: record.symptoms || '',
            treatment: record.treatment || '',
            notes: record.notes || '',
            prescription: record.prescription || '',
            testResults: record.testResults || '',
            medicalHistory: record.medicalHistory || '',
            recordDate: recordDate,
            nextAppointment: nextAppointment
        });
        setShowEditModal(true);
    };
    
    const openViewModal = (record) => {
        setSelectedRecord(record);
        setShowViewModal(true);
    };
    
    const handleAddRecord = async (e) => {
        e.preventDefault();
        // Format dates to include time component for LocalDateTime
        const formattedData = {
            ...formData,
            recordDate: formData.recordDate ? `${formData.recordDate}T00:00:00` : null,
            nextAppointment: formData.nextAppointment ? `${formData.nextAppointment}T00:00:00` : null
        };
        
        try {
            let response;
            try {
                response = await axios.post('http://localhost:8080/api/medical-records', formattedData);
            } catch (err) {
                response = await axios.post('http://localhost:8080/medical-records', formattedData);
            }
            
            if (response.status === 201 || response.status === 200) {
                fetchMedicalRecords();
                setShowAddModal(false);
                alert('Medical record added successfully!');
            }
        } catch (err) {
            console.error('Error adding medical record:', err);
            alert(err.response?.data?.message || 'Failed to add medical record. Please try again.');
        }
    };
    
    const handleUpdateRecord = async (e) => {
        e.preventDefault();
        if (!selectedRecord || !selectedRecord.recordId) {
            console.error('Cannot update record: No record selected or record ID is missing');
            alert('Error: Cannot update medical record - record ID is missing.');
            return;
        }
        
        // Format dates to include time component for LocalDateTime
        const formattedData = {
            ...formData,
            recordDate: formData.recordDate ? `${formData.recordDate}T00:00:00` : null,
            nextAppointment: formData.nextAppointment ? `${formData.nextAppointment}T00:00:00` : null
        };
        
        try {
            console.log(`Updating medical record with ID: ${selectedRecord.recordId}`);
            let response;
            try {
                response = await axios.put(`http://localhost:8080/api/medical-records/${selectedRecord.recordId}`, formattedData);
            } catch (err) {
                response = await axios.put(`http://localhost:8080/medical-records/${selectedRecord.recordId}`, formattedData);
            }
            
            if (response.status === 200) {
                fetchMedicalRecords();
                setShowEditModal(false);
                alert('Medical record updated successfully!');
            }
        } catch (err) {
            console.error('Error updating medical record:', err);
            alert(err.response?.data?.message || 'Failed to update medical record. Please try again.');
        }
    };
    
    const handleDeleteRecord = async (recordId) => {
        if (window.confirm('Are you sure you want to delete this medical record? This action cannot be undone.')) {
            try {
                let response;
                try {
                    response = await axios.delete(`http://localhost:8080/api/medical-records/${recordId}`);
                } catch (err) {
                    response = await axios.delete(`http://localhost:8080/medical-records/${recordId}`);
                }
                
                if (response.status === 204 || response.status === 200) {
                    fetchMedicalRecords();
                    alert('Medical record deleted successfully!');
                }
            } catch (err) {
                console.error('Error deleting medical record:', err);
                alert(err.response?.data?.message || 'Failed to delete medical record. Please try again.');
            }
        }
    };
    
    // Format date for display
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
    
    const getPatientName = (patientId) => {
        const patient = patients.find(p => p.patientId === patientId);
        return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
    };
    
    const getDoctorName = (doctorId) => {
        const doctor = doctors.find(d => d.doctorId === doctorId);
        return doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Unknown Doctor';
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
                    </div>
                </div>
                <button className="add-btn" onClick={openAddModal}>
                    <i className="fas fa-plus"></i>
                    New Medical Record
                </button>
            </div>
            
            {error && (
                <div className="error-container">
                    <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i>
                        <span>{error}</span>
                    </div>
                    <button 
                        className="retry-btn" 
                        onClick={() => {
                            setError('');
                            fetchMedicalRecords();
                        }}
                    >
                        <i className="fas fa-sync"></i> Retry
                    </button>
                </div>
            )}
            
            <div className="table-responsive">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Record ID</th>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Record Type</th>
                            <th>Diagnosis</th>
                            <th>Record Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getFilteredRecords().length > 0 ? (
                            getFilteredRecords().map(record => (
                                <tr key={record.recordId}>
                                    <td>{record.recordId}</td>
                                    <td>{getPatientName(record.patientId)}</td>
                                    <td>{getDoctorName(record.doctorId)}</td>
                                    <td>
                                        <span className={`status-badge ${getRecordTypeClass(record.recordType)}`}>
                                            {record.recordType?.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td>{record.diagnosis || 'N/A'}</td>
                                    <td>{formatDate(record.recordDate)}</td>
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
                                        <button 
                                            className="action-btn delete" 
                                            onClick={() => handleDeleteRecord(record.recordId)}
                                            title="Delete"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="no-data">No medical records found</td>
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
                                        <div className="form-group">
                                            <label htmlFor="doctorId">Doctor*</label>
                                            <select
                                                id="doctorId"
                                                name="doctorId"
                                                value={formData.doctorId}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select Doctor</option>
                                                {doctors.map(doctor => (
                                                    <option key={doctor.doctorId} value={doctor.doctorId}>
                                                        Dr. {doctor.firstName} {doctor.lastName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="appointmentId">Related Appointment</label>
                                            <select
                                                id="appointmentId"
                                                name="appointmentId"
                                                value={formData.appointmentId}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select Appointment</option>
                                                {appointments.map(appointment => (
                                                    <option key={appointment.appointmentId} value={appointment.appointmentId}>
                                                        {formatDate(appointment.appointmentDate)} - {appointment.reason?.substring(0, 30)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
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
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="diagnosis">Diagnosis</label>
                                            <input
                                                type="text"
                                                id="diagnosis"
                                                name="diagnosis"
                                                value={formData.diagnosis}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="form-group wide">
                                            <label htmlFor="symptoms">Symptoms</label>
                                            <textarea
                                                id="symptoms"
                                                name="symptoms"
                                                value={formData.symptoms}
                                                onChange={handleInputChange}
                                                rows="3"
                                            ></textarea>
                                        </div>
                                        <div className="form-group wide">
                                            <label htmlFor="treatment">Treatment</label>
                                            <textarea
                                                id="treatment"
                                                name="treatment"
                                                value={formData.treatment}
                                                onChange={handleInputChange}
                                                rows="3"
                                            ></textarea>
                                        </div>
                                        <div className="form-group wide">
                                            <label htmlFor="prescription">Prescription</label>
                                            <textarea
                                                id="prescription"
                                                name="prescription"
                                                value={formData.prescription}
                                                onChange={handleInputChange}
                                                rows="3"
                                            ></textarea>
                                        </div>
                                        <div className="form-group wide">
                                            <label htmlFor="testResults">Test Results</label>
                                            <textarea
                                                id="testResults"
                                                name="testResults"
                                                value={formData.testResults}
                                                onChange={handleInputChange}
                                                rows="3"
                                            ></textarea>
                                        </div>
                                        <div className="form-group wide">
                                            <label htmlFor="notes">Additional Notes</label>
                                            <textarea
                                                id="notes"
                                                name="notes"
                                                value={formData.notes}
                                                onChange={handleInputChange}
                                                rows="3"
                                            ></textarea>
                                        </div>
                                        <div className="form-group wide">
                                            <label htmlFor="medicalHistory">Medical History</label>
                                            <textarea
                                                id="medicalHistory"
                                                name="medicalHistory"
                                                value={formData.medicalHistory}
                                                onChange={handleInputChange}
                                                rows="4"
                                            ></textarea>
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
                                    <button type="submit" className="submit-btn">
                                        <i className="fas fa-save"></i> Add Medical Record
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
                                        <div className="form-group">
                                            <label htmlFor="doctorId">Doctor*</label>
                                            <select
                                                id="doctorId"
                                                name="doctorId"
                                                value={formData.doctorId}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Select Doctor</option>
                                                {doctors.map(doctor => (
                                                    <option key={doctor.doctorId} value={doctor.doctorId}>
                                                        Dr. {doctor.firstName} {doctor.lastName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="appointmentId">Related Appointment</label>
                                            <select
                                                id="appointmentId"
                                                name="appointmentId"
                                                value={formData.appointmentId}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Select Appointment</option>
                                                {appointments.map(appointment => (
                                                    <option key={appointment.appointmentId} value={appointment.appointmentId}>
                                                        {formatDate(appointment.appointmentDate)} - {appointment.reason?.substring(0, 30)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
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
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="diagnosis">Diagnosis</label>
                                            <input
                                                type="text"
                                                id="diagnosis"
                                                name="diagnosis"
                                                value={formData.diagnosis}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="form-group wide">
                                            <label htmlFor="symptoms">Symptoms</label>
                                            <textarea
                                                id="symptoms"
                                                name="symptoms"
                                                value={formData.symptoms}
                                                onChange={handleInputChange}
                                                rows="3"
                                            ></textarea>
                                        </div>
                                        <div className="form-group wide">
                                            <label htmlFor="treatment">Treatment</label>
                                            <textarea
                                                id="treatment"
                                                name="treatment"
                                                value={formData.treatment}
                                                onChange={handleInputChange}
                                                rows="3"
                                            ></textarea>
                                        </div>
                                        <div className="form-group wide">
                                            <label htmlFor="prescription">Prescription</label>
                                            <textarea
                                                id="prescription"
                                                name="prescription"
                                                value={formData.prescription}
                                                onChange={handleInputChange}
                                                rows="3"
                                            ></textarea>
                                        </div>
                                        <div className="form-group wide">
                                            <label htmlFor="testResults">Test Results</label>
                                            <textarea
                                                id="testResults"
                                                name="testResults"
                                                value={formData.testResults}
                                                onChange={handleInputChange}
                                                rows="3"
                                            ></textarea>
                                        </div>
                                        <div className="form-group wide">
                                            <label htmlFor="notes">Additional Notes</label>
                                            <textarea
                                                id="notes"
                                                name="notes"
                                                value={formData.notes}
                                                onChange={handleInputChange}
                                                rows="3"
                                            ></textarea>
                                        </div>
                                        <div className="form-group wide">
                                            <label htmlFor="medicalHistory">Medical History</label>
                                            <textarea
                                                id="medicalHistory"
                                                name="medicalHistory"
                                                value={formData.medicalHistory}
                                                onChange={handleInputChange}
                                                rows="4"
                                            ></textarea>
                                        </div>
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
                                    <button type="submit" className="submit-btn">
                                        <i className="fas fa-save"></i> Update Medical Record
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
                    <div className="modal-container large-modal">
                        <div className="modal-header">
                            <h3>Medical Record Details</h3>
                            <button className="close-btn" onClick={() => setShowViewModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-sections">
                                <div className="detail-section">
                                    <h4><i className="fas fa-info-circle"></i> Basic Information</h4>
                                    <div className="details-grid">
                                        <div className="detail-item">
                                            <span className="detail-label">Record ID:</span>
                                            <span className="detail-value">{selectedRecord.recordId}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Patient:</span>
                                            <span className="detail-value">{getPatientName(selectedRecord.patientId)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Doctor:</span>
                                            <span className="detail-value">{getDoctorName(selectedRecord.doctorId)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Record Type:</span>
                                            <span className="detail-value">
                                                <span className={`status-badge ${getRecordTypeClass(selectedRecord.recordType)}`}>
                                                    {selectedRecord.recordType?.replace('_', ' ')}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Record Date:</span>
                                            <span className="detail-value">{formatDate(selectedRecord.recordDate)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Next Appointment:</span>
                                            <span className="detail-value">{formatDate(selectedRecord.nextAppointment)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Created At:</span>
                                            <span className="detail-value">{formatDate(selectedRecord.createdAt)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Last Updated:</span>
                                            <span className="detail-value">{formatDate(selectedRecord.updatedAt)}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="detail-section">
                                    <h4><i className="fas fa-stethoscope"></i> Medical Details</h4>
                                    <div className="details-grid">
                                        <div className="detail-item wide">
                                            <span className="detail-label">Diagnosis:</span>
                                            <span className="detail-value">{selectedRecord.diagnosis || 'N/A'}</span>
                                        </div>
                                        <div className="detail-item wide">
                                            <span className="detail-label">Symptoms:</span>
                                            <div className="detail-text">{selectedRecord.symptoms || 'N/A'}</div>
                                        </div>
                                        <div className="detail-item wide">
                                            <span className="detail-label">Treatment:</span>
                                            <div className="detail-text">{selectedRecord.treatment || 'N/A'}</div>
                                        </div>
                                        <div className="detail-item wide">
                                            <span className="detail-label">Prescription:</span>
                                            <div className="detail-text">{selectedRecord.prescription || 'N/A'}</div>
                                        </div>
                                        <div className="detail-item wide">
                                            <span className="detail-label">Test Results:</span>
                                            <div className="detail-text">{selectedRecord.testResults || 'N/A'}</div>
                                        </div>
                                        <div className="detail-item wide">
                                            <span className="detail-label">Additional Notes:</span>
                                            <div className="detail-text">{selectedRecord.notes || 'N/A'}</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="detail-section">
                                    <h4><i className="fas fa-history"></i> Medical History</h4>
                                    <div className="detail-text">
                                        {selectedRecord.medicalHistory || 'No medical history information available.'}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="modal-actions">
                                <button 
                                    className="cancel-btn"
                                    onClick={() => setShowViewModal(false)}
                                >
                                    Close
                                </button>
                                <button 
                                    className="edit-btn"
                                    onClick={() => {
                                        setShowViewModal(false);
                                        openEditModal(selectedRecord);
                                    }}
                                >
                                    <i className="fas fa-edit"></i> Edit Record
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const PrescriptionManagement = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [medications, setMedications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [dateFilter, setDateFilter] = useState('');
    
    // Add search terms for patient and doctor filters
    const [patientSearchTerm, setPatientSearchTerm] = useState('');
    const [doctorSearchTerm, setDoctorSearchTerm] = useState('');

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
        medicalRecordId: '',
        prescriptionDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
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
        fetchPrescriptions();
        fetchPatients();
        fetchDoctors();
        fetchMedicalRecords();
        fetchMedications();
    }, []);

    const fetchPrescriptions = async () => {
        setLoading(true);
        try {
            let response;
            try {
                response = await axios.get('http://localhost:8080/api/prescriptions');
            } catch (err) {
                // Try alternate endpoint if first one fails
                response = await axios.get('http://localhost:8080/prescriptions');
            }
            
            if (response.data) {
                setPrescriptions(response.data);
                setError('');
            }
        } catch (err) {
            console.error('Error fetching prescriptions:', err);
            setError('Failed to load prescriptions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchPatients = async () => {
        try {
            let response;
            try {
                response = await axios.get('http://localhost:8080/api/patients');
            } catch (err) {
                response = await axios.get('http://localhost:8080/patients');
            }
            
            if (response.data) {
                setPatients(response.data);
            }
        } catch (err) {
            console.error('Error fetching patients:', err);
        }
    };

    const fetchDoctors = async () => {
        try {
            let response;
            try {
                response = await axios.get('http://localhost:8080/api/doctors');
            } catch (err) {
                response = await axios.get('http://localhost:8080/doctors');
            }
            
            if (response.data) {
                setDoctors(response.data);
            }
        } catch (err) {
            console.error('Error fetching doctors:', err);
        }
    };

    const fetchMedicalRecords = async () => {
        try {
            let response;
            try {
                response = await axios.get('http://localhost:8080/api/medical-records');
            } catch (err) {
                response = await axios.get('http://localhost:8080/medical-records');
            }
            
            if (response.data) {
                setMedicalRecords(response.data);
            }
        } catch (err) {
            console.error('Error fetching medical records:', err);
        }
    };

    const fetchMedications = async () => {
        try {
            let response;
            try {
                response = await axios.get('http://localhost:8080/api/medications');
            } catch (err) {
                response = await axios.get('http://localhost:8080/medications');
            }
            
            if (response.data) {
                setMedications(response.data);
            }
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
            doctorId: '',
            medicalRecordId: '',
            prescriptionDate: new Date().toISOString().split('T')[0],
            expiryDate: '',
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
            doctorId: prescription.doctorId || '',
            medicalRecordId: prescription.medicalRecordId || '',
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
            // Ensure expiryDate is set if not provided
            const payload = { ...formData };
            if (!payload.expiryDate) {
                // Default expiry to 30 days from prescription date
                const prescDate = new Date(payload.prescriptionDate);
                prescDate.setDate(prescDate.getDate() + 30);
                payload.expiryDate = prescDate.toISOString().split('T')[0];
            }
            
            let response;
            try {
                response = await axios.post('http://localhost:8080/api/prescriptions', payload);
            } catch (err) {
                response = await axios.post('http://localhost:8080/prescriptions', payload);
            }
            
            if (response.data) {
                setPrescriptions([...prescriptions, response.data]);
                setShowAddModal(false);
                alert('Prescription added successfully!');
            }
        } catch (err) {
            console.error('Error adding prescription:', err);
            alert(err.response?.data?.message || 'Failed to add prescription. Please try again.');
        }
    };

    const handleUpdatePrescription = async (e) => {
        e.preventDefault();
        if (!selectedPrescription) return;
        
        try {
            let response;
            try {
                response = await axios.put(`http://localhost:8080/api/prescriptions/${selectedPrescription.prescriptionId}`, formData);
            } catch (err) {
                response = await axios.put(`http://localhost:8080/prescriptions/${selectedPrescription.prescriptionId}`, formData);
            }
            
            if (response.data) {
                const updatedPrescriptions = prescriptions.map(presc => 
                    presc.prescriptionId === selectedPrescription.prescriptionId ? response.data : presc
                );
                setPrescriptions(updatedPrescriptions);
                setShowEditModal(false);
                alert('Prescription updated successfully!');
            }
        } catch (err) {
            console.error('Error updating prescription:', err);
            alert(err.response?.data?.message || 'Failed to update prescription. Please try again.');
        }
    };

    const handleUpdateStatus = async (prescriptionId, newStatus) => {
        try {
            let response;
            try {
                response = await axios.put(`http://localhost:8080/api/prescriptions/${prescriptionId}/status/${newStatus}`);
            } catch (err) {
                response = await axios.put(`http://localhost:8080/prescriptions/${prescriptionId}/status/${newStatus}`);
            }
            
            if (response.data) {
                const updatedPrescriptions = prescriptions.map(presc => 
                    presc.prescriptionId === prescriptionId ? response.data : presc
                );
                setPrescriptions(updatedPrescriptions);
                alert(`Prescription status updated to ${newStatus}`);
            }
        } catch (err) {
            console.error('Error updating prescription status:', err);
            alert(err.response?.data?.message || 'Failed to update status. Please try again.');
        }
    };

    const handleDeletePrescription = async (prescriptionId) => {
        if (window.confirm('Are you sure you want to delete this prescription?')) {
            try {
                let response;
                try {
                    response = await axios.delete(`http://localhost:8080/api/prescriptions/${prescriptionId}`);
                } catch (err) {
                    response = await axios.delete(`http://localhost:8080/prescriptions/${prescriptionId}`);
                }
                
                if (response.status === 204 || response.status === 200) {
                    const updatedPrescriptions = prescriptions.filter(presc => presc.prescriptionId !== prescriptionId);
                    setPrescriptions(updatedPrescriptions);
                    alert('Prescription deleted successfully!');
                }
            } catch (err) {
                console.error('Error deleting prescription:', err);
                alert(err.response?.data?.message || 'Failed to delete prescription. Please try again.');
            }
        }
    };

    const handleRefillPrescription = async (prescriptionId) => {
        try {
            let response;
            try {
                response = await axios.post(`http://localhost:8080/api/prescriptions/${prescriptionId}/refill`);
            } catch (err) {
                response = await axios.post(`http://localhost:8080/prescriptions/${prescriptionId}/refill`);
            }
            
            if (response.data) {
                const updatedPrescriptions = prescriptions.map(presc => 
                    presc.prescriptionId === prescriptionId ? response.data : presc
                );
                setPrescriptions(updatedPrescriptions);
                alert('Prescription refilled successfully!');
            }
        } catch (err) {
            console.error('Error refilling prescription:', err);
            alert(err.response?.data?.message || 'Failed to refill prescription. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'ACTIVE': return 'status-active';
            case 'COMPLETED': return 'status-completed';
            case 'EXPIRED': return 'status-expired';
            case 'CANCELLED': return 'status-cancelled';
            default: return '';
        }
    };

    const getPatientName = (patientId) => {
        const patient = patients.find(p => p.patientId === patientId);
        return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
    };

    const getDoctorName = (doctorId) => {
        const doctor = doctors.find(d => d.doctorId === doctorId);
        return doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Unknown Doctor';
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
            
            // Apply search term to patient name, doctor name, or prescription ID
            if (searchTerm) {
                const patientName = getPatientName(prescription.patientId).toLowerCase();
                const doctorName = getDoctorName(prescription.doctorId).toLowerCase();
                const prescriptionId = prescription.prescriptionId?.toString().toLowerCase() || '';
                
                return patientName.includes(searchTerm.toLowerCase()) || 
                       doctorName.includes(searchTerm.toLowerCase()) ||
                       prescriptionId.includes(searchTerm.toLowerCase());
            }
            
            return true;
        });
    };

    // If data is still loading, show a loading spinner
    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
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
                                    placeholder="Search by ID, patient or doctor..."
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
            
            <div className="table-responsive">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Patient</th>
                            <th>Doctor</th>
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
                                <td colSpan="8" className="no-data">No prescriptions found</td>
                            </tr>
                        ) : (
                            getFilteredPrescriptions().map(prescription => (
                                <tr key={prescription.prescriptionId}>
                                    <td>{prescription.prescriptionId}</td>
                                    <td>{getPatientName(prescription.patientId)}</td>
                                    <td>{getDoctorName(prescription.doctorId)}</td>
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
                                            className="action-btn view-btn" 
                                            onClick={() => openViewModal(prescription)}
                                            title="View Prescription"
                                        >
                                            <i className="fas fa-eye"></i>
                                        </button>
                                        <button 
                                            className="action-btn edit-btn" 
                                            onClick={() => openEditModal(prescription)}
                                            title="Edit Prescription"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button 
                                            className="action-btn delete-btn" 
                                            onClick={() => handleDeletePrescription(prescription.prescriptionId)}
                                            title="Delete Prescription"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
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
                                    <div className="form-group">
                                        <label htmlFor="patientSearch">Patient* (ID or Name)</label>
                                        <div className="searchable-dropdown">
                                            <div className="search-input-container">
                                                <input
                                                    type="text"
                                                    id="patientSearch"
                                                    placeholder="Search by patient ID or name..."
                                                    value={patientSearchTerm}
                                                    onChange={(e) => setPatientSearchTerm(e.target.value)}
                                                    className="search-input"
                                                />
                                                <i className="fas fa-search search-icon"></i>
                                            </div>
                                            <select
                                                id="patientId"
                                                name="patientId"
                                                value={formData.patientId}
                                                onChange={handleInputChange}
                                                required
                                                className="dropdown-select"
                                            >
                                                <option value="">Select Patient</option>
                                                {getFilteredPatients().map(patient => (
                                                    <option key={patient.patientId} value={patient.patientId}>
                                                        {patient.patientId} - {patient.firstName} {patient.lastName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="doctorSearch">Doctor* (ID or Name)</label>
                                        <div className="searchable-dropdown">
                                            <div className="search-input-container">
                                                <input
                                                    type="text"
                                                    id="doctorSearch"
                                                    placeholder="Search by doctor ID or name..."
                                                    value={doctorSearchTerm}
                                                    onChange={(e) => setDoctorSearchTerm(e.target.value)}
                                                    className="search-input"
                                                />
                                                <i className="fas fa-search search-icon"></i>
                                            </div>
                                            <select
                                                id="doctorId"
                                                name="doctorId"
                                                value={formData.doctorId}
                                                onChange={handleInputChange}
                                                required
                                                className="dropdown-select"
                                            >
                                                <option value="">Select Doctor</option>
                                                {getFilteredDoctors().map(doctor => (
                                                    <option key={doctor.doctorId} value={doctor.doctorId}>
                                                        {doctor.doctorId} - Dr. {doctor.firstName} {doctor.lastName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* The rest of the modal remains unchanged */}
                                <div className="form-section">
                                    <h4>Prescription Details</h4>
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
                                            <label htmlFor="expiryDate">Expiry Date</label>
                                            <input
                                                type="date"
                                                id="expiryDate"
                                                name="expiryDate"
                                                value={formData.expiryDate}
                                                onChange={handleInputChange}
                                            />
                                        </div>
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
                                        <div className="form-group">
                                            <div className="checkbox-group">
                                                <input
                                                    type="checkbox"
                                                    id="isRefillable"
                                                    name="isRefillable"
                                                    checked={formData.isRefillable}
                                                    onChange={handleInputChange}
                                                />
                                                <label htmlFor="isRefillable">Refillable</label>
                                            </div>
                                            {formData.isRefillable && (
                                                <div className="refill-count">
                                                    <label>Total Refills:</label>
                                                    <input
                                                        type="number"
                                                        id="totalRefills"
                                                        name="totalRefills"
                                                        value={formData.totalRefills}
                                                        onChange={handleInputChange}
                                                        min="1"
                                                        required={formData.isRefillable}
                                                    />
                                                </div>
                                            )}
                                        </div>
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
                                <h4>Medications</h4>
                                {formData.medications.map((medication, index) => (
                                    <div className="medication-item" key={index}>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Medication Name:</label>
                                                <input
                                                    type="text"
                                                    value={medication.medicationName}
                                                    onChange={(e) => handleMedicationChange(index, 'medicationName', e.target.value)}
                                                    required
                                                    list="medications-list"
                                                />
                                                <datalist id="medications-list">
                                                    {medications.map(med => (
                                                        <option key={med.id} value={med.name} />
                                                    ))}
                                                </datalist>
                                            </div>
                                            <div className="form-group">
                                                <label>Dosage:</label>
                                                <input
                                                    type="text"
                                                    value={medication.dosage}
                                                    onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                                                    required
                                                    placeholder="e.g., 10mg"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Frequency:</label>
                                                <input
                                                    type="text"
                                                    value={medication.frequency}
                                                    onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                                                    required
                                                    placeholder="e.g., Twice daily"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Duration:</label>
                                                <input
                                                    type="text"
                                                    value={medication.duration}
                                                    onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                                                    placeholder="e.g., 7 days"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Quantity:</label>
                                                <input
                                                    type="number"
                                                    value={medication.quantity}
                                                    onChange={(e) => handleMedicationChange(index, 'quantity', parseInt(e.target.value) || 1)}
                                                    min="1"
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Instructions:</label>
                                                <input
                                                    type="text"
                                                    value={medication.instructions}
                                                    onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                                                    placeholder="e.g., Take with food"
                                                />
                                            </div>
                                        </div>
                                        {formData.medications.length > 1 && (
                                            <button 
                                                type="button" 
                                                className="remove-medication-btn"
                                                onClick={() => removeMedicationField(index)}
                                            >
                                                <i className="fas fa-trash-alt"></i> Remove Medication
                                            </button>
                                        )}
                                        <hr />
                                    </div>
                                ))}
                                <button 
                                    type="button" 
                                    className="add-medication-btn"
                                    onClick={addMedicationField}
                                >
                                    <i className="fas fa-plus"></i> Add Another Medication
                                </button>
                                <div className="form-actions">
                                    <button 
                                        type="button" 
                                        className="cancel-btn"
                                        onClick={() => setShowAddModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="submit-btn">Add Prescription</button>
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
                            <h3>Edit Prescription #{selectedPrescription.prescriptionId}</h3>
                            <button className="close-btn" onClick={() => setShowEditModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleUpdatePrescription}>
                                <div className="form-group">
                                    <label>Patient:</label>
                                    <select 
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

                                <div className="form-group">
                                    <label>Doctor:</label>
                                    <select 
                                        name="doctorId" 
                                        value={formData.doctorId} 
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Doctor</option>
                                        {doctors.map(doctor => (
                                            <option key={doctor.doctorId} value={doctor.doctorId}>
                                                Dr. {doctor.firstName} {doctor.lastName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Medical Record:</label>
                                        <select 
                                            name="medicalRecordId" 
                                            value={formData.medicalRecordId} 
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select Medical Record (optional)</option>
                                            {medicalRecords
                                                .filter(record => !formData.patientId || record.patientId === formData.patientId)
                                                .map(record => (
                                                    <option key={record.recordId} value={record.recordId}>
                                                        Record #{record.recordId} - {formatDate(record.createdAt)}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Prescription Date:</label>
                                        <input 
                                            type="date" 
                                            name="prescriptionDate"
                                            value={formData.prescriptionDate}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Expiry Date:</label>
                                        <input 
                                            type="date" 
                                            name="expiryDate"
                                            value={formData.expiryDate}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Status:</label>
                                        <select 
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
                                    <div className="form-group">
                                        <div className="checkbox-group">
                                            <input 
                                                type="checkbox" 
                                                id="isRefillable" 
                                                name="isRefillable"
                                                checked={formData.isRefillable}
                                                onChange={handleInputChange}
                                            />
                                            <label htmlFor="isRefillable">Refillable</label>
                                        </div>
                                        {formData.isRefillable && (
                                            <div className="refill-count">
                                                <label>Total Refills:</label>
                                                <input 
                                                    type="number" 
                                                    name="totalRefills"
                                                    value={formData.totalRefills}
                                                    onChange={handleInputChange}
                                                    min="1"
                                                    required={formData.isRefillable}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Notes:</label>
                                    <textarea 
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        rows="3"
                                    ></textarea>
                                </div>

                                <h4>Medications</h4>
                                {formData.medications.map((medication, index) => (
                                    <div className="medication-item" key={index}>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Medication Name:</label>
                                                <input
                                                    type="text"
                                                    value={medication.medicationName}
                                                    onChange={(e) => handleMedicationChange(index, 'medicationName', e.target.value)}
                                                    required
                                                    list="medications-list"
                                                />
                                                <datalist id="medications-list">
                                                    {medications.map(med => (
                                                        <option key={med.id} value={med.name} />
                                                    ))}
                                                </datalist>
                                            </div>
                                            <div className="form-group">
                                                <label>Dosage:</label>
                                                <input
                                                    type="text"
                                                    value={medication.dosage}
                                                    onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                                                    required
                                                    placeholder="e.g., 10mg"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Frequency:</label>
                                                <input
                                                    type="text"
                                                    value={medication.frequency}
                                                    onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                                                    required
                                                    placeholder="e.g., Twice daily"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Duration:</label>
                                                <input
                                                    type="text"
                                                    value={medication.duration}
                                                    onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                                                    placeholder="e.g., 7 days"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Quantity:</label>
                                                <input
                                                    type="number"
                                                    value={medication.quantity}
                                                    onChange={(e) => handleMedicationChange(index, 'quantity', parseInt(e.target.value) || 1)}
                                                    min="1"
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Instructions:</label>
                                                <input
                                                    type="text"
                                                    value={medication.instructions}
                                                    onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                                                    placeholder="e.g., Take with food"
                                                />
                                            </div>
                                        </div>
                                        {formData.medications.length > 1 && (
                                            <button 
                                                type="button" 
                                                className="remove-medication-btn"
                                                onClick={() => removeMedicationField(index)}
                                            >
                                                <i className="fas fa-trash-alt"></i> Remove Medication
                                            </button>
                                        )}
                                        <hr />
                                    </div>
                                ))}
                                <button 
                                    type="button" 
                                    className="add-medication-btn"
                                    onClick={addMedicationField}
                                >
                                    <i className="fas fa-plus"></i> Add Another Medication
                                </button>

                                <div className="form-actions">
                                    <button 
                                        type="button" 
                                        className="cancel-btn"
                                        onClick={() => setShowEditModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="submit-btn">Update Prescription</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* View Prescription Modal */}
            {showViewModal && selectedPrescription && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Prescription #{selectedPrescription.prescriptionId}</h3>
                            <button className="close-btn" onClick={() => setShowViewModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-section">
                                <h4>Prescription Information</h4>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Patient:</label>
                                        <div>{getPatientName(selectedPrescription.patientId)}</div>
                                    </div>
                                    <div className="form-group">
                                        <label>Doctor:</label>
                                        <div>{getDoctorName(selectedPrescription.doctorId)}</div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Prescription Date:</label>
                                        <div>{formatDate(selectedPrescription.prescriptionDate)}</div>
                                    </div>
                                    <div className="form-group">
                                        <label>Expiry Date:</label>
                                        <div>{formatDate(selectedPrescription.expiryDate)}</div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Status:</label>
                                        <div>
                                            <span className={`status-badge ${getStatusClass(selectedPrescription.status)}`}>
                                                {selectedPrescription.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Refillable:</label>
                                        <div>
                                            {selectedPrescription.isRefillable ? (
                                                <span className="refill-info">
                                                    Yes ({selectedPrescription.refillsRemaining}/{selectedPrescription.totalRefills})
                                                </span>
                                            ) : (
                                                <span>No</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {selectedPrescription.notes && (
                                    <div className="form-group">
                                        <label>Notes:</label>
                                        <div className="prescription-notes">{selectedPrescription.notes}</div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="detail-section">
                                <h4>Medications</h4>
                                <div className="medications-list">
                                    {selectedPrescription.medications && selectedPrescription.medications.map((med, index) => (
                                        <div className="medication-card" key={index}>
                                            <h5>{med.medicationName}</h5>
                                            <p><strong>Dosage:</strong> {med.dosage}</p>
                                            <p><strong>Frequency:</strong> {med.frequency}</p>
                                            <p><strong>Quantity:</strong> {med.quantity}</p>
                                            {med.duration && <p><strong>Duration:</strong> {med.duration}</p>}
                                            {med.instructions && <p><strong>Instructions:</strong> {med.instructions}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="detail-footer">
                                <button 
                                    type="button" 
                                    className="close-modal-btn"
                                    onClick={() => setShowViewModal(false)}
                                >
                                    Close
                                </button>
                                {selectedPrescription.status === 'ACTIVE' && (
                                    <button 
                                        type="button" 
                                        className="submit-btn"
                                        onClick={() => {
                                            handleUpdateStatus(selectedPrescription.prescriptionId, 'COMPLETED');
                                            setShowViewModal(false);
                                        }}
                                    >
                                        Mark as Completed
                                    </button>
                                )}
                                {selectedPrescription.isRefillable && 
                                 selectedPrescription.refillsRemaining > 0 && 
                                 selectedPrescription.status === 'ACTIVE' && (
                                    <button 
                                        type="button" 
                                        className="submit-btn"
                                        onClick={() => {
                                            handleRefillPrescription(selectedPrescription.prescriptionId);
                                            setShowViewModal(false);
                                        }}
                                    >
                                        Refill Prescription
                                    </button>
                                )}
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