const { pool } = require('../dbconfig');
const moment = require('moment');

module.exports = async (req, res) => {

  //Check Body Is Empty

  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {

    res.status(200).json({ Type: "ERROR", Msg: "Oops! Empty Data Set." })
    return;

  }

  //Check Element Count

  if (Object.keys(req.body).length != 3) {

    res.status(200).json({ Type: "ERROR", Msg: "Oops! Can't Find Correct Dataset" })
    return;

  }

  const var_itemid = req.body.itemid;
  const var_value = req.body.value;
  const var_field = req.body.datafield;

  var sqlqry = ``;

  if(var_field === "PRICE")
  {
    sqlqry = `UPDATE plm_items_vpo SET item_price='${var_value}' WHERE item_id='${var_itemid}';`;
  }
  else if(var_field === "COMMENT")
  {
    sqlqry = `UPDATE plm_items_vpo SET item_comment='${var_value}' WHERE item_id='${var_itemid}';`;
  }
  else if(var_field === "ORDER1")
  {
    sqlqry = `UPDATE plm_items_vpo SET item_ordering='${var_value}' WHERE item_id='${var_itemid}';`;
  }
  else if(var_field === "ORDER2")
  {
    sqlqry = `UPDATE plm_items_vpo SET item_order_rev1='${var_value}' WHERE item_id='${var_itemid}';`;
  }
  else if(var_field === "ORDER3")
  {
    sqlqry = `UPDATE plm_items_vpo SET item_order_rev2='${var_value}' WHERE item_id='${var_itemid}';`;
  }
  else if(var_field === "ORDER4")
  {
    sqlqry = `UPDATE plm_items_vpo SET item_order_rev3='${var_value}' WHERE item_id='${var_itemid}';`;
  }
  else if(var_field === "ORDER5")
  {
    sqlqry = `UPDATE plm_items_vpo SET item_order_rev4='${var_value}' WHERE item_id='${var_itemid}';`;
  }
  else
  {
    res.status(200).json({ Type: "ERROR", Msg:"Error In Requested Update" })
    return;
  }

  pool.query(sqlqry, (error, results) => {
    if (error) {
      res.status(200).json({ Type: "ERROR", Msg: error.message })
      return;
    }
    else {
      res.status(200).json({ Type: "SUCCESS", Msg: "Item Updated Successfully!", Data: results.rows })
      return;
    }

  })

};