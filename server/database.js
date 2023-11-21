const mssql = require("mssql");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });
const database = process.env.MSSQL_DATABASE;

class Database {
  constructor() {
    const config = {
      user: process.env.MSSQL_USER,
      password: process.env.MSSQL_PASSWORD,
      server: process.env.MSSQL_HOST,
      database: database,
      options: {
        encrypt: true,
        trustServerCertificate: true,
      },
    };

    this.configString = JSON.stringify(config);
    this.pool = new mssql.ConnectionPool(config);
  }

  async connectToDatabase() {
    try {
      await this.pool.connect();
      console.log("\x1b[33mConnected to the database!!\x1b[0m");
    } catch (err) {
      console.error("Error connecting to the database:", err);
      throw err; // Rethrow the error to let the caller handle it
    }
  }

  async login(email, password) {
    try {
      // Attempt to login
      const result = await this.pool
        .request()
        .query(
          `SELECT * FROM ${database}.dbo.users WHERE email= '${email}' AND password = '${password}'`
        );
      // Remove password from result
      delete result.recordset[0].password;
      //console.dir(result.recordset);
      console.log("User logged in successfully");
      return result.recordset;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to get userinfo by email
  async getUserInfoByEmail(email) {
    try {
      const result = await this.pool
        .request()
        .query(`SELECT * FROM ${database}.dbo.users WHERE email = '${email}'`);
      return result.recordset;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to register user
  async registerUser(email, first_name, last_name, password) {
    try {
      //Protect from undefined parameters
      if (
        email === undefined ||
        first_name === undefined ||
        last_name === undefined ||
        password === undefined
      ) {
        throw new Error("Undefined parameters");
      }
      // Execute query
      const result = await this.pool
        .request()
        .query(
          `INSERT INTO ${database}.dbo.users (email, first_name, last_name, password, admin) VALUES ('${email}', '${first_name}', '${last_name}', '${password}', 'false' )`
        );
      // Check if the user was registered
      if (result.rowsAffected[0] === 1) {
        console.log("User registered successfully");
        const user = await this.getUserInfoByEmail(email);
        // Remove password from result
        delete user[0].password;
        return user;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Function to add admin user
  async registerUserAdmin(email, first_name, last_name, password) {
    try {
      // Protect from undefined parameters
      if (
        email === undefined ||
        first_name === undefined ||
        last_name === undefined ||
        password === undefined
      ) {
        throw new Error("Undefined parameters");
      }
      // Execute query
      const result = await this.pool
        .request()
        .query(
          `INSERT INTO ${database}.dbo.users (email, first_name, last_name, password, admin) VALUES ('${email}', '${first_name}', '${last_name}', '${password}', 'true' )`
        );
        // Check if the user was registered
      if (result.rowsAffected[0] === 1) {
        console.log("Admin registered successfully");
        const user = await this.getUserInfoByEmail(email);
        delete user[0].password;
        return user;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Function update password
  async updatePassword(email, new_password) {
    try {
      // Protect from undefined parameters
      if (new_password === undefined) {
        throw new Error("Undefined parameters 'new_password' ");
      }
      // Execute query
      const result = await this.pool
        .request()
        .query(
          `UPDATE ${database}.dbo.users SET password = '${new_password}' WHERE email = '${email}'`
        );
      // Check if the password was updated
      if (result.rowsAffected[0] === 1) {
        // If password was updated, return the user info with out the password
        console.log("Password updated successfully");
        const user = await this.getUserInfoByEmail(email);
        // Remove password from result
        delete user[0].password;
        console.log(
          "Password for user " + user[0].email + " updated successfully"
        );
        return user;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Function to delete user
  async deleteUser(email) {
    try {
      // Find user b4 delete to return user info after successful delete
      const user = await this.getUserInfoByEmail(email);
      // Remove password from result
      delete user[0].password;
      // Execute query
      const result = await this.pool
        .request()
        .query(`DELETE FROM ${database}.dbo.users WHERE email = '${email}'`);
      // Check if the user was deleted and return user info
      if (result.rowsAffected[0] === 1) {
        console.log("User deleted successfully");
        return user;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Function to get all programs
  async getPrograms() {
    try {
      const result = await this.pool
        .request()
        .query(`SELECT * FROM ${database}.dbo.programs`);
      return result.recordset;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to get program by program name
  async getProgramByProgramName(program_name) {
    try {
      const result = await this.pool
        .request()
        .query(
          `SELECT * FROM ${database}.dbo.programs WHERE program_name = '${program_name}'`
        );
      return result.recordset;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to add program
  async addProgram(
    program_name,
    program_code,
    program_fees,
    program_start_date,
    program_end_date,
    program_type
  ) {
    try {
      const result = await this.pool.request().query(`
          INSERT INTO ${database}.dbo.programs 
          (program_name, program_code, program_fees, program_start_date, program_end_date, program_type) 
          VALUES 
          ('${program_name}', '${program_code}', ${program_fees}, '${program_start_date}', '${program_end_date}', '${program_type}')
        `);

      if (result.rowsAffected[0] === 1) {
        console.log("Program added successfully");
        const program = await this.getProgramByProgramName(program_name);
        return program;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Function to edit program
  async editProgram(
    program_name,
    new_program_name,
    program_code,
    program_fees,
    program_start_date,
    program_end_date,
    program_type
  ) {
    try {
      const result = await this.pool.request().query(`
          UPDATE ${database}.dbo.programs 
          SET program_name = '${new_program_name}', program_code = '${program_code}', program_fees = ${program_fees}, program_start_date = '${program_start_date}', program_end_date = '${program_end_date}', program_type = '${program_type}'
          WHERE program_name = '${program_name}'
        `);

      if (result.rowsAffected[0] === 1) {
        console.log("Program edited successfully");
        const program = await this.getProgramByProgramName(new_program_name);
        return program;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Function to delete program
  async deleteProgram(program_name) {
    try {
      const program = await this.getProgramByProgramName(program_name);
      const result = await this.pool
        .request()
        .query(
          `DELETE FROM ${database}.dbo.programs WHERE program_name = '${program_name}'`
        );
      if (result.rowsAffected[0] === 1) {
        console.log("Program deleted successfully");
        return program;
      }
      return result.recordset;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to get all courses
  async getCourses() {
    try {
      const result = await this.pool
        .request()
        .query(`SELECT * FROM ${database}.dbo.courses`);
      return result.recordset;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to get course by course name
  async getCourseByCourseName(course_name) {
    try {
      const result = await this.pool
        .request()
        .query(
          `SELECT * FROM ${database}.dbo.courses WHERE course_name = '${course_name}'`
        );
        if (result.recordset.length === 0) {
          throw new Error("Course not found");
        }
      return result.recordset;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to get courses by program name
  async getCoursesByProgramName(program_name) {
    try {
      const result = await this.pool
        .request()
        .query(
          `SELECT * FROM ${database}.dbo.courses WHERE program_id IN (SELECT program_id FROM ${database}.dbo.programs WHERE program_name = '${program_name}')`
        );
        if (result.recordset.length === 0) {
          throw new Error("Courses not found");
        }
      return result.recordset;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to add course by program name
  async addCourseByProgramName(
    program_name,
    course_code,
    course_name,
    course_term,
    course_description,
    course_prerequisites
  ) {
  
    try {
      if (
        program_name === undefined ||
        course_code === undefined ||
        course_name === undefined ||
        course_term === undefined ||
        course_description === undefined ||
        course_prerequisites === undefined
      ) {
        throw new Error("Undefined parameters");
      }
      const result = await this.pool.request().query(`
          INSERT INTO ${database}.dbo.courses
          (program_id, course_code, course_name, course_term, course_description, course_prerequisites)
          VALUES (
            (SELECT program_id FROM ${database}.dbo.programs WHERE program_name = '${program_name}'),
            '${course_code}',
            '${course_name}',
            '${course_term}',
            '${course_description}',
            '${course_prerequisites}'
          )
        `);
        if (result.rowsAffected[0] === 0) {
          throw new Error("Course not created");
        }
        const course = await this.getCourseByCourseName(course_name);
        return course;
    }
    catch (error) {
      console.log(error);
    }
  }

  
  // Function to edit course by name
  async editCourseByCourseName(
    course_name,
    new_course_name,
    course_code,
    course_term,
    course_description,
    course_prerequisites
  ) {
    try {
      const result = await this.pool.request().query(`
          UPDATE ${database}.dbo.courses 
          SET course_name = '${new_course_name}', course_code = '${course_code}', course_term = '${course_term}', course_description = '${course_description}', course_prerequisites = '${course_prerequisites}'
          WHERE course_name = '${course_name}'
        `);

      if (result.rowsAffected[0] === 1) {
        console.log("Course edited successfully");
        const course = await this.getCourseByCourseName(new_course_name);
        return course;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Function to delete course by name
  async deleteCourseByCourseName(course_name) {
    try {
      const course = await this.getCourseByCourseName(course_name);
      const result = await this.pool
        .request()
        .query(
          `DELETE FROM ${database}.dbo.courses WHERE course_name = '${course_name}'`
        );
      if (result.rowsAffected[0] === 1) {
        console.log("Course deleted successfully");
        return course;
      } else {
        throw new Error("Course not deleted");
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Function to get completed courses by user email
  async getCompletedCoursesByUserEmail(email) {
    try {
      const result = await this.pool
        .request()
        .query(
          `SELECT * FROM ${database}.dbo.completed_courses WHERE user_id IN (SELECT user_id FROM ${database}.dbo.users WHERE email = '${email}')`
        );
      return result.recordset;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to add completed course by user email
  async addCompletedCourseByUserEmailAndCrouseName(
    email,
    course_name,
    course_grade
  ) {
    try {
      const result = await this.pool.request().query(`
        INSERT INTO ${database}.dbo.completed_courses 
        (user_id, course_id, course_code, course_grade) 
        VALUES (
          (SELECT user_id FROM ${database}.dbo.users WHERE email = '${email}'), 
          (SELECT course_id FROM ${database}.dbo.courses WHERE course_name = '${course_name}'),
          (SELECT course_code FROM ${database}.dbo.courses WHERE course_name = '${course_name}'),
          '${course_grade}'
        )
      `);

      if (result.rowsAffected[0] === 1) {
        console.log("Completed course added successfully");
        const completedCourse = await this.getCompletedCoursesByUserEmail(
          email
        );
        return completedCourse;
      }
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new Database();
