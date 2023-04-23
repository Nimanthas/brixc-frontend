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

  const var_fabricyyid = req.body.fabric_yyid;
  const var_orderdate = req.body.orderdate;
  const var_daterev = req.body.daterev;

  var sqlqry = ``;

  if(var_daterev === "ORDER1")
  {
    sqlqry = `UPDATE plm_items_vpo SET item_ordering='${var_orderdate}' WHERE fabyy_id='${var_fabricyyid}';`;
  }
  else if(var_daterev === "ORDER2")
  {
    sqlqry = `UPDATE plm_items_vpo SET item_order_rev1='${var_orderdate}' WHERE fabyy_id='${var_fabricyyid}';`;
  }
  else if(var_daterev === "ORDER3")
  {
    sqlqry = `UPDATE plm_items_vpo SET item_order_rev2='${var_orderdate}' WHERE fabyy_id='${var_fabricyyid}';`;
  }
  else if(var_daterev === "ORDER4")
  {
    sqlqry = `UPDATE plm_items_vpo SET item_order_rev3='${var_orderdate}' WHERE fabyy_id='${var_fabricyyid}';`;
  }
  else if(var_daterev === "ORDER5")
  {
    sqlqry = `UPDATE plm_items_vpo SET item_order_rev4='${var_orderdate}' WHERE fabyy_id='${var_fabricyyid}';`;
  }
  else
  {
    res.status(200).json({ Type: "ERROR", Msg:"Error In Requested ORDERING" })
    return;
  }

  pool.query(sqlqry, (error, results) => {
    if (error) {
      res.status(200).json({ Type: "ERROR", Msg: error.message })
      return;
    }
    else {
      res.status(200).json({ Type: "SUCCESS", Msg: "Order Updated Successfully!", Data: results.rows })
      return;
    }

  })

};