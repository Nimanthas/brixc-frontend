const { pool } = require('../dbconfig');

//Checked: 4/4/23
module.exports = async (req, res) => {

  //Check oarameter is empty
  if (req.params === undefined && req.params === null) 
  {
    res.status(200).json({ Type: "ERROR", Msg: "Oops! Empty Data Set in Hedaer on Get olr file headers by fabric yy request id" });
    return;
  }

  //Set varaiables from body parameters
  const var_fabyyid = req.params.fabyyid != undefined && req.params.fabyyid != null ? req.params.fabyyid : "";

  //Init variables
  var sqlqry = "";

  if (var_fabyyid != "")   //Query 01: get size templates by fabric yy id
  {
    sqlqry = `SELECT header_id, sheet_name, header_name, olr_datahead FROM olr_fileheaders WHERE header_active = 'true' AND cus_id IN (SELECT cus_id FROM fabricyy_master WHERE fabyy_id='${var_fabyyid}') ORDER BY header_id;`;
  }
  else 
  {
    res.status(200).json({ Type: "ERROR", Msg: "Oops! Can't Find Correct Query Combination for Get olr file headers in Database" });
    return;
  }

  if (sqlqry != "")   //Check for avalability of query
  {
    pool.query(sqlqry, (error, results) => {
      if (error) 
      {
        res.status(200).json({ Type: "ERROR", Msg: error.message })
        return;
      }
      else 
      {
        res.status(200).json({ Type: "SUCCESS", Data: results.rows })
        return;
      }
    })
  }
  else  //If query is blank
  {
    res.status(200).json({ Type: "ERROR", Msg: "Oops! Can't Find Correct Query Get olr file headers" });
    return;
  }
}