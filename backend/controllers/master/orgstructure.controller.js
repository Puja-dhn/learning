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

exports.getUsers = async (req, res) => {
    try {
        const query = `
            SELECT id, CONCAT(name, '(', emp_no, ')') AS name FROM t_inshe_users ORDER BY name ASC;`;
        const result = await simpleQuery(query, []);
        res.status(200).json({ historyUserData: result });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "An error occurred while fetching users" });
    }
};


exports.getOrgStructure = async (req, res) => {
    try {
        const query = `
            SELECT id, name, parent_id, category, head_user_id, created_at, updated_at, created_by, updated_by, is_active, is_deleted
            FROM t_inshe_org_structures
        `;
        const result = await simpleQuery(query, []);
        res.status(200).json({ historyOrgStructureData: result });
    } catch (error) {
        console.error("Error fetching organization structures:", error);
        res.status(500).json({ error: "An error occurred while fetching organization structures" });
    }
};

exports.getOrgStructureById = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT id, name, parent_id, category, head_user_id, is_deleted
            FROM t_inshe_org_structures
            WHERE id = ?
        `;
        const result = await simpleQuery(query, [id]);
        if (result.length === 0) {
            return res.status(404).json({ message: "Organization structure not found" });
        }
        res.status(200).json({ historyOrgStructureData: result[0] });
    } catch (error) {
        console.error("Error fetching organization structure:", error);
        res.status(500).json({ error: "An error occurred while fetching organization structure" });
    }
};

exports.createOrgStructure = async (req, res) => {
    const { name, parent_id, category, head_user_id } = req.body;
    const { ID } = req.user;
    try {
        const query = `
            INSERT INTO t_inshe_org_structures (name, parent_id, category, head_user_id, created_at, created_by)
            VALUES (?, ?, ?, ?, NOW(), ?)
        `;
        const values = [name, parent_id, category, head_user_id, ID];
        console.log('log',values);
        const result = await simpleQuery(query, values);
        res.status(201).json({
            message: "Organization structure created successfully",
            orgStructureId: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while creating organization structure" });
    }
};


exports.updateOrgStructure = async (req, res) => {
    const { ID } = req.user;
    const {id, name, parent_id, category, head_user_id } = req.body;
    try {
        const query = `
            UPDATE t_inshe_org_structures
            SET name = ?, parent_id = ?, category = ?, head_user_id = ?, updated_at = NOW(), updated_by = ?
            WHERE id = ?
        `;
        const values = [name, parent_id, category, head_user_id,ID,id ];
        console.log('log',values);
        const result = await simpleQuery(query, values);
       
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Organization structure not found" });
        }
        res.status(200).json({ message: "Organization structure updated successfully" });
    } catch (error) {
        console.error("Error updating organization structure:", error);
        res.status(500).json({ error: "An error occurred while updating organization structure" });
    }
};

exports.deleteOrgStructure = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            DELETE FROM t_inshe_org_structures
            WHERE id = ?
        `;
        const result = await simpleQuery(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Organization structure not found" });
        }
        res.status(200).json({ message: "Organization structure deleted successfully" });
    } catch (error) {
        console.error("Error deleting organization structure:", error);
        res.status(500).json({ error: "An error occurred while deleting organization structure" });
    }
};
