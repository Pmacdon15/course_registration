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
      const result = await this.pool
        .request()
        .query(
          `SELECT * FROM ${database}.dbo.users WHERE email= '${email}' AND password = '${password}'`
        );
      delete result.recordset[0].password;
      console.dir(result.recordset);
      return result.recordset;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to register user
  async registerUser(email, first_name, last_name, password) {
    try {
      const result = await this.pool
        .request()
        .query(
          `INSERT INTO ${database}.dbo.users (email, first_name, last_name, password, admin) VALUES ('${email}', '${first_name}', '${last_name}', '${password}', 'false' )`
        );
      if (result.rowsAffected[0] === 1) {
        console.log("User registered successfully");
      }
      return result.recordset;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to add admin user
  async registerUserAdmin(email, first_name, last_name, password) {
    try {
      const result = await this.pool
        .request()
        .query(
          `INSERT INTO ${database}.dbo.users (email, first_name, last_name, password, admin) VALUES ('${email}', '${first_name}', '${last_name}', '${password}', 'true' )`
        );
      if (result.rowsAffected[0] === 1) {
        console.log("Admin registered successfully");
      }
      return result.recordset;
    } catch (error) {
      console.log(error);
    }
  }

  // Function update password
  async updatePassword(email, new_password) {
    try {
      const result = await this.pool
        .request()
        .query(
          `UPDATE ${database}.dbo.users SET password = '${new_password}' WHERE email = '${email}'`
        );
      if (result.rowsAffected[0] === 1) {
        console.log("Password updated successfully");
      }
      return result.recordset;
    } catch (error) {
      console.log(error);
    }
  }
  // Function to delete user
  async deleteUser(email) {
    try {
      const result = await pool
        .request()
        .query(`DELETE FROM ${database}.dbo.users WHERE email = '${email}'`);
      if (result.rowsAffected[0] === 1) {
        console.log("User deleted successfully");
      }
      return result.recordset;
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

  // Function to add program
  async addProgram(program_name, program_code, program_fees, program_start_date, program_end_date, program_type) {
    try {
      const result = await this.pool
        .request()
        .query(`
          INSERT INTO ${database}.dbo.programs 
          (program_name, program_code, program_fees, program_start_date, program_end_date, program_type) 
          VALUES 
          ('${program_name}', '${program_code}', ${program_fees}, '${program_start_date}', '${program_end_date}', '${program_type}')
        `);
  
      if (result.rowsAffected[0] === 1) {
        console.log("Program added successfully");
      }
  
      return result.recordset;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to edit program
  async editProgram(program_name, new_program_name, program_code, program_fees, program_start_date, program_end_date, program_type) {
    try {
      const result = await this.pool
        .request()
        .query(`
          UPDATE ${database}.dbo.programs 
          SET program_name = '${new_program_name}', program_code = '${program_code}', program_fees = ${program_fees}, program_start_date = '${program_start_date}', program_end_date = '${program_end_date}', program_type = '${program_type}'
          WHERE program_name = '${program_name}'
        `);
  
      if (result.rowsAffected[0] === 1) {
        console.log("Program edited successfully");
      }
  
      return result.recordset;
    } catch (error) {
      console.log(error);
    }
  }

  // Function to delete program
  async deleteProgram(program_name) {
    try {
      const result = await this.pool
        .request()
        .query(`DELETE FROM ${database}.dbo.programs WHERE program_name = '${program_name}'`);
      if (result.rowsAffected[0] === 1) {
        console.log("Program deleted successfully");
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

  // Function to get courses by program name  
  async getCoursesByProgramName(program_name) {
    try {
      const result = await this.pool
        .request()
        .query(`SELECT * FROM ${database}.dbo.courses WHERE program_id IN (SELECT program_id FROM ${database}.dbo.programs WHERE program_name = '${program_name}')`);
      return result.recordset;
    } catch (error) {
      console.log(error);
    }
  }
}
  
module.exports = new Database();
