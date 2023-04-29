const { pool } = require('../dbconfig');

module.exports = async (req, res) => {
  try {
    // Check if request body is empty or has fewer than two keys
    if (!req.body || Object.keys(req.body).length < 2) {
      throw new Error("Invalid request");
    }

    // Get variables from request body
    const { username = "", fabyyid = "" } = req.body;

    let sqlqry = "";

    // Check request type and set SQL query accordingly
    if (fabyyid === "all" && username) {
      sqlqry = `SELECT fabricyy_master.*, sys_customer.cus_name, sys_factory.fac_name 
                FROM fabricyy_master 
                INNER JOIN sys_customer ON fabricyy_master.cus_id = sys_customer.cus_id 
                INNER JOIN sys_factory ON fabricyy_master.fac_id = sys_factory.fac_id 
                WHERE fabricyy_master.fabyy_status != 'Delete' AND fabricyy_master.username = '${username}' 
                ORDER BY fabricyy_master.fabyy_id DESC`;
    } else if (username && fabyyid) {
      sqlqry = `SELECT fabricyy_master.*, fabricyy_details.*, sys_customer.cus_name, sys_factory.fac_name 
                FROM fabricyy_master 
                INNER JOIN sys_customer ON fabricyy_master.cus_id = sys_customer.cus_id 
                INNER JOIN sys_factory ON fabricyy_master.fac_id = sys_factory.fac_id
                LEFT JOIN fabricyy_details ON fabricyy_master.fabyy_id = fabricyy_details.fabyy_id 
                WHERE fabricyy_master.fabyy_status != 'Delete' AND fabricyy_master.username = '${username}' AND fabricyy_master.fabyy_id = '${fabyyid}'`;
    } else {
      throw new Error("Invalid request");
    }

    // Execute SQL query and send response
    const { rows } = await pool.query(sqlqry);
    res.status(200).json({ Type: "SUCCESS", Data: rows });
  } catch (error) {
    // Handle errors
    res.status(200).json({ Type: "ERROR", Msg: error.message });
  }
};
