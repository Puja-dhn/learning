const mysql2 = require("mysql2/promise");
const dbConfig = require("../configs/database.js");

async function simpleQuery(statement, binds) {
  let conn;
  try {
    conn = await mysql2.createConnection(dbConfig);
    const [rows] = await conn.execute(statement, binds);
    return JSON.parse(JSON.stringify(rows));
  } catch (err) {
    throw err;
  } finally {
    if (conn) {
      try {
        await conn.end();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
}

module.exports.simpleQuery = simpleQuery;
