import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import HomePage from './components/home_page/HomePage'
import DoctorLogin from './components/login_pages/DoctorLogin'
import PatientLogin from './components/login_pages/PatientLogin'
import StaffLogin from './components/login_pages/StaffLogin'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/staff-login" element={<StaffLogin />} />
      </Routes>
    </Router>
  );
}

export default App
