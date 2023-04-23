const { pool } = require('../dbconfig');
const moment = require('moment');

//Checked: 4/4/23
module.exports = async (req, res) => {

  //Check oarameter is empty
  if (req.params === undefined && req.params === null) 
  {
    res.status(200).json({ Type: "ERROR", Msg: "Oops! Empty Data Set in Hedaer on Get OLR Data" });
    return;
  }

  //Set varaiables from body parameters
  const var_fabyyid = req.params.fabyyid != null && req.params.fabyyid != undefined ? req.params.fabyyid : "";

  //Init variables
  var sqlqry = "";
  var sqlqry02 = "";

  if (var_fabyyid != "")   //Query 01: get PLM related data for Fabric YY request Id
  {
    sqlqry = `SELECT *,
    COALESCE(s1_qty,0)+ COALESCE(s2_qty,0)+ COALESCE(s3_qty,0)+ COALESCE(s4_qty,0)+ COALESCE(s5_qty,0)+ COALESCE(s6_qty,0)+ COALESCE(s7_qty,0)+
    COALESCE(s8_qty,0)+ COALESCE(s9_qty,0)+ COALESCE(s10_qty,0)+ COALESCE(s11_qty,0)+ COALESCE(s12_qty,0)+ COALESCE(s13_qty,0)+ COALESCE(s14_qty,0)+ 
    COALESCE(s15_qty,0)+COALESCE(s16_qty,0)+ COALESCE(s17_qty,0)+ COALESCE(s18_qty,0)+ COALESCE(s19_qty,0)+ COALESCE(s20_qty,0)+ COALESCE(s21_qty,0)+
    COALESCE(s22_qty,0)+ COALESCE(s23_qty,0)+ COALESCE(s24_qty,0)+ COALESCE(s25_qty,0)+ COALESCE(s26_qty,0)+ COALESCE(s27_qty,0)+ COALESCE(s28_qty,0)+
    COALESCE(s29_qty,0)+ COALESCE(s30_qty,0) as sub_total FROM olr_items WHERE fabyy_id='${var_fabyyid}' ORDER BY color, vpono;`;

    sqlqry02 = `SELECT * FROM public.olr_data where fabyy_id='${var_fabyyid}';`;
  }
  else 
  {
    res.status(200).json({ Type: "ERROR", Msg: "Oops! Can't Find Correct Query Combination for Get OLR Size Data in Database" });
    return;
  }

  if (sqlqry != "")    //Check for avalability of query
  {
    pool.query(sqlqry, (error, results) => {
      if (error) {
        res.status(200).json({ Type: "ERROR", Msg: error.message })
        return;
      }
      else {
        if(results.rows != null && results.rows != undefined && results.rows.length > 0) {
          res.status(200).json({ Type: "SUCCESS", Data: results.rows })
          return;
        } else {
          pool.query(sqlqry02, (error02, results02) => {
            if (error02) {
              res.status(200).json({ Type: "ERROR", Msg: error02.message })
              return;
            }
            else {
              if(results02.rows != null && results02.rows != undefined && results02.rows.length > 0) {
                res.status(200).json({ Type: "SUCCESS", Data: results02.rows })
                return;
              } else {
                res.status(200).json({ Type: "ERROR", Msg: "Error on getting data" })
                return;
              }
            }
          })
        }
      }
    })
  }
  else   //If query is blank
  {
    res.status(200).json({ Type: "ERROR", Msg: "Oops! Can't Find Correct Query Get OLR Data in Database" });
    return;
  }
}