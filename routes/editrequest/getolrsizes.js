const { pool } = require('../dbconfig');

module.exports = async (req, res) => {
  let results = [];
  try {
    // Get fabricyyid from request parameters
    const { fabyyid } = req.params;

    //Check the validity of fabyyid
    if (!fabyyid) {
      throw new Error("Oops! empty data set in header on get plm items in database for the fabric yy request.");
    }

    const sqlqry = `SELECT sizename 
                  FROM olr_sizeset 
                  WHERE fabyy_id = ${fabyyid};`;

    results = await pool.query(sqlqry);
  } catch (error) {
    console.log("error in getolrsizes: ", error);
    // Handle errors by sending error response with error message
    res.status(200).json({ Type: "ERROR", Msg: error.message });
  } finally {
    // Send successful response with result rows
    res.status(200).json({ Type: "SUCCESS", Data: results.rows });
  }
};
