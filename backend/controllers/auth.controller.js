const mysql2 = require("mysql2/promise");
const database = require("../services/database.js");
const jwtGenerator = require("../utils/jwt");
const jwt = require("jsonwebtoken");
const ldap = require("ldapjs");
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

exports.refreshToken = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).send({
      errorMessage: "Invalid Token",
      errorTransKey: "api_res_invalid_token",
    });
  }

  try {
    const verifiedWithoutExpiry = jwtGenerator.vertifyAccessToken(token, true);
    if (
      !verifiedWithoutExpiry ||
      !verifiedWithoutExpiry.ID ||
      !verifiedWithoutExpiry.exp
    ) {
      return res.status(401).send({
        errorMessage: "Invalid Token",
        errorTransKey: "api_res_invalid_token",
      });
    }

    const userDetails = {
      ID: verifiedWithoutExpiry.ID,
      NAME: verifiedWithoutExpiry.NAME,
      ROLES: verifiedWithoutExpiry.ROLES,
      TICKET_NO: verifiedWithoutExpiry.TICKET_NO,
      BASE_LOCN_ID: verifiedWithoutExpiry.BASE_LOCN_ID,
      PHOTO_PATH: verifiedWithoutExpiry.PHOTO_PATH,
    };

    const jsontoken = jwtGenerator.generateAccessToken(userDetails);

    res.status(200).send({ AUTH_TOKEN: jsontoken });
  } catch (err) {
    console.log(err);
    return res.status(401).send({
      errorMessage: "Invalid Token",
      errorTransKey: "api_res_invalid_token",
    });
  }
};



exports.login = async (req, res) => {
  const { emailId, password } = req.body;
  let result;
  let roleRows;
  let errorStatus = 0;

  const decEmail = decryptData(emailId);
  const decPassword = decryptData(password);

  if (!decEmail || decEmail.length <= 0) {
    return res.status(400).json({
      errorMessage: "Domain Id cannot be blank. Try again.",
      errorTransKey: "api_res_domainid_blank",
    });
  }

  if (!decPassword || decPassword.length <= 0) {
    return res.status(400).json({
      errorMessage: "Password cannot be blank. Try again.",
      errorTransKey: "api_res_password_blank",
    });
  }
  let isAuthenticated = false;
  
  const query = `
  SELECT
            t1.id,
            t1.name name,
            t1.email email_id,
            t1.profile_pic_url photo_path,
            t1.department department,
            t1.logged_in,
            t1.password,
            t1.location
        FROM
            t_sis_users t1
        WHERE
            t1.email = ?
`;

  const results = await simpleQuery(query, [decEmail]);
  const userData = results[0];
  if (results.length > 0) {
    const updatequery = `update t_sis_users set logged_in=1 where id=?`;
    const updateresults = await simpleQuery(updatequery, [userData.id]);
    const queryRoles = `SELECT role_id FROM t_sis_user_role WHERE user_id = ?`;
    const resultRoles = await simpleQuery(queryRoles, [userData.id]);
     roleRows = Array.isArray(resultRoles.rows) ? resultRoles.rows.map((item) => item.ROLE_ID) : [];
    if (!isAuthenticated) {
      isAuthenticated = await bcrypt
        .compare(decPassword, userData.password)
        .then((hash) => {
          return hash;
        })
        .catch((err) => {
          console.error(err.message);
          return false;
        });

      if (!isAuthenticated) {
        return res.status(400).json({
          errorMessage: "Invalid Credentials. Try again",
          errorTransKey: "api_res_auth_invalid_credentials",
        });
      }
    }
  } else {
    res.json({
      success: false,
      message: "Invalid Credentials or Users not activated yet. Try again",
    });
  }


 

  const userDetails = {
    ID: userData.id,
    NAME: userData.name,
    ROLES: roleRows,
    EMAIL: userData.email_id,
    LOCATION: userData.location,
    PHOTO_PATH: userData.photo_path,
    DEPARTMENT: userData.department,
    LOGGED_IN: userData.logged_in,
  };

  const jsontoken = jwtGenerator.generateAccessToken(userDetails);

  res.status(200).json({ ...userDetails, AUTH_TOKEN: jsontoken });
};

