const Task = require("../models/Task");

const addTask = async (req, res) => {
  try {
    const { title, description, priority, assignedTo } = req.body;
    const task = new Task({
      title,
      description,
      priority,
      assignedTo: assignedTo || req.user.id, // default to logged-in user / pass the userId
    });

    await task.save();
    res.status(201).json({ message: "successfully add the task" }, task);
  } catch (error) {
    res.status(500).json({ message: "Failed to create task", error });
  }
};

const getTask = async (req, res) => {
  try {
    const filter = ["Manager", "Admin"].includes(req.user.role)
      ? {} // get all tasks
      : { assignedTo: req.user.id }; // only user tasks

    const tasks = await Task.find(filter).populate("assignedTo", "name email");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks", error });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Only the assigned user or manager/admin can update
    if (
      task.assignedTo.toString() !== req.user.id &&
      !["Manager", "Admin"].includes(req.user.role)
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, description, priority, status } = req.body;
    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.priority = priority ?? task.priority;
    task.status = status ?? task.status;

    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task", error });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Only assigned user or manager/admin can delete
    if (
      task.assignedTo.toString() !== req.user.id &&
      !["Manager", "Admin"].includes(req.user.role)
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await task.remove();
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task", error });
  }
};

module.exports = { addTask, getTask, updateTask, deleteTask };
