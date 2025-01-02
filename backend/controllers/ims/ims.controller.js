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
        and definitions_type = "IMS_LOG_INJURY_TYPE"
       
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
        t1.emp_no AS id,
    	CONCAT(t1.name, " (", t1.emp_no, ")") AS name
    FROM
        t_inshe_users t1
    WHERE
      t1.status = 'Active'
      and t1.id !=1
      order by name asc
     
  `;

    const resultUsers = await simpleQuery(usersQuery, []);

    const bodypartQuery = `
    SELECT DISTINCT
        t1.context_id id,
        t1.context_name name
    FROM
        t_inshe_context_definitions t1
    WHERE
      t1.is_deleted = 0
      and definitions_type = "IMS_INJURY_BODYPART"
     
  `;

    const resultBodypart = await simpleQuery(bodypartQuery, []);

    const injNatureQuery = `
    SELECT DISTINCT
        t1.context_id id,
        t1.context_name name
    FROM
        t_inshe_context_definitions t1
    WHERE
      t1.is_deleted = 0
      and definitions_type = "IMS_INJURY_NATURE"
     
  `;
    const resultInjNature = await simpleQuery(injNatureQuery, []);

    const injuryMedicalQuery = `
  SELECT DISTINCT
      t1.context_id id,
      t1.context_name name
  FROM
      t_inshe_context_definitions t1
  WHERE
    t1.is_deleted = 0
    and definitions_type = "IMS_INJURY_TYPE"
   
`;

    const resultInjuryMedical = await simpleQuery(injuryMedicalQuery, []);

    const masterDetails = {
      DEPARTMENT: [...resultDepartments],
      INJURYTYPE: [...resultInjury],
      FACTORS: [...resultFactors],
      AREA: [...resultAreas],
      CONTRACTORS: [...resultUsers],
      USERS: [...resultUsers],
      BODYPART: [...resultBodypart],
      INJURYNATURE: [...resultInjNature],
      INJURYMEDICAL: [...resultInjuryMedical],
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
    ims_photos,
    immediate_action,
    suggested_team,
    witness,
  } = req.body;

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
  let insertResult;
  if (+injury_type === 11) {
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
    ims_photos,
    immediate_action,
    status,
    medical_status,
    pending_on,
    created_at,
    created_by,
    updated_at,
    updated_by
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      ims_photos || "",
      immediate_action,
      "Submitted",
      "Pending",
      areaHead,
      currentTime,
      ID,
      currentTime,
      ID,
    ];

    insertResult = await simpleQuery(insertQuery, insertValues);
  } else {
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
        ims_photos,
        immediate_action,
        status,
        pending_on,
        created_at,
        created_by,
        updated_at,
        updated_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      ims_photos || "",
      immediate_action,
      "Submitted",
      areaHead,
      currentTime,
      ID,
      currentTime,
      ID,
    ];

    insertResult = await simpleQuery(insertQuery, insertValues);
  }

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
        body_part,
        injury_nature,
        status,
        created_at,
        created_by,
        updated_at,
        updated_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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

  return res.status(200).json({ message: "Data processed successfully." });
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
   DATE_FORMAT(t1.inc_date_time, '%d-%b-%Y %h:%i:%s %p') AS inc_date_time,
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
    t1.ims_photos,
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

  const investigationQuery = `
  SELECT DISTINCT
      t1.id,
      t1.incident_id,
      t1.list_facts,
      t1.physical_factors,
      t1.human_factors,
      t1.system_factors,
      t1.status,
      t1.risk_identified,
      t1.identified_control,
      t1.control_type,
      t1.control_description,
      t1.control_adequate_desc
  FROM
      t_inshe_incident_investigation t1
  WHERE
    1=1 
`;

  const resultInvestigation = await simpleQuery(investigationQuery, []);

  const recommendationQuery = `
  SELECT DISTINCT
      t1.id,
      t1.incident_id,
      t1.recommendation,
      t1.responsibility,
      t1.factor,
      t1.control_type,
      t1.target_date,
      t1.status
  FROM
      t_inshe_incident_recommendation t1
  WHERE
    1=1 
`;

  const resultRecommendation = await simpleQuery(recommendationQuery, []);

  const documentsQuery = `
  SELECT DISTINCT
      t1.id,
      t1.incident_id,
      t1.document_type,
      t1.document,
      t1.status
  FROM
      t_inshe_incident_documents t1
  WHERE
    1=1 
