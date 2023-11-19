const mssql = require("mssql");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

class Database {
  constructor() {
    const config = {
      user: process.env.MSSQL_USER,
      password: process.env.MSSQL_PASSWORD,
      server: process.env.MSSQL_HOST,
      database: process.env.MSSQL_DATABASE,
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
          `SELECT * FROM ${process.env.MSSQL_DATABASE}.dbo.users WHERE email= '${email}' AND password = '${password}'`
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
          `INSERT INTO ${process.env.MSSQL_DATABASE}.dbo.users (email, first_name, last_name, password, admin) VALUES ('${email}', '${first_name}', '${last_name}', '${password}', 'false' )`
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
          `INSERT INTO ${process.env.MSSQL_DATABASE}.dbo.users (email, first_name, last_name, password, admin) VALUES ('${email}', '${first_name}', '${last_name}', '${password}', 'true' )`
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
          `UPDATE ${process.env.MSSQL_DATABASE}.dbo.users SET password = '${new_password}' WHERE email = '${email}'`
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
        .query(`DELETE FROM ${process.env.MSSQL_DATABASE}.dbo.users WHERE email = '${email}'`);
      if (result.rowsAffected[0] === 1) {
        console.log("User deleted successfully");
      }
      return result.recordset;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new Database();
