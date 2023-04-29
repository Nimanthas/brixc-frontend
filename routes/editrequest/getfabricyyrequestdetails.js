const { pool } = require('../dbconfig');

module.exports = async (req, res) => {
    let results = [];
    try {
        // Get fabricyyid from request parameters
        const { fabyyid } = req.params;

        //Check the validity of fabyyid
        if (!fabyyid) {
            throw new Error("Oops! empty data set in header on get fabric yy request details.");
        }

        // Construct SQL query to fetch data
        const sqlqry = `SELECT m.*, d.*, c.cus_name, f.fac_name 
                        FROM fabricyy_master m 
                        INNER JOIN sys_customer c ON m.cus_id = c.cus_id 
                        INNER JOIN sys_factory f ON m.fac_id = f.fac_id
                        LEFT JOIN fabricyy_details d ON m.fabyy_id = d.fabyy_id 
                        WHERE m.fabyy_status != 'Delete' AND m.fabyy_id = '${fabyyid}'`;

        // Execute SQL query and get result rows
        results = await pool.query(sqlqry);
    } catch (error) {
        console.log("error in getfabricyyrequestdetails: ", error);
        // Handle errors by sending error response with error message
        res.status(200).json({ Type: "ERROR", Msg: error.message });
    } finally {
        // Send successful response with result rows
        res.status(200).json({ Type: "SUCCESS", Data: results.rows });
    }
};
