import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AuthForm.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword) {
      setError("Password is required");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/auth/reset-password",
        {
          token,
          newPassword,
        }
      );
      setMessage(res.data.message);
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Reset failed");
    }
  };

  return (
    <div className="AuthForm">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Reset Password</h1>
        {message && <p className="info-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <label>New Password</label>
        <input
          type="password"
          className="auth-input"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
        />
        <button className="auth-btn" type="submit">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
