const mysql2 = require("mysql2/promise");

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

exports.getPTWMasterData = async (req, res) => {
  try {
    const departmentQuery = `
      SELECT DISTINCT
          t1.id,
          t1.department_name name
      FROM
          t_inshe_departments t1
      WHERE
              t1.status = 'Active'
       
    `;

    const resultDepartments = await simpleQuery(departmentQuery, []);

    const areasQuery = `
    SELECT DISTINCT
        t1.id,
        t1.name
    FROM
        t_inshe_areas t1
    WHERE
      t1.status = 'Active'
     
  `;

    const resultAreas = await simpleQuery(areasQuery, []);

    const configsQuery = `
    SELECT 
        t1.id,
        t1.type,
        t1.checklist
    FROM
        t_inshe_ptw_configs t1
    WHERE
      t1.status = 'Active'
     
  `;

    const resultConfigs = await simpleQuery(configsQuery, []);

    const usersQuery = `
    SELECT DISTINCT
        t1.id,
        t1.name
    FROM
        t_inshe_users t1
    WHERE
      t1.status = 'active'
     
  `;

    const resultUsers = await simpleQuery(usersQuery, []);

    const contractorsQuery = `
    SELECT 
        t1.id,
        t1.contractor_name,
        t1.esic_reg_no
    FROM
        t_inshe_contractors t1
    WHERE
      t1.status = 'Active'
     
  `;

    const resultContractors = await simpleQuery(contractorsQuery, []);

    const masterDetails = {
      DEPARTMENT: [...resultDepartments],
      AREA: [...resultAreas],
      CONFIG: [...resultConfigs],
      USERS: [...resultUsers],
      CONTRACTORS: [...resultContractors],
    };

    res.status(200).json({ historyPTWMasterData: masterDetails });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      error: "An error occurred while fetching data",
    });
  }
};
