import "./app.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreatePost from "./Pages/CreatePost";
import Home from "./pages/Home";


const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/create-post" element={<CreatePost />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  </Router>
);

export default App;
