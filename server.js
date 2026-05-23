const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const PORT = process.env.PORT || 6000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/studyflow";
const AI_SERVER_URL = process.env.AI_SERVER_URL || "http://localhost:6000";

const fetchFn = typeof globalThis.fetch === "function"
  ? globalThis.fetch
  : (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/signup", async (req, res) => {
  try {
    const { username, role, email, password } = req.body;
    if (!username || !role || !email || !password) {
      return res.status(400).json({ message: "Please provide username, role, email and password." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, role, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "Account created successfully." });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Unable to create account." });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    res.json({ userId: user._id, username: user.username, email: user.email, role: user.role || "Student" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Unable to authenticate." });
  }
});

async function proxyToAI(endpoint, body) {
  const response = await fetchFn(`${AI_SERVER_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `AI server returned ${response.status}`);
  }
  return data;
}

app.post("/api/generate-plan", async (req, res) => {
  try {
    const data = await proxyToAI("/generate-plan", req.body);
    res.json(data);
  } catch (error) {
    console.error("Generate plan error:", error.message);
    res.status(502).json({ message: "AI service unavailable." });
  }
});

app.post("/api/explain-topic", async (req, res) => {
  try {
    const data = await proxyToAI("/explain-topic", req.body);
    res.json(data);
  } catch (error) {
    console.error("Explain topic error:", error.message);
    res.status(502).json({ message: "AI service unavailable." });
  }
});

app.post("/api/generate-quiz", async (req, res) => {
  try {
    const data = await proxyToAI("/generate-quiz", req.body);
    res.json(data);
  } catch (error) {
    console.error("Generate quiz error:", error.message);
    res.status(502).json({ message: "AI service unavailable." });
  }
});

app.post("/api/save-history", async (req, res) => {
  try {
    const { email, subject, topic, plan_md, type } = req.body;
    if (!email || !subject || !topic || !plan_md) {
      return res.status(400).json({ message: "Missing required history fields." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.plans.push({
      subject,
      topic,
      plan_md,
      type: type || "Plan",
      generatedAt: new Date(),
      tasks: []
    });
    await user.save();

    res.json({ message: "History saved." });
  } catch (error) {
    console.error("Save history error:", error.message);
    res.status(500).json({ message: "Unable to save history." });
  }
});

app.get("/api/history", async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ message: "Email query parameter is required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ history: user.plans || [] });
  } catch (error) {
    console.error("History fetch error:", error.message);
    res.status(500).json({ message: "Unable to fetch history." });
  }
});

app.delete("/api/delete-history/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const email = req.query.email || req.body.email;
    if (!email) {
      return res.status(400).json({ message: "Email is required to delete a history item." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const plan = user.plans.id(id);
    if (!plan) {
      return res.status(404).json({ message: "History item not found." });
    }

    plan.remove();
    await user.save();

    res.json({ message: "History item deleted." });
  } catch (error) {
    console.error("Delete history error:", error.message);
    res.status(500).json({ message: "Unable to delete history item." });
  }
});

app.get("/api/get-plans", async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ message: "Email query parameter is required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ plans: user.plans || [] });
  } catch (error) {
    console.error("Get plans error:", error.message);
    res.status(500).json({ message: "Unable to fetch plans." });
  }
});

app.post("/api/update-progress", async (req, res) => {
  try {
    const { email, planId, taskIndex, completed } = req.body;
    if (!email || !planId || typeof taskIndex !== "number") {
      return res.status(400).json({ message: "Missing required progress update fields." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const plan = user.plans.id(planId);
    if (!plan || !Array.isArray(plan.tasks)) {
      return res.status(404).json({ message: "Plan or tasks not found." });
    }

    const task = plan.tasks[taskIndex];
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    task.completed = completed;
    await user.save();

    res.json({ message: "Progress updated." });
  } catch (error) {
    console.error("Update progress error:", error.message);
    res.status(500).json({ message: "Unable to update progress." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});