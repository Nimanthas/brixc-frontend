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

    const sqlqry = `SELECT plm_cw_id, cw_name, cw_desc, colorway, garmentway, cw_order
                  FROM plm_colorways
                  WHERE fabyy_id = ${fabyyid}
                  ORDER BY cw_order;`;

    results = await pool.query(sqlqry);
  } catch (error) {
    console.log("error in getplmcolorways: ", error);
    // Handle errors by sending error response with error message
    res.status(200).json({ Type: "ERROR", Msg: error.message });
  } finally {
    // Send successful response with result rows
    res.status(200).json({ Type: "SUCCESS", Data: results.rows });
  }
};
