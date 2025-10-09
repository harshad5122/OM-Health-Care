import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Auth.css';
import loginIllustration from '../../assets/auth/login-illustration.png';
// import { signinUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { useAuthApi } from '../../api/authApi';
import { showAlert } from '../../components/AlertComponent';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton } from '@mui/material';
const UserTypes = Object.freeze({
  USER: 1,
  ADMIN: 2,
  STAFF: 3,
});


const Login = () => {
  // const { saveToken } = useAuth();
  const { saveAuthData } = useAuth();
  const [loginMethod, setLoginMethod] = useState('phone');
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const { signinUser } = useAuthApi();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (loginMethod === 'phone' && !otpSent) {

        // Step 1: Request OTP
        const res = await signinUser({
          loginType: "phone",
          countryCode,
          phone,
        });
        alert(res.msg); // "OTP Sent"
        setOtpSent(true);

      } else if (loginMethod === 'phone' && otpSent) {
        const res = await signinUser({
          loginType: "phone",
          countryCode,
          phone,
          otp,
        });
        showAlert(res.msg || "Logged in successfully!", "success");
        saveAuthData(res.body.token, res.body);
        console.log("Login Token:", res.body.token, res.body);
        // navigate("/");
        if (res.body.isPasswordChanged) {
          redirectUser("changePassword")
        } else {
          redirectUser(res.body.role);
        }

      } else {
        const res = await signinUser({
          loginType: "email",
          email,
          password,
        });
        showAlert(res.msg || "Logged in successfully!", "success");
        saveAuthData(res.body.token, res.body);
        console.log("Login Token:", res.body.token, res.body);
        // navigate("/");
        if (res.body.isPasswordChanged) {
          redirectUser("changePassword")
        } else {
          redirectUser(res.body.role);
        }
      }
    } catch (err) {
      showAlert(err.msg || "Login failed", "error")
    }
  };

  const redirectUser = (role) => {
    switch (role) {
      case "changePassword":
        navigate("/auth/change-password");
        break;
      case UserTypes.ADMIN:
        navigate("/dashboard/admin");
        break;
      case UserTypes.STAFF:
        navigate("/dashboard/staff");
        break;
      case UserTypes.USER:
      default:
        navigate("/dashboard/user");
        break;
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
              type="button"
              className={`toggle-option ${loginMethod === 'phone' ? 'active' : ''}`}
              onClick={() => { setLoginMethod('phone'); setOtpSent(false); }} // Reset OTP state on method change
            >
              Login with Phone
            </button>
            <button
              type="button"
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
                      <select
                        id="country-code"
                        className="country-code"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                      >
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
                    <p className="resend-otp">Didn't receive code?{" "}
                      <button type="button"
                        className="link-button"
                        onClick={() =>
                          signinUser({ loginType: "phone", countryCode, phone })
                        }
                      >Resend OTP</button></p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="form-row single-col">
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
                </div>
                {/* <div className="form-row single-col">
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
                </div> */}
              <div className="form-row single-col pt-2">
                <div className="form-group" style={{ position: "relative" }}>
                  <label htmlFor="password">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="password-input"
                    style={{ paddingRight: "40px" }} 
                  />
                  <IconButton
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "65%",
                      transform: "translateY(-50%)",
                      color: "#777",
                      padding: 0,
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </div>
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