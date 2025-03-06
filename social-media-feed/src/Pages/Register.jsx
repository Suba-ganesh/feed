import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Button, TextField, Box, Alert} from "@mui/material";
import axios from "axios";

const Register = () => {
    const [user, setUser] = useState({
      fullname: "",
      email: "",
      password: "",
    });
    const [message, setMessage] = useState({ text: "", type: "" });
    const navigate = useNavigate(); 
  
    const handleChange = (e) => {
      setUser({ ...user, [e.target.name]: e.target.value });
    };
  
    const handleRegister = async (e) => {
      e.preventDefault();
      
      if (!user.fullname || !user.email || !user.password) {
        setMessage({ text: "All fields are required!", type: "error" });
        return;
      }
  
      try {
        const response = await axios.post("http://localhost:5000/register", user);
        setMessage({ text: response.data.message, type: "success" });
  
       
        setTimeout(() => {
          navigate("/login");
        }, 1500);
  
        setUser({ fullname: "", email: "", password: "" }); // Reset form
      } catch (error) {
        setMessage({
          text: error.response?.data?.message || "Something went wrong",
          type: "error",
        });
      }
    };
  
    return (
      <Box sx={{ maxWidth: 400, mx: "auto", mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" textAlign="center" gutterBottom>
          Register
        </Typography>
  
        {message.text && <Alert severity={message.type}>{message.text}</Alert>}
  
        <form onSubmit={handleRegister}>
          <TextField
            fullWidth
            label="Full Name"
            name="fullname"
            value={user.fullname}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={user.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={user.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
      </Box>
    );
  };

  export default Register;