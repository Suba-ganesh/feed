// Backend: Node.js + Express.js + MySQL

const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));



// Secure database credentials with environment variables
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Ganesh126@", // Store this in .env
  database: process.env.DB_NAME || "social_media",
  waitForConnections: true,
  connectionLimit: 10,  // Adjust as needed
  queueLimit: 0
});


// File upload configuration
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// User Registration
app.post("/register", async (req, res) => {
  const { fullname, email, password } = req.body;

  // Check if all fields are provided
  if (!fullname || !email || !password) {
    return res.status(400).json({ message: "Full name, email, and password are required" });
  }

  try {
    console.log("🔹 Registering user:", fullname, email); // Debug log

    // Check if the email already exists
    const checkUserQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkUserQuery, [email], async (err, results) => {
      if (err) {
        console.error("Database error while checking user:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert into MySQL database
      const query = "INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)";
      db.query(query, [fullname, email, hashedPassword], (err, result) => {
        if (err) {
          console.error("Database error while inserting user:", err);
          return res.status(500).json({ message: "Database error", error: err });
        }
        console.log("User registered successfully:", fullname);
        res.status(201).json({ message: "User registered successfully" });
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

//  User Login with JWT
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    console.log("🔹 Login request received:", email); // Debug log

    // Check if the user exists in the database
    const checkUserQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkUserQuery, [email], async (err, results) => {
      if (err) {
        console.error("Database error while fetching user:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = results[0];

      // Compare the hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate a JWT token for authentication
      const token = jwt.sign({ id: user.id }, "secretkey", { expiresIn: "1h" });

      console.log("User logged in:", email);
      res.json({ token, userId: user.id });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

//  Get All Posts
app.get("/posts", (req, res) => {
  db.query("SELECT * FROM posts", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });

    // Ensure imageUrl has the correct server URL
    const posts = results.map((post) => ({
      ...post,
      imageUrl: post.imageUrl ? `http://localhost:5000${post.imageUrl}` : null,
    }));

    res.json(posts);
  });
});

//  Create a Post (with image)
// Create a new post
app.post("/posts", upload.single("imageURL"), (req, res) => {
  const { userId, content } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Image URL if uploaded

  console.log("🔹 Creating Post - User ID:", userId);
  console.log("🔹 Content:", content);
  console.log("🔹 Image URL:", imageUrl);

  // Input Validation
  if (!userId) return res.status(400).json({ message: "User ID is required" });
  if (!content) return res.status(400).json({ message: "Post content is required" });

  const query = "INSERT INTO posts (userId, content, imageUrl) VALUES (?, ?, ?)";
  db.query(query, [userId, content, imageUrl || null], (err, result) => {
    if (err) {
      console.error("Database error while inserting post:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.json({ message: "✅ Post created successfully", postId: result.insertId });
  });
});

// Add a Comment
app.post("/posts/:postId/comments", (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ message: "Comment cannot be empty" });
  }

  // Ensure postId exists before inserting comment
  db.query("SELECT id FROM posts WHERE id = ?", [postId], (err, results) => {
    if (err) {
      console.error("Error checking post existence:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Insert comment into database
    const query = "INSERT INTO comments (post_id, text) VALUES (?, ?)";
    db.query(query, [postId, text], (err, result) => {
      if (err) {
        console.error("Error adding comment:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      res.json({
        message: "✅ Comment added successfully",
        comment: { id: result.insertId, text, post_id: postId }
      });
    });
  });
});

// Fetch Comments for a Post
app.get("/posts/:postId/comments", (req, res) => {
  const { postId } = req.params;

  db.query(
    "SELECT id, text FROM comments WHERE post_id = ? ORDER BY id DESC",
    [postId],
    (err, results) => {
      if (err) {
        console.error("Error fetching comments:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      res.json({ comments: results });
    }
  );
});

//  Like a Post
app.post("/posts/:id/like", (req, res) => {
  const { id } = req.params;

  // Check if the post exists before updating
  db.query("SELECT * FROM posts WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    // If post exists, update likes
    db.query("UPDATE posts SET likes = likes + 1 WHERE id = ?", [id], (err, result) => {
      if (err) {
        console.error("Error updating likes:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      // Fetch updated like count
      db.query("SELECT likes FROM posts WHERE id = ?", [id], (err, updatedResult) => {
        if (err) {
          console.error("Error fetching updated likes:", err);
          return res.status(500).json({ message: "Database error", error: err });
        }

        res.json({ message: "Post liked", likes: updatedResult[0].likes });
      });
    });
  });
});

app.get("/posts/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM posts WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(results[0]); // Return the post details
  });
});

//  Start Express Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
