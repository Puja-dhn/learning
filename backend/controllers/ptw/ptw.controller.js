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
          t1.department_name name,
          t1.head_name
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
exports.getPtwData = async (req, res) => {
  const { ID: logged_user_id, ROLES } = req.user;
  const isAdmin = ROLES && ROLES.length > 0 && ROLES.includes(1);
  const {
    id,
    department,
    area,
    category,
    severity,
    obs_date_from,
    obs_date_to,
    status,
  } = req.body;

  const strId = id > 0 ? ` and t1.id=${id}` : "";
  const strDepartment =
    department !== "All" ? ` and t1.department=${department}` : "";
  const strArea = area !== "All" ? ` and t1.area=${area}` : "";
  const strCategory = category !== "All" ? ` and t1.category=${category}` : "";
  const strSeverity =
    severity !== "All" ? ` and t1.severity='${severity}'` : "";
  const strStatus = status !== "All" ? ` and t1.status='${status}'` : "";
  const strFromDate =
    obs_date_from !== ""
      ? ` and DATE(t1.obs_datetime) >='${obs_date_from}'`
      : "";
  const strToDate =
    obs_date_to !== "" ? ` and DATE(t1.obs_datetime) <='${obs_date_to}'` : "";

  const sioQuery = `
    SELECT 
      t1.id,
      t1.department department_id,
      t2.department_name department,
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
      t1.created_at,
      t1.created_by,
      t1.updated_at,
      t1.updated_by,
      t7.name log_by,
      LPAD(t1.id, 6, '0') AS disp_logno
    FROM
      t_inshe_log_ptw t1
      join t_inshe_departments t2 on t1.department = t2.id
      join t_inshe_areas t3 on t1.area = t3.id
      left join t_inshe_users t5 on t1.pending_on = t5.id
      join t_inshe_users t7 on t1.created_by = t7.id
    WHERE
      1=1
     
  `;

  const resultPtw = await simpleQuery(sioQuery, []);

  res.status(200).json({
    historyLogPtwData: [...resultPtw],
  });
};
exports.getOpenPtwData = async (req, res) => {
  const { ID: logged_user_id, ROLES } = req.user;
  const isAdmin = ROLES && ROLES.length > 0 && ROLES.includes(1);
  const {
    id,
    department,
    area,
    category,
    severity,
    obs_date_from,
    obs_date_to,
    status,
  } = req.body;

  const strId = id > 0 ? ` and t1.id=${id}` : "";
  const strDepartment =
    department !== "All" ? ` and t1.department=${department}` : "";
  const strArea = area !== "All" ? ` and t1.area=${area}` : "";
  const strCategory = category !== "All" ? ` and t1.category=${category}` : "";
  const strSeverity =
    severity !== "All" ? ` and t1.severity='${severity}'` : "";
  const strStatus = status !== "All" ? ` and t1.status='${status}'` : "";
  const strFromDate =
    obs_date_from !== ""
      ? ` and DATE(t1.obs_datetime) >='${obs_date_from}'`
      : "";
  const strToDate =
    obs_date_to !== "" ? ` and DATE(t1.obs_datetime) <='${obs_date_to}'` : "";

  const sioQuery = `
      SELECT 
        t1.id,
        t1.department department_id,
        t2.department_name department,
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
        t1.created_at,
        t1.created_by,
        t1.updated_at,
        t1.updated_by,
        t7.name log_by,
        LPAD(t1.id, 6, '0') AS disp_logno
      FROM
        t_inshe_log_ptw t1
        join t_inshe_departments t2 on t1.department = t2.id
        join t_inshe_areas t3 on t1.area = t3.id
        left join t_inshe_users t5 on t1.pending_on = t5.id
        join t_inshe_users t7 on t1.created_by = t7.id
      WHERE
        1=1
       and t1.pending_on = ? 
    `;

  const resultPtw = await simpleQuery(sioQuery, [logged_user_id]);

  res.status(200).json({
    historyLogPtwData: [...resultPtw],
  });
};
exports.submitPTWApprovalData = async (req, res) => {
  const { ID } = req.user;
  const { id, comments } = req.body.pdcData;

  try {
    const currentTime = new Date();

    const updateQuery = `
        update t_inshe_log_ptw set custodian_comments = ?,  updated_at = ?, updated_by = ?, status = "Closed", pending_on = 0 where id=?
      `;
    const updateValues = [, comments, currentTime, ID, id];

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
