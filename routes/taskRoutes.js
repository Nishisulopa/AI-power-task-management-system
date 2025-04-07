const express = require("express");
const authMiddleware = require("../middleware/authMiddleware2");
const {
  addTask,
  getTask,
  updateTask,
  deleteTask,
} = require("../controler/Task");

const router = express.Router();

// Create a new task
router.post("/add", authMiddleware, addTask);

// Get tasks for a user or all tasks (if manager/admin)
router.get("/", authMiddleware, getTask);

// Update a task
router.put("/:id", authMiddleware, updateTask);

// Delete a task
router.delete("/:id", authMiddleware, deleteTask);

module.exports = router;
