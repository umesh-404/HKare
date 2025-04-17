import React, { useState, useEffect } from 'react';
import './StaffPage.css';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
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
    Title,
    Tooltip,
    Legend
);

const StaffPage = () => {
    const [activeSection, setActiveSection] = useState("dashboard");
    const navigate = useNavigate();
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Apply specific body class for this page
        document.body.classList.add('staff-page-body');
        
        // Cleanup function to remove the class when component unmounts
        return () => {
            document.body.classList.remove('staff-page-body');
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
            case "appointments":
                return <Appointments />;
            case "patients":
                return <Patients />;
            case "prescriptions":
                return <Prescriptions />;
            case "payments":
                return <Payments />;
            case "messages":
                return <Messages />;
            case "settings":
                return <Settings />;
            case "profile":
                return <Profile userData={userData} />;
            case "departments":
                return <DepartmentManagement />;
            case "staff-management":
                return <StaffManagement />;
            default:
                return <div>Select a section from the sidebar</div>;
        }
    };

    // Get nav items based on user type
    const getNavItems = () => {
        const baseItems = ["Dashboard", "Appointments", "Patients", "Prescriptions", "Payments", "Messages", "Settings", "Profile"];
        
        // Add admin-only items for users with ADMIN type
        if (userData?.userType === 'STAFF') {
            return [...baseItems, "Departments", "Staff Management"];
        }
        
        return baseItems;
    };

    return (
        <div className="staff-page">
            {/* Header */}
            <header className="staff-header">
                <div className="header-left">
                    <img src="/vite.svg" alt="Hospital Logo" className="header-logo" />
                </div>
                <div className="header-right">
                    <div className="user-info" onClick={() => setActiveSection("profile")} style={{ cursor: 'pointer' }}>
                        <i className="fas fa-user user-icon"></i>
                        <span className="user-name">{userData ? `${userData.firstName} ${userData.lastName}` : 'Staff Member'}</span>
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
                            key={item}
                            className={`nav-button ${activeSection === item.toLowerCase().replace(' ', '-') ? "active" : ""}`}
                            onClick={() => setActiveSection(item.toLowerCase().replace(' ', '-'))}
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
        'patients': 'fa-users',
        'prescriptions': 'fa-prescription-bottle',
        'payments': 'fa-credit-card',
        'messages': 'fa-envelope',
        'settings': 'fa-cog',
        'profile': 'fa-user-circle',
        'departments': 'fa-hospital',
        'staff-management': 'fa-user-md'
    };
    return icons[section] || 'fa-circle';
};

