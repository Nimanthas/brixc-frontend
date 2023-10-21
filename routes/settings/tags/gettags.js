const { pool } = require('../../dbconfig');

module.exports = async (req, res) => {
  try {
    // Get tag_id from request parameters
    const { tag_id } = req.params;

    // Check the validity of tag_id
    if (!tag_id) {
      throw new Error("Oops! empty data set in header on get tags request.");
    }

    let sqlqry = `
      SELECT tag_type, tag_id, tag_name, tag_status, last_updated
      FROM public.master_tags
      ${tag_id === '0' ? '' : `WHERE tag_id = ${tag_id}`}
      ORDER BY last_updated DESC;`;

    const { rows } = await pool.query(sqlqry);

    // Send successful response with result rows
    res.status(200).json({ type: "SUCCESS", data: rows });
  } catch (error) {
    // Handle errors by sending an error response with an error message
    res.status(200).json({ type: "ERROR", message: error.message });
  }
};
