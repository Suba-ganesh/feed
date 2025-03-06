import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, TextField, Container} from "@mui/material";
import axios from "axios";
const axiosInstance = axios.create({ baseURL: "http://localhost:5000" });


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
  
    const handleLogin = async (e) => {
      e.preventDefault();
  
      try {
        const response = await axiosInstance.post("/login", { email, password });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        navigate("/");
      } catch (error) {
        console.error("Login failed:", error);
        alert(error.response?.data?.message || "Login failed");
      }
    };
  
    return (
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>Login</Typography>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <TextField label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} required />
          <TextField label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" variant="contained" color="primary">Login</Button>
        </form>
      </Container>
    );
  };
  
  export default Login;