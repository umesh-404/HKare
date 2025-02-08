import './DoctorLogin.css';

const DoctorLogin = () => {
  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Doctor Login</h2>
        <p className="login-subtitle">Please enter your details to login</p>
        <form className="login-form">
          <div className="form-group">
            <label htmlFor="doctorId">Doctor ID</label>
            <input 
              type="text" 
              id="doctorId" 
              name="doctorId" 
              placeholder="Enter your Doctor ID" 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="Enter your password" 
              required 
            />
          </div>

          <div className="forgot-password">
            <a href="/forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  )
}

export default PatientLogin;