exports.alllocations = async (req, res) => {
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
          t_sdt_locations t1          
      WHERE
          t1.status = 'Active'          
      ORDER BY t1.id ASC`,
      {}
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

  res.status(200).json([...resultLocations.rows]);
};

exports.registerScanner = async (req, res) => {
  const { NAME, TICKET_NO, BASE_LOCN_ID, RFID } = req.body;

  // check if data valid

  if (!NAME || !TICKET_NO || !BASE_LOCN_ID || !RFID) {
    return res.status(400).json({
      errorMessage: "Incomplete Data please check. Try again.",
      errorTransKey: "api_res_register_nodata",
    });
  }

  // check if ticket_no already exists

  let resultExists = await database
    .simpleQuery(
      `SELECT
            NVL(COUNT(id),0) countval
        FROM
            t_frm_users
        WHERE
            rfid = :curr_rfid 
          AND emp_id = :curr_ticket_no `,
      {
        curr_rfid: {
          dir: oracledb.BIND_IN,
          val: RFID,
          type: oracledb.STRING,
        },
        curr_ticket_no: {
          dir: oracledb.BIND_IN,
          val: TICKET_NO,
          type: oracledb.STRING,
        },
      }
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultExists || resultExists.errorMessage || !resultExists.rows) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  if (resultExists.rows[0]["COUNTVAL"] > 0) {
    return res.status(400).json({
      errorMessage: "User with given Ticket No or Scanned ID already Exists",
      errorTransKey: "api_res_register_userexists",
    });
  }

  // check if rfid already exists for other ticket no

  let resultExistsRFID = await database
    .simpleQuery(
      `SELECT
            NVL(COUNT(id),0) countval
        FROM
            t_frm_users
        WHERE
            rfid = :curr_rfid `,
      {
        curr_rfid: {
          dir: oracledb.BIND_IN,
          val: RFID,
          type: oracledb.STRING,
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
    !resultExistsRFID ||
    resultExistsRFID.errorMessage ||
    !resultExistsRFID.rows
  ) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  if (resultExistsRFID.rows[0]["COUNTVAL"] > 0) {
    return res.status(400).json({
      errorMessage: "User with given Ticket No or Scanned ID already Exists",
      errorTransKey: "api_res_register_userexists",
    });
  }

  // check if ticket no already exists where rfid is not blank

  let resultExistsTicketNoRFID = await database
    .simpleQuery(
      `SELECT
            NVL(COUNT(id),0) countval
        FROM
            t_frm_users
        WHERE
            emp_id = :curr_ticket_no 
          AND rfid IS NOT NULL `,
      {
        curr_ticket_no: {
          dir: oracledb.BIND_IN,
          val: TICKET_NO,
          type: oracledb.STRING,
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
    !resultExistsTicketNoRFID ||
    resultExistsTicketNoRFID.errorMessage ||
    !resultExistsTicketNoRFID.rows
  ) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  if (resultExistsTicketNoRFID.rows[0]["COUNTVAL"] > 0) {
    return res.status(400).json({
      errorMessage: "User with given Ticket No or Scanned ID already Exists",
      errorTransKey: "api_res_register_userexists",
    });
  }

  // check if ticket no already exists

  let resultExistsTicketNo = await database
    .simpleQuery(
      `SELECT
            NVL(COUNT(id),0) countval
        FROM
            t_frm_users
        WHERE
            emp_id = :curr_ticket_no `,
      {
        curr_ticket_no: {
          dir: oracledb.BIND_IN,
          val: TICKET_NO,
          type: oracledb.STRING,
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
    !resultExistsTicketNo ||
    resultExistsTicketNo.errorMessage ||
    !resultExistsTicketNo.rows
  ) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  if (resultExistsTicketNo.rows[0]["COUNTVAL"] > 0) {
    // update rfid for the user

    let resultUpdateUser = await database
      .simpleQuery(
        `UPDATE t_frm_users SET rfid = :curr_rfid, upd_ts = SYSDATE WHERE emp_id = :curr_ticket_no `,
        {
          curr_ticket_no: {
            dir: oracledb.BIND_IN,
            val: TICKET_NO,
            type: oracledb.STRING,
          },
          curr_rfid: {
            dir: oracledb.BIND_IN,
            val: RFID,
            type: oracledb.STRING,
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

    console.log("Updated User RFID", resultUpdateUser);

    return res.status(200).json("success");
  }

  // error message if user not found

  return res.status(400).json({
    errorMessage: "User with given Ticket No not found, Contact Admin",
    errorTransKey: "api_res_register_usernotexists",
  });
};
exports.getUserRfidValidate = async (req, res) => {
  const { ticketNo } = req.body;

  let resultUserList = await database
    .simpleQuery(
      `SELECT t1.name emp_name,
      CASE WHEN t1.rfid IS NOT NULL THEN 'yes' ELSE 'no' END rfid
      FROM
          t_frm_users t1
      WHERE
            t1.sap_status <> 'Inactive'
          AND
            t1.emp_id = ${ticketNo}
          `
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultUserList || resultUserList.errorMessage) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }
  if (resultUserList.rows.length > 0) {
    res.status(200).json([resultUserList.rows[0]]);
  } else {
    res.status(200).json([]);
  }
};
exports.getuser = async (req, res) => {
  const { ticketNo } = req.body;
  let resultUserList = await database
    .simpleQuery(
      `SELECT 
      t1.name,
      t1.email email_id,
      t1.emp_id employee_id,
      t1.mobile
      FROM
          t_frm_users t1
          JOIN t_ngs_users t2 on t1.emp_id = t2.emp_id
      WHERE
            t1.emp_id = :curr_employee_id `,
      {
        curr_employee_id: {
          dir: oracledb.BIND_IN,
          val: ticketNo,
          type: oracledb.STRING,
        },
      }
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
      };
    });
  // console.log(resultUserList);
  if (!resultUserList || resultUserList.errorMessage) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }
  if (resultUserList.rows.length > 0) {
    res.status(200).json(resultUserList.rows);
  } else {
    res.status(200).json([]);
  }
};

exports.getSapUser = async (req, res) => {
  const { inputText } = req.body;
  if (inputText == "") {
    return res.status(400).json({
      errorMessage: "Invalid Request",
      errorTransKey: "api_res_unknown_error",
    });
  } else {
    let postResponseData = null;
    const URL = `${NODE_MEDICAL_USER_API}?pno=${inputText}&bu=CV`;
    let config = {
      method: "get",
      url: URL,
      proxy: false,
      httpAgent: new http.Agent({ rejectUnauthorized: false }),
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    };
    postResponseData = await axios(config);
    if (postResponseData.status == 200) {
      let resultUserList = await database
        .simpleQuery(
          `
              SELECT
                  name,email,mobile
              FROM
                  t_frm_users t1
              WHERE
                    t1.sap_status = 'Active'
                AND
                    t1.emp_id = '${inputText}'`,
          {}
        )
        .catch((err) => {
          console.log(err);
          return {
            errorMessage: "Something went wrong",
            errorTransKey: "api_res_unknown_error",
          };
        });
      if (resultUserList.rows.length === 0) {
        return res.status(400).json({
          errorMessage: "Not a valid user",
          errorTransKey: "api_res_unknown_error",
        });
      } else {
        return res.status(200).json(resultUserList.rows[0]);
      }
    } else {
      return res.status(400).json({
        errorMessage: "Not a valid user",
        errorTransKey: "api_res_unknown_error",
      });
    }
  }
};
exports.registerUser = async (req, res) => {
  const { NAME, EMAIL_ID, EMPLOYEE_ID, MOBILE, PASSWORD } = req.body;

  // check if data valid

  if (!NAME || !EMAIL_ID || !EMPLOYEE_ID || !MOBILE || !PASSWORD) {
    return res.status(400).json({
      errorMessage: "Incomplete Data please check. Try again.",
      errorTransKey: "api_res_register_nodata",
    });
  }

  const decDomainPassword = decryptData(PASSWORD);
  // check if ticket_no already exists

  let resultExists = await database
    .simpleQuery(
      `SELECT
            t1.id 
        FROM
            t_frm_users t1
            join t_ngs_users t2 on t1.emp_id= t2.emp_id
        WHERE
                t1.sap_status = 'Active'
            AND
                t1.emp_id = :curr_ticket_no `,
      {
        curr_ticket_no: {
          dir: oracledb.BIND_IN,
          val: EMPLOYEE_ID,
          type: oracledb.STRING,
        },
      }
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!resultExists || resultExists.errorMessage || !resultExists.rows) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }

  if (resultExists.rows.length > 0) {
    return res.status(400).json({
      errorMessage: "Employee id is already registered. Please login.",
      errorTransKey: "api_res_unknown_error",
    });
  } else {
    let resultUpdateUser = await database
      .simpleQuery(
        `UPDATE t_frm_users SET email= :curr_email, mobile= :curr_mobile, upd_ts = SYSDATE WHERE emp_id = :curr_ticket_no AND sap_status = 'Active' `,
        {
          curr_ticket_no: {
            dir: oracledb.BIND_IN,
            val: EMPLOYEE_ID,
            type: oracledb.STRING,
          },
          curr_email: {
            dir: oracledb.BIND_IN,
            val: EMAIL_ID,
            type: oracledb.STRING,
          },
          curr_mobile: {
            dir: oracledb.BIND_IN,
            val: MOBILE,
            type: oracledb.STRING,
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
    let resultGetMaxId = await database
      .simpleQuery(`SELECT NVL(MAX(id),0) + 1 maxid FROM t_ngs_users`, {})
      .catch((err) => {
        console.log(err);
        return {
          errorMessage: "Something went wrong",
          errorTransKey: "api_res_unknown_error",
        };
      });
    if (
      !resultGetMaxId ||
      resultGetMaxId.errorMessage ||
      !resultGetMaxId.rows
    ) {
      return res.status(400).json({
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      });
    }
    const BCYRPT_SALT_ROUNDS = 10;
    const bycryptedPassword = await bcrypt
      .hash(decDomainPassword, BCYRPT_SALT_ROUNDS)
      .then((hash) => {
        return hash;
      })
      .catch((err) => {
        console.error(err.message);
        return "$2b$10$LR0iYyz1Gbp93sgEmRDcluQtcYiQGWFI7LraVOTADes7OVFT3.7nS1";
      });

    const maxSAUsersId = resultGetMaxId.rows[0]["MAXID"];
    let resultInsertSaUsers = await database
      .simpleQuery(
        `INSERT INTO 
              t_ngs_users
                (
                  id,
                  emp_id,
                  crt_ts,
                  upd_ts,
                  status,
                  password,
                  email_id,
                  mobile
                )
                values
                (
                  :curr_id,
                  :curr_emp_id,
                  SYSDATE,
                  SYSDATE,
                  'Pending',
                  :curr_password,
                  :curr_email,
                  :curr_mobile
                )`,
        {
          curr_id: {
            dir: oracledb.BIND_IN,
            val: maxSAUsersId,
            type: oracledb.NUMBER,
          },
          curr_emp_id: {
            dir: oracledb.BIND_IN,
            val: +EMPLOYEE_ID,
            type: oracledb.NUMBER,
          },
          curr_password: {
            dir: oracledb.BIND_IN,
            val: bycryptedPassword,
            type: oracledb.STRING,
          },
          curr_email: {
            dir: oracledb.BIND_IN,
            val: EMAIL_ID,
            type: oracledb.STRING,
          },
          curr_mobile: {
            dir: oracledb.BIND_IN,
            val: MOBILE,
            type: oracledb.STRING,
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

    if (!resultInsertSaUsers || resultInsertSaUsers.errorMessage) {
      return res.status(400).json({
        errorMessage: resultInsertSaUsers.errorMessage,
        errorTransKey: resultInsertSaUsers.errorTransKey,
      });
    }
    /* console.log("INSERTED SA USERS ", resultInsertSaUsers); */

    //get user base location
    let resultLocn = await database
      .simpleQuery(
        `SELECT
                t1.base_loc 
            FROM
                t_frm_users t1
            WHERE
              t1.emp_id = :curr_ticket_no `,
        {
          curr_ticket_no: {
            dir: oracledb.BIND_IN,
            val: EMPLOYEE_ID,
            type: oracledb.STRING,
          },
        }
      )
      .catch((err) => {
        return {
          errorMessage: "Something went wrong",
          errorTransKey: "api_res_unknown_error",
        };
      });

    if (!resultLocn || resultLocn.errorMessage || !resultLocn.rows) {
      return res.status(400).json({
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      });
    }

    const locnId = resultLocn.rows[0].BASE_LOC;

    //get admin email

    let adminUsers = await database
      .simpleQuery(
        `SELECT
            LISTAGG(t1.email,',') WITHIN GROUP(ORDER BY t1.id) email
            FROM
                t_frm_users t1
                JOIN t_ngs_user_role t2 on t1.id=t2.user_id
                JOIN t_frm_user_location t3 on t1.base_loc=t3.loc_id and t1.id = t3.user_id
            WHERE
              t2.role_id=2
              and t1.base_loc=${locnId}
              `,
        {}
      )
      .catch((err) => {
        return {
          errorMessage: "Something went wrong",
          errorTransKey: "api_res_unknown_error",
        };
      });

    if (!adminUsers || adminUsers.errorMessage || !adminUsers.rows) {
      return res.status(400).json({
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      });
    }

    const adminMail = adminUsers.rows[0].EMAIL;
    const adminName = adminUsers.rows[0].NAME;

    //     let mailHeader = `<html>
    //                   <body>
    //                     <p style='font-family: Verdana; font-size: x-small; color: #000080; '>Dear Admin,</p>
    //                     <p style='font-family: Verdana; font-size: x-small; color: #000080; '>A new user has been registered. Please activate their account.</p><br>
    //                     <div>
    //                       <div id='c1' style='overflow: auto;'>
    //                         <table style='font-family: Verdana; font-size: x-small;'>`;
    // let mailBody = `            <tr>
    //                               <td style='width:150px;color: #000080; background-color: #E0E0E0;text-align:left;'>Employee Id</td>
    //                               <td style='width:450px;text-align:left;background-color:#eef2d5;'>${EMPLOYEE_ID}</td>
    //                             </tr>
    //                             <tr>
    //                                 <td style='width:150px;color: #000080; background-color: #E0E0E0;text-align:left;'>Name</td>
    //                                 <td style='width:450px;text-align:left;background-color:#eef2d5;'>${NAME}</td>
    //                             </tr>
    //                             <tr>
    //                                 <td style='width:150px;color: #000080; background-color: #E0E0E0;text-align:left;'>Email</td>
    //                                 <td style='width:450px;text-align:left;background-color:#eef2d5;'>${EMAIL_ID}</td>
    //                             </tr>
    //                             <tr>
    //                                 <td style='width:150px;color: #000080; background-color: #E0E0E0;text-align:left;'>Mobile</td>
    //                                 <td style='width:450px;text-align:left;background-color:#eef2d5;'>${MOBILE}</td>
    //                             </tr>
    //                             `;
    // let mailFooter = `        </table>
    //                       </div>
    //                     </div>
    //                     <br><p style='font-family: Verdana; font-size: x-small; color: #000080; '>With Regards,</p>
    //                     <p style='font-family: Verdana; font-size: x-small; color: #000080; '>NexSafe System</p></br>
    //                     <p style='font-family: Verdana; font-size: x-small; color: #000080; '>In case of any issue or technical support please raise a request using [<a href='https://safety.inservices.tatamotors.com/issuetracking/login.php' style='text-decoration:none'><b style='color:red;'>Raise Issue</b></a>] link. Or email us to <a href='mail:safetysystemsupport@tatamotors.onmicrosoft.com'>SafetySystemSupport</a></p>
    //                     <p style='font-family: Verdana; font-size: x-small; color: red; '>[Note: Please do not reply to this mail as it is auto generated.]</p>
    //                   </body>
    //                 </html>`;

    // sendMail(
    //   `${adminMail}`,
    //   ``,
    //   `New User Registration-${NAME}(${EMPLOYEE_ID}) `,
    //   `${mailHeader}${mailBody}${mailFooter}`
    // );

    return res.status(200).json(locnId);
  }

  // error message if user not found

  return res.status(400).json({
    errorMessage: "User with given Ticket No not found, Contact Admin",
    errorTransKey: "api_res_register_usernotexists",
  });
};
exports.logout = async (req, res) => {
  const { ticketNo } = req.body;
  console.log(ticketNo);
  let updateUserStatus = await database
    .simpleQuery(
      `update t_ngs_users set logged_in=0 where emp_id = '${ticketNo}'`
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
        errorTransKey: "api_res_unknown_error",
      };
    });

  if (!updateUserStatus || updateUserStatus.errorMessage) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }
  return res.status(200).json("success");
};
exports.logoutConcurrentLogin = async (req, res) => {
  const { ticketNo } = req.body;
  let socketio = req.app.get("socketio");
  if (socketio) {
    socketio.emit(
      "NEW_LOGIN",
      JSON.stringify({
        ticketNo: ticketNo,
      })
    );
  }
  return res.status(200).json("success");
};

