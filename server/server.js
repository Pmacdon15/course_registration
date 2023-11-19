const express = require("express");
const app = express();
const port = 5544;
const cors = require("cors");

// Import functions from database.js
const Database = require("./database.js");

// Import function from graphic.js
//const { displayGraphic } = require("./graphic");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS for cross-origin requests
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

// Start connection to DB
Database.connectToDatabase();

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const users = await Database.login(email, password);
  res.json(users);
});

// Register user
app.post("/user", async (req, res) => {
  const { email, first_name, last_name, password } = req.body;
  const users = await Database.registerUser(email, first_name, last_name, password);
  res.json(users);
});

// Register admin user
app.post("/userAdmin", async (req, res) => {
  const { email, first_name, last_name, password } = req.body;
  const users = await Database.registerUserAdmin(email, first_name, last_name, password);
  res.json(users);
});

// Update password
app.put("/user/:email", async (req, res) => {
  const { new_password } = req.body;
  const users = await Database.updatePassword(req.params.email, new_password);
  res.json(users);
});

// Delete user
app.delete("/user/:email", async (req, res) => {
  const users = await Database.deleteUser(req.params.email);
  res.json(users);
});

// Start server
app.listen(port, () => {
  // displayGraphic(port);
  console.log(`Server is running on port: ${port}`);
});
