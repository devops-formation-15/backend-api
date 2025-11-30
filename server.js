import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors"; 
import productRoutes from "./routes/product.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware.
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Database Connection
async function connectDB() {
  if (process.env.NODE_ENV === "test") {
    // Skip MongoDB connection if in test environment
    console.log("Skipping MongoDB connection in test environment.");
    return;
  }

  try {
    //const mongo_uri = "mongodb+srv://hello:z6zh1uoYDogObtYM@cluster0.mq57s.mongodb.net/book-store?authSource=admin"
  // console.log("mongo_uri=",mongo_uri)
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.get("/hello", (req, res) => {
  res.send("Hello Le bon developpeur Community ! - new feature 🚀🚀");
});

app.get("/health", async (req, res) => {
  const start = Date.now();
  try {
    // Check database connection
    await mongoose.connection.db.admin().ping();

    const latency = Date.now() - start;
    res.status(200).json({
      status: "UP",
      message: "App is running smoothly. - le bon developpeur test 🚀",
      database: "Connected",
      latency: `${latency}ms`,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("Health check error:", err);
    res.status(500).json({
      status: "DOWN",
      message: "App or Database is experiencing issues.",
      database: "Disconnected",
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.use("/api/products", productRoutes);

// Start Server only if not in test environment
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
  });
}

export { app };  // Export app for testing
