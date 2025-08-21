


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Auth.css'; // Path to your Auth.css
// import { ReactComponent as ArrowLeftIcon } from '../../assets/icons/arrow-left.svg';
import loginIllustration from '../../assets/auth/login-illustration.png'; // Your illustration for login

const Login = () => {
  const [loginMethod, setLoginMethod] = useState('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginMethod === 'phone' && !otpSent) {
      console.log('Sending OTP to:', phone);
      setOtpSent(true);
    } else if (loginMethod === 'phone' && otpSent) {
      console.log('Verifying OTP:', otp);
      // Simulate successful login
      navigate('/');
    } else {
      console.log('Attempting email login with:', email, password);
      // Simulate successful login
      navigate('/');
    }
  };

  return (
    <div className="auth-wrapper"> {/* New wrapper for the split layout */}
      <div className="auth-illustration-section">
        <button onClick={() => navigate('/')} className="go-back-button">
          {/* <ArrowLeftIcon className="go-back-icon" />  */}
          <svg className="go-back-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          Go Back
        </button>
        <div className="illustration-content">
          <img src={loginIllustration} alt="Login Illustration" className="auth-illustration" />
          <h3 className="illustration-title">Welcome Back to OM Health Care</h3>
          <p className="illustration-subtitle">Your health journey continues here. Log in for personalized care.</p>
        </div>
      </div>

      <div className="auth-form-section">
        <div className="auth-card">
          <div className="auth-header">
            <h2>Access Your Account</h2>
            <p>Please select your preferred login method.</p>
          </div>

          <div className="auth-method-toggle">
            <button
              className={`toggle-option ${loginMethod === 'phone' ? 'active' : ''}`}
              onClick={() => { setLoginMethod('phone'); setOtpSent(false); }} // Reset OTP state on method change
            >
              Login with Phone
            </button>
            <button
              className={`toggle-option ${loginMethod === 'email' ? 'active' : ''}`}
              onClick={() => { setLoginMethod('email'); setOtpSent(false); }} // Reset OTP state on method change
            >
              Login with Email
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {loginMethod === 'phone' ? (
              <>
                {!otpSent ? (
                  <div className="form-group">
                    <label htmlFor="mobile">Mobile Number</label>
                    <div className="phone-input">
                      <select id="country-code" className="country-code">
                        <option value="+91">+91 (IN)</option>
                        <option value="+1">+1 (US)</option>
                        {/* Add more country codes as needed */}
                      </select>
                      <input
                        type="tel"
                        id="mobile"
                        placeholder="Enter your mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div className="form-group">
                    <label htmlFor="otp">Enter OTP</label>
                    <input
                      type="text"
                      id="otp"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                    <p className="resend-otp">Didn't receive code? <button type="button" className="link-button">Resend OTP</button></p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <button type="submit" className="auth-button">
              {loginMethod === 'phone' ? (otpSent ? 'Verify & Login' : 'Send OTP') : 'Login'}
            </button>
          </form>

          <div className="auth-footer">
            {loginMethod === 'email' && (
              <Link to="/auth/forgot-password" className="auth-link">
                Forgot Password?
              </Link>
            )}
            <p className="signup-prompt">
              Don't have an account?{' '}
              <Link to="/auth/register" className="auth-link">
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;