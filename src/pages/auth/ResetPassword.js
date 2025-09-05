import React, { useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import "../../styles/Auth.css";
import loginIllustration from "../../assets/auth/login-illustration.png";
import { useAuthApi } from "../../api/authApi";

const ChangePassword = () => {
    const navigate = useNavigate();
    const { changePassword } = useAuthApi(); // ✅ You'll implement this in your API
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const from = params.get("from");
    console.log(from,"from")


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            setIsSubmitting(true);
            const res = await changePassword({ newPassword: password });
            alert(res.msg || "Password changed successfully");
            navigate("/auth/login");
        } catch (err) {
            alert(err.msg || "Failed to change password");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
    if (from === "profile") {
      navigate("/dashboard/admin/profile");
    } else {
      navigate("/");
    }
  };
    return (
        <div className="auth-wrapper">
            <div className="auth-illustration-section">
                <button 
                // onClick={() => navigate("/")} 
                onClick={handleBack}
                className="go-back-button">
                    <svg
                        className="go-back-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Go Back
                </button>
                <div className="illustration-content">
                    <img
                        src={loginIllustration}
                        alt="Change Password Illustration"
                        className="auth-illustration"
                    />
                    <h3 className="illustration-title">Change Your Password</h3>
                    <p className="illustration-subtitle">
                        Please enter a new password for your account.
                    </p>
                </div>
            </div>

            <div className="auth-form-section">
                <div className="auth-card">
                    <div className="auth-header">
                        <h2>Change Password</h2>
                        <p>Enter your new password below.</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-row single-col">
                            <div className="form-group">
                                <label htmlFor="password">New Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row single-col">
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Retype New Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    placeholder="Retype new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={isSubmitting}

                        >
                            {isSubmitting ? "Changing..." : "Change Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
