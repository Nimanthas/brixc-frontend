const { pool } = require('../dbconfig');
const { validateRequestBody } = require('./common');

//Checked: 4/4/23
module.exports = async (req, res) => {

  //Check oarameter is empty
  if (req.params === undefined && req.params === null) 
  {
    res.status(200).json({ Type: "ERROR", Msg: "Oops! Empty Data Set in Hedaer on Get Fabric YY Requests" });
    return;
  }

  //Set varaiables from body parameters
  const var_fabyyid = req.params.fabyyid != null && req.params.fabyyid != undefined ? req.params.fabyyid : "";

  //Init variables
  var sqlqry = "";

  if (var_fabyyid === "")   //Query 01: get PLM related data for Fabric YY request Id
  {
      sqlqry =  `SELECT  distinct 
                ( SELECT distinct MAX(item_id) FROM plm_items_vpo a	
                  WHERE a.fabyy_id=b.fabyy_id and a.plm_fab_type='Fabric' and a.plm_item_name = b.plm_item_name	and 
                  a.plm_item_desc = b.plm_item_desc and a.plm_color = b.plm_color	and a.vpono = b.vpono and a.gmt_color_order = b.gmt_color_order
                ) item_id,
                ( SELECT distinct MAX(plm_item_id) FROM plm_items_vpo a	
                  WHERE a.fabyy_id=b.fabyy_id and a.plm_fab_type='Fabric' and a.plm_item_name = b.plm_item_name	and 
                  a.plm_item_desc = b.plm_item_desc and a.plm_color = b.plm_color	and a.vpono = b.vpono and a.gmt_color_order = b.gmt_color_orde- 
                ) plm_item_id,
                plm_actual,
                plm_item_name,
                plm_item_desc,
                plm_colorway_type,
                plm_supplier,
                plm_fab_type,
                plm_cw,
                ( SELECT array_to_string(array( 
                    SELECT distinct plm_placement FROM plm_items_vpo a	
                    WHERE a.fabyy_id=b.fabyy_id  AND a.plm_fab_type='Fabric' and a.plm_item_name = b.plm_item_name  and 
                    a.plm_item_desc = b.plm_item_desc and a.plm_color = b.plm_color	and a.vpono = b.vpono and 
                    a.gmt_color_order = b.gmt_color_order), ',' 
                  )
                ) plm_placement,
                plm_color,
                vpono,
                item_price,
                TO_CHAR(item_ordering::date,'yyyy/mm/dd') as item_ordering,
                TO_CHAR(item_order_rev1::date,'yyyy/mm/dd') as item_order_rev1,
                TO_CHAR(item_order_rev2::date,'yyyy/mm/dd') as item_order_rev2,
                TO_CHAR(item_order_rev3::date,'yyyy/mm/dd') as item_order_rev3,
                item_comment,
                gmt_color_order,
                ( SELECT distinct plm_colorways.cw_name FROM plm_colorways 
                  WHERE plm_colorways.fabyy_id=${var_fabyyid} and plm_colorways.cw_order=b.gmt_color_order limit 1
                ) AS cw_name
            FROM plm_items_vpo b
            WHERE fabyy_id=${var_fabyyid} AND plm_fab_type='Fabric';`;
  }
  else 
  {
    res.status(200).json({ Type: "ERROR", Msg: "Oops! Can't Find Correct Query Combination for Get PLM Data in Database" });
    return;
  }

  if (sqlqry != "")    //Check for avalability of query
  {
    pool.query(sqlqry, (error, results) => {
      if (error)   //if error
      {
        res.status(200).json({ Type: "ERROR", Msg: error.message });
        return;
      }
      else   //if sucess
      {
        res.status(200).json({ Type: "SUCCESS", Data: results.rows });
        return;
      }
    });
  }
  else   //If query is blank
  {
    res.status(200).json({ Type: "ERROR", Msg: "Oops! Can't Find Correct Query Get PLM Data in Database" });
    return;
  }
};