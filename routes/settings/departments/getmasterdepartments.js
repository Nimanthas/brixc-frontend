const { pool } = require('../../dbconfig');

module.exports = async (req, res) => {
  try {
    // Get department_id from request parameters
    const { department_id } = req.params;

    // Check the validity of department_id
    if (!department_id) {
      throw new Error("Oops! empty data set in header on get job types request.");
    }

    let sqlqry = `
      SELECT department_name, department_id, department_status, last_updated
      FROM public.master_event_types
      ${department_id === '0' ? '' : `WHERE department_id = ${department_id}`}
      ORDER BY last_updated DESC;`;

    const { rows } = await pool.query(sqlqry);

    // Send successful response with result rows
    res.status(200).json({ Type: "SUCCESS", Data: rows });
  } catch (error) {
    // Handle errors by sending an error response with an error message
    res.status(200).json({ Type: "ERROR", Msg: error.message });
  }
};
