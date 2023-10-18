const { pool } = require('../../dbconfig');

module.exports = async (req, res) => {
  try {
    // Get location_id from request parameters
    const { job_type_id } = req.params;

    // Check the validity of location_id
    if (!job_type_id) {
      throw new Error("Oops! empty data set in header on get job types request.");
    }

    let sqlqry = `
      SELECT job_type_id, job_type, job_type_status, last_updated
      FROM public.master_job_types
      ${job_type_id === '0' ? '' : `WHERE job_type_id = ${job_type_id}`}
      ORDER BY last_updated DESC;`;

    const { rows } = await pool.query(sqlqry);

    // Send successful response with result rows
    res.status(200).json({ Type: "SUCCESS", Data: rows });
  } catch (error) {
    // Handle errors by sending an error response with an error message
    res.status(200).json({ Type: "ERROR", Msg: error.message });
  }
};
