import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
const axiosInstance = axios.create({ baseURL: "http://localhost:5000" });


const Home = () => {
    const [posts, setPosts] = useState([]);
    useEffect(() => { axiosInstance.get("/posts").then((res) => setPosts(res.data)); }, []);
    return (
      <div>
        <Navbar />
        {posts.map((post) => (<PostCard key={post._id} post={post} />))}
      </div>
    );
  };

  export default Home;