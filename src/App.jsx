import { useState } from 'react'
import './App.css'
import HomePage from './components/home_page/HomePage'
import DoctorLogin from './components/login_pages/DoctorLogin'
import PatientLogin from './components/login_pages/PatientLogin'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <HomePage />
    </>
  )
}

export default App
