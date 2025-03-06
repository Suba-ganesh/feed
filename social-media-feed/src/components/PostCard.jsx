import React, { useState, useEffect } from "react";
import { Typography, Button, Card, CardContent, TextField, IconButton } from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import axios from "axios";


const PostCard = ({ post }) => {
    const [likes, setLikes] = useState(post.likes || 0);
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
  
    // Fetch comments when component mounts
    useEffect(() => {
      const fetchComments = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/posts/${post.id}/comments`);
          setComments(response.data.comments);
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      };
      fetchComments();
    }, [post.id]); 
  
  
    const handleLike = async () => {
      try {
        await axios.post(`http://localhost:5000/posts/${post.id}/like`);
        setLikes((prevLikes) => prevLikes + 1);
        setIsLiked(true);
      } catch (error) {
        console.error("Error liking post:", error);
      }
    };
  
    const handleAddComment = async () => {
      if (!newComment.trim()) return;
  
      try {
        const response = await axios.post(`http://localhost:5000/posts/${post.id}/comments`, { text: newComment });
        setComments([...comments, response.data.comment]); // Add new comment to list
        setNewComment("");
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    };
  
    return (
      <Card sx={{ margin: 2, padding: 2 }}>
        <CardContent>
          <Typography variant="h6">{post.username || "Unknown User"}</Typography>
          {post.imageUrl && <img src={post.imageUrl} alt="Post" width="100%" style={{borderRadius:"20px"}} />}
          <Typography variant="body1">{post.content || "No content available"}</Typography>
  
          <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
            <IconButton onClick={handleLike} disabled={isLiked} type="button">
              {isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
            <Typography>{likes} Likes</Typography>
          </div>
  
          {/* Display comments */}
          <div style={{ marginTop: 16 }}>
            <Typography variant="subtitle1">Comments:</Typography>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <Typography key={index} variant="body2" sx={{ marginLeft: 2 }}>
                  {comment.text}
                </Typography>
              ))
            ) : (
              <Typography variant="body2" sx={{ marginLeft: 2, color: "gray" }}>
                No comments yet.
              </Typography>
            )}
          </div>
  
          {/* Add Comment Section */}
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <TextField
              size="small"
              fullWidth
              variant="outlined"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button variant="contained" onClick={handleAddComment} type="button">
              Post
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };


  export default PostCard;