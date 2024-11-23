import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import styles from "../styles/SignUp.module.css";

// Validation function
export const validate = (data) => {
  const errors = {};

  if (!data.user_id.trim()) errors.user_id = "User ID is required.";
  if (!data.name.trim()) errors.name = "Name is required.";
  if (!data.email.trim()) errors.email = "Email is required.";
  if (!data.phone_number.trim() || !/^\d{11,15}$/.test(data.phone_number))
    errors.phone_number = "Valid phone number is required.";
  if (!data.password.trim()) errors.password = "Password is required.";
  else if (data.password.length < 6) errors.password = "Password must be at least 6 characters.";
  if (data.confirmPassword !== data.password)
    errors.confirmPassword = "Passwords do not match.";
  if (!data.role) errors.role = "Role selection is required.";

  return errors;
};

const SignUp = () => {
  const [data, setData] = useState({
    user_id: "",
    name: "", // Changed from user_name to name
    email: "",
    phone_number: "",
    role: "Member", // Default role is Member
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate(); // useNavigate hook to redirect

  // Update errors whenever the data changes
  useEffect(() => {
    setErrors(validate(data));
  }, [data]);

  const changeHandler = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const blurHandler = (event) => {
    setTouched({ ...touched, [event.target.name]: true });
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    // Final validation before submission
    const validationErrors = validate(data);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const url = `http://localhost:8000/signup`; // Ensure this URL matches the backend API route
      try {
        const response = await axios.post(url, data);
        if (response.data.success) {
          toast.success("Registered successfully!");
          setTimeout(() => {
            navigate("/login"); // Redirect to login page after 5 seconds
          }, 5000);
        } else {
          toast.error(response.data.message || "Something went wrong!");
        }
      } catch (error) {
        toast.error("Something went wrong during registration.");
      }
    } else {
      toast.error("Please fix the errors before submitting.");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={submitHandler}>
        <h2>Sign Up</h2>
        <input
          type="text"
          name="user_id"
          placeholder="User ID"
          value={data.user_id}
          onChange={changeHandler}
          onBlur={blurHandler}
        />
        {touched.user_id && errors.user_id && (
          <span className={styles.error}>{errors.user_id}</span>
        )}
        <input
          type="text"
          name="name" // Changed from user_name to name
          placeholder="Name"
          value={data.name}
          onChange={changeHandler}
          onBlur={blurHandler}
        />
        {touched.name && errors.name && (
          <span className={styles.error}>{errors.name}</span>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={data.email}
          onChange={changeHandler}
          onBlur={blurHandler}
        />
        {touched.email && errors.email && (
          <span className={styles.error}>{errors.email}</span>
        )}
        <input
          type="text"
          name="phone_number"
          placeholder="Phone"
          value={data.phone_number}
          onChange={changeHandler}
          onBlur={blurHandler}
        />
        {touched.phone_number && errors.phone_number && (
          <span className={styles.error}>{errors.phone_number}</span>
        )}
        <select
          name="role"
          value={data.role}
          onChange={changeHandler}
          onBlur={blurHandler}
        >
          <option value="Admin">Admin</option>
          <option value="Member">Member</option>
        </select>
        {touched.role && errors.role && (
          <span className={styles.error}>{errors.role}</span>
        )}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={changeHandler}
          onBlur={blurHandler}
        />
        {touched.password && errors.password && (
          <span className={styles.error}>{errors.password}</span>
        )}
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={data.confirmPassword}
          onChange={changeHandler}
          onBlur={blurHandler}
        />
        {touched.confirmPassword && errors.confirmPassword && (
          <span className={styles.error}>{errors.confirmPassword}</span>
        )}
        <button type="submit">Sign Up</button>
        <p>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SignUp;