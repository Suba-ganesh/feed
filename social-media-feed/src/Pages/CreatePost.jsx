import React, { useState } from "react";
import { Typography, Button, Card, CardContent, TextField,CircularProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";



const CreatePost = () => {
    const [userId, setUserId] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
  
    const handleFileChange = (event) => setImage(event.target.files[0]);
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      if (!userId || !content) {
        setMessage("User ID and Post content are required!");
        return;
      }
  
      setLoading(true);
      const formData = new FormData();
      formData.append("userId", userId); 
      formData.append("content", content);
      if (image) formData.append("imageURL", image);
  
      try {
        const response = await axios.post("http://localhost:5000/posts", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        setMessage(response.data.message);
        setUserId("");
        setContent("");
        setImage(null);
      } catch (error) {
        setMessage(error?.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Card sx={{ maxWidth: 500, margin: "auto", mt: 5, p: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>Create a Post</Typography>
  
          <form onSubmit={handleSubmit}>
           
            <TextField
              label="User ID"
              variant="outlined"
              fullWidth
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              sx={{ mb: 2 }}
            />
  
       
            <TextField
              label="What's on your mind?"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              sx={{ mb: 2 }}
            />
  
          
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} id="upload-button" />
            <label htmlFor="upload-button">
              <Button variant="contained" component="span" startIcon={<CloudUploadIcon />} sx={{ mb: 2 }}>
                Upload Image
              </Button>
            </label>
            {image && <Typography variant="body2">Selected: {image.name}</Typography>}
  
         
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : "Post"}
            </Button>
          </form>
  

          {message && <Typography color="error" mt={2}>{message}</Typography>}
        </CardContent>
      </Card>
    );
  };


  export default CreatePost;