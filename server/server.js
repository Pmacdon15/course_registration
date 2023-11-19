const express = require("express");
const app = express();
const port = 5544;
const cors = require("cors");

// Import functions from database.js
const Database = require("./database.js");

// Import function from graphic.js for server output
const { displayGraphic } = require("./graphic");

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
  if (users === null || users === undefined) {
    res.json({ message: "Invalid email or password" });
  } else {
    res.json(users);
  }
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
  if (users === null || users === undefined) {
    res.json({ message: "User not created" });
  } else {
    res.json(users);
  }
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
  if (users === null || users === undefined) {
    res.json({ message: "User not created." });
  } else {
    res.json(users);
  }
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

// Get program by program name
app.get("/program/:program_name", async (req, res) => {
  const programs = await Database.getProgramByProgramName(
    req.params.program_name
  );
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

// Get course by course name
app.get("/course/:course_name", async (req, res) => {
  const courses = await Database.getCourseByCourseName(req.params.course_name);
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

// Edit course by course name
app.put("/course/:course_name", async (req, res) => {
  const {
    course_code,
    new_course_name,
    course_term,
    course_description,
    course_prerequisites,
  } = req.body;
  const courses = await Database.editCourseByCourseName(
    req.params.course_name,
    new_course_name,
    course_code,
    course_term,
    course_description,
    course_prerequisites
  );
  res.json(courses);
});

// Delete course by course name
app.delete("/course/:course_name", async (req, res) => {
  const courses = await Database.deleteCourseByCourseName(
    req.params.course_name
  );
  res.json(courses);
});

// Get completed courses by user email
app.get("/completed_courses/:user_email", async (req, res) => {
  const courses = await Database.getCompletedCoursesByUserEmail(
    req.params.user_email
  );
  res.json(courses);
});

// Add completed course by user email and course name
app.post("/completed_course/:user_email/:course_name", async (req, res) => {
  const course_grade = req.body.course_grade;
  const courses = await Database.addCompletedCourseByUserEmailAndCrouseName(
    req.params.user_email,
    req.params.course_name,
    course_grade
  );
  res.json(courses);
});

// Start server
app.listen(port, () => {
  displayGraphic(port);
  //console.log(`Server is running on port: ${port}`);
});
