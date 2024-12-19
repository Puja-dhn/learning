const oracledb = require("oracledb");
const database = require("../services/database.js");
const dbConfigs = require("../configs/database_mssql.js");

// reusable functions

exports.getLineOrgData = async (req, res) => {
  const { ID } = req.user;
  let LINE_ORGDATA_LIST = [
    ...dbConfigs.map((config) => ({
      locn_id: config.locn_id,
      area_id: config.area_id,
      area_name: config.area_name,
      div_id: config.div_id,
      div_name: config.div_name,
    })),
  ];

  let resultLocations = await database
    .simpleQuery(
      `SELECT
          t1.id,
          t1.name,
          t1.status,
          t1.sht_name,
          t1.org_id,
          t1.unit_id,
          t1.locn_id
      FROM
          t_sdt_locations t1,
          t_frm_user_location t2
      WHERE
              t1.id = t2.loc_id
          AND
              t1.status = 'Active'
          AND
              t2.user_id = :logged_user_id
      ORDER BY t1.name ASC`,
      {
        logged_user_id: {
          dir: oracledb.BIND_IN,
          val: ID,
          type: oracledb.NUMBER,
        },
      }
    )
    .catch((err) => {
      console.log("locations ", err);
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (
    !resultLocations ||
    resultLocations.errorMessage ||
    !resultLocations.rows
  ) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  for (let i = 0; i < LINE_ORGDATA_LIST.length; i++) {
    const currLocn = resultLocations.rows.filter(
      (locn) => locn.ID === LINE_ORGDATA_LIST[i].locn_id
    );

    if (currLocn.length > 0) {
      LINE_ORGDATA_LIST[i].locn_name = currLocn[0].NAME;
    }
  }

  LINE_ORGDATA_LIST = LINE_ORGDATA_LIST.filter((item) =>
    resultLocations.rows.some((locnValue) => locnValue.ID === item.locn_id)
  );

  let resultMemberAreas = await database
    .simpleQuery(
      `SELECT DISTINCT
          t4.area_id
      FROM
          t_sdt_team_member t1,          
          t_sdt_team_master t4,
          t_frm_user_location t5
      WHERE
              t4.id = t1.team_id
          AND
              t5.loc_id = t4.locn_id
          AND
              t5.user_id = t1.member_id 
          AND
              t5.user_id = :logged_user_id
          AND
              trunc(SYSDATE) BETWEEN trunc(t1.effect_from) AND trunc(effect_to)
      `,
      {
        logged_user_id: {
          dir: oracledb.BIND_IN,
          val: ID,
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
    !resultMemberAreas ||
    resultMemberAreas.errorMessage ||
    !resultMemberAreas.rows
  ) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  let resultHeadFics = await database
    .simpleQuery(
      `SELECT DISTINCT
          t1.tfy_fac_id fic_id
      FROM
          t_stp_factory t1,
          t_frm_users t2
      WHERE
              t1.tfy_head =  t2.emp_id
          AND
              t2.id = :logged_user_id          
          AND
              t1.tfy_act_flg = 'Active' 
      `,
      {
        logged_user_id: {
          dir: oracledb.BIND_IN,
          val: ID,
          type: oracledb.NUMBER,
        },
      }
    )
    .catch((err) => {
      console.log("divisions", err);
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultHeadFics || resultHeadFics.errorMessage || !resultHeadFics.rows) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  let resultHeadAreas = await database
    .simpleQuery(
      `SELECT DISTINCT
          t1.tol_level_id area_id
      FROM
          t_sos_organisation_levels t1,
          t_frm_users t2
      WHERE
              t1.tol_has_head =  t2.emp_id
          AND
              t2.id = :logged_user_id
          AND 
              t1.tol_level =  3
          AND
              t1.tol_act_flg = 'Active' 
      `,
      {
        logged_user_id: {
          dir: oracledb.BIND_IN,
          val: ID,
          type: oracledb.NUMBER,
        },
      }
    )
    .catch((err) => {
      console.log("areas", err);
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (
    !resultHeadAreas ||
    resultHeadAreas.errorMessage ||
    !resultHeadAreas.rows
  ) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  res.status(200).json({
    lineOrgData: [...LINE_ORGDATA_LIST],
    memberAreas: [...resultMemberAreas.rows.map((item) => +item.AREA_ID)],
    headFics: [...resultHeadFics.rows.map((item) => +item.FIC_ID)],
    headAreas: [...resultHeadAreas.rows.map((item) => +item.AREA_ID)],
  });
};

exports.orgdata = async (req, res) => {
  const { ID } = req.user;
  let resultTeamCheck = await database
    .simpleQuery(
      `SELECT
            t1.team_id
        FROM
        t_sdt_team_member t1
        join t_sdt_team_master t2 on t1.team_id = t2.id
        WHERE
            t2.status = 'Active'
            AND
            t1.member_id =:logged_user_id
            AND SYSDATE BETWEEN t1.effect_from AND t1.effect_to`,
      {
        logged_user_id: {
          dir: oracledb.BIND_IN,
          val: ID,
          type: oracledb.NUMBER,
        },
      }
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (
    !resultTeamCheck ||
    resultTeamCheck.errorMessage ||
    !resultTeamCheck.rows
  ) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  let resultLocations = await database
    .simpleQuery(
      `SELECT
          t1.id,
          t1.name,
          t1.status,
          t1.sht_name,
          t1.org_id,
          t1.unit_id,
          t1.locn_id
      FROM
          t_sdt_locations t1,
          t_frm_user_location t2
      WHERE
              t1.id = t2.loc_id
          AND
              t1.status = 'Active'
          AND
              t2.user_id = :logged_user_id
      ORDER BY t1.name ASC`,
      {
        logged_user_id: {
          dir: oracledb.BIND_IN,
          val: ID,
          type: oracledb.NUMBER,
        },
      }
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (
    !resultLocations ||
    resultLocations.errorMessage ||
    !resultLocations.rows
  ) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  let resultDivisions = await database
    .simpleQuery(
      `SELECT
      TO_NUMBER(t1.tol_level_id) id,
          TRIM(
              CASE
                  WHEN instr(t1.tol_level_name,'(') > 0 THEN substr(
                      t1.tol_level_name,
                      0,
                      instr(t1.tol_level_name,'(') - 1
                  )
                  ELSE t1.tol_level_name
              END
          ) name,
          TO_NUMBER(t1.tol_mas_id) mas_id,
          t1.tol_act_flg status,
          t1.tol_level org_level,
          t1.tol_has_head head_ticket_no,
          initcap(t2.name) head_name,
          t2.id head_id,
          TO_NUMBER(t1.tol_org_id) sos_org_id,
          TO_NUMBER(t1.tol_unit_id) sos_unit_id,
          TO_NUMBER(t1.tol_locn_id) sos_locn_id,
          t3.id locn_id
      FROM
          t_sos_organisation_levels t1,
          t_frm_users t2,
          t_sdt_locations t3,
          t_frm_user_location t4
      WHERE
              t1.tol_has_head = t2.emp_id
          AND
              t1.tol_act_flg = 'Active'
          AND
              t1.tol_level = 2
          AND
              t1.tol_org_id NOT IN (
                  '152','9156'
              )
          AND
              t3.org_id = t1.tol_org_id
          AND
              t3.unit_id = t1.tol_unit_id
          AND
              t3.locn_id = t1.tol_locn_id
          AND
              t3.status = 'Active'
          AND
              t4.loc_id = t3.id
          AND
              t4.user_id = :logged_user_id
      ORDER BY
          t1.tol_org_id,
          t1.tol_unit_id,
          t1.tol_locn_id,
          t3.locn_id,
          TRIM(
              CASE
                  WHEN instr(t1.tol_level_name,'(') > 0 THEN substr(
                      t1.tol_level_name,
                      0,
                      instr(t1.tol_level_name,'(') - 1
                  )
                  ELSE t1.tol_level_name
              END
          ) ASC`,
      {
        logged_user_id: {
          dir: oracledb.BIND_IN,
          val: ID,
          type: oracledb.NUMBER,
        },
      }
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (
    !resultDivisions ||
    resultDivisions.errorMessage ||
    !resultDivisions.rows
  ) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  let resultAreas = await database
    .simpleQuery(
      `SELECT
          TO_NUMBER(t1.tol_level_id) id,
          t1.tol_level_name name,
          TO_NUMBER(t1.tol_mas_id) mas_id,
          t1.tol_act_flg status,
          t1.tol_level org_level,
          t1.tol_has_head head_ticket_no,
          initcap(t2.name) head_name,
          t2.id head_id,
          TO_NUMBER(t1.tol_org_id) sos_org_id,
          TO_NUMBER(t1.tol_unit_id) sos_unit_id,
          TO_NUMBER(t1.tol_locn_id) sos_locn_id,
          t3.id locn_id
      FROM
          t_sos_organisation_levels t1,
          t_frm_users t2,
          t_sdt_locations t3,
          t_frm_user_location t4
      WHERE
              t1.tol_has_head = t2.emp_id
          AND
              t1.tol_act_flg = 'Active'
          AND
              t1.tol_level = 3
          AND
              t1.tol_org_id NOT IN (
                  '152','9156'
              )
          AND
              t3.org_id = t1.tol_org_id
          AND
              t3.unit_id = t1.tol_unit_id
          AND
              t3.locn_id = t1.tol_locn_id
          AND
              t3.status = 'Active'
          AND
              t4.loc_id = t3.id
          AND
              t4.user_id = :logged_user_id
      ORDER BY
          t1.tol_org_id,
          t1.tol_unit_id,
          t1.tol_locn_id,
          t3.locn_id,
          t1.tol_level_name ASC`,
      {
        logged_user_id: {
          dir: oracledb.BIND_IN,
          val: ID,
          type: oracledb.NUMBER,
        },
      }
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultAreas || resultAreas.errorMessage || !resultAreas.rows) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }
  let resultSDTTeams = await database
    .simpleQuery(
      `SELECT
      t1.id,
      t1.name,
      TO_NUMBER(t1.area_id) area_id,
      t3.tol_level_name area_name,
      NVL(t4.tol_level_id,'') div_id,
      TRIM(
          CASE
              WHEN instr(t4.tol_level_name,'(') > 0 THEN substr(
                  t4.tol_level_name,
                  0,
                  instr(t4.tol_level_name,'(') - 1
              )
              ELSE t4.tol_level_name
          END
      ) div_name,
      t1.locn_id,
      t1.status,
      t1.maturity_level
  FROM
      t_sdt_team_master t1,
      t_frm_user_location t2,
      t_sos_organisation_levels t3,
      t_sos_organisation_levels t4,
      t_sdt_team_member t5
  WHERE
          t1.status = 'Active'
      AND
          t1.locn_id = t2.loc_id
      AND
          t1.area_id = t3.tol_level_id(+)
      AND
          t3.tol_mas_id = t4.tol_level_id(+)
     
          AND
          t5.member_id =:logged_user_id
      AND
          t1.id = t5.team_id
      AND
          t2.user_id = t5.member_id
      AND
          SYSDATE BETWEEN t5.effect_from AND t5.effect_to
  ORDER BY          
      t1.name ASC`,
      {
        logged_user_id: {
          dir: oracledb.BIND_IN,
          val: ID,
          type: oracledb.NUMBER,
        },
      }
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultSDTTeams || resultSDTTeams.errorMessage || !resultSDTTeams.rows) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }
  let resultSDTTeamMembers = await database
    .simpleQuery(
      `SELECT
          t1.id,
          t1.team_id,
          t1.role_type role_type_id,
          t3.sap_status,
          TRIM(replace(replace(replace(
              t2.tsr_role_name,
              'Point Leader',
              ''              
          ),'–','' ),'-','')) role_type_name,
          t1.emp_type,
          t1.member_id,
          INITCAP(t3.name) member_name,
          t3.emp_id member_ticket_no,
          TO_NUMBER(t4.area_id) area_id,
          t4.locn_id,
          nvl(t3.profile_pic_url,'profile_photo_default.png') photo_path,
          to_number(t2.tsr_role_id) team_slno
      FROM
          t_sdt_team_member t1,
          t_sdt_roles t2,
          t_frm_users t3,
          t_sdt_team_master t4,
          t_frm_user_location t5
      WHERE
              t1.role_type = t2.tsr_role_id
          AND
              t3.id = t1.member_id
          AND
              t4.id = t1.team_id
          AND
              t5.loc_id = t4.locn_id
          AND
              t5.user_id = :logged_user_id
          AND
              trunc(SYSDATE) BETWEEN trunc(t1.effect_from) AND trunc(effect_to)
      ORDER BY                 
          to_number(t2.tsr_role_id),
          t3.name ASC`,
      {
        logged_user_id: {
          dir: oracledb.BIND_IN,
          val: ID,
          type: oracledb.NUMBER,
        },
      }
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (
    !resultSDTTeamMembers ||
    resultSDTTeamMembers.errorMessage ||
    !resultSDTTeamMembers.rows
  ) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  let resultRoleType = await database
    .simpleQuery(
      `SELECT
            to_number(tsr_role_id) id,
            tsr_role_name name
        FROM
            t_sdt_roles
        WHERE
            tsr_status = 'Active'
        ORDER BY to_number(tsr_role_id) ASC`,
      {}
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultRoleType || resultRoleType.errorMessage || !resultRoleType.rows) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  res.status(200).json({
    locations: [...resultLocations.rows],
    divisions: [...resultDivisions.rows],
    areas: [...resultAreas.rows],
    sdtTeams: [...resultSDTTeams.rows],
    sdtTeamMembers: [...resultSDTTeamMembers.rows],
    roleTypes: [
      ...resultRoleType.rows.map((role) => ({ id: role.ID, name: role.NAME })),
    ],
  });
};

exports.getDBDate = async (req, res) => {
  let resultCurrDate = await database
    .simpleQuery(
      `SELECT
          CASE WHEN TO_NUMBER(TO_CHAR(SYSDATE,'hh24')) BETWEEN 0 AND 6 THEN TO_CHAR(sysdate-1, 'YYYY-MM-DD') ELSE TO_CHAR(sysdate, 'YYYY-MM-DD') END CURR_DATE_TIME          
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
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  const currDate = resultCurrDate.rows[0].CURR_DATE_TIME;

  res.status(200).json({
    currDate,
  });
};

exports.getFicOrgData = async (req, res) => {
  const { ID } = req.user;

  let resultLocations = await database
    .simpleQuery(
      `SELECT
          t1.id,
          t1.name,
          t1.status,
          t1.sht_name,
          t1.org_id,
          t1.unit_id,
          t1.locn_id
      FROM
          t_sdt_locations t1,
          t_frm_user_location t2
      WHERE
              t1.id = t2.loc_id
          AND
              t1.status = 'Active'
          AND
              t2.user_id = :logged_user_id
      ORDER BY t1.name ASC`,
      {
        logged_user_id: {
          dir: oracledb.BIND_IN,
          val: ID,
          type: oracledb.NUMBER,
        },
      }
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (
    !resultLocations ||
    resultLocations.errorMessage ||
    !resultLocations.rows
  ) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  let resultFics = await database
    .simpleQuery(
      `SELECT
            TO_NUMBER(t1.tfy_fac_id) id,
            t1.tfy_fac_name name,
            0 mas_id,
            t1.tfy_act_flg status,
            0 org_level,
            t1.tfy_head head_ticket_no,
            initcap(t2.name) head_name,
            t2.id head_id,
            TO_NUMBER(t1.tfy_org_id) sos_org_id,
            TO_NUMBER(t1.tfy_unit_id) sos_unit_id,
            TO_NUMBER(t1.tfy_locn_id) sos_locn_id,
            t3.id locn_id
        FROM
            t_stp_factory t1,
            t_frm_users t2,
            t_sdt_locations t3,
            t_frm_user_location t4
        WHERE
                t1.tfy_head = t2.emp_id
            AND
                t1.tfy_act_flg = 'Active'        
            AND
                t1.tfy_org_id NOT IN (
                    '152','9156'
                )
            AND
                t3.org_id = t1.tfy_org_id
            AND
                t3.unit_id = t1.tfy_unit_id
            AND
                t3.locn_id = t1.tfy_locn_id
            AND
                t3.status = 'Active'
            AND
                t4.loc_id = t3.id
            AND
                t4.user_id = :logged_user_id
        ORDER BY
            t1.tfy_org_id,
            t1.tfy_unit_id,
            t1.tfy_locn_id,
            t3.locn_id,
            t1.tfy_fac_name ASC `,
      {
        logged_user_id: {
          dir: oracledb.BIND_IN,
          val: ID,
          type: oracledb.NUMBER,
        },
      }
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultFics || resultFics.errorMessage || !resultFics.rows) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  let resultAreas = await database
    .simpleQuery(
      `SELECT
            TO_NUMBER(t6.tol_level_id) id,
            t6.tol_level_name name,
            t6.tol_mas_id mas_id,
            t6.tol_act_flg status,
            t1.tfy_fac_id org_level,
            t1.tfy_head head_ticket_no,
            initcap(t2.name) head_name,
            t2.id head_id,
            TO_NUMBER(t1.tfy_org_id) sos_org_id,
            TO_NUMBER(t1.tfy_unit_id) sos_unit_id,
            TO_NUMBER(t1.tfy_locn_id) sos_locn_id,
            t3.id locn_id
        FROM
            t_stp_factory t1,
            t_frm_users t2,
            t_sdt_locations t3,
            t_frm_user_location t4,
            t_sos_ficdiv_map t5,
            t_sos_organisation_levels t6
        WHERE
                t1.tfy_head = t2.emp_id
            AND
                t1.tfy_act_flg = 'Active'        
            AND
                t1.tfy_org_id NOT IN (
                    '152','9156'
                )
            AND
                t3.org_id = t1.tfy_org_id
            AND
                t3.unit_id = t1.tfy_unit_id
            AND
                t3.locn_id = t1.tfy_locn_id
            AND
                t3.status = 'Active'
            AND
                t4.loc_id = t3.id
            AND
                t4.user_id = :logged_user_id
            AND
                t5.tfm_fic_id = t1.tfy_fac_id 
            AND
                t5.tfm_act_flg = 'Active'
            AND
                t6.tol_mas_id = t5.tfm_div_id 
            AND
                t6.tol_act_flg = 'Active'
        ORDER BY
            t1.tfy_org_id,
            t1.tfy_unit_id,
            t1.tfy_locn_id,
            t3.locn_id,
            t6.tol_level_name ASC `,
      {
        logged_user_id: {
          dir: oracledb.BIND_IN,
          val: ID,
          type: oracledb.NUMBER,
        },
      }
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultAreas || resultAreas.errorMessage || !resultAreas.rows) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  let resultMemberAreas = await database
    .simpleQuery(
      `SELECT DISTINCT
          t4.area_id
      FROM
          t_sdt_team_member t1,          
          t_sdt_team_master t4,
          t_frm_user_location t5
      WHERE
              t4.id = t1.team_id
          AND
              t5.loc_id = t4.locn_id
          AND
              t5.user_id = t1.member_id 
          AND
              t5.user_id = :logged_user_id
          AND
              trunc(SYSDATE) BETWEEN trunc(t1.effect_from) AND trunc(effect_to)
      `,
      {
        logged_user_id: {
          dir: oracledb.BIND_IN,
          val: ID,
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
    !resultMemberAreas ||
    resultMemberAreas.errorMessage ||
    !resultMemberAreas.rows
  ) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  let resultHeadFics = await database
    .simpleQuery(
      `SELECT DISTINCT
          t1.tfy_fac_id fic_id
      FROM
          t_stp_factory t1,
          t_frm_users t2
      WHERE
              t1.tfy_head =  t2.emp_id
          AND
              t2.id = :logged_user_id          
          AND
              t1.tfy_act_flg = 'Active' 
      `,
      {
        logged_user_id: {
          dir: oracledb.BIND_IN,
          val: ID,
          type: oracledb.NUMBER,
        },
      }
    )
    .catch((err) => {
      console.log("divisions", err);
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultHeadFics || resultHeadFics.errorMessage || !resultHeadFics.rows) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  let resultHeadDivisions = await database
    .simpleQuery(
      `SELECT DISTINCT
          t1.tol_level_id division_id
      FROM
          t_sos_organisation_levels t1,
          t_frm_users t2
      WHERE
              t1.tol_has_head =  t2.emp_id
          AND
              t2.id = :logged_user_id
          AND 
              t1.tol_level =  2
          AND
              t1.tol_act_flg = 'Active' 
      `,
      {
        logged_user_id: {
          dir: oracledb.BIND_IN,
          val: ID,
          type: oracledb.NUMBER,
        },
      }
    )
    .catch((err) => {
      console.log("areas", err);
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (
    !resultHeadDivisions ||
    resultHeadDivisions.errorMessage ||
    !resultHeadDivisions.rows
  ) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  let resultHeadAreas = await database
    .simpleQuery(
      `SELECT DISTINCT
          t1.tol_level_id area_id
      FROM
          t_sos_organisation_levels t1,
          t_frm_users t2
      WHERE
              t1.tol_has_head =  t2.emp_id
          AND
              t2.id = :logged_user_id
          AND 
              t1.tol_level =  3
          AND
              t1.tol_act_flg = 'Active' 
      `,
      {
        logged_user_id: {
          dir: oracledb.BIND_IN,
          val: ID,
          type: oracledb.NUMBER,
        },
      }
    )
    .catch((err) => {
      console.log("areas", err);
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (
    !resultHeadAreas ||
    resultHeadAreas.errorMessage ||
    !resultHeadAreas.rows
  ) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  res.status(200).json({
    locations: [...resultLocations.rows],
    fics: [...resultFics.rows],
    areas: [...resultAreas.rows],
    memberAreas: [...resultMemberAreas.rows.map((item) => +item.AREA_ID)],
    headFics: [...resultHeadFics.rows.map((item) => +item.FIC_ID)],
    headDivisions: [
      ...resultHeadDivisions.rows.map((item) => +item.DIVISION_ID),
    ],
    headAreas: [...resultHeadAreas.rows.map((item) => +item.AREA_ID)],
  });
};
