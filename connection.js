const mongoose = require("mongoose");

const connectDb = (url) => {
  try {
    mongoose
      .connect(url)
      .then(() => console.log("MongoDB Connected"))
      .catch((err) => console.log(err));
  } catch (error) {
    console.log(error);
  }
};

module.exports = { connectDb };
