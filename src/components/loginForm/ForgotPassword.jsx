import React, { useState } from "react";
import axios from "axios";
import "./AuthForm.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }
    if (!emailPattern.test(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/auth/forgot-password",
        {
          email,
        }
      );
      setMessage("If this email is registered, a reset link will be sent.");
      toast.success("Reset email sent (if registered).");
      console.log("Reset response:", res.data);
    } catch (err) {
      setMessage("Failed to send reset email.");
      console.error("Reset error:", err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="AuthForm">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Forgot Password</h1>
        {message && <p className="info-message">{message}</p>}

        <label>Email</label>
        <input
          type="email"
          className="auth-input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit" className="auth-btn">
          Send Reset Link
        </button>

        <div className="forgot-password-link">
          <Link to="/" style={{ textDecoration: "none" }}>
            ← Back to Login
          </Link>
        </div>
      </form>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default ForgotPassword;
