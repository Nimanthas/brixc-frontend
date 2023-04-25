const { pool } = require('../dbconfig');

module.exports = async (req, res) => {
  let results = [];
  try {
    // Get fabricyyid from request parameters
    const { item_id } = req.params;

    //Check the validity of itemid
    if (!item_id) {
      throw new Error("Oops! empty data set in header on get plm bom items in database for the item id." + item_id);
    }

    const sqlqry = `SELECT iv.item_id,
                      iv.plm_item_id,
                      iv.plm_actual,
                      iv.plm_item_name,
                      iv.plm_item_desc,
                      iv.plm_colorway_type,
                      iv.plm_supplier,
                      iv.plm_fab_type,
                      iv.plm_cw,
                      iv.plm_placement,
                      iv.plm_color,
                      iv.vpono,
                      iv.item_price,
                      iv.item_ordering::date,
                      iv.item_order_rev1::date,
                      iv.item_order_rev2::date,
                      iv.item_order_rev3::date,
                      iv.item_comment,
                      iv.gmt_color_order,
                      pc.cw_name
                    FROM plm_items_vpo iv
                    LEFT JOIN plm_colorways pc ON pc.fabyy_id = iv.fabyy_id AND pc.cw_order = iv.gmt_color_order
                    WHERE iv.item_id = '${item_id}'`;

    results = await pool.query(sqlqry);
  } catch (error) {
    //console.log("error in getplmcolorways: ", error);
    // Handle errors by sending error response with error message
    res.status(200).json({ Type: "ERROR", Msg: error.message });
  } finally {
    // Send successful response with result rows
    res.status(200).json({ Type: "SUCCESS", Data: results.rows, Msg: 'Successful' });
  }
};
