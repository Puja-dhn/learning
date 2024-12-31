const pdf = require("html-pdf");
const fs = require("fs");
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

exports.getPermittoWork = async (req, res) => {
  const { id } = req.body;
  try {
    const query = ` SELECT 
      t1.id,
      t1.department department_id,
      t2.name department,
      t1.area area_id,
      t3.name area,
      t1.work_location,
      DATE_FORMAT(t1.datetime_from, '%Y-%m-%d %H:%i') AS datetime_from,
      DATE_FORMAT(t1.datetime_to, '%Y-%m-%d %H:%i') AS datetime_to,
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
      DATE_FORMAT(t1.ei_date_time, '%Y-%m-%d %H:%i') AS ei_date_time,     
      t1.si_panel_name,
      t1.si_loto_no,
      t1.si_checked_by,
      DATE_FORMAT(t1.si_date_time, '%Y-%m-%d %H:%i') AS si_date_time,
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
      DATE_FORMAT(t1.created_at, '%Y-%m-%d %H:%i') AS created_at,  
      t1.created_by,
      t1.updated_at,
      t1.updated_by,
      t7.name log_by,
      LPAD(t1.id, 6, '0') AS disp_logno,
      t1.equipment,
      t8.name custodian,
      t9.name issuer
    FROM
      t_inshe_log_ptw t1
      join t_inshe_org_structures t2 on t1.department = t2.id
      join t_inshe_org_structures t3 on t1.area = t3.id
      left join t_inshe_users t5 on t1.pending_on = t5.id
      join t_inshe_users t7 on t1.created_by = t7.id
      join t_inshe_users t8 on t2.head_user_id = t8.id
      join t_inshe_users t9 on t1.issuer = t9.id
    WHERE
     t1.id = ?;`;
    const result = await simpleQuery(query, [id]);

    if (result.length === 0) {
      return res.status(404).json({ error: "PTW not found" });
    }

    const ptwData = result[0];

    const hazaedsConfigsQuery = `
    SELECT
        t1.id,
        t1.checklist
    FROM
        t_inshe_ptw_configs t1
    WHERE
      t1.status = 'Active'
      and t1.type='Hazard Identification'
  `;

    const hazardsConfigs = await simpleQuery(hazaedsConfigsQuery, []);

    const risksConfigsQuery = `
    SELECT
        t1.id,
        t1.checklist
    FROM
        t_inshe_ptw_configs t1
    WHERE
      t1.status = 'Active'
      and t1.type='Risk Assessment'
  `;

    const risksConfigs = await simpleQuery(risksConfigsQuery, []);

    const ppeConfigsQuery = `
    SELECT
        t1.id,
        t1.checklist
    FROM
        t_inshe_ptw_configs t1
    WHERE
      t1.status = 'Active'
      and t1.type='PPE Required'
  `;

    const ppeConfigs = await simpleQuery(ppeConfigsQuery, []);

    const generalConfigsQuery = `
    SELECT
        t1.id,
        t1.checklist
    FROM
        t_inshe_ptw_configs t1
    WHERE
      t1.status = 'Active'
      and t1.type='General Work'
  `;

    const generalConfigs = await simpleQuery(generalConfigsQuery, []);

    const hotwrkConfigsQuery = `
    SELECT
        t1.id,
        t1.checklist
    FROM
        t_inshe_ptw_configs t1
    WHERE
      t1.status = 'Active'
      and t1.type='Hot Work'
  `;

    const hotwrkConfigs = await simpleQuery(hotwrkConfigsQuery, []);

    const whConfigsQuery = `
    SELECT
        t1.id,
        t1.checklist
    FROM
        t_inshe_ptw_configs t1
    WHERE
      t1.status = 'Active'
      and t1.type='Work at Height'
  `;

    const whConfigs = await simpleQuery(whConfigsQuery, []);

    const confinedConfigsQuery = `
    SELECT
        t1.id,
        t1.checklist
    FROM
        t_inshe_ptw_configs t1
    WHERE
      t1.status = 'Active'
      and t1.type='Confined Space'
  `;

    const confinedConfigs = await simpleQuery(confinedConfigsQuery, []);

    const liftingConfigsQuery = `
    SELECT
        t1.id,
        t1.checklist
    FROM
        t_inshe_ptw_configs t1
    WHERE
      t1.status = 'Active'
      and t1.type='Lifiting Work'
  `;

    const liftingConfigs = await simpleQuery(liftingConfigsQuery, []);

    const esmsConfigsQuery = `
    SELECT
        t1.id,
        t1.checklist
    FROM
        t_inshe_ptw_configs t1
    WHERE
      t1.status = 'Active'
      and t1.type='ESMS Work Permit'
  `;

    const esmsConfigs = await simpleQuery(esmsConfigsQuery, []);

    const toolsConfigsQuery = `
    SELECT
        t1.id,
        t1.checklist
    FROM
        t_inshe_ptw_configs t1
    WHERE
      t1.status = 'Active'
      and t1.type='Tools and Equipment'
  `;

    const toolsConfigs = await simpleQuery(toolsConfigsQuery, []);

    // console.log("ptwData", ptwData);

    const htmlContent = generateHTML(
      ptwData,
      hazardsConfigs,
      risksConfigs,
      ppeConfigs,
      generalConfigs,
      hotwrkConfigs,
      whConfigs,
      confinedConfigs,
      liftingConfigs,
      esmsConfigs,
      toolsConfigs
    );

    const pdfOptions = { format: "A4" };
    pdf.create(htmlContent, pdfOptions).toStream((err, stream) => {
      if (err) {
        console.error("Error generating PDF:", err);
        return res.status(500).json({ error: "Failed to generate PDF" });
      }
      res.setHeader("Content-Type", "application/pdf");
      stream.pipe(res);
    });
  } catch (error) {
    console.error("Error fetching PTW:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching PTW data" });
  }
};

