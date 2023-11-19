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
  const users = await Database.registerUser(
    email,
    first_name,
    last_name,
    password
  );
  res.json(users);
});

// Register admin user
app.post("/userAdmin", async (req, res) => {
  const { email, first_name, last_name, password } = req.body;
  const users = await Database.registerUserAdmin(
    email,
    first_name,
    last_name,
    password
  );
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

// Get all programs
app.get("/programs", async (req, res) => {
  const programs = await Database.getPrograms();
  res.json(programs);
});

// Add program
app.post("/program", async (req, res) => {
  const {
    program_name,
    program_code,
    program_fees,
    program_start_date,
    program_end_date,
    program_type,
  } = req.body;
  const programs = await Database.addProgram(
    program_name,
    program_code,
    program_fees,
    program_start_date,
    program_end_date,
    program_type
  );
  res.json(programs);
});

// Edit program
app.put("/program/:program_name", async (req, res) => {
  const {
    program_code,
    new_program_name,
    program_fees,
    program_start_date,
    program_end_date,
    program_type,
  } = req.body;
  const programs = await Database.editProgram(
    req.params.program_name,
    new_program_name,
    program_code,
    program_fees,
    program_start_date,
    program_end_date,
    program_type
  );
  res.json(programs);
});

// Delete program
app.delete("/program/:program_name", async (req, res) => {
  const programs = await Database.deleteProgram(req.params.program_name);
  res.json(programs);
});

// Get all courses
app.get("/courses", async (req, res) => {
  const courses = await Database.getCourses();
  res.json(courses);
});

// Get courses by program name
app.get("/courses/:program_name", async (req, res) => {
  const courses = await Database.getCoursesByProgramName(
    req.params.program_name
  );
  res.json(courses);
});

// Add course by program name
app.post("/course/:program_name", async (req, res) => {
  const {
    course_code,
    course_name,
    course_term,
    course_description,
    course_prerequisites,
  } = req.body;
  const courses = await Database.addCourseByProgramName(
    req.params.program_name,
    course_code,
    course_name,
    course_term,
    course_description,
    course_prerequisites
  );
  res.json(courses);
});

// Start server
app.listen(port, () => {
  // displayGraphic(port);
  console.log(`Server is running on port: ${port}`);
});
