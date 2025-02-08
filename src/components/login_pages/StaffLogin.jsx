import './StaffLogin.css';

const StaffLogin = () => {
  return (

    <div className="login-container">
      <div className="login-card">

        <h2 className="login-title">Staff Login</h2>
        <p className="login-subtitle">Please enter your details to login</p>
        <form className="login-form">
          <div className="form-group">


            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Enter your email" required />
          </div>



          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Enter your password" required />
          </div>

          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  )
}

export default StaffLogin;
