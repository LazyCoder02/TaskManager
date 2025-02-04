require("dotenv").config();
const express = require("express");
const cors = require("cors");
const security = require("./middleware/security");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const errorHandler = require("./utils/errorHandler");
const { initializeDatabase } = require("./migrations/dbMigrations");

const app = express();

async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/tasks", taskRoutes);

    // Error handling
    app.use(errorHandler);

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
