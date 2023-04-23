const { pool } = require('../dbconfig');

module.exports = async (req, res) => {
  let results = [];
  try {
    const sqlqry = `SELECT fac_id, fac_name FROM sys_factory WHERE fac_active='true' ORDER BY fac_name ASC;`;

    results = await pool.query(sqlqry);
  } catch (error) {
    console.log("error in getfactories: ", error);
    // Handle errors by sending error response with error message
    res.status(200).json({ Type: "ERROR", Msg: error.message });
  } finally {
    // Send successful response with result rows
    res.status(200).json({ Type: "SUCCESS", Data: results.rows });
  }
};
