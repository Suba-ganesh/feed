import {  Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      navigate("/login");
    };
  
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Social Media Feed</Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          {token ? (
            <>
              <Button color="inherit" component={Link} to="/create-post">Create Post</Button>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/register">Register</Button>
              <Button color="inherit" component={Link} to="/login">Login</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    );
  };

  export default Navbar;