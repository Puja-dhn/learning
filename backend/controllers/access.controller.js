const mysql2 = require("mysql2/promise");
const database = require("../services/database.js");
const DB_CONFIG = {
  host: process.env.NODE_MYSQLDB_CONNECTIONSTRING,
  user: process.env.NODE_MYSQLDB_USER,
  password: process.env.NODE_MYSQLDB_PASSWORD,
  database: process.env.NODE_MYSQLDB_DATABASE,
  namedPlaceholders: true,
};

async function simpleQuery(statement, binds) {
  let conn;
  try {
    conn = await mysql2.createConnection(DB_CONFIG);
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
exports.appaccess = async (req, res) => {
  const { ID } = req.user;

  try {
    // Fetch menus data
    const menusQuery = `
      SELECT DISTINCT
          t1.id,
          t1.name,
          t1.app_id,
          t1.mas_id
      FROM
          t_inshe_menus t1,
          t_inshe_role_menus t2,
          t_inshe_user_role t3
      WHERE
              t1.id = t2.menu_id
          AND
              t2.role_id = t3.role_id
          AND
              t1.status = 'Active'
          AND
              t3.user_id = ?
    `;

    const resultMenus = await simpleQuery(menusQuery, [ID]);

    // Fetch apps data
    const appsQuery = `
      SELECT DISTINCT
          t1.id,
          t1.name,
          t1.sht_name,
          t1.app_desc,
          t1.logo_path
      FROM
          t_inshe_apps t1,
          t_inshe_menus t2,
          t_inshe_role_menus t3,
          t_inshe_user_role t4
      WHERE
              t1.status = 'Active'
          AND
              t2.app_id = t1.id
          AND
              t2.status = 'Active'
          AND
              t3.menu_id = t2.id
          AND
              t4.role_id = t3.role_id
          AND
              t4.user_id = ?  
      ORDER BY id asc
    `;

    const resultApps = await simpleQuery(appsQuery, [ID]);

    // Respond with both menus and apps data
    res.status(200).json({
      menus: resultMenus,
      apps: resultApps,
      appId: 1, // Modify as needed if you want dynamic appId
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      error: "An error occurred while fetching data",
    });
  }
};
