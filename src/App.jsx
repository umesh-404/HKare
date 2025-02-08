import { useState } from 'react'
import './App.css'
import PatientPage from './components/patient/PatientPage'
import HomePage from './components/home_page/HomePage'
function App() {
  const [count, setCount] = useState(0)


  return (
    <>
    <PatientPage />
    </>
  )
}

export default App
