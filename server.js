require("dotenv").config();
const express = require("express");
// const mongoose = require("mongoose");
const { connectDb } = require("./connection");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.log(err));

connectDb(process.env.MONGO_URI);

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("API is running...");
});

//User authentication
app.use("/api/users", userRoutes);

//task CRUD
app.use("/api/task", taskRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
