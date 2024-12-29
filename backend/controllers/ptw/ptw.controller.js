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
          t1.name,
          t2.name head_name
      FROM
          t_inshe_org_structures t1
          left join t_inshe_users t2 on t1.head_user_id = t2.id
      WHERE
              t1.is_deleted = 0
        and t1.category = "DEPT"
       
    `;

    const resultDepartments = await simpleQuery(departmentQuery, []);

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
exports.getPtwData = async (req, res) => {
  const { ID: logged_user_id, ROLES } = req.user;
  const isAdmin = ROLES && ROLES.length > 0 && ROLES.includes(1);
  const { id, department, area, date_from, date_to, status } = req.body;

  const strId = id > 0 ? ` and t1.id=${id}` : "";
  const strDepartment =
    department !== "All" ? ` and t1.department=${department}` : "";
  const strArea = area !== "All" ? ` and t1.area=${area}` : "";
  const strStatus = status !== "All" ? ` and t1.status='${status}'` : "";
  const strFromDate =
    date_from !== "" ? ` and DATE(t1.created_at) >='${date_from}'` : "";
  const strToDate =
    date_to !== "" ? ` and DATE(t1.created_at) <='${date_to}'` : "";

  const sioQuery = `
    SELECT 
      t1.id,
      t1.department department_id,
      t2.name department,
      t1.area area_id,
      t3.name area,
      t1.work_location,
      t1.datetime_from,
      t1.datetime_to,
      t1.nearest_firealarm,
      t1.job_description,
      t1.moc_required,
      t1.moc_title,
      t1.moc_no,
      t1.supervisor_name,
      t1.pending_on pending_on_id,
      t5.name pending_on,
      t1.status,
      t1.contractor,
      t1.esic_no,
      t1.associated_permit,
      t1.hazard_identification,
      t1.other_hazards,
      t1.risk_assessment,
      t1.ppe_required,
      t1.ei_panel_name,
      t1.ei_loto_no,
      t1.ei_checked_by,
      t1.ei_date_time,
      t1.si_panel_name,
      t1.si_loto_no,
      t1.si_checked_by,
      t1.si_date_time,
      t1.general_work_dtls,
      t1.annexture_v,
      t1.work_height_checklist,
      t1.work_height_supervision,
      t1.confined_space_checklist,
      t1.confined_space_supervision,
      t1.confined_space_atmospheric,
      t1.confined_space_oxygen_level,
      t1.confined_space_lel,
      t1.confined_space_toxic,
      t1.confined_space_detector,
      t1.lifting_work_checklist,
      t1.esms_checklist,
      t1.hot_work_checklist,
      t1.equipment_checklist,
      t1.created_at,
      t1.created_by,
      t1.updated_at,
      t1.updated_by,
      t7.name log_by,
      LPAD(t1.id, 6, '0') AS disp_logno,
      t1.equipment
    FROM
      t_inshe_log_ptw t1
      join t_inshe_org_structures t2 on t1.department = t2.id
      join t_inshe_org_structures t3 on t1.area = t3.id
      left join t_inshe_users t5 on t1.pending_on = t5.id
      join t_inshe_users t7 on t1.created_by = t7.id
    WHERE
      1=1
      ${strId}
      ${strDepartment}
      ${strArea}
      ${strStatus}
      ${strFromDate}
      ${strToDate}
      order by t1.id desc
  `;

  const resultPtw = await simpleQuery(sioQuery, []);

  res.status(200).json({
    historyLogPtwData: [...resultPtw],
  });
};
exports.getOpenPtwData = async (req, res) => {
  const { ID: logged_user_id, ROLES } = req.user;
  const { id, department, category, area, date_from, date_to, status } =
    req.body;
  const isAdmin = ROLES && ROLES.length > 0 && ROLES.includes(1);

  const sioQuery = `
      SELECT 
        t1.id,
        t1.department department_id,
        t2.name department,
        t1.area area_id,
        t3.name area,
        t1.work_location,
        t1.datetime_from,
        t1.datetime_to,
        t1.nearest_firealarm,
        t1.job_description,
        t1.moc_required,
        t1.moc_title,
        t1.moc_no,
        t1.supervisor_name,
        t1.pending_on pending_on_id,
        t5.name pending_on,
        t1.status,
        t1.contractor,
        t1.esic_no,
        t1.associated_permit,
        t1.hazard_identification,
        t1.other_hazards,
        t1.risk_assessment,
        t1.ppe_required,
        t1.ei_panel_name,
        t1.ei_loto_no,
        t1.ei_checked_by,
        t1.ei_date_time,
        t1.si_panel_name,
        t1.si_loto_no,
        t1.si_checked_by,
        t1.si_date_time,
        t1.general_work_dtls,
        t1.annexture_v,
        t1.work_height_checklist,
        t1.work_height_supervision,
        t1.confined_space_checklist,
        t1.confined_space_supervision,
        t1.confined_space_atmospheric,
        t1.confined_space_oxygen_level,
        t1.confined_space_lel,
        t1.confined_space_toxic,
        t1.confined_space_detector,
        t1.lifting_work_checklist,
        t1.esms_checklist,
        t1.hot_work_checklist,
        t1.equipment_checklist,
        t1.created_at,
        t1.created_by,
        t1.updated_at,
        t1.updated_by,
        t7.name log_by,
        LPAD(t1.id, 6, '0') AS disp_logno
      FROM
        t_inshe_log_ptw t1
        join t_inshe_org_structures t2 on t1.department = t2.id
        join t_inshe_org_structures t3 on t1.area = t3.id
        left join t_inshe_users t5 on t1.pending_on = t5.id
        join t_inshe_users t7 on t1.created_by = t7.id
      WHERE
        1=1
        and t1.status = ?
       and t1.pending_on = ? 
       order by t1.id desc
    `;

  const resultPtw = await simpleQuery(sioQuery, [status, logged_user_id]);

  res.status(200).json({
    historyLogPtwData: [...resultPtw],
  });
};
exports.submitPTWApprovalData = async (req, res) => {
  const { ID } = req.user;
  const { id, issuer_id, comments } = req.body.pdcData;
  const initiatorQuery = `
  SELECT
    t1.created_by
  FROM
    t_inshe_log_ptw t1
  WHERE
    t1.id = ?
