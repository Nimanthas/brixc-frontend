const { pool } = require('../dbconfig');
const moment = require('moment');

module.exports = async (req, res) => {

  const var_itemid = req.params.itemid;

  var sqlqry = `SELECT item_id,plm_item_id,plm_actual,plm_item_name,plm_item_desc,plm_colorway_type,plm_supplier,plm_fab_type,plm_cw,plm_placement,plm_color,vpono,item_price,TO_CHAR(item_ordering::date,'yyyy/mm/dd') as item_ordering,TO_CHAR(item_order_rev1::date,'yyyy/mm/dd') as item_order_rev1,TO_CHAR(item_order_rev2::date,'yyyy/mm/dd') as item_order_rev2,TO_CHAR(item_order_rev3::date,'yyyy/mm/dd') as item_order_rev3,item_comment,gmt_color_order,(SELECT plm_colorways.cw_name FROM plm_colorways WHERE plm_colorways.fabyy_id=plm_items_vpo.fabyy_id AND plm_colorways.cw_order=plm_items_vpo.gmt_color_order) AS cw_name FROM plm_items_vpo WHERE item_id='${var_itemid}'`;
  pool.query(sqlqry, (error, results) => {
    if (error) {
      res.status(200).json({ Type: "ERROR", Msg: error.message })
      return;
    }
    else {
      res.status(200).json({ Type: "SUCCESS", Data: results.rows })
      return;
    }

  })
}