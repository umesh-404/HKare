import React, { useState } from 'react';
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

    const handleLogout = () => {
        setShowLogoutPopup(true);
        setTimeout(() => {
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
            default:
                return <div>Select a section from the sidebar</div>;
        }
    };

    return (
        <div className="staff-page">
            {/* Header */}
            <header className="staff-header">
                <div className="header-left">
                    <img src="/vite.svg" alt="Hospital Logo" className="header-logo" />
                </div>
                <div className="header-right">
                    <div className="user-info">
                        <i className="fas fa-user user-icon"></i>
                        <span className="user-name">Staff Member</span>
                        <button 
                            className="logout-button" 
                            onClick={handleLogout}
                        >
                            <i className="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
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

            {/* Main Content Area */}
            <div className="main-area">
                {/* Sidebar */}
                <aside className="sidebar">
                    {["Dashboard", "Appointments", "Patients", "Prescriptions", "Payments", "Messages", "Settings"].map(
                        (item) => (
                            <button
                                key={item}
                                className={`nav-button ${activeSection === item.toLowerCase() ? "active" : ""}`}
                                onClick={() => setActiveSection(item.toLowerCase())}
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
                            {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
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
        'dashboard': 'fa-tachometer-alt',
        'appointments': 'fa-calendar-check',
        'patients': 'fa-users',
        'prescriptions': 'fa-prescription-bottle',
        'payments': 'fa-credit-card',
        'messages': 'fa-envelope',
        'settings': 'fa-cog'
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

export default StaffPage;
