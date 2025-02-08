import { useState } from 'react'
import './App.css'
import DoctorLogin from './components/login_pages/DoctorLogin'
import PatientLogin from './components/login_pages/PatientLogin'
import StaffLogin from './components/login_pages/StaffLogin'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <StaffLogin />
    
    </>
  )



}

export default App
