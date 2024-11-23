import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../styles/SignUp.module.css"; // Reuse SignUp styles
import axios from "axios";

const ForgotPassword = () => {
  const [data, setData] = useState({
    email: "",
    newPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const changeHandler = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!data.email.trim()) newErrors.email = "Email is required.";
    if (!data.newPassword.trim()) newErrors.newPassword = "New password is required.";
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post("http://localhost:8000/reset-password", {
          email: data.email,
          password: data.newPassword,
        });

        if (response.data.success) {
          toast.success("Password reset successful. Redirecting to login...");
          setTimeout(() => {
            navigate("/login");
          }, 5000); // Redirect after 5 seconds
        } else {
          toast.error(response.data.message || "Error resetting password.");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "An error occurred.");
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={data.email}
          onChange={changeHandler}
        />
        {errors.email && <span className={styles.error}>{errors.email}</span>}

        <input
          type="password"
          name="newPassword"
          placeholder="Enter your new password"
          value={data.newPassword}
          onChange={changeHandler}
        />
        {errors.newPassword && (
          <span className={styles.error}>{errors.newPassword}</span>
        )}

        <button type="submit">Reset Password</button>
      </form>
      <div className={styles.loginBox}>
        <p>
          Remembered your password?{" "}
          <a href="/login" className={styles.link}>
            Log in
          </a>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
