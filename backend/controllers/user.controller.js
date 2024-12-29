const mysql2 = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
const { sendMail } = require("../services/mail.js");
const logger = require("../utils/logger.js");
const bcrypt = require("bcrypt");
const { decryptData } = require("../utils/crypto.js");
const nodemailer = require("nodemailer");

const axios = require("axios");
const http = require("http");
const https = require("https");

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
exports.getUserDBList = async (req, res) => {
  try {
    const roleQuery = `
        SELECT
          id,
          name
        FROM
          t_inshe_roles
        WHERE
          status = 1
        ORDER BY
          name ASC
      `;

    const resultRoles = await simpleQuery(roleQuery, []);

    const roles = resultRoles || [];

    const roleList = roles.map((item) => ({
      id: item.id,
      name: item.name,
    }));

    // Assuming mappingList should match roleList
    const mappingList = roleList;

    res.status(200).json({
      roleList,
      mappingList,
    });
  } catch (error) {
    console.error("Error fetching user DB list:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
exports.getUserDetailsList = async (req, res) => {
  const { filterTicketNo, filterList } = req.body;
  const {
    id,
    name,
    email,
    show_roles,
    in_role,
    in_role_list,
    in_mapping,
    in_mapping_list,
    is_filter_query,
  } = filterList;

  let result = [];
  let resultSDT = [];

  let strSql = "";
  let strSqlSDT = "";

  let strSqlRolesCol = `  COALESCE(
        (
        SELECT
            GROUP_CONCAT(
                CONCAT(t3.name, ' (', t3.id, ')')
            ORDER BY
                t3.name,
                t3.id SEPARATOR ', '
            )
        FROM
            t_inshe_roles t3
        INNER JOIN t_inshe_user_role t4 ON
            t3.id = t4.role_id
        WHERE
            t4.user_id = t1.id
    ),
    ''
    ) AS roles `;

  if (show_roles || in_role_list.length > 0) {
    strSqlRolesCol = ` COALESCE(
        (
        SELECT
            GROUP_CONCAT(
                CONCAT(t3.name, ' (', t3.id, ')')
            ORDER BY
                t3.name,
                t3.id SEPARATOR ', '
            )
        FROM
            t_inshe_roles t3
        INNER JOIN t_inshe_user_role t4 ON
            t3.id = t4.role_id
        WHERE
            t4.user_id = t1.id
    ),
    ''
    ) AS roles `;
  }

  const isTicketNotNumber = isNaN(filterTicketNo);
  const strSqlForID = !isTicketNotNumber
    ? ` t1.id = ${filterTicketNo} OR `
    : ``;

  if (filterTicketNo > 0 && is_filter_query !== 1) {
    strSql = `SELECT
                  t1.id,
                  t1.name,
                  t1.email,
                  t1.mobile,
                  t1.designation,
                  t1.status,
                  NVL(t1.profile_pic_url,'profile_photo_default.png') profile_pic_url,
                  ${strSqlRolesCol}
                FROM
                  t_inshe_users t1
                WHERE
                 1=1
                  AND 
                  (
                    ${strSqlForID}   
                    t1.id = '${filterTicketNo}'   OR
                    LOWER(t1.name) LIKE '%${filterTicketNo}%'   OR
                    LOWER(t1.email) LIKE '%${filterTicketNo}%'   
                  )
                ORDER BY 
                  name, 
                  id ASC`;
    if (filterTicketNo.length > 0) {
      let resultUserList = await simpleQuery(strSql, []);
      result = [...resultUserList];
    } else {
      result = [];
    }
  } else {
    if (is_filter_query) {
      let strID = id > 0 ? ` AND t1.id = ${id}  ` : ``;
      let strEmpName =
        name.length > 0
          ? ` AND LOWER(t1.name) LIKE '%${name.toLowerCase()}%'  `
          : ``;
      let strEmail =
        email.length > 0
          ? ` AND LOWER(t1.email) LIKE '%${email.toLowerCase()}%'  `
          : ``;

      strSql = `SELECT
                  t1.id,
                  t1.name,
                  NVL(t1.profile_pic_url,'profile_photo_default.png') profile_pic_url,
                  t1.email,
                   t1.mobile,
                   t1.designation,
                   t1.status,
                  ${strSqlRolesCol}
                 
                FROM
                  t_inshe_users t1
                WHERE
                1=1
                  ${strID}
                  ${strEmpName}
                  ${strEmail}
                ORDER BY 
                  name, 
                  id ASC`;
      console.log(strSql);
      let resultUserList = await simpleQuery(strSql, []);

      result = [...resultUserList];
    } else {
      result = [];
      resultSDT = [];
    }
  }

  // check roles

  if (in_role_list.length > 0) {
    result = result.filter((user) => {
      if (in_role == "1") {
        let hasRole = false;
        for (let iRole = 0; iRole < in_role_list.length; iRole++) {
          if (user.roles && user.roles.includes(`${in_role_list[iRole]}`)) {
            hasRole = true;
          }
        }
        return hasRole;
      } else {
        let hasRole = true;
        for (let iRole = 0; iRole < in_role_list.length; iRole++) {
          if (user.roles && user.ROLES.includes(`${in_role_list[iRole]}`)) {
            hasRole = false;
          }
        }
        return hasRole;
      }
    });
  }

  res.status(200).json([...result]);
};

exports.updateUserDetails = async (req, res) => {
  const { ID: logged_user_id, ROLES } = req.user;
  const isEditAllowed = ROLES && ROLES.length > 0 && ROLES.includes(1);
  const {
    is_password_reset,
    new_password,
    id,
    name,
    email,
    mobile,
    designation,
    profile_pic_url,
    status,
    roles,
    is_profile_edit,
  } = req.body;
  const currentTime = new Date();

  if (!isEditAllowed) {
    return res.status(403).json({
      errorMessage: "You are not authorized to update Data",
      errorTransKey: "api_res_unathorized_update_data",
    });
  }
  if (!id || id.length <= 0) {
    const BCYRPT_SALT_ROUNDS = 10;
    const selectSqlUsers = `SELECT
        *
    FROM
        t_inshe_users
    WHERE
        email = ?
    ORDER BY name DESC`;
    const resultUsers = await simpleQuery(selectSqlUsers, [email]);
    if (resultUsers && resultUsers.length > 0) {
      return res.status(403).json({
        errorMessage: "Email id already exists.",
        errorTransKey: "api_res_email_exists",
      });
    } else {
      const bycryptedPassword = await bcrypt
        .hash(new_password, BCYRPT_SALT_ROUNDS)
        .then((hash) => {
          return hash;
        })
        .catch((err) => {
          console.error(err.message);
          return "$2b$10$LR0iYyz1Gbp93sgEmRDcluQtcYiQGWFI7LraVOTADes7OVFT3.7nS1";
        });
      if (is_profile_edit.toString() === "1") {
        const imageDirPath = path.resolve(
          __dirname,
          "../static/api/images/profile/"
        );
        fs.rename(
          `${imageDirPath}/${id}_temp.JPG`,
          `${imageDirPath}/${id}.JPG`,
          (err) => {
            if (err) console.log("ERROR renaming profile pic: " + err);
          }
        );
      }
      const insertSqlUsers = `
      INSERT into t_inshe_users(name,email,mobile,password,designation,status,profile_pic_url,created_at,created_by)values(
      ?,?,?,?,?,?,?,?,?
      )
      `;
      const resultUsers = await simpleQuery(insertSqlUsers, [
        name,
        email,
        mobile,
        bycryptedPassword,
        designation,
        status,
        profile_pic_url,
        currentTime,
        logged_user_id,
      ]);
      const userId = resultUsers.insertId;
      const selectSqlRoles = `SELECT
        id,
        name
      FROM
          t_inshe_roles
      WHERE
          status = 1
      ORDER BY name DESC`;
      const resultRoles = await simpleQuery(selectSqlRoles, []);

      const strRoles = roles;
      let arrRoles = [];
      if (strRoles.length > 0) {
        arrRoles = strRoles.split(", ");
      }
      arrRoles = arrRoles.map(
        (item) =>
          resultRoles.filter((role) => item === `${role.name} (${role.id})`)[0]
            .id
      );

      for (let i = 0; i < arrRoles.length; i += 1) {
        const insSqlRole = `INSERT INTO 
                      t_inshe_user_role 
                    (
                      user_id,
                      role_id
                    )
                    values
                    (
                      ?,
                      ?  
                    )`;
        const resultInsertUserRole = await simpleQuery(insSqlRole, [
          userId,
          arrRoles[i],
        ]);
      }
    }
  } else {
    // update user details, if rfid is reset, if password is reset

    let strSqlPass = "";
    let strSqlImage = "";
    const BCYRPT_SALT_ROUNDS = 10;
    if (is_password_reset.toString() === "1") {
      const bycryptedPassword = await bcrypt
        .hash(new_password, BCYRPT_SALT_ROUNDS)
        .then((hash) => {
          return hash;
        })
        .catch((err) => {
          console.error(err.message);
          return "$2b$10$LR0iYyz1Gbp93sgEmRDcluQtcYiQGWFI7LraVOTADes7OVFT3.7nS1";
        });

      strSqlPass = ` password = '${bycryptedPassword}', `;
    }

    if (is_profile_edit.toString() === "1") {
      strSqlImage = ` profile_pic_url = '${id}.JPG', `;
    }
    const resultSql = `UPDATE
          t_inshe_users  
        SET  
        ${strSqlPass}
          ${strSqlImage}         
          name = ?,
          email = ?,
          mobile = ?,
          designation = ?
          
          
        WHERE
            id = ?`;
    const resultUpdateUserDetails = await simpleQuery(resultSql, [
      name,
      email,
      mobile,
      designation,
      id,
    ]);

    if (is_profile_edit.toString() === "1") {
      const imageDirPath = path.resolve(
        __dirname,
        "../static/api/images/profile/"
      );
      fs.rename(
        `${imageDirPath}/${id}_temp.JPG`,
        `${imageDirPath}/${id}.JPG`,
        (err) => {
          if (err) console.log("ERROR renaming profile pic: " + err);
        }
      );
    }

    // delete old roles
    const resultSqlRoles = `DELETE  from        
          t_inshe_user_role
      WHERE
          user_id = ? `;
    const resultDeleteOldRoles = await simpleQuery(resultSqlRoles, [id]);

    // add new roles
    const selectSqlRoles = `SELECT
          id,
          name
      FROM
          t_inshe_roles
      WHERE
          status = 1
      ORDER BY name DESC`;
    const resultRoles = await simpleQuery(selectSqlRoles, []);

    const strRoles = roles;
    let arrRoles = [];
    if (strRoles.length > 0) {
      arrRoles = strRoles.split(", ");
    }
    arrRoles = arrRoles.map(
      (item) =>
        resultRoles.filter((role) => item === `${role.name} (${role.id})`)[0].id
    );

    for (let i = 0; i < arrRoles.length; i += 1) {
      const insSqlRole = `INSERT INTO 
                          t_inshe_user_role 
                        (
                          user_id,
                          role_id
                        )
                        values
                        (
                          ?,
                          ?  
                        )`;
      const resultInsertUserRole = await simpleQuery(insSqlRole, [
        id,
        arrRoles[i],
      ]);
    }
  }

  return res.status(200).json("success");
};
