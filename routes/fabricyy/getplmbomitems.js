const { pool } = require('../dbconfig');

//Checked: 4/4/23
module.exports = async (req, res) => {

  //Check oarameter is empty
  if (req.params === undefined && req.params === null) 
  {
    res.status(200).json({ Type: "ERROR", Msg: "Oops! Empty Data Set in Hedaer on Get PLM BOM Items by Request ID" });
    return;
  }

  //Set varaiables from body parameters
  const var_fabyyid = req.params.fabyyid != undefined && req.params.fabyyid != null ? req.params.fabyyid : "";

  //Init variables
  var sqlqry = ""

  if (var_fabyyid != "")   //Query 01: get plm bom items by fabric yy id
  {
    var sqlqry = `SELECT distinct plm_items.*,plm_colorways.cw_name as gmt_color
                  FROM plm_items 
                  inner join  plm_colorways on plm_colorways.fabyy_id = plm_items.fabyy_id AND plm_colorways.cw_order = plm_items.gmt_color_order
                  WHERE plm_items.fabyy_id=${var_fabyyid} ORDER BY plm_fab_type,plm_placement,gmt_color,plm_colorways.cw_name;`;
  }
  else 
  {
    res.status(200).json({ Type: "ERROR", Msg: "Oops! Can't Find Correct Query Combination for Get PLM BOM Items in Database" });
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
    res.status(200).json({ Type: "ERROR", Msg: "Oops! Can't Find Correct Query Get PLM BOM Items by Request ID" });
    return;
  }
};