import React from 'react';
import './StaffPage.css';

const StaffPage = () => {
    return (
        <div className="staff-dashboard">
            <aside className="sidebar">
                <h2>Staff Panel</h2>
                <nav>
                    <a href="#dashboard">Dashboard</a>
                    <a href="#patients">Patients</a>
                    <a href="#appointments">Appointments</a>
                    <a href="#inventory">Inventory</a>
                    <a href="#billing">Billing</a>
                    <a href="/" className="logout">Logout</a>
                </nav>
            </aside>
            
            <main className="main-content">
                <h1>Welcome to Staff Dashboard</h1>
                {/* Add your staff dashboard content here */}
            </main>
        </div>
    );
};

export default StaffPage;
