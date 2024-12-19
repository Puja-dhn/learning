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

exports.getSIOMasterData = async (req, res) => {
  try {
    const departmentQuery = `
      SELECT DISTINCT
          t1.id,
          t1.department_name name
      FROM
          t_sis_departments t1
      WHERE
              t1.status = 'Active'
       
    `;

    const resultDepartments = await simpleQuery(departmentQuery, []);

    const categoriesQuery = `
      SELECT DISTINCT
          t1.id,
          t1.name
      FROM
          t_sis_categories t1
      WHERE
        t1.status = 'Active'
       
    `;

    const resultCategories = await simpleQuery(categoriesQuery, []);

    const areasQuery = `
    SELECT DISTINCT
        t1.id,
        t1.name
    FROM
        t_sis_areas t1
    WHERE
      t1.status = 'Active'
     
  `;

    const resultAreas = await simpleQuery(areasQuery, []);
    const masterDetails = {
      DEPARTMENT: [...resultDepartments],
      CATEGORY: [...resultCategories],
      AREA: [...resultAreas],
    };

    res.status(200).json({ historySIOMasterData: masterDetails });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      error: "An error occurred while fetching data",
    });
  }
};
exports.addNewSIOData = async (req, res) => {
  const {
    OBS_DATE_TIME,
    DEPARTMENT,
    AREA,
    CATEGORY,
    SEVERITY,
    STATUS,
    OBS_DESC,
    OBS_SUGG,
    OBS_PHOTOS,
    CLOSE_DESC,
    CLOSE_PHOTOS,
  } = req.body;
  console.log(req.body);
  // try {
  //   const departmentQuery = `
  //     SELECT DISTINCT
  //         t1.id,
  //         t1.department_name name
  //     FROM
  //         t_sis_departments t1
  //     WHERE
  //             t1.status = 'Active'

  //   `;

  //   const resultDepartments = await simpleQuery(departmentQuery, []);

  //   const categoriesQuery = `
  //     SELECT DISTINCT
  //         t1.id,
  //         t1.name
  //     FROM
  //         t_sis_categories t1
  //     WHERE
  //       t1.status = 'Active'

  //   `;

  //   const resultCategories = await simpleQuery(categoriesQuery, []);

  //   const areasQuery = `
  //   SELECT DISTINCT
  //       t1.id,
  //       t1.name
  //   FROM
  //       t_sis_areas t1
  //   WHERE
  //     t1.status = 'Active'

  // `;

  //   const resultAreas = await simpleQuery(areasQuery, []);
  //   const masterDetails = {
  //     DEPARTMENT: [...resultDepartments],
  //     CATEGORY: [...resultCategories],
  //     AREA: [...resultAreas],
  //   };

  //   res.status(200).json({ historySIOMasterData: masterDetails });
  // } catch (error) {
  //   console.error("Error fetching data:", error);
  //   res.status(500).json({
  //     error: "An error occurred while fetching data",
  //   });
  // }
};
