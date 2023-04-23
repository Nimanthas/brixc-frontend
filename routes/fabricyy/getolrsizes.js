const { pool } = require('../dbconfig');
const moment = require('moment');

//Checked: 4/4/23
module.exports = async (req, res) => {

  //Check oarameter is empty
  if (req.params === undefined && req.params === null) 
  {
    res.status(200).json({ Type: "ERROR", Msg: "Oops! Empty Data Set in Hedaer on Get PLM Colorways by Request ID" });
    return;
  }

  //Set varaiables from body parameters
  const var_fabyyid = req.params.fabyyid != undefined && req.params.fabyyid != null ? req.params.fabyyid : "";

  //Init variables
  var sqlqry = ""

  if (var_fabyyid != "")   //Query 01: get olr sizes by fabric yy id
  {
    sqlqry = `SELECT sizename FROM olr_sizeset WHERE fabyy_id='${var_fabyyid}';`;
  }
  else 
  {
    res.status(200).json({ Type: "ERROR", Msg: "Oops! Can't Find Correct Query Combination for Get Olr Sizes in Database" });
    return;
  }

  if (sqlqry != "")   //Check for avalability of query
  {
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
  else  //If query is blank
  {
    res.status(200).json({ Type: "ERROR", Msg: "Oops! Can't Find Correct Query Get Olr Sizes by Request ID" });
    return;
  }
};