const { pool } = require('../dbconfig');

module.exports = async (req, res) => {
  let results = [];
  try {
    // Get fabricyyid from request parameters
    const { fabyyid } = req.params;

    //Check the validity of fabyyid
    if (!fabyyid) {
      throw new Error("Oops! empty data set in header on get size templates from database for the fabric yy request.");
    }

    const sqlqry = `SELECT temp_id, temp_name 
                  FROM sys_sizetemplate 
                  INNER JOIN fabricyy_master ON sys_sizetemplate.cus_id = fabricyy_master.cus_id
                  WHERE temp_active = 'true' AND fabricyy_master.fabyy_id = '${fabyyid}' 
                  ORDER BY temp_name;`;

    results = await pool.query(sqlqry);
  } catch (error) {
    console.log("error in getsizetemplates: ", error);
    // Handle errors by sending error response with error message
    res.status(200).json({ Type: "ERROR", Msg: error.message });
  } finally {
    // Send successful response with result rows
    res.status(200).json({ Type: "SUCCESS", Data: results.rows });
  }
};