// Dashboard Section with Analytics and Graphs
const Dashboard = () => {
    // Sample data for the graph
    const graphData = {
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

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false
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

    return (
        <div className="dashboard-section">
            <div className="analytics-overview">
                <h2>Analytics Overview</h2>
                <div className="analytics-cards">
                    <div className="analytics-card">
                        <h4>Total Patients</h4>
                        <p>150</p>
                    </div>
                    <div className="analytics-card">
                        <h4>Appointments Today</h4>
                        <p>30</p>
                    </div>
                    <div className="analytics-card">
                        <h4>Pending Prescriptions</h4>
                        <p>5</p>
                    </div>
                </div>
            </div>
            <div className="graph-section">
                <h2>Monthly Patient Visits</h2>
                <div className="graph-container">
                    <Line data={graphData} options={options} />
                </div>
            </div>
        </div>
    );
};

// Appointments Section
const Appointments = () => {
    const [activeView, setActiveView] = useState('active');

    // Sample data for appointments
    const activeAppointments = [
        {
            id: 1,
            patientName: "Priya Sharma",
            type: "Follow-up",
            time: "11:30 AM",
            date: "Today",
            status: "In Progress",
            department: "Cardiology"
        },
        {
            id: 2,
            patientName: "Anjali Patel",
            type: "First Consultation",
            time: "2:00 PM",
            date: "Today",
            status: "Waiting",
            department: "Neurology"
        }
    ];

    const appointmentHistory = [
        {
            id: 3,
            patientName: "Rajesh Kumar",
            type: "Check-up",
            date: "15 Mar 2024",
            time: "10:00 AM",
            status: "Completed",
            department: "General"
        },
        {
            id: 4,
            patientName: "Deepika Singh",
            type: "Follow-up",
            date: "14 Mar 2024",
            time: "3:30 PM",
            status: "Completed",
            department: "Orthopedics"
        }
    ];

    return (
        <div className="appointments-wrapper">
            {/* Title with Icon */}
            <div className="appointments-header">
                <i className="fas fa-calendar-plus"></i>
                <h2>Appointments</h2>
            </div>

            {/* White Container */}
            <div className="appointments-container">
                {/* Navigation Tabs */}
                <div className="appointments-tabs">
                    <button 
                        className={`tab-btn ${activeView === 'active' ? 'active' : ''}`}
                        onClick={() => setActiveView('active')}
                    >
                        Active Appointments
                    </button>
                    <button 
                        className={`tab-btn ${activeView === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveView('history')}
                    >
                        Appointment History
                    </button>
                </div>

                {/* Appointments Content */}
                <div className="appointments-content">
                    {activeView === 'active' ? (
                        <div className="active-appointments">
                            {activeAppointments.map(appointment => (
                                <div key={appointment.id} className="appointment-card">
                                    <div className="appointment-header">
                                        <h3>{appointment.patientName}</h3>
                                        <span className={`status-badge ${appointment.status.toLowerCase()}`}>
                                            {appointment.status}
                                        </span>
                                    </div>
                                    <div className="appointment-details">
                                        <p><i className="fas fa-stethoscope"></i> {appointment.type}</p>
                                        <p><i className="fas fa-hospital"></i> {appointment.department}</p>
                                        <p><i className="far fa-clock"></i> {appointment.date}, {appointment.time}</p>
                                    </div>
                                    <div className="appointment-actions">
                                        <button className="action-btn view">View Details</button>
                                        {appointment.status === "Waiting" && (
                                            <button className="action-btn start">Start Appointment</button>
                                        )}
                                        {appointment.status === "In Progress" && (
                                            <button className="action-btn complete">Complete</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="appointments-history">
                            <div className="history-filters">
                                <input type="date" className="date-filter" />
                                <select className="department-filter">
                                    <option value="">All Departments</option>
                                    <option value="cardiology">Cardiology</option>
                                    <option value="neurology">Neurology</option>
                                    <option value="orthopedics">Orthopedics</option>
                                </select>
                            </div>
                            {appointmentHistory.map(appointment => (
                                <div key={appointment.id} className="appointment-card history">
                                    <div className="appointment-header">
                                        <h3>{appointment.patientName}</h3>
                                        <span className="status-badge completed">
                                            {appointment.status}
                                        </span>
                                    </div>
                                    <div className="appointment-details">
                                        <p><i className="fas fa-stethoscope"></i> {appointment.type}</p>
                                        <p><i className="fas fa-hospital"></i> {appointment.department}</p>
                                        <p><i className="far fa-calendar"></i> {appointment.date}, {appointment.time}</p>
                                    </div>
                                    <div className="appointment-actions">
                                        <button className="action-btn view">View Details</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Patients Section
const Patients = () => {
    const [activeView, setActiveView] = useState('active');

    return (
        <div className="patients-wrapper">
            {/* Section Title */}
            <div className="section-title">
                <i className="fas fa-users"></i>
                <h2>Patients</h2>
            </div>

            {/* Content Container */}
            <div className="patients-container">
                {/* Navigation Tabs */}
                <div className="tab-navigation">
                    <button 
                        className={`tab-btn ${activeView === 'active' ? 'active' : ''}`}
                        onClick={() => setActiveView('active')}
                    >
                        Active Patients
                    </button>
                    <button 
                        className={`tab-btn ${activeView === 'previous' ? 'active' : ''}`}
                        onClick={() => setActiveView('previous')}
                    >
                        Previous Patients
                    </button>
                </div>

                {/* Search Bar */}
                <div className="search-bar">
                    <i className="fas fa-search"></i>
                    <input 
                        type="text" 
                        placeholder="Search patients by name or ID..." 
                    />
                </div>

                {/* Patient Cards */}
                <div className="patients-list">
                    <div className="patient-card">
                        <div className="patient-card-header">
                            <h3>Priya Sharma</h3>
                            <span className="patient-id">P12346</span>
                        </div>
                        <div className="patient-details">
                            <p><i className="fas fa-stethoscope"></i> Check-up</p>
                            <p><i className="fas fa-hospital"></i> General</p>
                            <p><i className="far fa-clock"></i> Last Visit: 15 Mar 2024, 10:00 AM</p>
                        </div>
                        <div className="patient-actions">
                            <button className="action-btn view">View Details</button>
                            <button className="action-btn schedule">Schedule Appointment</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Prescriptions Section
const Prescriptions = () => {
    const [searchId, setSearchId] = useState('');

    // Sample prescription data
    const prescriptions = [
        {
            id: 1,
            patientName: "Priya Sharma",
            patientId: "P12346",
            medication: "Amoxicillin 500mg",
            dosage: "1 tablet, twice daily",
            duration: "7 days (ends 20 Mar)",
            status: "Active"
        },
        {
            id: 2,
            patientName: "Anjali Patel",
            patientId: "P12347",
            medication: "Lisinopril 10mg",
            dosage: "1 tablet daily",
            duration: "30 days",
            status: "Pending"
        }
    ];

    return (
        <div className="prescriptions-wrapper">
            {/* Title with Icon */}
            <div className="section-title">
                <i className="fas fa-prescription"></i>
                <h2>Prescriptions</h2>
            </div>

            {/* White Container */}
            <div className="prescriptions-container">
                {/* Search Bar */}
                <div className="search-bar">
                    <i className="fas fa-search"></i>
                    <input 
                        type="text" 
                        placeholder="Search prescriptions by Patient ID..." 
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                    />
                </div>

                {/* Prescriptions List */}
                <div className="prescriptions-list">
                    {prescriptions.map(prescription => (
                        <div key={prescription.id} className="prescription-card">
                            <div className="prescription-header">
                                <div className="patient-info">
                                    <h3>{prescription.patientName}</h3>
                                    <span className="patient-id">{prescription.patientId}</span>
                                </div>
                                <span className={`status-badge ${prescription.status.toLowerCase()}`}>
                                    {prescription.status}
                                </span>
                            </div>
                            <div className="prescription-details">
                                <p><i className="fas fa-pills"></i> {prescription.medication}</p>
                                <p><i className="fas fa-clock"></i> {prescription.dosage}</p>
                                <p><i className="fas fa-calendar"></i> {prescription.duration}</p>
                            </div>
                            <div className="prescription-actions">
                                <button className="action-btn view">View Details</button>
                                {prescription.status === "Active" && (
                                    <button className="action-btn renew">Renew</button>
                                )}
                                {prescription.status === "Pending" && (
                                    <>
                                        <button className="action-btn approve">Approve</button>
                                        <button className="action-btn decline">Decline</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Payments Section
const Payments = () => {
    const [searchId, setSearchId] = useState('');

    // Sample payments data
    const payments = [
        {
            id: 1,
            patientName: "Priya Sharma",
            patientId: "P12346",
            amount: "$150.00",
            date: "15 Mar 2024",
            status: "Paid",
            service: "General Consultation"
        },
        {
            id: 2,
            patientName: "Anjali Patel",
            patientId: "P12347",
            amount: "$200.00",
            date: "16 Mar 2024",
            status: "Pending",
            service: "Specialist Consultation"
        }
    ];

    return (
        <div className="payments-wrapper">
            {/* Title with Icon */}
            <div className="section-title">
                <i className="fas fa-credit-card"></i>
                <h2>Payments</h2>
            </div>

            {/* White Container */}
            <div className="payments-container">
                {/* Search Bar */}
                <div className="search-bar">
                    <i className="fas fa-search"></i>
                    <input 
                        type="text" 
                        placeholder="Search payments by Patient ID..." 
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                    />
                </div>

                {/* Payments List */}
                <div className="payments-list">
                    {payments.map(payment => (
                        <div key={payment.id} className="payment-card">
                            <div className="payment-header">
                                <div className="patient-info">
                                    <h3>{payment.patientName}</h3>
                                    <span className="patient-id">{payment.patientId}</span>
                                </div>
                                <span className={`status-badge ${payment.status.toLowerCase()}`}>
                                    {payment.status}
                                </span>
                            </div>
                            <div className="payment-details">
                                <p><i className="fas fa-file-invoice-dollar"></i> Amount: {payment.amount}</p>
                                <p><i className="fas fa-calendar"></i> Date: {payment.date}</p>
                                <p><i className="fas fa-stethoscope"></i> Service: {payment.service}</p>
                            </div>
                            <div className="payment-actions">
                                <button className="action-btn view">View Details</button>
                                {payment.status === "Pending" && (
                                    <>
                                        <button className="action-btn approve">Process Payment</button>
                                        <button className="action-btn decline">Cancel</button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Messages & Communication Section
const Messages = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentMessage, setCurrentMessage] = useState('');
    const [selectedChat, setSelectedChat] = useState(null);

    // Sample messages data
    const conversations = [
        {
            id: 1,
            patientName: "Priya Sharma",
            patientId: "P12346",
            unread: 2,
            lastMessage: "Thank you for the prescription details",
            lastTime: "10:30 AM",
            messages: [
                {
                    id: 1,
                    sender: "patient",
                    content: "Hello, I have a question about my prescription",
                    time: "10:25 AM"
                },
                {
                    id: 2,
                    sender: "staff",
                    content: "Of course, how can I help you?",
                    time: "10:28 AM"
                },
                {
                    id: 3,
                    sender: "patient",
                    content: "Thank you for the prescription details",
                    time: "10:30 AM"
                }
            ]
        },
        // Add more conversations as needed
    ];

    return (
        <div className="messages-wrapper">
            {/* Title with Icon */}
            <div className="section-title">
                <i className="fas fa-comments"></i>
                <h2>Messages</h2>
            </div>

            <div className="messages-container">
                {/* Left Side - Conversations List */}
                <div className="conversations-list">
                    {/* Search Bar */}
                    <div className="search-bar">
                        <i className="fas fa-search"></i>
                        <input 
                            type="text" 
                            placeholder="Search conversations..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Conversations */}
                    {conversations.map(chat => (
                        <div 
                            key={chat.id} 
                            className={`conversation-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
                            onClick={() => setSelectedChat(chat)}
                        >
                            <div className="conversation-info">
                                <h3>{chat.patientName}</h3>
                                <span className="patient-id">{chat.patientId}</span>
                            </div>
                            <div className="conversation-preview">
                                <p>{chat.lastMessage}</p>
                                <span className="message-time">{chat.lastTime}</span>
                            </div>
                            {chat.unread > 0 && (
                                <span className="unread-badge">{chat.unread}</span>
                            )}
                        </div>
                    ))}
                </div>

                {/* Right Side - Chat Area */}
                <div className="chat-area">
                    {selectedChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="chat-header">
                                <div className="chat-user-info">
                                    <h3>{selectedChat.patientName}</h3>
                                    <span className="patient-id">{selectedChat.patientId}</span>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="messages-list">
                                {selectedChat.messages.map(message => (
                                    <div 
                                        key={message.id} 
                                        className={`message ${message.sender === 'staff' ? 'sent' : 'received'}`}
                                    >
                                        <div className="message-content">
                                            <p>{message.content}</p>
                                            <span className="message-time">{message.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Message Input */}
                            <div className="message-input-area">
                                <input 
                                    type="text"
                                    placeholder="Type your message..."
                                    value={currentMessage}
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                />
                                <button className="send-btn">
                                    <i className="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="no-chat-selected">
                            <i className="fas fa-comments"></i>
                            <p>Select a conversation to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Settings Section
const Settings = () => {
    const [activeTab, setActiveTab] = useState('account');

    return (
        <div className="settings-wrapper">
            {/* Title with Icon */}
            <div className="section-title">
                <i className="fas fa-cog"></i>
                <h2>Settings</h2>
            </div>

            <div className="settings-container">
                {/* Settings Navigation */}
                <div className="settings-nav">
                    <button 
                        className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`}
                        onClick={() => setActiveTab('account')}
                    >
                        <i className="fas fa-user"></i>
                        Account Settings
                    </button>
                    <button 
                        className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        <i className="fas fa-bell"></i>
                        Notifications
                    </button>
                    <button 
                        className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        <i className="fas fa-shield-alt"></i>
                        Security
                    </button>
                </div>

                {/* Settings Content */}
                <div className="settings-content">
                    {activeTab === 'account' && (
                        <div className="settings-section">
                            <h3>Account Information</h3>
                            <div className="settings-form">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input type="text" placeholder="Enter your full name" />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" placeholder="Enter your email" />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="tel" placeholder="Enter your phone number" />
                                </div>
                                <button className="save-btn">Save Changes</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="settings-section">
                            <h3>Notification Preferences</h3>
                            <div className="settings-form">
                                <div className="toggle-group">
                                    <label>Email Notifications</label>
                                    <label className="switch">
                                        <input type="checkbox" defaultChecked />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                                <div className="toggle-group">
                                    <label>SMS Notifications</label>
                                    <label className="switch">
                                        <input type="checkbox" />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                                <button className="save-btn">Save Preferences</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="settings-section">
                            <h3>Security Settings</h3>
                            <div className="settings-form">
                                <div className="form-group">
                                    <label>Current Password</label>
                                    <input type="password" placeholder="Enter current password" />
                                </div>
                                <div className="form-group">
                                    <label>New Password</label>
                                    <input type="password" placeholder="Enter new password" />
                                </div>
                                <div className="form-group">
                                    <label>Confirm New Password</label>
                                    <input type="password" placeholder="Confirm new password" />
                                </div>
                                <button className="save-btn">Update Password</button>
                            </div>
                        </div>
                    )}
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
        position: '',
        hireDate: '',
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
            setIsLoading(true);
            try {
                console.log("Fetching departments from:", 'http://localhost:8080/api/departments');
                // First try with /api prefix
                try {
                    const response = await axios.get('http://localhost:8080/api/departments');
                    console.log("Departments response:", response.data);
                    setDepartments(response.data);
                } catch (apiError) {
                    console.log("Trying alternate URL without /api prefix");
                    // If that fails, try without /api prefix
                    const response = await axios.get('http://localhost:8080/departments');
                    console.log("Departments response (alternate URL):", response.data);
                    setDepartments(response.data);
                }
            } catch (err) {
                console.error('Error fetching departments:', err);
                const errorMessage = err.response ? 
                    `Failed to load departments. Status: ${err.response.status}, Message: ${err.response.statusText}` : 
                    'Failed to load departments. Server might be unreachable. Please try again later.';
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchDepartments();
    }, []);

    useEffect(() => {
        if (userData) {
            // Fetch detailed staff profile
            const fetchStaffDetails = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/staff/${userData.roleId}`);
                    const staffData = response.data;
                    
                    // Format date of birth if exists
                    let formattedDob = '';
                    if (staffData.user?.dateOfBirth) {
                        const dob = new Date(staffData.user.dateOfBirth);
                        formattedDob = dob.toISOString().split('T')[0]; // Format as YYYY-MM-DD
                    }
                    
                    // Format hire date if exists
                    let formattedHireDate = '';
                    if (staffData.hireDate) {
                        const hireDate = new Date(staffData.hireDate);
                        formattedHireDate = hireDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
                    }
                    
                    setFormData({
                        firstName: staffData.firstName || '',
                        lastName: staffData.lastName || '',
                        email: staffData.user?.email || '',
                        phoneNumber: staffData.user?.phoneNumber || '',
                        address: staffData.user?.address || '',
                        dateOfBirth: formattedDob,
                        gender: staffData.user?.gender || '',
                        position: staffData.position || '',
                        hireDate: formattedHireDate,
                        departmentId: staffData.department?.departmentId?.toString() || ''
                    });
                } catch (err) {
                    console.error('Error fetching staff details:', err);
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
            
            fetchStaffDetails();
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
                departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
                dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
                hireDate: formData.hireDate ? new Date(formData.hireDate).toISOString() : null
            };
            
            // Send update request
            await axios.put(`http://localhost:8080/api/staff/${userData.roleId}`, updateData);
            
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
                        <h3>{userData?.userType === 'ADMIN' ? 'Admin' : 'Staff'} Profile</h3>
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
                                    <label>Staff ID</label>
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
                            <h4 className="profile-section-title">Employment Information</h4>
                            <div className="profile-form-row">
                                <div className="profile-form-group">
                                    <label>Position</label>
                                    <input 
                                        type="text" 
                                        name="position" 
                                        value={formData.position} 
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="profile-form-field" 
                                    />
                                </div>
                                <div className="profile-form-group">
                                    <label>Hire Date</label>
                                    <input 
                                        type="date" 
                                        name="hireDate" 
                                        value={formData.hireDate} 
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="profile-form-field" 
                                    />
                                </div>
                            </div>
                            
                            <div className="profile-form-row">
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
                                <div className="profile-form-group">
                                    <label>Role Type</label>
                                    <input 
                                        type="text" 
                                        value={userData?.userType === 'ADMIN' ? 'Administrator' : 'Staff Member'} 
                                        disabled 
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

// Department Management Section
const DepartmentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentDepartment, setCurrentDepartment] = useState(null);
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

    const fetchDepartments = async () => {
        setIsLoading(true);
        try {
            console.log("Fetching departments from:", 'http://localhost:8080/api/departments');
            const response = await axios.get('http://localhost:8080/api/departments');
            console.log("Departments response:", response.data);
            setDepartments(response.data);
        } catch (err) {
            console.error('Error fetching departments:', err);
            const errorMessage = err.response ? 
                `Failed to load departments. Status: ${err.response.status}, Message: ${err.response.statusText}` : 
                'Failed to load departments. Server might be unreachable. Please try again later.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDoctors = async () => {
        try {
            console.log("Fetching doctors from:", 'http://localhost:8080/api/doctors');
            const response = await axios.get('http://localhost:8080/api/doctors');
            console.log("Doctors response:", response.data);
            setDoctors(response.data);
        } catch (err) {
            console.error('Error fetching doctors:', err);
            console.error('Error details:', err.response ? 
                `Status: ${err.response.status}, Message: ${err.response.statusText}` : 
                'Server might be unreachable');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openAddModal = () => {
        setFormData({
            name: '',
            description: '',
            headDoctorId: ''
        });
        setShowAddModal(true);
    };

    const openEditModal = (department) => {
        setCurrentDepartment(department);
        setFormData({
            name: department.name,
            description: department.description,
            headDoctorId: department.headDoctorId || ''
        });
        setShowEditModal(true);
    };

    const handleAddDepartment = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/departments', formData);
            setShowAddModal(false);
            fetchDepartments(); // Refresh the list
        } catch (err) {
            console.error('Error adding department:', err);
            setError('Failed to add department. Please try again.');
        }
    };

    const handleUpdateDepartment = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/departments/${currentDepartment.departmentId}`, formData);
            setShowEditModal(false);
            fetchDepartments(); // Refresh the list
        } catch (err) {
            console.error('Error updating department:', err);
            setError('Failed to update department. Please try again.');
        }
    };

    const handleDeleteDepartment = async (departmentId) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            try {
                await axios.delete(`http://localhost:8080/api/departments/${departmentId}`);
                fetchDepartments(); // Refresh the list
            } catch (err) {
                console.error('Error deleting department:', err);
                setError('Failed to delete department. Please try again.');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading departments...</p>
            </div>
        );
    }

    return (
        <div className="department-management">
            {error && <div className="error-message">{error}</div>}
            
            <div className="departments-header">
                <button className="add-btn" onClick={openAddModal}>
                    <i className="fas fa-plus"></i> Add Department
                </button>
            </div>
            
            <div className="departments-list">
                <table className="departments-table">
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
                        {departments.map(dept => (
                            <tr key={dept.departmentId}>
                                <td>{dept.departmentId}</td>
                                <td>{dept.name}</td>
                                <td>{dept.description}</td>
                                <td>{dept.headDoctorName || 'Not assigned'}</td>
                                <td className="actions-cell">
                                    <button className="action-btn edit" onClick={() => openEditModal(dept)}>
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button className="action-btn delete" onClick={() => handleDeleteDepartment(dept.departmentId)}>
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {departments.length === 0 && (
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
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Add New Department</h3>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleAddDepartment}>
                            <div className="form-group">
                                <label>Department Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea 
                                    name="description" 
                                    value={formData.description} 
                                    onChange={handleInputChange} 
                                    rows="3"
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label>Head Doctor</label>
                                <select 
                                    name="headDoctorId" 
                                    value={formData.headDoctorId} 
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Head Doctor</option>
                                    {doctors.map(doctor => (
                                        <option key={doctor.doctorId} value={doctor.doctorId}>
                                            Dr. {doctor.firstName} {doctor.lastName} ({doctor.specialization || 'General'})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="save-btn">
                                    <i className="fas fa-save"></i> Add Department
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {/* Edit Department Modal */}
            {showEditModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Edit Department: {currentDepartment.name}</h3>
                            <button className="close-btn" onClick={() => setShowEditModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleUpdateDepartment}>
                            <div className="form-group">
                                <label>Department Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleInputChange} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea 
                                    name="description" 
                                    value={formData.description} 
                                    onChange={handleInputChange} 
                                    rows="3"
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label>Head Doctor</label>
                                <select 
                                    name="headDoctorId" 
                                    value={formData.headDoctorId} 
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Head Doctor</option>
                                    {doctors.map(doctor => (
                                        <option key={doctor.doctorId} value={doctor.doctorId}>
                                            Dr. {doctor.firstName} {doctor.lastName} ({doctor.specialization || 'General'})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="save-btn">
                                    <i className="fas fa-save"></i> Update Department
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Staff Management Section
const StaffManagement = () => {
    const [staff, setStaff] = useState([]);
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
        position: '',
        hireDate: '',
        isAdmin: false
    });

    useEffect(() => {
        fetchStaff();
        fetchDepartments();
    }, []);

    const fetchStaff = async () => {
        setIsLoading(true);
        try {
            console.log("Fetching staff from:", 'http://localhost:8080/api/staff');
            // First try with /api prefix
            try {
                const response = await axios.get('http://localhost:8080/api/staff');
                console.log("Staff response:", response.data);
                setStaff(response.data);
            } catch (apiError) {
                console.log("Trying alternate URL without /api prefix");
                // If that fails, try without /api prefix
                const response = await axios.get('http://localhost:8080/staff');
                console.log("Staff response (alternate URL):", response.data);
                setStaff(response.data);
            }
        } catch (err) {
            console.error('Error fetching staff:', err);
            const errorMessage = err.response ? 
                `Failed to load staff members. Status: ${err.response.status}, Message: ${err.response.statusText}` : 
                'Failed to load staff members. Server might be unreachable. Please try again later.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/departments');
            setDepartments(response.data);
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
            position: '',
            hireDate: '',
            isAdmin: false
        });
        setShowAddModal(true);
    };

    const handleAddStaff = async (e) => {
        e.preventDefault();
        try {
            // Convert date string to ISO format for backend
            const dateOfBirth = formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null;
            const hireDate = formData.hireDate ? new Date(formData.hireDate).toISOString() : null;
            
            const staffData = {
                ...formData,
                dateOfBirth,
                hireDate,
                departmentId: formData.departmentId ? Number(formData.departmentId) : null
            };
            
            console.log("Creating staff member with data:", staffData);
            try {
                const response = await axios.post('http://localhost:8080/api/staff', staffData);
                console.log("Staff creation response:", response.data);
                setShowAddModal(false);
                fetchStaff(); // Refresh the list
            } catch (apiError) {
                console.log("Trying alternate URL without /api prefix");
                const response = await axios.post('http://localhost:8080/staff', staffData);
                console.log("Staff creation response (alternate URL):", response.data);
                setShowAddModal(false);
                fetchStaff(); // Refresh the list
            }
        } catch (err) {
            console.error('Error adding staff member:', err);
            setError(err.response?.data?.message || 'Failed to add staff member. Please try again.');
        }
    };

    const handleDeleteStaff = async (staffId) => {
        if (window.confirm('Are you sure you want to delete this staff member?')) {
            try {
                console.log(`Deleting staff member: ${staffId}`);
                try {
                    await axios.delete(`http://localhost:8080/api/staff/${staffId}`);
                    console.log(`Staff member ${staffId} deleted successfully`);
                    fetchStaff(); // Refresh the list
                } catch (apiError) {
                    console.log("Trying alternate URL without /api prefix");
                    await axios.delete(`http://localhost:8080/staff/${staffId}`);
                    console.log(`Staff member ${staffId} deleted successfully (alternate URL)`);
                    fetchStaff(); // Refresh the list
                }
            } catch (err) {
                console.error('Error deleting staff member:', err);
                setError(err.response?.data?.message || 'Failed to delete staff member. Please try again.');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading staff members...</p>
            </div>
        );
    }

    return (
        <div className="staff-management">
            {error && <div className="error-message">{error}</div>}
            
            <div className="staff-header">
                <button className="add-btn" onClick={openAddModal}>
                    <i className="fas fa-plus"></i> Add Staff Member
                </button>
            </div>
            
            <div className="staff-list">
                <table className="staff-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Position</th>
                            <th>Department</th>
                            <th>User Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map(member => (
                            <tr key={member.staffId}>
                                <td>{member.staffId}</td>
                                <td>{member.firstName} {member.lastName}</td>
                                <td>{member.email}</td>
                                <td>{member.position || 'N/A'}</td>
                                <td>{member.department ? member.department.name : 'N/A'}</td>
                                <td>{member.staffId.startsWith('A') ? 'Admin' : 'Staff'}</td>
                                <td className="actions-cell">
                                    <button className="action-btn view" onClick={() => window.location.href = `/staff/${member.staffId}`}>
                                        <i className="fas fa-eye"></i>
                                    </button>
                                    <button className="action-btn delete" onClick={() => handleDeleteStaff(member.staffId)}>
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {staff.length === 0 && (
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
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Add New Staff Member</h3>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleAddStaff}>
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
                                <h4>Employment Information</h4>
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
                                        <label>Position</label>
                                        <input 
                                            type="text" 
                                            name="position" 
                                            value={formData.position} 
                                            onChange={handleInputChange} 
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Hire Date</label>
                                        <input 
                                            type="date" 
                                            name="hireDate" 
                                            value={formData.hireDate} 
                                            onChange={handleInputChange} 
                                        />
                                    </div>
                                    <div className="form-group admin-toggle">
                                        <label className="checkbox-label">
                                            <input 
                                                type="checkbox" 
                                                name="isAdmin" 
                                                checked={formData.isAdmin} 
                                                onChange={handleInputChange} 
                                            />
                                            <span>Admin Privileges</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="save-btn">
                                    <i className="fas fa-save"></i> Add Staff Member
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffPage;
