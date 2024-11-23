import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added Link for navigation
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../styles/SignUp.module.css";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    user_id: "",
    name: "",
    email: "",
    phone_number: "",
    role: "Member",
    password: "",
    confirmPassword: "", // Added confirmPassword field
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateStepOne = () => {
    const newErrors = {};
    if (!data.user_id.trim()) newErrors.user_id = "User ID is required.";
    if (!data.name.trim()) newErrors.name = "Name is required.";
    if (!data.email.trim()) newErrors.email = "Email is required.";
    if (!data.phone_number.trim() || !/^\d{11,15}$/.test(data.phone_number))
      newErrors.phone_number = "Valid phone number is required.";
    return newErrors;
  };

  const validateStepTwo = () => {
    const newErrors = {};
    if (!data.password.trim()) newErrors.password = "Password is required.";
    else if (data.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (!data.confirmPassword.trim())
      newErrors.confirmPassword = "Confirm Password is required.";
    else if (data.password !== data.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    return newErrors;
  };

  const changeHandler = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const nextStep = () => {
    const validationErrors = validateStepOne();
    if (Object.keys(validationErrors).length === 0) {
      setErrors({});
      setStep(2);
    } else {
      setErrors(validationErrors);
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const validationErrors = validateStepTwo();
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch("http://localhost:8000/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (result.success) {
          toast.success("Signup successful!");
          navigate("/login"); // Redirect to login after signup
        } else {
          toast.error(result.message || "Signup failed.");
        }
      } catch (error) {
        toast.error("Something went wrong.");
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className={styles.container}>
      <h2>{step === 1 ? "Sign Up" : "Password"}</h2>
      {step === 1 ? (
        <form>
          <input
            type="text"
            name="user_id"
            placeholder="User ID"
            value={data.user_id}
            onChange={changeHandler}
          />
          {errors.user_id && <span className={styles.error}>{errors.user_id}</span>}

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={data.name}
            onChange={changeHandler}
          />
          {errors.name && <span className={styles.error}>{errors.name}</span>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={data.email}
            onChange={changeHandler}
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}

          <input
            type="text"
            name="phone_number"
            placeholder="Phone Number"
            value={data.phone_number}
            onChange={changeHandler}
          />
          {errors.phone_number && (
            <span className={styles.error}>{errors.phone_number}</span>
          )}

          <select name="role" value={data.role} onChange={changeHandler}>
            <option value="Admin">Admin</option>
            <option value="Member">Member</option>
          </select>

          <button type="button" onClick={nextStep}>
            Next
          </button>

          <p>
            Already have an account?{" "}
            <Link to="/login" className={styles.link}>
              Log In
            </Link>
          </p>
        </form>
      ) : (
        <form onSubmit={submitHandler}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={data.password}
            onChange={changeHandler}
          />
          {errors.password && (
            <span className={styles.error}>{errors.password}</span>
          )}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={data.confirmPassword}
            onChange={changeHandler}
          />
          {errors.confirmPassword && (
            <span className={styles.error}>{errors.confirmPassword}</span>
          )}

          <button type="submit">Submit</button>
        </form>
      )}
      <ToastContainer />
    </div>
  );
};

export default SignUp;
