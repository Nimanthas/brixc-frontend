const { pool } = require('../dbconfig');

module.exports = async (req, res) => {
  let results = [];
  try {
    // Get fabricyyid from request parameters
    const { item_id } = req.params;

    //Check the validity of itemid
    if (!item_id) {
      throw new Error("Oops! empty data set in header on get olr items in database for the item id." + item_id);
    }

    const sqlqry = `SELECT * FROM olr_items WHERE olr_item_id='${item_id}';`;

    results = await pool.query(sqlqry);
  } catch (error) {
    console.log("error in getplmcolorways: ", error);
    // Handle errors by sending error response with error message
    res.status(200).json({ Type: "ERROR", Msg: error.message });
  } finally {
    // Send successful response with result rows
    res.status(200).json({ Type: "SUCCESS", Data: results.rows, Msg: 'Successful' });
  }
};
