const Task = require("../models/Task");

// ✅ Only MANAGER can add a task
const addTask = async (req, res) => {
  try {
    if (req.user.role !== "Manager") {
      return res
        .status(403)
        .json({ message: "Only Managers can create tasks" });
    }

    const { title, description, priority, status, assignedTo } = req.body;

    if (!assignedTo) {
      return res
        .status(400)
        .json({ message: "AssignedTo is required for creating a task" });
    }

    const task = new Task({
      title,
      description,
      priority,
      status,
      assignedTo,
    });

    await task.save();
    res.status(201).json({ message: "Successfully added the task", task });
  } catch (error) {
    res.status(500).json({ message: "Failed to create task", error });
  }
};

// ✅ Manager can get all tasks
// ✅ Admin can also view all tasks (optional for audit purposes)
// ✅ User can only see their assigned tasks
const getTask = async (req, res) => {
  try {
    const filter = ["Manager", "Admin"].includes(req.user.role)
      ? {}
      : { assignedTo: req.user.id };

    const tasks = await Task.find(filter).populate("assignedTo", "name email");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks", error });
  }
};

// ✅ Only the assigned user or Manager/Admin can update the task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (
      task.assignedTo.toString() !== req.user.id &&
      !["Manager", "Admin"].includes(req.user.role)
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    const { title, description, priority, status } = req.body;
    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.priority = priority ?? task.priority;
    task.status = status ?? task.status;
    task.assignedTo = assignedTo ?? task.assignedTo;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task", error });
  }
};

// ✅ Only the assigned user or Manager/Admin can delete the task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (
      task.assignedTo.toString() !== req.user.id &&
      !["Manager", "Admin"].includes(req.user.role)
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this task" });
    }

    await task.remove();
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task", error });
  }
};

module.exports = { addTask, getTask, updateTask, deleteTask };