const transporter = nodemailer.createTransport({
  host: process.env.NODE_EMAIL_HOST,
  port: process.env.NODE_EMAIL_PORT,
  secure: false,
  tls: {
    rejectUnauthorized: false, // do not fail on invalid certs
  },
});
exports.requestotp = async (req, res) => {
  const { email, employeeid } = req.body;
  let resultUserList = await database
    .simpleQuery(
      `SELECT
        t2.*
        FROM
          t_ngs_users t2 
        WHERE
              t2.emp_id = :curr_employee_id `,
      {
        curr_employee_id: {
          dir: oracledb.BIND_IN,
          val: +employeeid,
          type: oracledb.NUMBER,
        },
      }
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
      };
    });
  if (!resultUserList || resultUserList.errorMessage) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }
  if (resultUserList.rows.length > 0) {
    const userEmail = resultUserList.rows[0].EMAIL_ID;
    if (userEmail !== "") {
      if (userEmail !== email) {
        return res.status(200).json(1); //email not matched in system
      }
    }
  }
  const otp = Math.floor(100000 + Math.random() * 900000);
  let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>Forgot Password</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f0f0f0;">
 <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid black; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
     <tr>
         <td style="background-color: #24579d;  text-align: left; border-radius: 5px 5px 0 0;">
            <img src='data:image/png;base64,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'/>
         </td>
     </tr>
     <tr>
         <td style="padding: 10px 5px;">
             <p style='font-family: Verdana; font-size: x-small; color: #000080;padding-left:5px; '>Dear <strong style="color: #000080;">User,</strong></p>
             <p style='font-family: Verdana; font-size: x-small; color: #000080;padding-left:5px; '>Your otp to change the password is. <strong style="color: #000080;">${otp}</strong>.</p>
             <p style='font-family: Verdana; font-size: x-small; color: #000080;padding-left:5px; '>Kindly use this otp to change your password..</p>
         </td>
     </tr>
    
     <tr>
         <td style="padding: 5px; ">
             <p style='font-family: Verdana; font-size: x-small; color: #000080;padding-left:5px; '>With Regards,</p>
             <p style="font-family: Verdana; font-size: x-small; color: #000080;padding-left:5px;">Nexsafe System</p>
            <p style='font-family: Verdana; font-size: x-small; color: red;margin-bottom:10px;padding-left:5px; '>[Note: Please do not reply to this mail as it is auto generated.]</p> 
         </td>
     </tr>
 </table>
