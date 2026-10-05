const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const registrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  event: {
    type: String,
    required: true,
  },

  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

const Registration = mongoose.model(
  "Registration",
  registrationSchema
);

app.get("/", (req, res) => {
  res.send("CampusEvents API is running");
});

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, event } = req.body;

    if (!name || !email || !event) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    const registration = new Registration({
      name,
      email,
      event,
    });

    await registration.save();

    res.status(201).json({
      message: "Registration successful",
      registration,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Registration failed.",
    });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(process.env.PORT, () => {
      console.log(
        `Server running on http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(
      "MongoDB connection error:",
      error.message
    );
  });