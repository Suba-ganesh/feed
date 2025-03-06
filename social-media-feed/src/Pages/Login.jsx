import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, TextField, Container } from "@mui/material";
import axios from "axios";

// Create Axios instance with default settings
const axiosInstance = axios.create({ baseURL: "http://localhost:5000" });

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation check
    if (!email.trim() || !password.trim()) {
      alert("Please enter both email and password");
      return;
    }

    try {
      const response = await axiosInstance.post("/login", { email, password });

      // Check if token exists before storing
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        navigate("/");
      } else {
        alert("Login failed: No token received");
      }
    } catch (error) {
      console.error("Login failed:", error);

      // Improved error handling
      const errorMessage = error.response?.data?.message || "Invalid email or password";
      alert(errorMessage);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>Login</Typography>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <TextField 
          label="Email" 
          fullWidth 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <TextField 
          label="Password" 
          type="password" 
          fullWidth 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <Button type="submit" variant="contained" color="primary">Login</Button>
      </form>
    </Container>
  );
};

export default Login;
