const { pool } = require('../dbconfig');

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

  if (var_fabyyid != "")   //Query 01: get plm colorways by fabric yy id
  {
    sqlqry =`SELECT plm_cw_id,cw_name,cw_desc,colorway,garmentway,cw_order FROM plm_colorways WHERE fabyy_id='${var_fabyyid}' ORDER BY cw_order;`;
  }
  else 
  {
    res.status(200).json({ Type: "ERROR", Msg: "Oops! Can't Find Correct Query Combination for Get PLM Colorways in Database" });
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
    res.status(200).json({ Type: "ERROR", Msg: "Oops! Can't Find Correct Query Get PLM Colorways by Request ID" });
    return;
  }
};