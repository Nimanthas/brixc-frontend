const { pool } = require('../dbconfig');
const moment = require('moment');

module.exports = async (req, res) => {
  try {
    // Check if body is empty
    if (Object.keys(req.body).length === 0) {
      throw new Error('Empty data set');
    }

    // Check if element count is 6
    if (Object.keys(req.body).length !== 6) {
      throw new Error('Incorrect dataset');
    }

    const {
      username: var_username,
      customer: var_customer,
      cus_style_no: var_cus_style_no,
      m3_style_no: var_m3_style_no,
      old_style_no: var_old_style_no,
      factory: var_factory,
    } = req.body;

    const var_crdate = moment().format('YYYY-MM-DD HH:mm:ss');
    const sqlqry = `INSERT INTO fabricyy_master(username, cus_id, fac_id, cus_sty_no, m3_sty_no, old_sty_no, fabyy_status, create_ts,olr_upload,get_plmbom) 
    VALUES ('${var_username}','${var_customer}','${var_factory}','${var_cus_style_no}','${var_m3_style_no}','${var_old_style_no}','Edit','${var_crdate}','false','false') RETURNING fabyy_id;`;

    const { rows } = await pool.query(sqlqry);
    res.status(200).json({ Type: 'SUCCESS', Msg: 'New fabric yy request created successfully! id: ' + rows[0]?.fabyy_id, Data: rows });
  } catch (error) {
    res.status(200).json({ Type: 'ERROR', Msg: error.message });
  }
};
