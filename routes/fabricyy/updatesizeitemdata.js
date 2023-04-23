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
  const var_gw = req.body.gw;
  const var_plant = req.body.plant;
 
  var sqlqry = `UPDATE olr_items SET garmentway='${var_gw}',prod_plant='${var_plant}' WHERE olr_item_id='${var_itemid}';`;
  console.log('updatesizeitemdata query:'+sqlqry);
  
  pool.query(sqlqry, (error, results) => {
    if (error) {
      res.status(200).json({ Type: "ERROR", Msg: error.message })
      return;
    }
    else {
      res.status(200).json({ Type: "SUCCESS", Msg: "Size Item Updated Successfully!"})
      return;
    }

  })

};