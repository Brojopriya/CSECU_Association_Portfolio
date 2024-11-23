import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../styles/SignUp.module.css";
import axios from "axios";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const changeHandler = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!data.email.trim()) newErrors.email = "Email is required.";
    if (!data.password.trim()) newErrors.password = "Password is required.";
    return newErrors;
  };

   const submitHandler = async (event) => {
    event.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post("http://localhost:8000/login", {
          email: data.email,
          password: data.password,
        });
       if (response.data.success) {
          toast.success("Login successful!");
          localStorage.setItem("token", response.data.token);
          navigate("/dashboard");
        } else {
          toast.error(response.data.message || "Login failed.");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "An error occurred during login."
        );
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <form onSubmit={submitHandler}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={data.email}
          onChange={changeHandler}
        />
        {errors.email && <span className={styles.error}>{errors.email}</span>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={changeHandler}
        />
        {errors.password && <span className={styles.error}>{errors.password}</span>}

        <button type="submit">Log In</button>

        <div className={styles.links}>
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className={styles.link}>
              Sign Up
            </Link>
          </p>
          <p>
            Forgot your password?{" "}
            <Link to="/forgot-password" className={styles.link}>
              Reset it here
            </Link>
          </p>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
