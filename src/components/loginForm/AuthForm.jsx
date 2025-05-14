import React, { use, useState, useEffect } from "react";
import "./AuthForm.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { API_BASE } from "../../../api";
import "react-toastify/dist/ReactToastify.css";

const AuthForm = () => {
  const [activeTab, setActiveTab] = useState("login");

  // const [loginEmail, setLoginEmail] = useState("");
  // const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerError, setRegisterError] = useState("");

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  const [isTaskManager, setIsTaskManager] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const [ph, setPh] = useState("");
  // const API_BASE = "http://localhost:5000/api/auth";

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const handleFormValidation = (event) => {
    console.log(event);
    const { id, value } = event;
    console.log(value, id);
    setLoginForm((oldstate) => ({
      ...oldstate,
      [id]: value,
    }));
  };

  const validatePassword = (password) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!forgotEmail) {
      setForgotMessage("Please enter your email.");
      return;
    }
    if (!emailPattern.test(forgotEmail)) {
      setForgotMessage("Please enter a valid email.");
      return;
    }

    try {
      const res = await axios.post("${API_BASE}/forgot-password", {
        email: forgotEmail,
      });
      setForgotMessage(
        "If this email is registered, a reset link will be sent."
      );
      console.log("Reset response:", res.data);
    } catch (err) {
      setForgotMessage("Failed to send reset email.");
      console.error(
        "Reset email error:",
        err.response?.data?.error || err.message
      );
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setLoginError("");
    setRegisterError("");
    setPasswordError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (!loginForm.email || !loginForm.password) {
      setLoginError("Both email and password are required.");
      return;
    }
    console.log(loginForm);
    try {
      const res = await axios.post(`${API_BASE}/login`, {
        email: loginForm.email,
        password: loginForm.password,
      });

      const { user, token } = res.data;
      localStorage.setItem("token", token);

      toast.success(`Welcome back, ${user.name}`);
      setTimeout(() => {
        navigate(user.role === "task-manager" ? "/task-manager" : "/tasks");
      }, 1000);
    } catch (err) {
      setLoginError(err.response?.data?.error || "Login failed.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError("");
    setPasswordError("");

    if (!registerName || !registerEmail || !registerPassword) {
      setRegisterError("All fields are required for registration.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(registerEmail)) {
      setRegisterError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(registerPassword)) {
      setPasswordError(
        "Password must be at least 8 characters, contain uppercase and lowercase letters, a number, and a special character."
      );
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/register`, {
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        role: isTaskManager ? "task-manager" : "user",
      });

      toast.success("Registration successful! You can now log in.");
      setActiveTab("login");
    } catch (err) {
      setRegisterError(err.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <div className="AuthForm">
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "login" ? "active" : ""}`}
          onClick={() => handleTabChange("login")}
        >
          Login
        </button>
        <button
          className={`tab-btn ${activeTab === "register" ? "active" : ""}`}
          onClick={() => handleTabChange("register")}
        >
          Register
        </button>
      </div>

      {activeTab === "login" && (
        <form className="auth-form" onSubmit={handleLogin}>
          <h1>Login</h1>
          {loginError && <p className="error-message">{loginError}</p>}
          <label>Email</label>
          <input
            type="text"
            className="auth-input"
            placeholder="Enter your email"
            value={loginForm.email}
            onChange={(e) => handleFormValidation(e.target)}
            id="email"
          />

          <label>Password</label>
          <div className="password-input-wrapper">
            <input
              type={showLoginPassword ? "text" : "password"}
              className="auth-input"
              placeholder="Enter your password"
              value={loginForm.password}
              onChange={(e) => handleFormValidation(e.target)}
              id="password"
            />
            <FontAwesomeIcon
              icon={showLoginPassword ? faEyeSlash : faEye}
              className="eye-icon"
              onClick={() => setShowLoginPassword(!showLoginPassword)}
            />
          </div>

          <button type="submit" className="auth-btn">
            Login
          </button>
          <div className="forgot-password-link">
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot Password?
            </Link>
          </div>
        </form>
      )}

      {showForgotPassword && (
        <form className="auth-form" onSubmit={handleForgotPassword}>
          <h1>Forgot Password</h1>
          {forgotMessage && <p className="info-message">{forgotMessage}</p>}
          <label>Email</label>
          <input
            type="text"
            className="auth-input"
            placeholder="Enter your email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
          />
          <button type="submit" className="auth-btn">
            Send Reset Link
          </button>
          <div className="forgot-password-link">
            <span onClick={() => setShowForgotPassword(false)}>
              Back to Login
            </span>
          </div>
        </form>
      )}

      {activeTab === "register" && (
        <form className="auth-form" onSubmit={handleRegister}>
          <h1>Register</h1>
          {registerError && <p className="error-message">{registerError}</p>}

          <label>Name</label>
          <input
            type="text"
            className="auth-input"
            placeholder="Enter your name"
            value={registerName}
            onChange={(e) => setRegisterName(e.target.value)}
          />

          <label>Email</label>
          <input
            type="text"
            className="auth-input"
            placeholder="Enter your email"
            value={registerEmail}
            onChange={(e) => setRegisterEmail(e.target.value)}
          />

          <label>Password</label>
          <div className="password-input-wrapper">
            <input
              type={showRegisterPassword ? "text" : "password"}
              className="auth-input"
              placeholder="Enter your password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
            <FontAwesomeIcon
              icon={showRegisterPassword ? faEyeSlash : faEye}
              className="eye-icon"
              onClick={() => setShowRegisterPassword(!showRegisterPassword)}
            />
          </div>

          {passwordError && <p className="error-message">{passwordError}</p>}

          <label>
            <input
              className="checkbox"
              type="checkbox"
              checked={isTaskManager}
              onChange={(e) => setIsTaskManager(e.target.checked)}
              style={{ marginRight: "8px" }}
            />
            Task Manager
          </label>

          <button type="submit" className="auth-btn">
            Register
          </button>
        </form>
      )}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default AuthForm;
