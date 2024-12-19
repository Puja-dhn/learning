const oracledb = require("oracledb");
const database = require("../../services/database.js");

exports.addNewAectData = async (req, res) => {
  const { ID: logged_user_id } = req.user;
  const {
    TEAM_ID,
    AREA_ID,
    OBS_DESC,
    CATEGORY,
    LOCATION,
    SEVERITY,
    REPORTED_BY,
    REPORTED_DATE,
    STATUS,
    ACTION_PLANNED,
    PDC_DATE,
    ACTION_TAKEN,
    ACTION_CLOSED_BY,
    ACTION_CLOSED_DATE,
  } = req.body;
  // console.log(req.body)

  // validation

  // insert update structure details

  let resultGetMaxId = await database
    .simpleQuery(`SELECT NVL(MAX(id),0) + 1 maxid FROM t_sdt_log_aect`, {})
    .catch((err) => {
      console.log(err);
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });
  if (!resultGetMaxId || resultGetMaxId.errorMessage || !resultGetMaxId.rows) {
    return res.status(400).json({
      errorMessage: "Fail to get max id",
      errorTransKey: "api_res_error_get_maxid",
    });
  }

  const maxAectLogId = resultGetMaxId.rows[0]["MAXID"];

  let resultInsertAectLog = await database
    .simpleQuery(
      `INSERT INTO 
        t_sdt_log_aect 
          (
            id,
            team_id,
            area_id,
            obs_desc,
            category,
            location,
            severity,
            reported_by,
            reported_date,
            status,
            action_planned,
            pdc_date,
            action_taken,
            action_closed_by,
            action_closed_date,
            crt_by,
            crt_ts,
            upd_by,
            upd_ts,
            logged_from
          )
          values
          (
            :curr_id,
            :curr_team_id,
            :curr_area_id,
            :curr_obs_desc,
            :curr_category,
            :curr_location,
            :curr_severity,
            :curr_reported_by,
            :curr_reported_date,
            :curr_status,
            :curr_action_planned,
            :curr_pdc_date,
            :curr_action_taken,
            :curr_action_closed_by,
            :curr_action_closed_date,
            :logged_user_id,
            SYSDATE,
            :logged_user_id,
            SYSDATE,
            'NEXSAFE'
          )`,
      {
        curr_id: {
          dir: oracledb.BIND_IN,
          val: maxAectLogId,
          type: oracledb.NUMBER,
        },
        curr_team_id: {
          dir: oracledb.BIND_IN,
          val: TEAM_ID,
          type: oracledb.NUMBER,
        },
        curr_area_id: {
          dir: oracledb.BIND_IN,
          val: AREA_ID,
          type: oracledb.NUMBER,
        },
        curr_obs_desc: {
          dir: oracledb.BIND_IN,
          val: OBS_DESC,
          type: oracledb.STRING,
        },
        curr_category: {
          dir: oracledb.BIND_IN,
          val: CATEGORY,
          type: oracledb.STRING,
        },
        curr_location: {
          dir: oracledb.BIND_IN,
          val: LOCATION,
          type: oracledb.STRING,
        },
        curr_severity: {
          dir: oracledb.BIND_IN,
          val: SEVERITY,
          type: oracledb.STRING,
        },
        curr_reported_by: {
          dir: oracledb.BIND_IN,
          val: Number(logged_user_id),
          type: oracledb.NUMBER,
        },
        curr_reported_date: {
          dir: oracledb.BIND_IN,
          val: new Date(REPORTED_DATE),
          type: oracledb.DATE,
        },
        curr_status: {
          dir: oracledb.BIND_IN,
          val: STATUS,
          type: oracledb.STRING,
        },
        curr_action_planned: {
          dir: oracledb.BIND_IN,
          val: ACTION_PLANNED,
          type: oracledb.STRING,
        },
        curr_pdc_date: {
          dir: oracledb.BIND_IN,
          val: PDC_DATE ? new Date(PDC_DATE) : null,
          type: oracledb.DATE,
        },
        curr_action_taken: {
          dir: oracledb.BIND_IN,
          val: ACTION_TAKEN,
          type: oracledb.STRING,
        },
        curr_action_closed_by: {
          dir: oracledb.BIND_IN,
          val: ACTION_CLOSED_BY ? ACTION_CLOSED_BY : null,
          type: oracledb.NUMBER,
        },
        curr_action_closed_date: {
          dir: oracledb.BIND_IN,
          val: STATUS === "Closed" ? new Date(REPORTED_DATE) : null,
          type: oracledb.DATE,
        },
        logged_user_id: {
          dir: oracledb.BIND_IN,
          val: Number(logged_user_id),
          type: oracledb.NUMBER,
        },
      }
    )
    .catch((err) => {
      console.log(err);
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultInsertAectLog || resultInsertAectLog.errorMessage) {
    return res.status(400).json({
      errorMessage: resultInsertAectLog.errorMessage,
      errorTransKey: resultInsertAectLog.errorTransKey,
    });
  }

  console.log("INSERTED AECT LOG ", resultInsertAectLog);

  return res.status(200).json("success");
};

exports.updateAectStatus = async (req, res) => {
  const { ID: logged_user_id, ROLES } = req.user;
  const isEditAllowed =
    ROLES &&
    ROLES.length > 0 &&
    (ROLES.includes(3) ||
      ROLES.includes(4) ||
      ROLES.includes(5) ||
      ROLES.includes(7));
  const { ID, PDC_DATE, STATUS, ACTION_PLANNED, ACTION_TAKEN } = req.body;

  if (!isEditAllowed) {
    return res.status(403).json({
      errorMessage: "You are not authorized to update Data",
      errorTransKey: "api_res_unathorized_update_data",
    });
  }

  // validation

  // insert update structure details

  let resultUpdatedAectLog = await database
    .simpleQuery(
      `UPDATE t_sdt_log_aect 
        SET
            status = :curr_status,
            action_planned = :curr_action_planned,
            pdc_date = :curr_pdc_date,
            action_taken = :curr_action_taken,
            ${STATUS === "Closed" ? "action_closed_by = :logged_user_id ," : ""}
            ${
              STATUS === "Closed" ? "action_closed_date =  SYSDATE ," : ""
            }            
            upd_by = :logged_user_id,
            upd_ts = SYSDATE
        WHERE
            id = : curr_id `,
      {
        curr_status: {
          dir: oracledb.BIND_IN,
          val: STATUS,
          type: oracledb.STRING,
        },
        curr_action_planned: {
          dir: oracledb.BIND_IN,
          val: ACTION_PLANNED,
          type: oracledb.STRING,
        },
        curr_pdc_date: {
          dir: oracledb.BIND_IN,
          val: PDC_DATE ? new Date(PDC_DATE) : null,
          type: oracledb.DATE,
        },
        curr_action_taken: {
          dir: oracledb.BIND_IN,
          val: ACTION_TAKEN,
          type: oracledb.STRING,
        },
        logged_user_id: {
          dir: oracledb.BIND_IN,
          val: logged_user_id,
          type: oracledb.NUMBER,
        },
        curr_id: {
          dir: oracledb.BIND_IN,
          val: ID,
          type: oracledb.NUMBER,
        },
      }
    )
    .catch((err) => {
      console.log(err);
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultUpdatedAectLog || resultUpdatedAectLog.errorMessage) {
    return res.status(400).json({
      errorMessage: resultUpdatedAectLog.errorMessage,
      errorTransKey: resultUpdatedAectLog.errorTransKey,
    });
  }

  console.log("UPDATED AECT LOG ", resultUpdatedAectLog);

  return res.status(200).json("success");
};

exports.getAectData = async (req, res) => {
  const { ID: logged_user_id, ROLES } = req.user;
  const isAdmin = ROLES && ROLES.length > 0 && ROLES.includes(2);
  const {
    ID,
    TEAM_ID,
    AREA_ID,
    DIVISION_ID,
    LOCATION_ID,
    OBS_DESC,
    CATEGORY,
    LOCATION,
    SEVERITY,
    REPORTED_BY,
    REPORTED_DATE_FROM,
    REPORTED_DATE_TO,
    STATUS,
    PDC_DATE_FROM,
    PDC_DATE_TO,
    ACTION_CLOSED_DATE_FROM,
    ACTION_CLOSED_DATE_TO,
  } = req.body;
  let resultTeamMemberCheck = await database
    .simpleQuery(
      `SELECT DISTINCT
          t1.id
      FROM
          t_sdt_team_member t1
      WHERE
              t1.member_id = :logged_user_id
          AND
              trunc(SYSDATE) BETWEEN trunc(t1.effect_from) AND trunc(effect_to)
      `,
      {
        logged_user_id: {
          dir: oracledb.BIND_IN,
          val: logged_user_id,
          type: oracledb.NUMBER,
        },
      }
    )
    .catch((err) => {
      console.log("member area", err);
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (
    !resultTeamMemberCheck ||
    resultTeamMemberCheck.errorMessage ||
    !resultTeamMemberCheck.rows
  ) {
    return res.status(400).json({
      errorMessage: "You are not mapped to any team",
      errorTransKey: "api_res_not_mapped_any_team",
    });
  }

  // filter condition

  const strID = ID > 0 ? " AND t1.id = " + ID + " " : "";
  const strTeamId =
    TEAM_ID > 0 && TEAM_ID !== -1 ? " AND t1.team_id = " + TEAM_ID + " " : "";
  const strAreaId =
    AREA_ID > 0 && AREA_ID !== -2 ? " AND t1.area_id = " + AREA_ID + " " : "";
  const strDivisionId =
    DIVISION_ID > 0 ? " AND t3.tol_mas_id = " + DIVISION_ID + " " : "";
  const strLocationId =
    LOCATION_ID > 0
      ? " AND (t2.locn_id = " + LOCATION_ID + " OR t2.locn_id is NULL) "
      : "";
  const strReportedFromDate = REPORTED_DATE_FROM
    ? " AND trunc(t1.reported_date) >= trunc(TO_DATE('" +
      REPORTED_DATE_FROM +
      "','yyyy-mm-dd') )"
    : " ";
  const strReportedToDate = REPORTED_DATE_TO
    ? " AND trunc(t1.reported_date) <= trunc(TO_DATE('" +
      REPORTED_DATE_TO +
      "','yyyy-mm-dd') )"
    : " ";

  const strObsDesc =
    OBS_DESC && OBS_DESC.length > 0
      ? " AND UPPER(t1.obs_desc) LIKE q'[%" + OBS_DESC.toUpperCase() + "%]' "
      : "";
  const strCategory =
    CATEGORY !== "All" ? " AND t1.category = '" + CATEGORY + "' " : "";
  const strLocation =
    LOCATION && LOCATION.length > 0
      ? " AND UPPER(t1.location) like q'[%" + LOCATION.toUpperCase() + "%]' "
      : "";
  const strSeverity =
    SEVERITY !== "All" ? " AND t1.severity = '" + SEVERITY + "' " : "";
  const strReportedBy = !isAdmin
    ? " AND t1.reported_by = " + logged_user_id + " "
    : "";

  const strStatus =
    STATUS !== "All" ? " AND t1.status = '" + STATUS + "' " : "";
  const strPDCFromDate = PDC_DATE_FROM
    ? " AND trunc(t1.pdc_date) >= trunc(TO_DATE('" +
      PDC_DATE_FROM +
      "','yyyy-mm-dd') )"
    : " ";
  const strPDCToDate = PDC_DATE_TO
    ? " AND trunc(t1.pdc_date) <= trunc(TO_DATE('" +
      PDC_DATE_TO +
      "','yyyy-mm-dd') )"
    : " ";
  const strActionFromDate = ACTION_CLOSED_DATE_FROM
    ? " AND trunc(t1.action_closed_date) >= trunc(TO_DATE('" +
      ACTION_CLOSED_DATE_FROM +
      "','yyyy-mm-dd') )"
    : " ";
  const strActionToDate = ACTION_CLOSED_DATE_TO
    ? " AND trunc(t1.action_closed_date) <= trunc(TO_DATE('" +
      ACTION_CLOSED_DATE_TO +
      "','yyyy-mm-dd') )"
    : " ";
  if (resultTeamMemberCheck.rows.length > 0) {
    let resultAectLogData = await database
      .simpleQuery(
        `SELECT
          t1.id,
          t1.area_id,
          TRIM(
              CASE
                  WHEN instr(t3.tol_level_name,'(') > 0 THEN substr(
                      t3.tol_level_name,
                      0,
                      instr(t3.tol_level_name,'(') - 1
                  )
                  ELSE t3.tol_level_name
              END
          ) area_name,
          t4.tol_level_id division_id,
          TRIM(
              CASE
                  WHEN instr(t4.tol_level_name,'(') > 0 THEN substr(
                      t4.tol_level_name,
                      0,
                      instr(t4.tol_level_name,'(') - 1
                  )
                  ELSE t4.tol_level_name
              END
          ) division_name,
          t2.id team_id,
          t2.name team_name,
          t1.obs_desc,
          t1.category,
          t1.location,
          t1.severity,
          t1.reported_by,
          initcap(t5.name)
          || ' ('
          || t5.emp_id
          || ')' reported_by_disp_name,
          TO_CHAR(t1.reported_date,'yyyy-mm-dd') reported_date,
          t1.status,
          t1.action_planned,
          TO_CHAR(t1.pdc_date,'yyyy-mm-dd') pdc_date,
          t1.action_taken,
          t1.action_closed_by,
              CASE
                  WHEN t6.name IS NOT NULL THEN initcap(t6.name)
                  || ' ('
                  || t6.id
                  || ')'
                  ELSE ''
              END
          action_closed_by_disp_name,
          TO_CHAR(t1.action_closed_date,'yyyy-mm-dd') action_closed_date
      FROM
          t_sdt_log_aect t1,
          t_sdt_team_master t2,
          t_sos_organisation_levels t3,
          t_sos_organisation_levels t4,
          t_frm_users t5,
          t_frm_users t6
      WHERE
              t1.status != 'Discarded'
          AND
              t1.team_id = t2.id (+)
          AND
              t1.area_id = to_number(t3.tol_level_id)
          AND
              t3.tol_mas_id = to_number(t4.tol_level_id)
          AND
              t1.reported_by = t5.id (+)
          AND
              t1.action_closed_by = t6.id (+)
          ${strID} 
          ${strTeamId} 
          ${strAreaId} 
          ${strDivisionId} 
          ${strLocationId} 
          ${strReportedFromDate} 
          ${strReportedToDate} 
          ${strObsDesc} 
          ${strCategory} 
          ${strLocation} 
          ${strSeverity} 
          ${strReportedBy} 
          ${strStatus} 
          ${strPDCFromDate} 
          ${strPDCToDate} 
          ${strActionFromDate} 
          ${strActionToDate} 
      ORDER BY 
          t1.id DESC`,
        {}
      )
      .catch((err) => {
        console.log("1", err);
        return {
          errorMessage: "Something went wrong",
          errorTransKey: "api_res_unknown_error",
        };
      });

    if (!resultAectLogData || resultAectLogData.errorMessage) {
      return res.status(400).json({
        errorMessage: "No data found",
        errorTransKey: "api_res_no_data_found",
      });
    }

    res.status(200).json({
      historyLogAectData: [...resultAectLogData.rows],
    });
  } else {
    let resultAectLogData = await database
      .simpleQuery(
        `SELECT
          t1.id,
          t1.area_id,
          TRIM(
              CASE
                  WHEN instr(t3.tol_level_name,'(') > 0 THEN substr(
                      t3.tol_level_name,
                      0,
                      instr(t3.tol_level_name,'(') - 1
                  )
                  ELSE t3.tol_level_name
              END
          ) area_name,
          t4.tol_level_id division_id,
          TRIM(
              CASE
                  WHEN instr(t4.tol_level_name,'(') > 0 THEN substr(
                      t4.tol_level_name,
                      0,
                      instr(t4.tol_level_name,'(') - 1
                  )
                  ELSE t4.tol_level_name
              END
          ) division_name,
          t1.obs_desc,
          t1.category,
          t1.location,
          t1.severity,
          t1.reported_by,
          initcap(t5.name)
          || ' ('
          || t5.emp_id
          || ')' reported_by_disp_name,
          TO_CHAR(t1.reported_date,'yyyy-mm-dd') reported_date,
          t1.status,
          t1.action_planned,
          TO_CHAR(t1.pdc_date,'yyyy-mm-dd') pdc_date,
          t1.action_taken,
          t1.action_closed_by,
              CASE
                  WHEN t6.name IS NOT NULL THEN initcap(t6.name)
                  || ' ('
                  || t6.id
                  || ')'
                  ELSE ''
              END
          action_closed_by_disp_name,
          TO_CHAR(t1.action_closed_date,'yyyy-mm-dd') action_closed_date
      FROM
          t_sdt_log_aect t1,
          t_sos_organisation_levels t3,
          t_sos_organisation_levels t4,
          t_frm_users t5,
          t_frm_users t6
      WHERE
              t1.status != 'Discarded'
          AND
              t1.area_id = to_number(t3.tol_level_id)
          AND
              t3.tol_mas_id = to_number(t4.tol_level_id)
          AND
              t1.reported_by = t5.id (+)
          AND
              t1.action_closed_by = t6.id (+)
          ${strID} 
          ${strAreaId} 
          ${strDivisionId} 
          ${strReportedFromDate} 
          ${strReportedToDate} 
          ${strObsDesc} 
          ${strCategory} 
          ${strLocation} 
          ${strSeverity} 
          ${strReportedBy} 
          ${strStatus} 
          ${strPDCFromDate} 
          ${strPDCToDate} 
          ${strActionFromDate} 
          ${strActionToDate} 
      ORDER BY 
          t1.id DESC`,
        {}
      )
      .catch((err) => {
        console.log("1", err);
        return {
          errorMessage: "Something went wrong",
          errorTransKey: "api_res_unknown_error",
        };
      });

    if (!resultAectLogData || resultAectLogData.errorMessage) {
      return res.status(400).json({
        errorMessage: "No data found",
        errorTransKey: "api_res_no_data_found",
      });
    }

    res.status(200).json({
      historyLogAectData: [...resultAectLogData.rows],
    });
  }
};

exports.getAECTDashboardData = async (req, res) => {
  const { ID: logged_user_id, ROLES } = req.user;
  const isAdmin = ROLES && ROLES.length > 0 && ROLES.includes(2);
  const { team_id, area_id, division_id, location_id } = req.body;

  let resultCurrDate = await database
    .simpleQuery(
      `SELECT
          CASE WHEN TO_NUMBER(TO_CHAR(SYSDATE,'hh24')) BETWEEN 0 AND 6 THEN TO_CHAR(sysdate-1, 'YYYY-MM-DD') ELSE TO_CHAR(sysdate, 'YYYY-MM-DD') END CURR_DATE_TIME ,
          CASE WHEN TO_NUMBER(TO_CHAR(SYSDATE,'hh24')) BETWEEN 0 AND 6 THEN TO_CHAR(sysdate-1, 'YYYY') ELSE TO_CHAR(sysdate, 'YYYY') END CURR_MONTH          
        FROM
          dual`,
      {}
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultCurrDate || resultCurrDate.errorMessage || !resultCurrDate.rows) {
    return res.status(400).json({
      errorMessage: "No data found",
      errorTransKey: "api_res_no_data_found",
    });
  }

  const currDate = resultCurrDate.rows[0].CURR_DATE_TIME;
  const currStrMonth = resultCurrDate.rows[0].CURR_MONTH;
  const arrDay = currDate.split("-");
  const currYear = +arrDay[0];
  const currMonth = +arrDay[1];
  const currFYear = currMonth < 4 ? currYear - 1 : currYear;

  let resultTeamMemberCheck = await database
    .simpleQuery(
      `SELECT DISTINCT
    t1.id
FROM
    t_sdt_team_member t1
WHERE
        t1.member_id = :logged_user_id
    AND
        trunc(SYSDATE) BETWEEN trunc(t1.effect_from) AND trunc(effect_to)
    `,
      {
        logged_user_id: {
          dir: oracledb.BIND_IN,
          val: logged_user_id,
          type: oracledb.NUMBER,
        },
      }
    )
    .catch((err) => {
      console.log("member area", err);
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (
    !resultTeamMemberCheck ||
    resultTeamMemberCheck.errorMessage ||
    !resultTeamMemberCheck.rows
  ) {
    return res.status(400).json({
      errorMessage: "No data found",
      errorTransKey: "api_res_no_data_foundr",
    });
  }
  // filter condition
  const strTeamId =
    team_id > 0 && team_id !== -2 && team_id !== -1
      ? " AND (t1.team_id = " + team_id + " OR t2.team_id is NULL) "
      : "";
  const strAreaId =
    area_id > 0 && area_id !== -2 ? " AND t1.area_id = " + area_id + " " : "";
  const strDivisionId =
    division_id > 0 && division_id !== -2
      ? " AND t3.tol_mas_id = " + division_id + " "
      : "";
  const stryear = `to_date('01-04-${currStrMonth}') AND to_date('31-03-${
    +currStrMonth + 1
  }')`;
  const strLocationId = location_id
    ? " AND ( t2.locn_id = " + location_id + " OR t2.locn_id is NULL) "
    : "";
  const strReportedBy = !isAdmin
    ? " AND t1.reported_by = " + logged_user_id + " "
    : "";

  let resultAectLogData = await database
    .simpleQuery(
      `SELECT
          COUNT(t1.id) totalaect,
          SUM(
              CASE
                  WHEN t1.category = 'UA' THEN 1
                  ELSE 0
              END
          ) totalua,
          SUM(
              CASE
                  WHEN t1.category = 'UC' THEN 1
                  ELSE 0
              END
          ) totaluc,
          SUM(
              CASE
                  WHEN t1.status = 'Open' THEN 1
                  ELSE 0
              END
          ) totalopen,
          SUM(
              CASE
                  WHEN t1.status = 'Closed' THEN 1
                  ELSE 0
              END
          ) totalclosed
      FROM
          t_sdt_log_aect t1,
          t_sdt_team_master t2,
          t_sos_organisation_levels t3
      WHERE
          t1.team_id = t2.id(+)
          AND
          t1.severity = 'Minor'
           AND
            t1.area_id = t3.tol_level_id         
            AND (
              (
                      TO_CHAR(t1.reported_date,'yyyy') = '${currFYear}'
                  AND
                      to_number(TO_CHAR(t1.reported_date,'mm') ) >= 4
              ) OR (
                      TO_CHAR(t1.reported_date,'yyyy') = '${currFYear + 1}'
                  AND
                      to_number(TO_CHAR(t1.reported_date,'mm') ) <= 3
              )
          ) 
          ${strTeamId}
          ${strAreaId}
          ${strDivisionId}
          ${strLocationId}
          ${strReportedBy}
          `,
      {}
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultAectLogData || resultAectLogData.errorMessage) {
    return res.status(400).json({
      errorMessage: "No data found",
      errorTransKey: "api_res_no_data_found",
    });
  }

  let resultNMCLogData = await database
    .simpleQuery(
      `SELECT
          COUNT(t1.id) totalnmc,
          SUM(
              CASE
                  WHEN t1.severity = 'Minor' THEN 1
                  ELSE 0
              END
          ) totalminor,
          SUM(
            CASE
                WHEN t1.severity = 'Serious' THEN 1
                ELSE 0
            END
        ) totalserious,
          SUM(
              CASE
                  WHEN t1.log_shift = 'SH1' THEN 1
                  ELSE 0
              END
          ) totalNMCAShift,
          SUM(
              CASE
                  WHEN t1.log_shift = 'SH2' THEN 1
                  ELSE 0
              END
          ) totalNMCBShift,
          SUM(
              CASE
                  WHEN t1.log_shift = 'SH3' THEN 1
                  ELSE 0
              END
          ) totalNMCCShift,
          SUM(
              CASE
                  WHEN t1.log_shift = 'SH41' THEN 1
                  ELSE 0
              END
          ) totalNMCGShift
      FROM
          t_sdt_log_nearmiss t1,
          t_sdt_team_master t2,
          t_sos_organisation_levels t3
      WHERE
        t1.team_id = t2.id(+)
        AND
            t1.area_id = t3.tol_level_id          
          
          AND (
            (
                    TO_CHAR(t1.log_date,'yyyy') = '${currFYear}'
                AND
                    to_number(TO_CHAR(t1.log_date,'mm') ) >= 4
            ) OR (
                    TO_CHAR(t1.log_date,'yyyy') = '${currFYear + 1}'
                AND
                    to_number(TO_CHAR(t1.log_date,'mm') ) <= 3
            )
        ) 
          ${strTeamId}
          ${strAreaId}
          ${strDivisionId}
          ${strLocationId}
          ${strReportedBy}
          `,
      {}
    )
    .catch((err) => {
      console.log("1", err);
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultNMCLogData || resultNMCLogData.errorMessage) {
    return res.status(400).json({
      errorMessage: "No data found",
      errorTransKey: "api_res_no_data_found",
    });
  }

  let resultAECTLogTrendData = await database
    .simpleQuery(
      `SELECT
            a.monthname name,
            nvl(b.totalaect,0) data1,
            0 data2,
            0 data3
        FROM
            (
                SELECT
                    TO_CHAR(tsm_from_date,'Mon-yy') monthname,
                    tsm_from_date monthfromdate,
                    tsm_to_date monthtodate
                FROM
                    t_sos_months
                WHERE
                        tsm_month_format = 'MF1'
                    AND (
                        (
                                tsm_year_no = ${currFYear}
                            AND
                                tsm_month_no >= 4
                        ) OR (
                                tsm_year_no = ${currFYear + 1} 
                            AND
                                tsm_month_no <= 3
                        )
                    )
                ORDER BY tsm_from_date ASC
            ) a,
            (
                SELECT
                    TO_CHAR(t1.reported_date,'Mon-yy') monthname,
                    COUNT(t1.id) totalaect                    
                FROM
                    t_sdt_log_aect t1,
                    t_sdt_team_master t2,
                    t_sos_organisation_levels t3
                WHERE
                t1.team_id = t2.id(+)
                AND
                t1.severity = 'Minor'
                ${strReportedBy}
                AND
                      t1.area_id = t3.tol_level_id
                    AND (
                          (
                                  TO_CHAR(t1.reported_date,'yyyy') = '${currFYear}'
                              AND
                                  to_number(TO_CHAR(t1.reported_date,'mm') ) >= 4
                          ) OR (
                                  TO_CHAR(t1.reported_date,'yyyy') = '${
                                    currFYear + 1
                                  }'
                              AND
                                  to_number(TO_CHAR(t1.reported_date,'mm') ) <= 3
                          )
                      ) 
                    ${strTeamId}
                    ${strAreaId}
                    ${strDivisionId}
                    ${strLocationId}
                GROUP BY
                    TO_CHAR(t1.reported_date,'Mon-yy')
            ) b
        WHERE
            a.monthname = b.monthname (+)         
          `,
      {}
    )
    .catch((err) => {
      console.log("1", err);
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultAECTLogTrendData || resultAECTLogTrendData.errorMessage) {
    return res.status(400).json({
      errorMessage: "No data found",
      errorTransKey: "api_res_no_data_found",
    });
  }

  let resultNMCLogTrendData = await database
    .simpleQuery(
      `SELECT
            a.monthname name,
            nvl(b.totalminor,0) data1,
            nvl(b.totalserious,0) data2
        FROM
            (
                SELECT
                    TO_CHAR(tsm_from_date,'Mon-yy') monthname,
                    tsm_from_date monthfromdate,
                    tsm_to_date monthtodate
                FROM
                    t_sos_months
                WHERE
                        tsm_month_format = 'MF1'
                    AND (
                        (
                                tsm_year_no = ${currFYear}
                            AND
                                tsm_month_no >= 4
                        ) OR (
                                tsm_year_no = ${currFYear + 1} 
                            AND
                                tsm_month_no <= 3
                        )
                    )
                ORDER BY tsm_from_date ASC
            ) a,
            (
                SELECT
                    TO_CHAR(t1.log_date,'Mon-yy') monthname,
                    SUM(
                        CASE
                            WHEN t1.severity = 'Minor' THEN 1
                            ELSE 0
                        END
                    ) totalminor,
                    SUM(
                      CASE
                          WHEN t1.severity = 'Serious' THEN 1
                          ELSE 0
                      END
                  ) totalserious
                               
                FROM
                    t_sdt_log_nearmiss t1,
                    t_sdt_team_master t2,
                    t_sos_organisation_levels t3
                WHERE
                t1.team_id = t2.id(+)
                ${strReportedBy}
                AND
                      t1.area_id = t3.tol_level_id
                    AND (
                          (
                                  TO_CHAR(t1.log_date,'yyyy') = '${currFYear}'
                              AND
                                  to_number(TO_CHAR(t1.log_date,'mm') ) >= 4
                          ) OR (
                                  TO_CHAR(t1.log_date,'yyyy') = '${
                                    currFYear + 1
                                  }'
                              AND
                                  to_number(TO_CHAR(t1.log_date,'mm') ) <= 3
                          )
                      ) 
                    ${strTeamId}
                    ${strAreaId}
                    ${strDivisionId}
                    ${strLocationId}
                GROUP BY
                    TO_CHAR(t1.log_date,'Mon-yy')
            ) b
        WHERE
            a.monthname = b.monthname (+)         
          `,
      {}
    )
    .catch((err) => {
      console.log("1", err);
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultNMCLogTrendData || resultNMCLogTrendData.errorMessage) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  res.status(200).json({
    currMonth: +currStrMonth + 1,
    currFYear: currFYear,
    totalAECT: resultAectLogData.rows[0].TOTALAECT,
    totalUA: resultAectLogData.rows[0].TOTALUA,
    totalUC: resultAectLogData.rows[0].TOTALUC,
    totalOpen: resultAectLogData.rows[0].TOTALOPEN,
    totalClosed: resultAectLogData.rows[0].TOTALCLOSED,
    totalNMC: resultNMCLogData.rows[0].TOTALNMC,
    totalMinor: resultNMCLogData.rows[0].TOTALMINOR,
    totalSerious:
      resultNMCLogData.rows[0].TOTALSERIOUS > 0
        ? resultNMCLogData.rows[0].TOTALSERIOUS
        : 0,
    totalHipo: resultNMCLogData.rows[0].TOTALHIPO,
    totalNMCAShift: resultNMCLogData.rows[0].TOTALNMCASHIFT,
    totalNMCBShift: resultNMCLogData.rows[0].TOTALNMCBSHIFT,
    totalNMCCShift: resultNMCLogData.rows[0].TOTALNMCCSHIFT,
    totalNMCGShift: resultNMCLogData.rows[0].TOTALNMCGSHIFT,
    monthWiseAECT: [...resultAECTLogTrendData.rows],
    monthWiseNMC: [...resultNMCLogTrendData.rows],
  });
};

exports.getAECTPendingClosureData = async (req, res) => {
  const { ID: logged_user_id } = req.user;
  const { team_id, area_id, division_id, location_id } = req.body;

  const strTeamId = team_id ? " AND t1.team_id = " + team_id + " " : "";
  const strAreaId = area_id ? " AND t1.area_id = " + area_id + " " : "";
  const strDivisionId = division_id
    ? " AND t3.tol_mas_id = " + division_id + " "
    : "";
  const strLocationId = location_id
    ? " AND t2.locn_id = " + location_id + " "
    : "";

  let resultAectLogData = await database
    .simpleQuery(
      `SELECT
          t1.id,
          t1.team_id,
          t2.name team_name,
          t1.area_id,
          TRIM(
              CASE
                  WHEN instr(t3.tol_level_name,'(') > 0 THEN substr(
                      t3.tol_level_name,
                      0,
                      instr(t3.tol_level_name,'(') - 1
                  )
                  ELSE t3.tol_level_name
              END
          ) area_name,
          t4.tol_level_id division_id,
          TRIM(
              CASE
                  WHEN instr(t4.tol_level_name,'(') > 0 THEN substr(
                      t4.tol_level_name,
                      0,
                      instr(t4.tol_level_name,'(') - 1
                  )
                  ELSE t4.tol_level_name
              END
          ) division_name,
          t1.obs_desc,
          t1.category,
          t1.location,
          t1.severity,
          t1.reported_by,
          initcap(t5.name)
          || ' ('
          || t5.emp_id
          || ')' reported_by_disp_name,
          TO_CHAR(t1.reported_date,'yyyy-mm-dd') reported_date,
          t1.status,
          t1.action_planned,
          TO_CHAR(t1.pdc_date,'yyyy-mm-dd') pdc_date,
          t1.action_taken,
          t1.action_closed_by,
              CASE
                  WHEN t6.name IS NOT NULL THEN initcap(t6.name)
                  || ' ('
                  || t6.emp_id
                  || ')'
                  ELSE ''
              END
          action_closed_by_disp_name,
          TO_CHAR(t1.action_closed_date,'yyyy-mm-dd') action_closed_date,
          t7.id area_incharge_id
      FROM
          t_sdt_log_aect t1,
          t_sdt_team_master t2,
          t_sos_organisation_levels t3,
          t_sos_organisation_levels t4,
          t_frm_users t5,
          t_frm_users t6,
          t_frm_users t7
      WHERE
              t1.status = 'Open'
          AND
              t1.team_id = t2.id
          AND
              t1.area_id = to_number(t3.tol_level_id)
          AND
              t3.tol_mas_id = to_number(t4.tol_level_id)
          AND
              t1.reported_by = t5.id
          AND
              t1.action_closed_by = t6.id (+)
          AND
              t3.tol_has_head = t7.emp_id
          ${strTeamId} 
          ${strAreaId} 
          ${strDivisionId} 
          ${strLocationId} 
      ORDER BY 
          t1.id DESC`,
      {}
    )
    .catch((err) => {
      console.log("1", err);
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultAectLogData || resultAectLogData.errorMessage) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  res.status(200).json({
    pendingLogAectData: [...resultAectLogData.rows],
  });
};
