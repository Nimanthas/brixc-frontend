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

    const sqlqry = `WITH max_item_id AS (
                      SELECT MAX(item_id) AS item_id, MAX(plm_item_id) AS plm_item_id, fabyy_id, plm_item_name, plm_item_desc, plm_color, vpono, gmt_color_order
                      FROM plm_items_vpo
                      WHERE fabyy_id = ${fabyyid} AND plm_fab_type = 'Fabric'
                      GROUP BY fabyy_id, plm_item_name, plm_item_desc, plm_color, vpono, gmt_color_order
                    )
                    SELECT mi.item_id, mi.plm_item_id, pv.plm_actual, pv.plm_item_name, pv.plm_item_desc, pv.plm_colorway_type, pv.plm_supplier, 
                          pv.plm_fab_type, pv.plm_cw, pv.plm_placement, pv.plm_color, pv.vpono, pv.item_price,
                          TO_CHAR(pv.item_ordering::date,'yyyy/mm/dd') AS item_ordering,
                          TO_CHAR(pv.item_order_rev1::date,'yyyy/mm/dd') AS item_order_rev1,
                          TO_CHAR(pv.item_order_rev2::date,'yyyy/mm/dd') AS item_order_rev2,
                          TO_CHAR(pv.item_order_rev3::date,'yyyy/mm/dd') AS item_order_rev3,
                          pv.item_comment, pv.gmt_color_order,
                          (SELECT DISTINCT plm_colorways.cw_name 
                            FROM plm_colorways 
                            WHERE plm_colorways.fabyy_id = ${fabyyid} AND plm_colorways.cw_order = pv.gmt_color_order 
                            LIMIT 1) AS cw_name
                    FROM max_item_id mi
                    JOIN plm_items_vpo pv ON pv.item_id = mi.item_id AND pv.plm_item_name = mi.plm_item_name AND 
                    pv.plm_item_desc = mi.plm_item_desc AND pv.plm_color = mi.plm_color AND 
                    pv.vpono = mi.vpono AND pv.gmt_color_order = mi.gmt_color_order;`;
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
