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

    const usersQuery = `
    SELECT DISTINCT
        t1.id,
        t1.name
    FROM
        t_sis_users t1
    WHERE
      t1.status = 'active'
     
  `;

    const resultUsers = await simpleQuery(usersQuery, []);

    const masterDetails = {
      DEPARTMENT: [...resultDepartments],
      CATEGORY: [...resultCategories],
      AREA: [...resultAreas],
      USERS: [...resultUsers],
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
  const { ID } = req.user;
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

  try {
    const currentTime = new Date();

    // Fetch Department Head
    const departmentQuery = `
      SELECT DISTINCT
        t1.id,
        t1.department_name name,
        t1.head_id
      FROM
        t_sis_departments t1
      WHERE
        t1.status = 'Active' AND t1.id = ?
    `;
    const resultDepartments = await simpleQuery(departmentQuery, [DEPARTMENT]);
    if (!resultDepartments.length) {
      return res.status(404).json({ message: "Department not found." });
    }

    const departmentHead = resultDepartments[0].id;

    if (STATUS === "Closed") {
      const insertQuery = `
        INSERT INTO t_sis_log_sio (
          obs_date_time,
          department,
          area,
          category,
          severity,
          status,
          obs_desc,
          obs_sugg,
          obs_photos,
          close_desc,
          close_photos,
          pending_on,
          created_at,
          created_by,
          updated_at,
          updated_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const insertValues = [
        OBS_DATE_TIME,
        DEPARTMENT,
        AREA,
        CATEGORY,
        SEVERITY,
        STATUS,
        OBS_DESC,
        OBS_SUGG,
        OBS_PHOTOS || "test",
        CLOSE_DESC,
        CLOSE_PHOTOS || "test",
        departmentHead,
        currentTime,
        ID,
        currentTime,
        ID,
      ];

      try {
        await simpleQuery(insertQuery, insertValues);
        console.log("Data inserted successfully.");
      } catch (queryError) {
        console.error("Error executing query:", queryError);
        return res.status(500).json({ error: "Failed to insert data." });
      }
    } else {
      const insertQuery = `
        INSERT INTO t_sis_log_sio (
          obs_datetime,
          department,
          area,
          category,
          severity,
          status,
          obs_desc,
          obs_sugg,
          obs_photos,
          pending_on,
          created_at,
          created_by,
          updated_at,
          updated_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const insertValues = [
        OBS_DATE_TIME,
        DEPARTMENT,
        AREA,
        CATEGORY,
        SEVERITY,
        STATUS,
        OBS_DESC,
        OBS_SUGG,
        OBS_PHOTOS || "test",
        departmentHead,
        currentTime,
        ID,
        currentTime,
        ID,
      ];

      console.log("Insert Query:", insertQuery);
      console.log("Insert Values:", insertValues);

      try {
        await simpleQuery(insertQuery, insertValues);
        console.log("Data inserted successfully.");
      } catch (queryError) {
        console.error("Error executing query:", queryError);
        return res.status(500).json({ error: "Failed to insert data." });
      }
    }

    res.status(200).json({ message: "Data processed successfully." });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "An error occurred while processing data." });
  }
};
exports.getSioData = async (req, res) => {
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
    t1.obs_datetime,
    t2.department_name department,
    t3.name area,
    t4.name category,
    t1.severity,
    t1.obs_desc,
    t1.obs_sugg,
    t1.obs_photos,
    t1.closure_desc,
    t1.closure_photos,
    t5.name pending_on,
    t6.name responsibilities,
    t1.target_date,
    t1.action_plan,
    t1.status,
    t1.created_at,
    t1.created_by,
    t1.updated_at,
    t1.updated_by,
    t7.name log_by,
    t1.closure_date,
    LPAD(t1.id, 6, '0') AS disp_logno
  FROM
    t_sis_log_sio t1
    join t_sis_departments t2 on t1.department = t2.id
    join t_sis_areas t3 on t1.area = t3.id
    join t_sis_categories t4 on t1.category = t4.id
    left join t_sis_users t5 on t1.pending_on = t5.id
    left join t_sis_users t6 on t1.responsibilities = t6.id
    join t_sis_users t7 on t1.created_by = t7.id
  WHERE
    1=1
    ${strId}
    ${strDepartment}
    ${strArea}
    ${strCategory}
    ${strSeverity}
    ${strStatus}
    ${strFromDate}
    ${strToDate}
`;

  const resultSio = await simpleQuery(sioQuery, []);

  res.status(200).json({
    historyLogSioData: [...resultSio],
  });
};
exports.getOpenSioData = async (req, res) => {
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
      t1.obs_datetime,
      t1.department department_id,
      t2.department_name department,
      t1.area area_id,
      t3.name area,
      t1.category category_id,
      t4.name category,
      t1.severity,
      t1.obs_desc,
      t1.obs_sugg,
      t1.obs_photos,
      t1.closure_desc,
      t1.closure_photos,
      t1.pending_on pending_on_id,
      t5.name pending_on,
      t6.name responsibilities,
      t1.target_date,
      t1.action_plan,
      t1.status,
      t1.created_at,
      t1.created_by,
      t1.updated_at,
      t1.updated_by,
      t7.name log_by,
      t1.closure_date,
      LPAD(t1.id, 6, '0') AS disp_logno
    FROM
      t_sis_log_sio t1
      join t_sis_departments t2 on t1.department = t2.id
      join t_sis_areas t3 on t1.area = t3.id
      join t_sis_categories t4 on t1.category = t4.id
      join t_sis_users t5 on t1.pending_on = t5.id
      left join t_sis_users t6 on t1.responsibilities = t6.id
       join t_sis_users t7 on t1.created_by = t7.id
    WHERE
      t1.status = "Open"
      ${strId}
      ${strDepartment}
      ${strArea}
      ${strCategory}
      ${strSeverity}
      ${strStatus}
      ${strFromDate}
      ${strToDate}
      and t1.pending_on = ?
  `;

  const resultSio = await simpleQuery(sioQuery, [logged_user_id]);

  res.status(200).json({
    historyLogSioData: [...resultSio],
  });
};
exports.submitPDCAssign = async (req, res) => {
  const { ID } = req.user;
  const {
    id,
    obs_datetime,
    department,
    area,
    category,
    severity,
    obs_desc,
    obs_sugg,
    obs_photos,
    closure_desc,
    closure_photos,
    responsibilities,
    status,
    target_date,
    action_plan,
  } = req.body.pdcData;

  console.log(req.body);

  try {
    const currentTime = new Date();

    const updateQuery = `
        update t_sis_log_sio set pending_on = ?, action_plan = ?, target_date= ?, updated_at = ?, updated_by = ?, status = "PDC Assigned", responsibilities = ?  where id=?
      `;
    const updateValues = [
      responsibilities,
      action_plan,
      target_date,
      currentTime,
      ID,
      responsibilities,
      id,
    ];

    try {
      await simpleQuery(updateQuery, updateValues);
      console.log("PDC Assigned successfully.");
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
exports.getAssignedSioData = async (req, res) => {
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
    SELECT DISTINCT
      t1.id,
      t1.obs_datetime,
      t1.department department_id,
      t2.department_name department,
      t1.area area_id,
      t3.name area,
      t1.category category_id,
      t4.name category,
      t1.severity,
      t1.obs_desc,
      t1.obs_sugg,
      t1.obs_photos,
      t1.closure_desc,
      t1.closure_photos,
      t1.pending_on pending_on_id,
      t5.name pending_on,
      t6.name responsibilities,
      t1.target_date,
      t1.action_plan,
      t1.status,
      t1.created_at,
      t1.created_by,
      t1.updated_at,
      t1.updated_by,
      t7.name log_by,
      t1.closure_date,
      LPAD(t1.id, 6, '0') AS disp_logno
    FROM
      t_sis_log_sio t1
      join t_sis_departments t2 on t1.department = t2.id
      join t_sis_areas t3 on t1.area = t3.id
      join t_sis_categories t4 on t1.category = t4.id
      join t_sis_users t5 on t1.pending_on = t5.id
      left join t_sis_users t6 on t1.responsibilities = t6.id
       join t_sis_users t7 on t1.created_by = t7.id
    WHERE
      t1.status = "PDC Assigned"
      ${strId}
      ${strDepartment}
      ${strArea}
      ${strCategory}
      ${strSeverity}
      ${strStatus}
      ${strFromDate}
      ${strToDate}
      and t1.pending_on = ?
  `;
  const resultSio = await simpleQuery(sioQuery, [logged_user_id]);

  res.status(200).json({
    historyLogSioData: [...resultSio],
  });
};
exports.submitActionTaken = async (req, res) => {
  const { ID } = req.user;
  const {
    id,
    obs_datetime,
    department,
    area,
    category,
    severity,
    obs_desc,
    obs_sugg,
    obs_photos,
    closure_desc,
    closure_photos,
    pending_on,
    status,
    target_date,
    action_plan,
  } = req.body.pdcData;

  try {
    const currentTime = new Date();

    const updateQuery = `
        update t_sis_log_sio set pending_on = 0, closure_desc = ?, closure_photos= ?, updated_at = ?, updated_by = ?, status = "Closed", closure_date = ?  where id=?
      `;
    const updateValues = [
      closure_desc,
      closure_photos,
      currentTime,
      ID,
      currentTime,
      id,
    ];

    try {
      await simpleQuery(updateQuery, updateValues);
      console.log("SIO Closed Successfully.");
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