`;

  const resultDocuments = await simpleQuery(documentsQuery, []);

  res.status(200).json({
    historyLogImsData: [...resultIms],
    INJURY_DETAILS: [...resultInjury],
    SUGG_TEAM: [...resultSuggTeams],
    WITNESS_TEAM: [...resultWittTeams],
    INVESTIGATION_DATA: [...resultInvestigation],
    RECOMMENDATION_DATA: [...resultRecommendation],
    DOCUMENTS_DATA: [...resultDocuments],
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
    DATE_FORMAT(t1.inc_date_time, '%d-%b-%Y %h:%i:%s %p') AS inc_date_time,
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
    t1.ims_photos,
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
    close_remarks,
    suggested_team,
  } = req.body.pdcData;

  const currentTime = new Date();
  if (injury_type === "Medical Center FAC") {
    const checkHeaderExistsQuery =
      "SELECT * FROM t_inshe_incident_team WHERE header_id = ? and team_type='SUGGESTED_TEAM'";
    const headerExists = await simpleQuery(checkHeaderExistsQuery, [
      incident_no,
    ]);

    // Delete existing data if header_id exists
    if (headerExists.length > 0) {
      const deleteQuery =
        "DELETE FROM t_inshe_incident_team WHERE header_id = ? and team_type='SUGGESTED_TEAM'";
      await simpleQuery(deleteQuery, [incident_no]);
      console.log("Existing data for header_id", incident_no, "deleted");
    }

    // Helper function to parse and insert JSON data
    const parseAndInsert = async (jsonString, query, mapValues) => {
      if (jsonString) {
        let parsedData;
        try {
          parsedData = JSON.parse(jsonString);
          console.log(parsedData);
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

    const pendingOnIds = JSON.parse(suggested_team)
      .map((item) => item.id)
      .join(",");
    const updateHeaderQuery = `
    UPDATE t_inshe_incident_header
    SET status = 'Team Formed',
        pending_on = ?,
        updated_at = ?,
        updated_by = ?
    WHERE id = ?
  `;
    await simpleQuery(updateHeaderQuery, [
      pendingOnIds,
      currentTime,
      ID,
      incident_no,
    ]);
  } else {
    const updateHeaderQuery = `
    UPDATE t_inshe_incident_header
    SET status = 'Closed', pending_on = ?, updated_at = ?, updated_by = ?, close_date = ?, close_remarks = ?
    WHERE id = ?
  `;
    await simpleQuery(updateHeaderQuery, [
      0,
      currentTime,
      ID,
      currentTime,
      close_remarks,
      incident_no,
    ]);
  }

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
    DATE_FORMAT(t1.inc_date_time, '%d-%b-%Y %h:%i:%s %p') AS inc_date_time,
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
    t1.ims_photos,
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
    and t1.status='Investigated'
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
exports.getImsCategorizationData = async (req, res) => {
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
    DATE_FORMAT(t1.inc_date_time, '%d-%b-%Y %h:%i:%s %p') AS inc_date_time,
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
    t1.ims_photos,
    t1.immediate_action,
    'Medical Team' pending_on,
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
    and t1.status != 'Closed'
    and t1.medical_status = 'Pending'
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
          t1.injury_nature,
          t1.category,
          t1.rejoin_date
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
exports.submitIncidentCategory = async (req, res) => {
  const { ID } = req.user;
  const { injury_details, incident_no } = req.body.pdcData;
  const currentTime = new Date();
  const injuryDetailsArray = JSON.parse(injury_details);
  if (Array.isArray(injuryDetailsArray) && injuryDetailsArray.length > 0) {
    const updateInjuryDetailQuery = `
      UPDATE t_inshe_incident_injury_dtls
      SET category = ?, rejoin_date = ?, status = 'Completed', updated_at = ?, updated_by = ?
      WHERE id = ?
    `;

    for (const detail of injuryDetailsArray) {
      await simpleQuery(updateInjuryDetailQuery, [
        detail.category ? detail.category : "",
        detail.rejoin_date ? detail.rejoin_date : "",
        currentTime,
        ID,
        detail.id,
      ]);
    }
  }

  const checkStatusQuery = `
  SELECT COUNT(*) AS incomplete_count
  FROM t_inshe_incident_injury_dtls
  WHERE header_id = ? AND status != 'Completed'
