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

exports.getContextDefinitions = async (req, res) => {
    try {
        const query = `
            SELECT context_id, context_name, definitions_type
            FROM t_inshe_context_definitions 
        `;
        const result = await simpleQuery(query, []);
        res.status(200).json({ historyContextData: result });
    } catch (error) {
        console.error("Error fetching context definitions:", error);
        res.status(500).json({ error: "An error occurred while fetching context definitions" });
    }
};

exports.getContextDefinitionById = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT context_id, context_name, parent_context_id, definitions_type, created_at, updated_at, created_by, updated_by, is_deleted
            FROM t_inshe_context_definitions
            WHERE context_id = ?
        `;
        const result = await simpleQuery(query, [id]);
        if (result.length === 0) {
            return res.status(404).json({ message: "Context definition not found" });
        }
        res.status(200).json({ contextDefinition: result[0] });
    } catch (error) {
        console.error("Error fetching context definition:", error);
        res.status(500).json({ error: "An error occurred while fetching context definition" });
    }
};

exports.createContextDefinition = async (req, res) => {
    const { ID } = req.user;
    const { context_name,  definitions_type } = req.body;
    try {
        const query = `
            INSERT INTO t_inshe_context_definitions (context_name, definitions_type, created_at, created_by)
            VALUES (?, ?, NOW(), ?)
        `;
        const result = await simpleQuery(query, [context_name, definitions_type, ID]);
        res.status(201).json({ message: "Context definition created successfully", contextId: result.insertId });
    } catch (error) {
        console.error("Error creating context definition:", error);
        res.status(500).json({ error: "An error occurred while creating context definition" });
    }
};

exports.updateContextDefinition = async (req, res) => {
    const { ID } = req.user;
    const { context_id, context_name, definitions_type } = req.body;

    // Log input values for debugging
    console.log("Received data:", { context_id, context_name, definitions_type, ID });

    // Validate input
    if (!context_id || !context_name || !definitions_type || !ID) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const query = `
            UPDATE t_inshe_context_definitions
            SET context_name = ?, definitions_type = ?, updated_at = NOW(), updated_by = ?
            WHERE context_id = ?
        `;

        // Execute query with the provided inputs
        const result = await simpleQuery(query, [context_name, definitions_type, ID, context_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Context definition not found" });
        }

        res.status(200).json({ message: "Context definition updated successfully" });
    } catch (error) {
        console.error("Error updating context definition:", error);
        res.status(500).json({ error: "An error occurred while updating context definition" });
    }
};


exports.deleteContextDefinition = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            DELETE FROM t_inshe_context_definitions
            WHERE context_id = ?
        `;
        const result = await simpleQuery(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Context definition not found" });
        }
        res.status(200).json({ message: "Context definition deleted successfully" });
    } catch (error) {
        console.error("Error deleting context definition:", error);
        res.status(500).json({ error: "An error occurred while deleting context definition" });
    }
};
