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

exports.getImsMasterData = async (req, res) => {
  try {
    const departmentQuery = `
      SELECT DISTINCT
          t1.id,
          t1.name
      FROM
          t_inshe_org_structures t1
      WHERE
              t1.is_deleted = 0
        and t1.category = "DEPT"
       
    `;

    const resultDepartments = await simpleQuery(departmentQuery, []);

    const injuryQuery = `
      SELECT DISTINCT
          t1.context_id id,
          t1.context_name name
      FROM
          t_inshe_context_definitions t1
      WHERE
        t1.is_deleted = 0
        and definitions_type = "IMS_INJURY_TYPE"
       
    `;

    const resultInjury = await simpleQuery(injuryQuery, []);

    const factorsQuery = `
    SELECT DISTINCT
        t1.context_id id,
        t1.context_name name
    FROM
        t_inshe_context_definitions t1
    WHERE
      t1.is_deleted = 0
      and definitions_type = "IMS_FACTORS"
     
  `;

    const resultFactors = await simpleQuery(factorsQuery, []);

    const areasQuery = `
    SELECT DISTINCT
        t1.id,
        t1.parent_id,
        t1.name
    FROM
        t_inshe_org_structures t1
    WHERE
      t1.is_deleted = 0
      and t1.category = "AREA"
  `;

    const resultAreas = await simpleQuery(areasQuery, []);

    const contractorsQuery = `
    SELECT DISTINCT
        t1.id,
        t1.contractor_name name
    FROM
        t_inshe_contractors t1
    WHERE
      t1.status = 'active'
     
  `;

    const resultContractors = await simpleQuery(contractorsQuery, []);

    const usersQuery = `
    SELECT DISTINCT
        t1.id,
        t1.name name
    FROM
        t_inshe_users t1
    WHERE
      t1.status = 'active'
     
  `;

    const resultUsers = await simpleQuery(usersQuery, []);

    const masterDetails = {
      DEPARTMENT: [...resultDepartments],
      INJURYTYPE: [...resultInjury],
      FACTORS: [...resultFactors],
      AREA: [...resultAreas],
      CONTRACTORS: [...resultUsers],
      USERS: [...resultUsers],
    };

    res.status(200).json({ historyIMSMasterData: masterDetails });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      error: "An error occurred while fetching data",
    });
  }
};
exports.addNewIms = async (req, res) => {
  const { ID } = req.user;
  const {
    inc_date_time,
    department,
    area,
    reported_by,
    injury_type,
    factors,
    exact_location,
    potential_outcome,
    action_taken,
    injury_details,
    incident_details,
    immediate_action,
    suggested_team,
    witness,
  } = req.body;

  console.log(req.body);

  res.status(200).json({ message: "Data processed successfully." });

  const currentTime = new Date();

  // Fetch Area Head
  const areaQuery = `
      SELECT DISTINCT
        t1.id,
        t1.name,
        t1.head_user_id head_id
      FROM
        t_inshe_org_structures t1
      WHERE
        t1.is_deleted = 0 AND t1.id = ?
    `;
  const resultArea = await simpleQuery(areaQuery, [area]);
  if (!resultArea.length) {
    return res.status(404).json({ message: "Area not found." });
  }

  const areaHead = resultArea[0].head_id;

  // Insert into incident header
  const insertQuery = `
      INSERT INTO t_inshe_incident_header (
        inc_date_time,
        department,
        area,
        reported_by,
        injury_type,
        factors,
        exact_location,
        potential_outcome,
        action_taken,
        incident_details,
        immediate_action,
        status,
        pending_on,
        created_at,
        created_by,
        updated_at,
        updated_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  const insertValues = [
    inc_date_time,
    department,
    area,
    reported_by,
    injury_type,
    factors,
    exact_location,
    potential_outcome,
    action_taken,
    incident_details,
    immediate_action,
    "Submitted",
    areaHead,
    currentTime,
    ID,
    currentTime,
    ID,
  ];

  const insertResult = await simpleQuery(insertQuery, insertValues);
  // console.log(insertResult.insertid);
  // if (insertResult.affectedRows > 0) {
  //   const lastInsertedIdQuery = "SELECT LAST_INSERT_ID() AS last_id";
  //   const result = await simpleQuery(lastInsertedIdQuery);
  //   const incidentId = result[0]?.last_id;
  //   console.log("Last inserted ID:", incidentId);
  // }
  const incidentId = insertResult.insertId;

  // Helper function to parse and insert JSON data
  const parseAndInsert = async (jsonString, query, mapValues) => {
    if (jsonString) {
      let parsedData;
      try {
        parsedData = JSON.parse(jsonString);
      } catch (error) {
        console.error("Error parsing JSON:", error);
        return;
      }

      if (Array.isArray(parsedData) && parsedData.length > 0) {
        for (const item of parsedData) {
          const values = mapValues(item);
          await simpleQuery(query, values);
        }
      }
    }
  };

  // Insert injury details
  const injuryInsertQuery = `
      INSERT INTO t_inshe_incident_injury_dtls (
        header_id,
        company_type,
        employee_id,
        name,
        department,
        company,
        age,
        sex,
        deployed_date,
        body_part,
        injury_nature,
        status,
        created_at,
        created_by,
        updated_at,
        updated_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  await parseAndInsert(injury_details, injuryInsertQuery, (injury) => [
    incidentId,
    injury.companyType,
    injury.employeeId,
    injury.name,
    injury.department,
    injury.company,
    injury.age,
    injury.sex,
    injury.deployedDate,
    injury.bodyPart,
    injury.injuryNature,
    "Submitted",
    currentTime,
    ID,
    currentTime,
    ID,
  ]);

  // Insert suggested team
  const suggestedInsertQuery = `
      INSERT INTO t_inshe_incident_team (
        header_id,
        team_type,
        employee_id,
        name,
        created_at,
        created_by,
        updated_at,
        updated_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
  await parseAndInsert(suggested_team, suggestedInsertQuery, (sugg) => [
    incidentId,
    "SUGGESTED_TEAM",
    sugg.id,
    sugg.name,
    currentTime,
    ID,
    currentTime,
    ID,
  ]);

  // Insert witness team

  const witnessInsertQuery = `
    INSERT INTO t_inshe_incident_team (
      header_id,
      team_type,
      employee_id,
      name,
      department,
      created_at,
      created_by,
      updated_at,
      updated_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await parseAndInsert(witness, witnessInsertQuery, (witt) => [
    incidentId,
    "WITNESS_TEAM",
    witt.employeeId,
    witt.name,
    witt.department,
    currentTime,
    ID,
    currentTime,
    ID,
  ]);

  console.log("Data inserted successfully.");
  res.status(200).json({ message: "Data processed successfully." });
};
