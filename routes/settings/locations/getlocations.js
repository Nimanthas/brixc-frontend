const { pool } = require('../../dbconfig');

module.exports = async (req, res) => {
  try {
    // Get location_id from request parameters
    const { location_id } = req.params;

    // Check the validity of location_id
    if (!location_id) {
      throw new Error("Oops! empty data set in header on get locations request.");
    }

    let sqlqry = `
      SELECT location_id, location_name, location_address, location_status, last_updated
      FROM public.master_locations
      ${location_id === '0' ? '' : `WHERE location_id = ${location_id}`}
      ORDER BY last_updated DESC;`;

    const { rows } = await pool.query(sqlqry);

    // Send successful response with result rows
    res.status(200).json({ Type: "SUCCESS", Data: rows });
  } catch (error) {
    // Handle errors by sending an error response with an error message
    res.status(200).json({ Type: "ERROR", Msg: error.message });
  }
};
