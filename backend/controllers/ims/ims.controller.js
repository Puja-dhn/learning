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
exports.getImsData = async (req, res) => {
  const { ID: logged_user_id, ROLES } = req.user;
  const isAdmin = ROLES && ROLES.length > 0 && ROLES.includes(1);

  const {
    incident_no,
    department,
    area,
    injury_type,
    factors,
    date_from,
    date_to,
    status,
  } = req.body;

  const strId = incident_no > 0 ? ` and t1.id=${id}` : "";
  const strDepartment =
    department !== "All" ? ` and t1.department=${department}` : "";
  const strArea = area !== "All" ? ` and t1.area=${area}` : "";
  const strInjuryType =
    injury_type !== "All" ? ` and t1.injury_type=${injury_type}` : "";
  const strFactors = factors !== "All" ? ` and t1.factors='${factors}'` : "";
  const strStatus = status !== "All" ? ` and t1.status='${status}'` : "";
  const strFromDate =
    date_from !== "" ? ` and DATE(t1.obs_datetime) >='${date_from}'` : "";
  const strToDate =
    date_to !== "" ? ` and DATE(t1.obs_datetime) <='${date_to}'` : "";

  const imsQuery = `
  SELECT 
    t1.id incident_no,
    t1.inc_date_time,
    t1.department department_id,
    t2.name department,
    t1.area area_id,
    t3.name area,
    t4.context_name injury_type,
    t8.context_name factors,
    t1.reported_by,
    t1.exact_location,
    t1.potential_outcome,
    t1.action_taken,
    t1.incident_details,
    t1.immediate_action,
    t5.name pending_on,
    t1.status,
    t1.created_at,
    t1.created_by,
    t1.updated_at,
    t1.updated_by,
    t7.name log_by,
    LPAD(t1.id, 6, '0') AS disp_logno
  FROM
    t_inshe_incident_header t1
    join t_inshe_org_structures t2 on t1.department = t2.id
    join t_inshe_org_structures t3 on t1.area = t3.id
    left join t_inshe_context_definitions t4 on t1.injury_type = t4.context_id
    left join t_inshe_context_definitions t8 on t1.factors = t8.context_id
    left join t_inshe_users t5 on t1.pending_on = t5.id
    join t_inshe_users t7 on t1.created_by = t7.id
  WHERE
    1=1
    ${strId}
    ${strDepartment}
    ${strArea}
    ${strInjuryType}
    ${strFactors}
    ${strStatus}
    ${strFromDate}
    ${strToDate}
    order by t1.id desc
`;

  const resultIms = await simpleQuery(imsQuery, []);

  const injuryQuery = `
      SELECT 
          t1.id,
          t1.header_id,
          t1.company_type,
          t1.employee_id,
          t1.name,
          t1.department,
          t1.company,
          t1.age,
          t1.sex,
          t1.deployed_date,
          t1.body_part,
          t1.injury_nature
      FROM
          t_inshe_incident_injury_dtls t1
      WHERE
       1=1
       
    `;

  const resultInjury = await simpleQuery(injuryQuery, []);

  const suggTeamQuery = `
      SELECT DISTINCT
          t1.id,
          t1.header_id,
          t1.team_type,
          t1.employee_id,
          t1.name,
          t1.department
      FROM
          t_inshe_incident_team t1
      WHERE
        1=1
        and team_type = "SUGGESTED_TEAM"
       
    `;

  const resultSuggTeams = await simpleQuery(suggTeamQuery, []);

  const witTeamQuery = `
      SELECT DISTINCT
          t1.id,
          t1.header_id,
          t1.team_type,
          t1.employee_id,
          t1.name,
          t1.department
      FROM
          t_inshe_incident_team t1
      WHERE
        1=1
        and team_type = "WITNESS_TEAM"
       
    `;

  const resultWittTeams = await simpleQuery(witTeamQuery, []);

  res.status(200).json({
    historyLogImsData: [...resultIms],
    INJURY_DETAILS: [...resultInjury],
    SUGG_TEAM: [...resultSuggTeams],
    WITNESS_TEAM: [...resultWittTeams],
  });
};
exports.getImsOthersData = async (req, res) => {
  const { incidentNo } = req.body;
  console.log(req);
  try {
    const injuryQuery = `
      SELECT 
          t1.id,
          t1.header_id,
          t1.company_type,
          t1.employee_id,
          t1.name,
          t1.department,
          t1.company,
          t1.age,
          t1.sex,
          t1.deployed_date,
          t1.body_part,
          t1.injury_nature,
      FROM
          t_inshe_incident_injury_dtls t1
      WHERE
        t1.header_id = ?
       
    `;

    const resultInjury = await simpleQuery(injuryQuery, [incidentNo]);

    const suggTeamQuery = `
      SELECT DISTINCT
          t1.id,
          t1.header_id,
          t1.team_type,
          t1.employee_idm
          t1.name,
          t1.department
      FROM
          t_inshe_incident_team t1
      WHERE
        t1.header_id = ?
        and team_type = "SUGGESTED_TEAM"
       
    `;

    const resultSuggTeams = await simpleQuery(suggTeamQuery, [incidentNo]);

    const witTeamQuery = `
      SELECT DISTINCT
          t1.id,
          t1.header_id,
          t1.team_type,
          t1.employee_idm
          t1.name,
          t1.department
      FROM
          t_inshe_incident_team t1
      WHERE
        t1.header_id = ?
        and team_type = "WITNESS_TEAM"
       
    `;

    const resultWittTeams = await simpleQuery(witTeamQuery, [incidentNo]);

    const masterDetails = {
      INJURY_DETAILS: [...resultInjury],
      SUGG_TEAM: [...resultSuggTeams],
      WITNESS_TEAM: [...resultWittTeams],
    };

    res.status(200).json({ historyIMSOthersData: masterDetails });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      error: "An error occurred while fetching data",
    });
  }
};
exports.getImsTeamFormationData = async (req, res) => {
  const { ID: logged_user_id, ROLES } = req.user;
  const isAdmin = ROLES && ROLES.length > 0 && ROLES.includes(1);

  const {
    incident_no,
    department,
    area,
    injury_type,
    factors,
    date_from,
    date_to,
    status,
  } = req.body;

  const strId = incident_no > 0 ? ` and t1.id=${id}` : "";
  const strDepartment =
    department !== "All" ? ` and t1.department=${department}` : "";
  const strArea = area !== "All" ? ` and t1.area=${area}` : "";
  const strInjuryType =
    injury_type !== "All" ? ` and t1.injury_type=${injury_type}` : "";
  const strFactors = factors !== "All" ? ` and t1.factors='${factors}'` : "";
  const strStatus = status !== "All" ? ` and t1.status='${status}'` : "";
  const strFromDate =
    date_from !== "" ? ` and DATE(t1.obs_datetime) >='${date_from}'` : "";
  const strToDate =
    date_to !== "" ? ` and DATE(t1.obs_datetime) <='${date_to}'` : "";

  const imsQuery = `
  SELECT 
    t1.id incident_no,
    t1.inc_date_time,
    t1.department department_id,
    t2.name department,
    t1.area area_id,
    t3.name area,
    t4.context_name injury_type,
    t8.context_name factors,
    t1.reported_by,
    t1.exact_location,
    t1.potential_outcome,
    t1.action_taken,
    t1.incident_details,
    t1.immediate_action,
    t5.name pending_on,
    t1.status,
    t1.created_at,
    t1.created_by,
    t1.updated_at,
    t1.updated_by,
    t7.name log_by,
    LPAD(t1.id, 6, '0') AS disp_logno
  FROM
    t_inshe_incident_header t1
    join t_inshe_org_structures t2 on t1.department = t2.id
    join t_inshe_org_structures t3 on t1.area = t3.id
    left join t_inshe_context_definitions t4 on t1.injury_type = t4.context_id
    left join t_inshe_context_definitions t8 on t1.factors = t8.context_id
    left join t_inshe_users t5 on t1.pending_on = t5.id
    join t_inshe_users t7 on t1.created_by = t7.id
  WHERE
    1=1
    and t1.status='Submitted'
    and t1.pending_on = ?
    ${strId}
    ${strDepartment}
    ${strArea}
    ${strInjuryType}
    ${strFactors}
    ${strStatus}
    ${strFromDate}
    ${strToDate}
    order by t1.id desc
`;

  const resultIms = await simpleQuery(imsQuery, [logged_user_id]);

  const injuryQuery = `
      SELECT 
          t1.id,
          t1.header_id,
          t1.company_type,
          t1.employee_id,
          t1.name,
          t1.department,
          t1.company,
          t1.age,
          t1.sex,
          t1.deployed_date,
          t1.body_part,
          t1.injury_nature
      FROM
          t_inshe_incident_injury_dtls t1
      WHERE
       1=1
       
    `;

  const resultInjury = await simpleQuery(injuryQuery, []);

  const suggTeamQuery = `
      SELECT DISTINCT
          t1.id,
          t1.header_id,
          t1.team_type,
          t1.employee_id,
          t1.name,
          t1.department
      FROM
          t_inshe_incident_team t1
      WHERE
        1=1
        and team_type = "SUGGESTED_TEAM"
       
    `;

  const resultSuggTeams = await simpleQuery(suggTeamQuery, []);

  const witTeamQuery = `
      SELECT DISTINCT
          t1.id,
          t1.header_id,
          t1.team_type,
          t1.employee_id,
          t1.name,
          t1.department
      FROM
          t_inshe_incident_team t1
      WHERE
        1=1
        and team_type = "WITNESS_TEAM"
       
    `;

  const resultWittTeams = await simpleQuery(witTeamQuery, []);

  res.status(200).json({
    historyLogImsData: [...resultIms],
    INJURY_DETAILS: [...resultInjury],
    SUGG_TEAM: [...resultSuggTeams],
    WITNESS_TEAM: [...resultWittTeams],
  });
};
exports.submitTeamFormationdata = async (req, res) => {
  const { ID } = req.user;
  const {
    disp_logno,
    incident_no,
    inc_date_time,
    department_id,
    department,
    area_id,
    area,
    injury_type,
    factors,
    reported_by,
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
    updated_by,
    log_by,
    suggested_team,
  } = req.body.pdcData;

  const currentTime = new Date();
  const checkHeaderExistsQuery =
    "SELECT * FROM t_inshe_incident_team WHERE header_id = ?";
  const headerExists = await simpleQuery(checkHeaderExistsQuery, [incident_no]);

  // Delete existing data if header_id exists
  if (headerExists.length > 0) {
    const deleteQuery = "DELETE FROM t_inshe_incident_team WHERE header_id = ?";
    await simpleQuery(deleteQuery, [incident_no]);
    console.log("Existing data for header_id", incident_no, "deleted");
  }

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
    incident_no,
    "SUGGESTED_TEAM",
    sugg.id,
    sugg.name,
    currentTime,
    ID,
    currentTime,
    ID,
  ]);

  const updateHeaderQuery = `
  UPDATE t_inshe_incident_header 
  SET status = 'TEAM_FORMED', 
      updated_at = ?, 
      updated_by = ? 
  WHERE id = ?
`;
  await simpleQuery(updateHeaderQuery, [currentTime, ID, incident_no]);

  console.log("Data inserted successfully.");
  res.status(200).json({ message: "Data processed successfully." });
};
exports.getImsCloseData = async (req, res) => {
  const { ID: logged_user_id, ROLES } = req.user;
  const isAdmin = ROLES && ROLES.length > 0 && ROLES.includes(1);

  const {
    incident_no,
    department,
    area,
    injury_type,
    factors,
    date_from,
    date_to,
    status,
  } = req.body;

  const strId = incident_no > 0 ? ` and t1.id=${id}` : "";
  const strDepartment =
    department !== "All" ? ` and t1.department=${department}` : "";
  const strArea = area !== "All" ? ` and t1.area=${area}` : "";
  const strInjuryType =
    injury_type !== "All" ? ` and t1.injury_type=${injury_type}` : "";
  const strFactors = factors !== "All" ? ` and t1.factors='${factors}'` : "";
  const strStatus = status !== "All" ? ` and t1.status='${status}'` : "";
  const strFromDate =
    date_from !== "" ? ` and DATE(t1.obs_datetime) >='${date_from}'` : "";
  const strToDate =
    date_to !== "" ? ` and DATE(t1.obs_datetime) <='${date_to}'` : "";

  const imsQuery = `
  SELECT 
    t1.id incident_no,
    t1.inc_date_time,
    t1.department department_id,
    t2.name department,
    t1.area area_id,
    t3.name area,
    t4.context_name injury_type,
    t8.context_name factors,
    t1.reported_by,
    t1.exact_location,
    t1.potential_outcome,
    t1.action_taken,
    t1.incident_details,
    t1.immediate_action,
    t5.name pending_on,
    t1.status,
    t1.created_at,
    t1.created_by,
    t1.updated_at,
    t1.updated_by,
    t7.name log_by,
    LPAD(t1.id, 6, '0') AS disp_logno
  FROM
    t_inshe_incident_header t1
    join t_inshe_org_structures t2 on t1.department = t2.id
    join t_inshe_org_structures t3 on t1.area = t3.id
    left join t_inshe_context_definitions t4 on t1.injury_type = t4.context_id
    left join t_inshe_context_definitions t8 on t1.factors = t8.context_id
    left join t_inshe_users t5 on t1.pending_on = t5.id
    join t_inshe_users t7 on t1.created_by = t7.id
  WHERE
    1=1
    and t1.status='INVESTIGATE'
    and t1.pending_on = ?
    ${strId}
    ${strDepartment}
    ${strArea}
    ${strInjuryType}
    ${strFactors}
    ${strStatus}
    ${strFromDate}
    ${strToDate}
    order by t1.id desc
`;

  const resultIms = await simpleQuery(imsQuery, [logged_user_id]);

  const injuryQuery = `
      SELECT 
          t1.id,
          t1.header_id,
          t1.company_type,
          t1.employee_id,
          t1.name,
          t1.department,
          t1.company,
          t1.age,
          t1.sex,
          t1.deployed_date,
          t1.body_part,
          t1.injury_nature
      FROM
          t_inshe_incident_injury_dtls t1
      WHERE
       1=1
       
    `;

  const resultInjury = await simpleQuery(injuryQuery, []);

  const suggTeamQuery = `
      SELECT DISTINCT
          t1.id,
          t1.header_id,
          t1.team_type,
          t1.employee_id,
          t1.name,
          t1.department
      FROM
          t_inshe_incident_team t1
      WHERE
        1=1
        and team_type = "SUGGESTED_TEAM"
       
    `;

  const resultSuggTeams = await simpleQuery(suggTeamQuery, []);

  const witTeamQuery = `
      SELECT DISTINCT
          t1.id,
          t1.header_id,
          t1.team_type,
          t1.employee_id,
          t1.name,
          t1.department
      FROM
          t_inshe_incident_team t1
      WHERE
        1=1
        and team_type = "WITNESS_TEAM"
       
    `;

  const resultWittTeams = await simpleQuery(witTeamQuery, []);

  res.status(200).json({
    historyLogImsData: [...resultIms],
    INJURY_DETAILS: [...resultInjury],
    SUGG_TEAM: [...resultSuggTeams],
    WITNESS_TEAM: [...resultWittTeams],
  });
};
exports.closeIncident = async (req, res) => {
  const { ID } = req.user;
  const {
    disp_logno,
    incident_no,
    inc_date_time,
    department_id,
    department,
    area_id,
    area,
    injury_type,
    factors,
    reported_by,
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
    updated_by,
    log_by,
    close_date,
    close_remarks,
  } = req.body.pdcData;

  const currentTime = new Date();

  const updateHeaderQuery = `
  UPDATE t_inshe_incident_header 
  SET status = 'Closed', 
      close_date = ?,
      close_remarks = ?,
      updated_at = ?, 
      updated_by = ? ,
      pending_on = 0
  WHERE id = ?
`;
  await simpleQuery(updateHeaderQuery, [
    currentTime,
    close_remarks,
    currentTime,
    ID,
    incident_no,
  ]);

  console.log("Data inserted successfully.");
  res.status(200).json({ message: "Data processed successfully." });
};