`;
  const [result] = await simpleQuery(checkStatusQuery, [incident_no]);

  if (result.incomplete_count === 0) {
    // Update the header's medical status to 'Completed'
    const updateHeaderQuery = `
    UPDATE t_inshe_incident_header
    SET medical_status = 'Completed', updated_at = ?, updated_by = ?
    WHERE id = ?
  `;
    await simpleQuery(updateHeaderQuery, [currentTime, ID, incident_no]);
  }

  // const updateHeaderQuery = `
  //   UPDATE t_inshe_incident_header
  //   SET status = 'Team Formed',
  //       updated_at = ?,
  //       updated_by = ?
  //   WHERE id = ?
  // `;
  // await simpleQuery(updateHeaderQuery, [currentTime, ID, incident_no]);

  console.log("Data updated successfully.");
  res.status(200).json({ message: "Data processed successfully." });
};
exports.getImsInvestigationData = async (req, res) => {
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
    DATE_FORMAT(t1.inc_date_time, '%d-%b-%Y %h:%i:%s %p') AS inc_date_time,
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
    t1.ims_photos,
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
    and t1.status = "Team Formed"
    and  FIND_IN_SET(?, t1.pending_on) > 0
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
exports.submitInvestigationData = async (req, res) => {
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
    repeated_incident,
    status,
    immediate_action,
    risk_identified,
    identified_control,
    control_type,
    control_description,
    control_adequate_desc,
    list_facts,
    physical_factors,
    human_factors,
    system_factors,
    recommendations,
    documents,
  } = req.body.pdcData;
  // console.log(req.body.pdcData);

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
  const resultArea = await simpleQuery(areaQuery, [area_id]);
  if (!resultArea.length) {
    return res.status(404).json({ message: "Area not found." });
  }

  const areaHead = resultArea[0].head_id;

  const currentTime = new Date();
  const investigationInsertQuery = `
  INSERT INTO t_inshe_incident_investigation (
    incident_id,
    repeated_incident,
    list_facts,
    physical_factors,
    human_factors,
    system_factors,
    status,
    risk_identified,
    identified_control,
    control_type,
    control_description,
    control_adequate_desc,
    created_at,
    created_by,
    updated_at,
    updated_by
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
`;
  await simpleQuery(investigationInsertQuery, [
    incident_no,
    repeated_incident,
    list_facts,
    physical_factors,
    human_factors,
    system_factors,
    "Submitted",
    risk_identified,
    identified_control | null,
    control_type | null,
    control_description | null,
    control_adequate_desc | null,
    currentTime,
    ID,
    currentTime,
    ID,
  ]);

  // Helper function to parse and insert JSON data
  const parseAndInsert = async (jsonString, query, mapValues) => {
    if (jsonString) {
      let parsedData;
      try {
        parsedData = JSON.parse(jsonString);
        console.log(parsedData);
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

  const recommendationInsertQuery = `
      INSERT INTO t_inshe_incident_recommendation (
        incident_id,
        recommendation,
        responsibility,
        factor,
        control_type,
        target_date,
        status,
        created_by,
        created_at,
        updated_by,
        updated_at,
        pending_on
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  await parseAndInsert(recommendations, recommendationInsertQuery, (recom) => [
    incident_no,
    recom.recommendation,
    recom.responsibility,
    recom.factor,
    recom.control_type,
    recom.target_date,
    "Submitted",
    ID,
    currentTime,
    ID,
    currentTime,
    recom.resp_id,
  ]);

  const documentInsertQuery = `
      INSERT INTO t_inshe_incident_documents (
        incident_id,
        document_type,
        document,
        status,
        created_by,
        created_at,
        updated_by,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
  await parseAndInsert(documents, documentInsertQuery, (doc) => [
    incident_no,
    doc.documentType,
    doc.document,
    "Submitted",
    ID,
    currentTime,
    ID,
    currentTime,
  ]);
  const updateHeaderQuery = `
  UPDATE t_inshe_incident_header
  SET status = 'Investigated',
      updated_at = ?,
      updated_by = ?
  WHERE id = ?
`;
  await simpleQuery(updateHeaderQuery, [currentTime, ID, incident_no]);
  console.log("Data inserted successfully.");
  res.status(200).json({ message: "Data processed successfully." });
};
exports.getRecommendationData = async (req, res) => {
  const { ID: logged_user_id, ROLES } = req.user;
  const isAdmin = ROLES && ROLES.length > 0 && ROLES.includes(1);

  const { incident_no, date_from, date_to, status } = req.body;

  const strId = incident_no > 0 ? ` and t1.incident_id=${id}` : "";

  const strStatus = status !== "All" ? ` and t1.status='${status}'` : "";
  const strFromDate =
    date_from !== "" ? ` and DATE(t1.created_at) >='${date_from}'` : "";
  const strToDate =
    date_to !== "" ? ` and DATE(t1.created_at) <='${date_to}'` : "";

  const imsQuery = `
  SELECT 
    t8.id incident_no,
    DATE_FORMAT(t8.inc_date_time, '%d-%b-%Y %h:%i:%s %p') AS inc_date_time,
    t8.department department_id,
    t2.name department,
    t8.area area_id,
    t8.ims_photos,
    t3.name area,
    t1.recommendation,
    t1.responsibility,
    t1.factor,
    t1.control_type,
    t1.target_date,
    t1.status,
    LPAD(t1.id, 6, '0') AS disp_logno,
    t1.id
  FROM
    t_inshe_incident_recommendation t1
    join t_inshe_incident_header t8 on t1.incident_id = t8.id
    join t_inshe_org_structures t2 on t8.department = t2.id
    join t_inshe_org_structures t3 on t8.area = t3.id
  WHERE
    1=1
    and t1.pending_on = ?
    ${strId}
    ${strStatus}
    ${strFromDate}
    ${strToDate}
    order by t1.id desc
`;

  const resultIms = await simpleQuery(imsQuery, [logged_user_id]);

  res.status(200).json({
    historyLogImsData: [...resultIms],
  });
};
exports.closeRecommendation = async (req, res) => {
  const { ID } = req.user;
  const { id, close_remarks } = req.body.pdcData;

  const currentTime = new Date();

  const updateHeaderQuery = `
  UPDATE t_inshe_incident_recommendation 
  SET status = 'Closed', 
      closure_remarks = ?,
      updated_at = ?, 
      updated_by = ? 
     
  WHERE id = ?
`;
  await simpleQuery(updateHeaderQuery, [close_remarks, currentTime, ID, id]);

  res.status(200).json({ message: "Data processed successfully." });
};
exports.getPendingHdInitiateData = async (req, res) => {
  const { ID: logged_user_id, ROLES } = req.user;
  const isAdmin = ROLES && ROLES.length > 0 && ROLES.includes(1);

  const { incident_no, date_from, date_to, status } = req.body;

  const strId = incident_no > 0 ? ` and t1.incident_id=${id}` : "";

  const strStatus = status !== "All" ? ` and t1.status='${status}'` : "";
  const strFromDate =
    date_from !== "" ? ` and DATE(t1.created_at) >='${date_from}'` : "";
  const strToDate =
    date_to !== "" ? ` and DATE(t1.created_at) <='${date_to}'` : "";

  const imsQuery = `
  SELECT 
    t8.id incident_no,
    DATE_FORMAT(t8.inc_date_time, '%d-%b-%Y %h:%i:%s %p') AS inc_date_time,
    t8.department department_id,
    t2.name department,
    t8.area area_id,
    t8.ims_photos,
    t3.name area,
    t1.recommendation,
    t1.responsibility,
    t1.factor,
    t1.control_type,
    t1.target_date,
    t1.status,
    LPAD(t1.id, 6, '0') AS disp_logno,
    t1.id
  FROM
    t_inshe_incident_recommendation t1
    join t_inshe_incident_header t8 on t1.incident_id = t8.id
    join t_inshe_org_structures t2 on t8.department = t2.id
    join t_inshe_org_structures t3 on t8.area = t3.id
  WHERE
    1=1
    ${strId}
    ${strFromDate}
    ${strToDate}
    and t1.status = 'Closed'
    order by t1.id desc
`;

  const resultIms = await simpleQuery(imsQuery, [logged_user_id]);

  res.status(200).json({
    historyLogImsData: [...resultIms],
  });
};
exports.getHdMasterData = async (req, res) => {
  try {
    const departmentQuery = `
      SELECT DISTINCT
          t1.id,
          t1.head_user_id,
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
        and definitions_type = "IMS_LOG_INJURY_TYPE"
       
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
      order by t1.name asc
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
        t1.emp_no AS id,
    	CONCAT(t1.name, " (", t1.emp_no, ")") AS name
    FROM
        t_inshe_users t1
    WHERE
      t1.status = 'Active'
      and t1.id !=1
      order by name asc
     
  `;

    const resultUsers = await simpleQuery(usersQuery, []);

    const bodypartQuery = `
    SELECT DISTINCT
        t1.context_id id,
        t1.context_name name
    FROM
        t_inshe_context_definitions t1
    WHERE
      t1.is_deleted = 0
      and definitions_type = "IMS_INJURY_BODYPART"
     
  `;

    const resultBodypart = await simpleQuery(bodypartQuery, []);

    const injNatureQuery = `
    SELECT DISTINCT
        t1.context_id id,
        t1.context_name name
    FROM
        t_inshe_context_definitions t1
    WHERE
      t1.is_deleted = 0
      and definitions_type = "IMS_INJURY_NATURE"
     
  `;
    const resultInjNature = await simpleQuery(injNatureQuery, []);

    const injuryMedicalQuery = `
  SELECT DISTINCT
      t1.context_id id,
      t1.context_name name
  FROM
      t_inshe_context_definitions t1
  WHERE
    t1.is_deleted = 0
    and definitions_type = "IMS_INJURY_TYPE"
   
`;

    const resultInjuryMedical = await simpleQuery(injuryMedicalQuery, []);

    const masterDetails = {
      DEPARTMENT: [...resultDepartments],
      INJURYTYPE: [...resultInjury],
      FACTORS: [...resultFactors],
      AREA: [...resultAreas],
      CONTRACTORS: [...resultUsers],
      USERS: [...resultUsers],
      BODYPART: [...resultBodypart],
      INJURYNATURE: [...resultInjNature],
      INJURYMEDICAL: [...resultInjuryMedical],
    };

    res.status(200).json({ historyIMSMasterData: masterDetails });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      error: "An error occurred while fetching data",
    });
  }
};
exports.submitHDInitiate = async (req, res) => {
  const { ID } = req.user;
  const { recomid, incidentno, hddata } = req.body;
  const currentTime = new Date();
  const hdDetailsArray = JSON.parse(hddata);
  if (Array.isArray(hdDetailsArray) && hdDetailsArray.length > 0) {
    const updateHdInitiateQuery = `
      insert into t_inshe_hd_details(recom_id,incident_id,department,area,hd_status,pending_on,created_at,created_by)
      values(?, ?,  ?, ?, ?, ?, ?, ?)
      `;

    for (const detail of hdDetailsArray) {
      const departmentQuery = `
        SELECT DISTINCT
            t1.parent_id,
            t1.head_user_id
        FROM
            t_inshe_org_structures t1
        WHERE
                t1.is_deleted = 0
          and t1.id = ?
         
      `;

      const resultDepartments = await simpleQuery(departmentQuery, [
        detail.area,
      ]);
      await simpleQuery(updateHdInitiateQuery, [
        recomid,
        incidentno,
        resultDepartments[0].parent_id,
        detail.area,
        detail.value,
        resultDepartments[0].head_user_id,
        currentTime,
        ID,
      ]);
    }
  }

  console.log("Data updated successfully.");
  res.status(200).json({ message: "Data processed successfully." });
};
exports.getHdCloseData = async (req, res) => {
  const { ID: logged_user_id, ROLES } = req.user;
  const isAdmin = ROLES && ROLES.length > 0 && ROLES.includes(1);

  const { incident_no, date_from, date_to } = req.body;

  const strId = incident_no > 0 ? ` and t1.id=${id}` : "";

  const strFromDate =
    date_from !== "" ? ` and DATE(t1.created_at) >='${date_from}'` : "";
  const strToDate =
    date_to !== "" ? ` and DATE(t1.created_at) <='${date_to}'` : "";

  const imsQuery = `
  SELECT 
    LPAD(t1.id, 6, '0') AS disp_logno,
    LPAD(t1.incident_id, 6, '0') AS incident_no,
    t3.name department,
    t4.name area,
    t2.recommendation,
    t1.implemented_status as status,
    t1.closure_remarks,
    t1.close_date,
    t1.id,
    t1.close_evidance
  FROM
    t_inshe_hd_details t1
    join t_inshe_incident_recommendation t2 on t1.recom_id = t2.id
    join t_inshe_org_structures t3 on t1.department = t3.id
    join t_inshe_org_structures t4 on t1.area = t4.id
  WHERE
    1=1
    and t1.pending_on = ?
    and t1.hd_status = 'Applicable'
    ${strId}
    ${strFromDate}
    ${strToDate}
    order by t1.id desc
`;

  const resultIms = await simpleQuery(imsQuery, [logged_user_id]);

  res.status(200).json({
    historyLogHdData: [...resultIms],
  });
};
exports.submitCloseHd = async (req, res) => {
  const { ID } = req.user;
  const { id, implemented_status, evidance_file, close_remarks } =
    req.body.pdcData;

  const currentTime = new Date();

  const updateHeaderQuery = `
  UPDATE t_inshe_hd_details
  SET implemented_status = ?, 
      close_evidance = ?,
      closure_remarks = ?,
      close_date = ?,
      updated_at = ?, 
      updated_by = ? 
     
  WHERE id = ?
`;
  await simpleQuery(updateHeaderQuery, [
    implemented_status,
    evidance_file,
    close_remarks,
    currentTime,
    currentTime,
    ID,
    id,
  ]);

  res.status(200).json({ message: "Data processed successfully." });
};
