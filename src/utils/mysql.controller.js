import mysql from "mysql2/promise";
import dotenv from 'dotenv';
dotenv.config();

class MySqlController {
  constructor() {
    if (!MySqlController.instance) {
      if (!process.env.DATABASE_URL) {
        console.log("Error: DATABASE_URL not found in .env file.");
      }
      this.pool = mysql.createPool(process.env.DATABASE_URL);
      MySqlController.instance = this;
    }
    return MySqlController.instance;
  }

  // Simple query
  async query(queryString, params = []) {
    try {
      const [rows, fields] = await this.pool.query(queryString, params);
      return { error: null, response: rows, fields };
    } catch (err) {
      return { error: err, response: null, fields: null };
    }
  }

  // Transactional query (single statement)
  async transactionalQuery(queryString, params = []) {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      const [rows, fields] = await connection.query(queryString, params);
      await connection.commit();
      return { error: null, response: rows, fields };
    } catch (err) {
      await connection.rollback();
      return { error: err, response: null, fields: null };
    } finally {
      connection.release();
    }
  }

  // Manual transaction (useful for multiple queries in a transaction)
  async runTransaction(callback) {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();
      const result = await callback(connection); // pass connection to execute multiple queries
      await connection.commit();
      return result;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  }
}

const dbInstance = new MySqlController()
Object.freeze(dbInstance)

export default dbInstance
