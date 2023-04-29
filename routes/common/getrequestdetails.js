const { pool } = require('../dbconfig');

module.exports = async (req, res, fabyy_id) => {
  try {
    let sqlqry = "";

    // Check request type and set SQL query accordingly
    sqlqry = `SELECT fabricyy_master.*, fabricyy_details.*, sys_customer.cus_name, sys_factory.fac_name 
                FROM fabricyy_master 
                INNER JOIN sys_customer ON fabricyy_master.cus_id = sys_customer.cus_id 
                INNER JOIN sys_factory ON fabricyy_master.fac_id = sys_factory.fac_id
                LEFT JOIN fabricyy_details ON fabricyy_master.fabyy_id = fabricyy_details.fabyy_id 
                WHERE fabricyy_master.fabyy_status != 'Delete' AND fabricyy_master.fabyy_id = '${fabyy_id}'`;

    // Execute SQL query and send response
    const { rows } = await pool.query(sqlqry);
    return rows[0];
  } catch (error) {
    // Handle errors
    throw new Error(`Error occured when get request details. ${error.message}`);
  }
};
