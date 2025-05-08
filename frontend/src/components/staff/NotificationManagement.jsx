import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Form data state
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'GENERAL',
    priority: 'NORMAL',
    recipientType: 'ALL',
    recipientId: '',
    scheduledTime: ''
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/notifications');
      setNotifications(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddNotification = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/notifications', formData);
      setShowAddModal(false);
      fetchNotifications();
      setFormData({
        title: '',
        message: '',
        type: 'GENERAL',
        priority: 'NORMAL',
        recipientType: 'ALL',
        recipientId: '',
        scheduledTime: ''
      });
    } catch (err) {
      console.error('Error adding notification:', err);
      setError('Failed to add notification. Please try again.');
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
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return "N/A";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'SENT':
        return 'status-completed';
      case 'PENDING':
        return 'status-pending';
      case 'FAILED':
        return 'status-rejected';
      default:
        return '';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'priority-high';
      case 'NORMAL':
        return 'priority-normal';
      case 'LOW':
        return 'priority-low';
      default:
        return '';
    }
  };

  const getFilteredNotifications = () => {
    return notifications.filter(notification => {
      // Filter by type
      if (typeFilter !== 'ALL' && notification.type !== typeFilter) {
        return false;
      }
      
      // Filter by status
      if (statusFilter !== 'ALL' && notification.status !== statusFilter) {
        return false;
      }
      
      // Search term filter
      if (searchTerm) {
        const searchString = `${notification.title} ${notification.message} ${notification.recipientType}`.toLowerCase();
        return searchString.includes(searchTerm.toLowerCase());
      }
      
      return true;
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading notifications...</p>
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
              <label>Type:</label>
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="filter-select"
              >
                <option value="ALL">All Types</option>
                <option value="GENERAL">General</option>
                <option value="APPOINTMENT">Appointment</option>
                <option value="PRESCRIPTION">Prescription</option>
                <option value="MEDICAL_RECORD">Medical Record</option>
                <option value="PAYMENT">Payment</option>
                <option value="SYSTEM">System</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Status:</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="ALL">All Status</option>
                <option value="SENT">Sent</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Search:</label>
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <i className="fas fa-search search-icon"></i>
              </div>
            </div>
          </div>
        </div>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus"></i> Send Notification
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Type</th>
              <th>Priority</th>
              <th>Recipient</th>
              <th>Scheduled Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredNotifications().length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">No notifications found</td>
              </tr>
            ) : (
              getFilteredNotifications().map(notification => (
                <tr key={notification.notificationId}>
                  <td>{notification.notificationId}</td>
                  <td>
                    <div className="notification-title">
                      {notification.title}
                      <div className="notification-message">{notification.message}</div>
                    </div>
                  </td>
                  <td>{notification.type}</td>
                  <td>
                    <span className={`priority-badge ${getPriorityClass(notification.priority)}`}>
                      {notification.priority}
                    </span>
                  </td>
                  <td>
                    {notification.recipientType === 'ALL' ? 'All Users' : `${notification.recipientType}: ${notification.recipientId}`}
                  </td>
                  <td>{formatDate(notification.scheduledTime)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(notification.status)}`}>
                      {notification.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Notification Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Send New Notification</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleAddNotification}>
                <div className="form-section">
                  <div className="form-group">
                    <label>Title*</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter notification title..."
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Message*</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      placeholder="Enter notification message..."
                    ></textarea>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Type*</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="GENERAL">General</option>
                        <option value="APPOINTMENT">Appointment</option>
                        <option value="PRESCRIPTION">Prescription</option>
                        <option value="MEDICAL_RECORD">Medical Record</option>
                        <option value="PAYMENT">Payment</option>
                        <option value="SYSTEM">System</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Priority*</label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="NORMAL">Normal</option>
                        <option value="HIGH">High</option>
                        <option value="LOW">Low</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Recipient Type*</label>
                      <select
                        name="recipientType"
                        value={formData.recipientType}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="ALL">All Users</option>
                        <option value="PATIENT">Patient</option>
                        <option value="DOCTOR">Doctor</option>
                        <option value="STAFF">Staff</option>
                      </select>
                    </div>
                    {formData.recipientType !== 'ALL' && (
                      <div className="form-group">
                        <label>Recipient ID</label>
                        <input
                          type="text"
                          name="recipientId"
                          value={formData.recipientId}
                          onChange={handleInputChange}
                          placeholder="Enter recipient ID..."
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label>Schedule Time (Optional)</label>
                    <input
                      type="datetime-local"
                      name="scheduledTime"
                      value={formData.scheduledTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    <i className="fas fa-paper-plane"></i> Send Notification
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

export default NotificationManagement; 