</body>
</html>
 `;
  // const mailOptions = {
  //   from: '"Nexsafe" <ngs-noreply@tatamotors.com>',
  //   to: email,
  //   subject: "Forgot Password",
  //   html: htmlContent,
  // };

  // try {
  //   await transporter.sendMail(mailOptions);
  //   console.log("Email sent successfully");
  // } catch (error) {
  //   console.error("Error sending email:", error);
  //   throw error;
  // }
  try {
    await sendMail(`${email}`, ``, `Forgot Password`, `${htmlContent}`);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
  let resultUpdateUsers = await database
    .simpleQuery(
      `update t_ngs_users set otp=:curr_otp, upd_ts=SYSDATE where emp_id= :curr_emp_id `,
      {
        curr_otp: {
          dir: oracledb.BIND_IN,
          val: otp,
          type: oracledb.NUMBER,
        },
        curr_emp_id: {
          dir: oracledb.BIND_IN,
          val: employeeid,
          type: oracledb.NUMBER,
        },
      }
    )
    .catch((err) => {
      return {
        errorMessage: err,
      };
    });
  // console.log(resultUserList);
  if (!resultUpdateUsers || resultUpdateUsers.errorMessage) {
    console.log(resultUpdateUsers.errorMessage);
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }
  res.status(200).json(0); //otp send successfully
};

exports.passwordUpdate = async (req, res) => {
  const { EMAIL_ID, EMPLOYEE_ID, OTP, PASSWORD } = req.body.values;
  let resultUserList = await database
    .simpleQuery(
      `SELECT
        t2.*
        FROM
          t_ngs_users t2 
        WHERE
              t2.emp_id = :curr_employee_id `,
      {
        curr_employee_id: {
          dir: oracledb.BIND_IN,
          val: +EMPLOYEE_ID,
          type: oracledb.NUMBER,
        },
      }
    )
    .catch((err) => {
      return {
        errorMessage: "Something went wrong",
      };
    });
  if (!resultUserList || resultUserList.errorMessage) {
    return res.status(400).json({
      errorMessage: "Something went wrong",
      errorTransKey: "api_res_unknown_error",
    });
  }
  if (resultUserList.rows.length > 0) {
    const userOTP = resultUserList.rows[0].OTP;
    if (+userOTP === +OTP) {
      const BCYRPT_SALT_ROUNDS = 10;
      const bycryptedPassword = await bcrypt
        .hash(PASSWORD, BCYRPT_SALT_ROUNDS)
        .then((hash) => {
          return hash;
        })
        .catch((err) => {
          console.error(err.message);
          return "$2b$10$LR0iYyz1Gbp93sgEmRDcluQtcYiQGWFI7LraVOTADes7OVFT3.7nS1";
        });
      let resultUpdateUsers = await database
        .simpleQuery(
          `update t_ngs_users set password=:curr_password,otp=null, upd_ts=SYSDATE where emp_id= :curr_emp_id `,
          {
            curr_password: {
              dir: oracledb.BIND_IN,
              val: bycryptedPassword,
              type: oracledb.STRING,
            },
            curr_emp_id: {
              dir: oracledb.BIND_IN,
              val: +EMPLOYEE_ID,
              type: oracledb.NUMBER,
            },
          }
        )
        .catch((err) => {
          return {
            errorMessage: err,
          };
        });
      // console.log(resultUserList);
      if (!resultUpdateUsers || resultUpdateUsers.errorMessage) {
        console.log(resultUpdateUsers.errorMessage);
        return res.status(400).json({
          errorMessage: "Something went wrong",
          errorTransKey: "api_res_unknown_error",
        });
      }
      res.status(200).json(0); //update successfull
    } else {
      res.status(200).json(1); // invalid otp
    }
  } else {
    res.status(200).json(2); //not a valid user
  }
};