let getChecklistDescriptions = async (ids) => {
  let result = "";

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const query = "SELECT checklist FROM t_inshe_ptw_configs WHERE id = ?";

    try {
      const rows = await simpleQuery(query, [id]);
      if (rows.length > 0 && rows[0].checklist) {
        result = rows[0].checklist;
      } else {
        result = null;
      }
    } catch (err) {
      console.error("Error fetching checklist for ID", id, err);
      result = null;
    }
  }

  return result;
};

function generateDateRangeTableRows(startDate, endDate, issuer, initiator) {
  const rows = [];
  let currentDate = new Date(startDate);
  let i = 0;
  while (currentDate <= new Date(endDate)) {
    i++;
    rows.push(`
          <tr>
              <td>Day ${i}</td>
              <td>${issuer}</td>
              <td>${initiator}</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
          </tr>
      `);
    currentDate.setDate(currentDate.getDate() + 1); // Increment by 1 day
  }

  return rows.join("");
}

function generateHTML(
  data,
  hazardsConfigs,
  risksConfigs,
  ppeConfigs,
  generalConfigs,
  hotwrkConfigs,
  whConfigs,
  confinedConfigs,
  liftingConfigs,
  esmsConfigs,
  toolsConfigs
) {
  const currentDate = new Date().toLocaleString();

  function generateAssDynamicRows(allPermits, selectedPermits) {
    // Helper function to chunk the array into groups of 4
    const chunkArray = (array, size) => {
      const chunks = [];
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
      }
      return chunks;
    };

    // Split the permits into rows of 4
    const rows = chunkArray(allPermits, 4);

    // Generate HTML for each row
    return rows
      .map(
        (row) => `
          <tr>
            ${row
              .map((permit) => {
                const isChecked = selectedPermits.includes(permit) ? "✔" : "";
                return `
                  <td>${isChecked}</td>
                  <th>${permit}</th>
                `;
              })
              .join("")}
          </tr>
        `
      )
      .join("");
  }

  function generateConfigsDynamicRows(allPermits, selectedPermits) {
    // Helper function to chunk the array into groups of 4
    const chunkArray = (array, size) => {
      const chunks = [];
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
      }
      return chunks;
    };

    // Split the permits into rows of 4
    const rows = chunkArray(allPermits, 4);

    // Generate HTML for each row
    return rows
      .map(
        (row) => `
          <tr>
            ${row
              .map((permit) => {
                const isChecked = selectedPermits.includes(permit.id.toString())
                  ? "✔"
                  : "";
                return `
                  <td>${isChecked}</td>
                  <td>${permit.checklist}</td>
                `;
              })
              .join("")}
          </tr>
        `
      )
      .join("");
  }

  function generateDynamicRows(items) {
    // Helper function to chunk the array into groups of 4
    const chunkArray = (array, size) => {
      const chunks = [];
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
      }
      return chunks;
    };

    // Split the items into rows of 4
    const rows = chunkArray(items, 4);

    // Generate HTML for each row
    return rows
      .map(
        (row) => `
        <tr>
          ${row
            .map(
              (item) => `
            <td>✔</td>
            <th>${item}</th>
          `
            )
            .join("")}
        </tr>
      `
      )
      .join("");
  }
  function generateDBDynamicRows(items) {
    // Helper function to chunk the array into groups of 4
    const chunkArray = (array, size) => {
      const chunks = [];
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
      }
      return chunks;
    };

    // Split the items into rows of 4
    const rows = chunkArray(items, 4);

    // Generate HTML for each row
    return rows
      .map(
        (row) => `
        <tr>
          ${row
            .map(
              (item) => `
            <td>✔</td>
            <th>${getChecklistDescriptions(item)}</th>
          `
            )
            .join("")}
        </tr>
      `
      )
      .join("");
  }
  function generatePersonsTable(persons) {
    return persons
      .map(
        (person, index) => `
          <tr>
              <td>${index + 1}</td>
              <td>${person.name}</td>
              <td>${person.contractor}</td>
              <td>${person.trade}</td>
              <td>${person.ticketNo}</td>
          </tr>
      `
      )
      .join("");
  }

  return `
     <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Permit To Work</title>
        <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 11px;
            }

            .container {
              width: 100%;
              margin: 0 auto;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 10px;
            }

            th, td {
              border: 1px solid #ddd;
              padding: 5px;
            }

            th {
              background-color: #f4f4f4;
              text-align: left;
            }

            h3 {
              font-size: 13px;
            }

            header img {
              height: 50px;
            }

            header h1 {
              font-size: 22px;
              margin: 0;
              text-transform: uppercase;
              flex-grow: 1;
              text-align: center;
              color: #00457c;
            }
           strong{
          color: #00457c;
          font-size: 13px;
          }
           .page-break {
            page-break-after: always;
        }
        </style>
    </head>
    <body>
        <header>
            <img src="https://atomberg.com/logo/atomberg-highres-white-logo.svg" alt="Atomberg Logo">
            <h1>Permit To Work</h1>
        </header>
        <div class="content">
            <table>
                <tbody>
                <tr><th colspan="4"><strong>General Information</strong></th></tr>
                 <tr>
                <th>Permit No</th>
                <td>${data.id}</td>
                <th>Issue Date</th>
                <td>${data.created_at}</td>
               </tr>
                    <tr>
                        <th>Department</th>
                        <td>${data.department}</td>
                        <th>Area</th>
                        <td>${data.area}</td>
                    </tr>
                    <tr>
                        <th>Period From</th>
                        <td>${data.datetime_from}</td>
                        <th>Period To</th>
                        <td>${data.datetime_to}</td>
                    </tr>
                    <tr>
                        <th>Work Location</th>
                        <td>${data.work_location}</td>
                        <th>Nearest Manual Call Points</th>
                        <td>${data.nearest_firealarm}</td>
                    </tr>
                </tbody>
            </table>

            <table>
                <tbody>
                <tr><th colspan="4"><strong>Job Details</strong></th></tr>
                    <tr>
                    <th>Job Description</th><td>${data.job_description}</td>
                    <th>Name of Supervisor</th><td>${data.supervisor_name}</td>
                    </tr>
                    <tr>
                    <td colspan="3"><strong>Is MOC Required</strong></td><td>${
                      data.moc_required === 1 ? "Yes" : "No"
                    }</td>
                    </tr>  
                    ${
                      data.moc_required === 1
                        ? `
                    <tr>
                    <th>MOC Title</th><td>${data.moc_title}</td>
                    <th>MOC No</th><td>${data.moc_no}</td>
                    </tr>
                    <tr>
                    <th>Contractor</th><td>${data.contractor}</td>
                    <th>ESIC Reg No</th><td>${data.esic_no}</td>
                    </tr>   
                    `
                        : ""
                    }          
                </tbody>
            </table>

            <table>
                <tbody>
                <tr><th colspan="7"><strong>Associated Permits</strong></th><td>${
                  data.associated_permit ? "Yes" : "No"
                }</th></tr>                    
                ${generateAssDynamicRows(
                  [
                    "Work at Height",
                    "Confined Space",
                    "Lifting Work",
                    "ESMS Work Permit",
                    "Hot Work",
                  ],
                  JSON.parse(data.associated_permit || "[]")
                )}                   
                </tbody>
            </table>

            <table>
                <tbody>
                <tr><th colspan="7"><strong>Hazard Identified</strong></td><td>${
                  data.hazard_identification ? "Yes" : "No"
                }</th></tr>
                
                ${generateConfigsDynamicRows(
                  hazardsConfigs,
                  JSON.parse(data.hazard_identification || "[]")
                )}          
                <tr><th colspan="2">Any Other Specific Hazards</th><td colspan="6">${
                  data.other_hazards || "None"
                }</td></tr>
                </tbody>
            </table>

            <table>
                <tbody>
                <tr><th colspan="7"><strong>Risk Assessment</strong></th><td>${
                  data.risk_assessment ? "Yes" : "No"
                }</td></tr>
                ${generateConfigsDynamicRows(
                  risksConfigs,
                  JSON.parse(data.risk_assessment || "[]")
                )}
                </tbody>
            </table>

            <table>
                <tbody>
                <tr><th colspan="7"><strong>PPE Required</strong></th><td>${
                  data.ppe_required ? "Yes" : "No"
                }</td></tr>
                ${generateConfigsDynamicRows(
                  ppeConfigs,
                  JSON.parse(data.ppe_required || "[]")
                )}
                </tbody>
            </table>

            <table>
                <tbody>
                <tr><th colspan="7"><strong>Tools and Equipment required for the job identified, available, and inspected OK</strong></th><td>${
                  data.equipment_checklist ? "Yes" : "No"
                }</td></tr>
                ${generateConfigsDynamicRows(
                  toolsConfigs,
                  JSON.parse(data.equipment_checklist || "[]")
                )}
                </tbody>
            </table>

        <table>
  <tbody>
    <tr>
      <th colspan="2">
        <strong>Isolation Details</strong>
      </th>
      <td colspan="2">${data.ei_panel_name ? "Yes" : "No"}</td>
    </tr>
    <tr>
      <th colspan="2">Electrical Isolation</td>
      <th colspan="2">Service Isolation</td>
    </tr>
    <tr>
      <th>Drive/Panel Name</th>
      <td>${data.ei_panel_name}</td>
      <th>Steam/Air/Water/Gas</th>
      <td>${data.si_panel_name}</td>
    </tr>
    <tr>
      <th>LOTO No</th>
      <td>${data.ei_loto_no}</td>
      <th>LOTO No</th>
      <td>${data.si_loto_no}</td>
    </tr>
    <tr>
      <th>Checked By</th>
      <td>${data.ei_checked_by}</td>
      <th>Checked By</th>
      <td>${data.si_checked_by}</td>
    </tr>
    <tr>
      <th>Date & Time</th>
      <td>${data.ei_date_time}</td>
      <th>Date & Time</th>
      <td>${data.si_date_time}</td>
    </tr>
  </tbody>
</table>

<br><br><br><br><br>
            <table>
                <tbody>
                <tr><th colspan="7"><strong>General Work/Cold Work?</strong></td><td>${
                  data.general_work_dtls ? "Yes" : "No"
                }</th></tr>
                ${generateConfigsDynamicRows(
                  generalConfigs,
                  JSON.parse(data.general_work_dtls || "[]")
                )}              
                </tbody>
            </table>
           ${
             data.annexture_v
               ? `
            <table>
                <tbody>
                <tr><th colspan="6"><strong>List of persons attached to this permit (Other than custodian, issuer, and initiator)</strong></th></tr>
                <tr>
                    <th>Sl. No.</th><th>Name of Person</th><th>Own/Contractor</th><th>Trade</th><th>ESIC No.</th>
                </tr>    
                ${generatePersonsTable(
                  JSON.parse(data.annexture_v || [])
                )}          
                </tbody>
            </table>
           `
               : ""
           }
            <table>
                <tbody>
                <tr><th colspan="7"><strong>Work at Height</strong></th><th>${
                  data.work_height_checklist ? "Yes" : "No"
                }</th></tr>
                ${
                  data.work_height_checklist
                    ? `
                ${generateConfigsDynamicRows(
                  whConfigs,
                  JSON.parse(data.work_height_checklist || "[]")
                )}
                <tr>
                    <th colspan="2">Supervision provided by(Atomberg's Emp)</th>
                    <td colspan="6">${data.work_height_supervision}</td>
                </tr>
                 `
                    : ""
                }
                </tbody>
            </table>

             <table>
                <tbody>
                <tr><th colspan="7"><strong>Confined Space</strong></th><td>${
                  data.confined_space_checklist ? "Yes" : "No"
                }</td></tr>
                ${
                  data.confined_space_checklist
                    ? `
                ${generateConfigsDynamicRows(
                  confinedConfigs,
                  JSON.parse(data.confined_space_checklist || "[]")
                )}
                <tr>
                  <th>Supervision provided by(Atomberg's Emp)</th>
                  <td>${data.confined_space_supervision}</td>
                   <th>Atmospheric Checks done by</th>
                    <td>${data.confined_space_atmospheric}</td>    
                     <th>Oxygen level (19% - 21%)</th>
                    <td>${data.confined_space_oxygen_level}</td>   
                    <th>Explosive LEL & UEL</th>
                    <td>${data.confined_space_lel}</td>               
                </tr>              
                <tr>                     
                    <th>Toxic</th>
                    <td>${data.confined_space_toxic}</td>
                   <th>Detector Details</th>
                    <td>${data.confined_space_detector}</td> 
                    <th></th>
                    <td> </td>   
                    <th></th>
                    <td> </td>                   
                </tr>                
                  `
                    : ""
                }  
                </tbody>
            </table>
              <table>
                <tbody>
                <tr><th colspan="7"><strong>Lifiting Work</strong></th><td>${
                  data.lifting_work_checklist ? "Yes" : "No"
                }</td></tr>
                ${
                  data.lifting_work_checklist
                    ? `
                ${generateConfigsDynamicRows(
                  liftingConfigs,
                  JSON.parse(data.lifting_work_checklist || "[]")
                )}
               
                 `
                    : ""
                }
                </tbody>
            </table>
            <table>
                <tbody>
                <tr><th colspan="7"><strong>ESMS Work Permit</strong></th><td>${
                  data.esms_checklist ? "Yes" : "No"
                }</td></tr>
                ${
                  data.esms_checklist
                    ? `
                ${generateConfigsDynamicRows(
                  esmsConfigs,
                  JSON.parse(data.esms_checklist || "[]")
                )}
               
                 `
                    : ""
                }
                </tbody>
            </table>
             <table>
                <tbody>
                <tr><th colspan="7"><strong>Hot Work</strong></th><td>${
                  data.hot_work_checklist ? "Yes" : "No"
                }</td></tr>
                ${
                  data.hot_work_checklist
                    ? `
                ${generateConfigsDynamicRows(
                  hotwrkConfigs,
                  JSON.parse(data.hot_work_checklist || "[]")
                )}
               
                 `
                    : ""
                }
                </tbody>
            </table>



<table>
<tbody>
<tr>
<th colspan="5">
<strong>Permit Authorisation</strong>
</th>
</tr>
<tr>
<th>&nbsp;</th>
<th>
Name
</th>
<th>
Sig
</th>
<th>
Date
</th>
<th>
Time
</th>
</tr>
<tr>
<th>
Initiator
</th>
<td>${data.log_by}</td>
<td>&nbsp;</td>
<td>&nbsp;</td>
<td>&nbsp;</td>
</tr>
<tr>
<th>
Custodian
</th>
<td>${data.custodian}</td>
<td>&nbsp;</td>
<td>&nbsp;</td>
<td>&nbsp;</td>
</tr>
<tr>
<th>
Issuer
</th>
<td>${data.issuer}</td>
<td>&nbsp;</td>
<td>&nbsp;</td>
<td>&nbsp;</td>
</tr>
<tr>
<th>
EHS/Safety
</th>
<td>&nbsp;</td>
<td>&nbsp;</td>
<td>&nbsp;</td>
<td>&nbsp;</td>
</tr>
<tr>
<th>
Plant Head
</th>
<td>&nbsp;</td>
<td>&nbsp;</td>
<td>&nbsp;</td>
<td>&nbsp;</td>
</tr>
</tbody>
</table>



<table>
                <thead>
                <tr>
<th colspan="6">
<strong>Permit Extension (Checklist completed as per Extension conditions)</strong>
</th>
</tr>
                    <tr>
                        <th>Day</th>
                        <th>Issuer</th>
                        <th>Initiator</th>
                        <th>Safety</th>
                        <th>Extension time</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateDateRangeTableRows(
                      data.datetime_from,
                      data.datetime_to,
                      data.issuer,
                      data.log_by
                    )}
                </tbody>
            </table>


            <div class="page-break"></div>
        <table>
        <tr>
            <th colspan="2">
                <strong>General Instructions for Cold/General Work Permit</strong>
            </th>
        </tr>
        <tr>
            <td colspan="2">
                <p>
                    Appropriate safeguards and required personnel protective equipment (PPEs) shall be determined by a careful analysis of the potential hazards and the operations to be performed prior to starting the work.
                </p>
            </td>
        </tr>
        <tr>
            <th>Do’s</th>
        </tr>
        <tr>
            <td>
                <ul>
                    <li>Ensure the availability of a valid work permit before the start of work.</li>
                    <li>Ensure that work permit conditions are fully complied with at site.</li>
                    <li>Equipment should be properly isolated from all sources of energy before the start of work.</li>
                    <li>Ensure that walkways and passages are free from all slip/trip and fall hazard.</li>
                    <li>All draining of oil should be in a closed system as the draining of oil on floor will make the work area and area around the work unsafe.</li>
                    <li>Ensure proper illumination of workplace while working in dark.</li>
                    <li>Ensure use of non-sparking tools in flammable areas.</li>
                    <li>Executor should ensure the quality of hand tools and their health.</li>
                    <li>Use of proper PPE must be ensured.</li>
                </ul>
            </td>
        </tr>
        <tr>
            <th>Don’ts</th>
        </tr>
        <tr>
            <td>
                <ul>
                    <li>Never stand or work under suspended loads.</li>
                    <li>Never enter work area without safety helmet and shoe.</li>
                    <li>Do not wear loose/synthetic clothes while at work.</li>
                    <li>Do not use short cuts at work.</li>
                    <li>Do not use lamp of more than 24 V while working in confined space.</li>
                    <li>Do not run a machine without putting back the guard on its exposed moving part.</li>
                </ul>
            </td>
        </tr>
    </table>

    <table>
        <tr>
            <th colspan="2">
                <strong>General Instructions for Hot Work and Confined Space Entry Permit</strong>
            </th>
        </tr>
        <tr>
            <td colspan="2">
                <ul>
                    <li>Welding machines should be in non-hazardous and ventilated areas.</li>
                    <li>Gas test is mandatory. No hot work shall be permitted unless the explosive meter reading is zero.</li>
                    <li>For confined space entry, the oxygen level shall be between 19.5 - 21 percent volume, and the concentration of toxic gases below the threshold limits.</li>
                    <li>Hot work includes welding, grinding, gas cutting, burning, open flame, soldering, shot blasting, chipping, riveting, drilling, camera flashing, power tools, IC engines, mixer machines, use of certain non-explosion proof equipment, vehicle entry, or any other activities which may generate heat or spark.</li>
                    <li>Ensure the confined space is positively isolated from the source of energy and free from harmful gases.</li>
                    <li>Wherever forced ventilation is used, the gas test should be carried out after a minimum of 10 minutes of stopping the eductor/fan/blower.</li>
                    <li>Use suitable respiratory protection for entry into the confined space.</li>
                    <li>An attendant should always be available at the manway entry of the confined space until the work inside is complete.</li>
                </ul>
            </td>
        </tr>
        <tr>
            <th>Do’s</th>
        </tr>
        <tr>
            <td>
                <ul>
                    <li>Ensure the area is free from all flammables and combustibles.</li>
                    <li>In case of gas welding/cutting, cylinders should be kept in an upright position.</li>
                    <li>Check hose connections of gas cylinders before starting hot work. The hoses must be free from all cuts and kinks and distinct in color.</li>
                    <li>Ensure the use of proper PPEs during hot work.</li>
                    <li>Ensure the use of flashback arrestors in gas cylinders when using oxy-acetylene sets.</li>
                    <li>Hot work inside confined spaces should be done under the presence of EHS representatives.</li>
                    <li>Ensure electric cables are free from joints and have sound insulation.</li>
                    <li>All portable/mobile electrical equipment must be connected with ELCB.</li>
                </ul>
            </td>
        </tr>
        <tr>
            <th>Don’ts</th>
        </tr>
        <tr>
            <td>
                <ul>
                    <li>Never stand or work under suspended loads.</li>
                    <li>Do not use electrode holders as cable connectors for extending welding cables.</li>
                    <li>Never keep acetylene cylinders in a horizontal position, even if they are empty.</li>
                    <li>Do not use a grinder without a wheel guard on abrasive wheels.</li>
                    <li>Do not use lights of more than 24 V inside confined spaces.</li>
                </ul>
            </td>
        </tr>
    </table>

    <table>
        <tr>
            <th colspan="2">
                <strong>General Instructions for Work at Height Permit</strong>
            </th>
        </tr>
        <tr>
            <td colspan="2">
                <ul>
                    <li>All works at height shall be discontinued during rain/high wind.</li>
                    <li>Stop all jobs in case scaffold is sagging unduly; report to EHS/Admin.</li>
                    <li>Metallic tubular scaffolding and standard aluminum ladders are only to be used.</li>
                    <li>For electrical work at height, only fiberglass ladders are to be used.</li>
                    <li>Use of an approved type full-body safety harness along with a lifeline is mandatory for working at a height of 2.0 m and above.</li>
                    <li>Use of a safety helmet and shoes is mandatory for all height work.</li>
                </ul>
            </td>
        </tr>
        <tr>
            <th>Do’s</th>
        </tr>
        <tr>
            <td>
                <ul>
                    <li>Ensure every open side or opening into or through which a person may fall is covered or guarded by an effective barrier to prevent falls.</li>
                    <li>Check ladders and step-ladders for good construction, sound material, and adequate strength before use.</li>
                </ul>
            </td>
        </tr>
       
      
    </table>

     <table>
        <tr>
            <th colspan="2">
                <strong>Permit Extension Checkpoints (Conditions for Extension/Renewal of Permit)</strong>
            </th>
        </tr>
        <tr>
            <td colspan="2">
                <ul>
                    <li>Ensure the work environment has not changed for the extension time.</li>
                    <li>Ensure the permit type/work type has not changed over the extension duration.</li>
                    <li>Ensure persons involved in the work have not changed during the permit extension period.</li>
                    <li>Ensure no new machines are added for the extension.</li>
                    <li>Ensure all machines have undergone checks as per the checklist for each extension period.</li>
                    <li>Ensure JSA (Job Safety Analysis) is valid over the extension period.</li>
                </ul>
            </td>
        </tr>
    </table>
    
        </div>
    </body>
    </html>`;
}
