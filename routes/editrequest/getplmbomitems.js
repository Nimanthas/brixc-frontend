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

    const sqlqry = `SELECT DISTINCT i.*, c.cw_name AS gmt_color
                  FROM plm_items i
                  INNER JOIN plm_colorways c ON c.fabyy_id = i.fabyy_id AND c.cw_order = i.gmt_color_order
                  WHERE i.fabyy_id = ${fabyyid}
                  ORDER BY i.plm_fab_type, i.plm_placement, gmt_color, c.cw_name;`;

    results = await pool.query(sqlqry);
  } catch (error) {
    console.log("error in getplmitemsindb: ", error);
    // Handle errors by sending error response with error message
    res.status(200).json({ Type: "ERROR", Msg: error.message });
  } finally {
    // Send successful response with result rows
    res.status(200).json({ Type: "SUCCESS", Data: results.rows });
  }
};