`;
  const resultRows = await simpleQuery(initiatorQuery, [id]);
  if (!resultRows.length) {
    return res.status(404).json({ message: "Permit not found." });
  }

  const initiator = resultRows[0].created_by;
  try {
    const currentTime = new Date();

    const updateQuery = `
        update t_inshe_log_ptw set custodian_comments = ?,  updated_at = ?, updated_by = ?, status = "Custodian Approved", issuer = ?, pending_on = ? where id=?
      `;
    const updateValues = [comments, currentTime, ID, issuer_id, initiator, id];

    try {
      await simpleQuery(updateQuery, updateValues);
      console.log("Custodian Approved Successfully.");
    } catch (queryError) {
      console.error("Error executing query:", queryError);
      return res.status(500).json({ error: "Failed to insert data." });
    }

    res.status(200).json({ message: "Data processed successfully." });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "An error occurred while processing data." });
  }
};
exports.addNewPTWData = async (req, res) => {
  const { ID, DEPARTMENT } = req.user;
  const {
    department,
    area,
    work_location,
    datetime_from,
    datetime_to,
    nearest_firealarm,
    job_description,
    moc_required,
    moc_title,
    moc_no,
    why_moc_remarks,
    equipment,
    supervisor_name,
    contractor,
    esic_no,
    associated_permit,
    hazard_identification,
    other_hazards,
    risk_assessment,
    ppe_required,
    ei_panel_name,
    ei_loto_no,
    ei_checked_by,
    ei_date_time,
    si_panel_name,
    si_loto_no,
    si_checked_by,
    si_date_time,
    general_work_dtls,
    annexture_v,
    work_height_checklist,
    work_height_supervision,
    confined_space_checklist,
    confined_space_supervision,
    confined_space_atmospheric,
    confined_space_oxygen_level,
    confined_space_lel,
    confined_space_toxic,
    confined_space_detector,
    lifting_work_checklist,
    esms_checklist,
    hot_work_checklist,
    equipment_checklist,
    pending_on,
    status,
  } = req.body;

  try {
    const currentTime = new Date();

    // Fetch Department Head
    const departmentQuery = `
      SELECT DISTINCT
        t1.id,
        t1.name,
        t1.head_user_id as head_id
      FROM
        t_inshe_org_structures t1
      WHERE
        t1.is_deleted = 0 AND t1.id = ?
    `;
    const resultDepartments = await simpleQuery(departmentQuery, [DEPARTMENT]);
    if (!resultDepartments.length) {
      return res.status(400).json({ message: "Department not found." });
    }

    const departmentHead = resultDepartments[0].head_id;
    const query = `
      INSERT INTO t_inshe_log_ptw (
        department, area, work_location, datetime_from, datetime_to, 
        nearest_firealarm, job_description, moc_required, moc_title, moc_no, 
        why_moc_remarks, equipment, supervisor_name, contractor, esic_no, 
        associated_permit, hazard_identification, other_hazards, risk_assessment, 
        ppe_required, ei_panel_name, ei_loto_no, ei_checked_by, ei_date_time, 
        si_panel_name, si_loto_no, si_checked_by, si_date_time, general_work_dtls, 
        annexture_v, work_height_checklist, work_height_supervision, confined_space_checklist, 
        confined_space_supervision, confined_space_atmospheric, confined_space_oxygen_level, 
        confined_space_lel, confined_space_toxic, confined_space_detector, 
        lifting_work_checklist, esms_checklist, hot_work_checklist, equipment_checklist, pending_on, status,
        created_at,created_by,updated_at,updated_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      DEPARTMENT,
      area,
      work_location,
      datetime_from,
      datetime_to,
      nearest_firealarm,
      job_description,
      moc_required,
      moc_title,
      moc_no,
      why_moc_remarks,
      equipment,
      supervisor_name,
      contractor,
      esic_no,
      associated_permit,
      hazard_identification,
      other_hazards,
      risk_assessment,
      ppe_required,
      ei_panel_name,
      ei_loto_no,
      ei_checked_by,
      ei_date_time,
      si_panel_name,
      si_loto_no,
      si_checked_by,
      si_date_time,
      general_work_dtls,
      annexture_v,
      work_height_checklist,
      work_height_supervision,
      confined_space_checklist,
      confined_space_supervision,
      confined_space_atmospheric,
      confined_space_oxygen_level,
      confined_space_lel,
      confined_space_toxic,
      confined_space_detector,
      lifting_work_checklist,
      esms_checklist,
      hot_work_checklist,
      equipment_checklist,
      departmentHead,
      "Open",
      currentTime,
      ID,
      currentTime,
      ID,
    ];

    // Execute the query
    await simpleQuery(query, values);

    res.status(200).json({ message: "Data added successfully." });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "An error occurred while processing data." });
  }
};
exports.closePtw = async (req, res) => {
  const { ID } = req.user;
  const { id, closure_remarks } = req.body.pdcData;
  try {
    const currentTime = new Date();

    const updateQuery = `
        update t_inshe_log_ptw set close_remarks = ?,  updated_at = ?, updated_by = ?, status = "Closed", pending_on = 0 where id=?
      `;
    const updateValues = [closure_remarks, currentTime, ID, id];

    try {
      await simpleQuery(updateQuery, updateValues);
      console.log("Permit Closed Successfully.");
    } catch (queryError) {
      console.error("Error executing query:", queryError);
      return res.status(500).json({ error: "Failed to insert data." });
    }

    res.status(200).json({ message: "Data processed successfully." });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "An error occurred while processing data." });
  }
};
exports.getViolationMasterData = async (req, res) => {
  const { ID: logged_user_id, ROLES } = req.user;

  const sioQuery = `
    SELECT 
      t1.id,
      t1.job_description,
      t2.contractor_name
    FROM
      t_inshe_log_ptw t1
      join t_inshe_contractors t2 on t1.contractor = t2.id
    WHERE
      1=1
      order by t1.id desc
  `;

  const resultPtw = await simpleQuery(sioQuery, []);

  res.status(200).json({
    historyViolationMasterData: [...resultPtw],
  });
};
exports.addNewViolationData = async (req, res) => {
  const { ID, DEPARTMENT } = req.user;
  const { permit_no, contractor_name, job_description, violation_dtls } =
    req.body;

  try {
    const currentTime = new Date();

    // Fetch Department Head
    const initiatorQuery = `
      SELECT 
        t1.created_by
      FROM
        t_inshe_log_ptw t1
      WHERE
       t1.id = ?
    `;
    const resultInitiator = await simpleQuery(initiatorQuery, [permit_no]);
    if (!resultInitiator.length) {
      return res.status(400).json({ message: "Department not found." });
    }

    const initiator = resultInitiator[0].created_by;
    const query = `
      INSERT INTO t_inshe_log_violations (
        permit_no, violation_details, pending_on, status, created_at, created_by,updated_at, updated_by
      ) VALUES (?, ?, ?, "Open", ?, ?, ?, ?)
    `;

    const values = [
      permit_no,
      violation_dtls,
      initiator,
      currentTime,
      ID,
      currentTime,
      ID,
    ];

    // Execute the query
    await simpleQuery(query, values);

    res.status(200).json({ message: "Data added successfully." });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "An error occurred while processing data." });
  }
};
exports.getViolationData = async (req, res) => {
  const { ID: logged_user_id, ROLES } = req.user;
  const sioQuery = `
    SELECT 
      t1.id,
      LPAD(t1.id, 6, '0') AS disp_logno,
      LPAD(t1.permit_no, 6, '0') AS permit_no,
      t1.created_at violation_date,
      t3.contractor_name,
      t1.violation_details,
      t4.name pending_on,
      t1.status
    FROM
      t_inshe_log_violations t1
      join t_inshe_log_ptw t2 on t1.permit_no = t2.id
      join t_inshe_contractors t3 on t2.contractor = t3.id
      left join t_inshe_users t4 on t1.pending_on = t4.id
    WHERE
      1=1
      and t1.created_by = ?
      order by t1.id desc
  `;

  const resultPtw = await simpleQuery(sioQuery, [logged_user_id]);

  res.status(200).json({
    historyViolationData: [...resultPtw],
  });
};
exports.getOpenViolationData = async (req, res) => {
  const { ID: logged_user_id, ROLES } = req.user;
  const sioQuery = `
    SELECT 
      t1.id,
      LPAD(t1.id, 6, '0') AS disp_logno,
      LPAD(t1.permit_no, 6, '0') AS permit_no,
      t1.created_at violation_date,
      t3.contractor_name,
      t1.violation_details,
      t4.name pending_on,
      t1.status
    FROM
      t_inshe_log_violations t1
      join t_inshe_log_ptw t2 on t1.permit_no = t2.id
      join t_inshe_contractors t3 on t2.contractor = t3.id
      join t_inshe_users t4 on t1.pending_on = t4.id
    WHERE
      1=1
      and t1.pending_on = ?
      and t1.status = "Open"
      order by t1.id desc
  `;

  const resultPtw = await simpleQuery(sioQuery, [logged_user_id]);

  res.status(200).json({
    historyViolationData: [...resultPtw],
  });
};
exports.closeViolations = async (req, res) => {
  const { ID } = req.user;
  const { id, closure_remarks } = req.body.pdcData;
  try {
    const currentTime = new Date();

    const updateQuery = `
        update t_inshe_log_violations set close_remarks = ?,  updated_at = ?, updated_by = ?, status = "Closed", pending_on = 0 where id=?
      `;
    const updateValues = [closure_remarks, currentTime, ID, id];

    try {
      await simpleQuery(updateQuery, updateValues);
      console.log("Violation Closed Successfully.");
    } catch (queryError) {
      console.error("Error executing query:", queryError);
      return res.status(500).json({ error: "Failed to insert data." });
    }

    res.status(200).json({ message: "Data processed successfully." });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "An error occurred while processing data." });
  }
};
