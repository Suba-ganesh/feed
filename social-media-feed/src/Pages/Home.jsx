import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
const axiosInstance = axios.create({ baseURL: "http://localhost:5000" });


const Home = () => {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState("none");

  useEffect(() => {
    axiosInstance.get("/posts").then((res) => setPosts(res.data));
  }, []);

  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === "likes") return b.likes - a.likes;
    if (sortBy === "comments") return (b.comments?.length || 0) - (a.comments?.length || 0);
    return 0;
  });

  return (
    <div>
      <Navbar />
      <Box display="flex" justifyContent="center" margin={2}>
        <Button variant="outlined" onClick={() => setSortBy("likes")} sx={{ mx: 1 }}>
          Sort by Likes
        </Button>
        <Button variant="outlined" onClick={() => setSortBy("comments")} sx={{ mx: 1 }}>
          Sort by Comments
        </Button>
        <Button variant="outlined" onClick={() => setSortBy("none")} sx={{ mx: 1 }}>
          Clear Sorting
        </Button>
      </Box>
      {sortedPosts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};


  export default Home;