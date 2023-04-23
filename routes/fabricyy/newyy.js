const { pool } = require('../dbconfig');
const moment = require('moment');

module.exports = async (req, res) => {

  //Check Body Is Empty
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {

    res.status(200).json({ Type: "ERROR", Msg: "Oops! Empty Data Set." })
    return;

  }

  //Check Element Count
  if (Object.keys(req.body).length != 6) {

    res.status(200).json({ Type: "ERROR", Msg: "Oops! Can't Find Correct Dataset" })
    return;

  }

  const var_username = req.body.username;
  const var_customer = req.body.customer;
  const var_cus_style_no = req.body.cus_style_no;
  const var_m3_style_no = req.body.m3_style_no;
  const var_old_style_no = req.body.old_style_no;
  const var_factory = req.body.factory;
  const var_crdate = moment().format("YYYY-MM-DD HH:mm:ss");

  var sqlqry = `INSERT INTO fabricyy_master(username, cus_id, fac_id, cus_sty_no, m3_sty_no, old_sty_no, fabyy_status, create_ts,olr_upload,get_plmbom) 
  VALUES ('${var_username}','${var_customer}','${var_factory}','${var_cus_style_no}','${var_m3_style_no}','${var_old_style_no}','Edit','${var_crdate}','false','false') RETURNING fabyy_id;`;

  pool.query(sqlqry, (error, results) => {
    if (error) {
      res.status(200).json({ Type: "ERROR", Msg: error.message })
      return;
    }
    else {
      res.status(200).json({ Type: "SUCCESS", Msg: "New Fabric YY Create Successfully!", Data: results.rows })
      return;
    }

  })

};