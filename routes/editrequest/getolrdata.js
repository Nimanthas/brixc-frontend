const { pool } = require('../dbconfig');
const moment = require('moment');

// define the function as async to allow for the use of await
module.exports = async (req, res) => {
  // Get fabricyyid from request parameters
  const { fabyyid } = req.params;

  // Check if req.params is undefined or null
  if (!fabyyid) {
    res.status(200).json({ Type: "ERROR", Msg: "Oops! empty data set in header on get olr data in database for the fabric yy request." });
    return;
  }

  try {
    //define queries
    const sqlqry01 = `WITH sub_totals AS (
                    SELECT 
                      olr_item_id, 
                      COALESCE(s1_qty, 0) + COALESCE(s2_qty, 0) + COALESCE(s3_qty, 0) + COALESCE(s4_qty, 0) + COALESCE(s5_qty, 0) + 
                      COALESCE(s6_qty, 0) + COALESCE(s7_qty, 0) + COALESCE(s8_qty, 0) + COALESCE(s9_qty, 0) + COALESCE(s10_qty, 0) + 
                      COALESCE(s11_qty, 0) + COALESCE(s12_qty, 0) + COALESCE(s13_qty, 0) + COALESCE(s14_qty, 0) + COALESCE(s15_qty, 0) + 
                      COALESCE(s16_qty, 0) + COALESCE(s17_qty, 0) + COALESCE(s18_qty, 0) + COALESCE(s19_qty, 0) + COALESCE(s20_qty, 0) + 
                      COALESCE(s21_qty, 0) + COALESCE(s22_qty, 0) + COALESCE(s23_qty, 0) + COALESCE(s24_qty, 0) + COALESCE(s25_qty, 0) + 
                      COALESCE(s26_qty, 0) + COALESCE(s27_qty, 0) + COALESCE(s28_qty, 0) + COALESCE(s29_qty, 0) + COALESCE(s30_qty, 0) AS sub_total 
                    FROM olr_items 
                    WHERE fabyy_id = ${fabyyid}
                  )
                  SELECT 
                    oi.*, 
                    st.sub_total 
                  FROM olr_items oi 
                  JOIN sub_totals st ON oi.olr_item_id = st.olr_item_id 
                  WHERE oi.fabyy_id = ${fabyyid}
                  ORDER BY oi.color, oi.vpono;`;
    const sqlqry02 = `SELECT * FROM public.olr_data WHERE fabyy_id = ${fabyyid};`;

    // use Promise.all to execute both SQL queries in parallel
    const [results01, results02] = await Promise.all([pool.query(sqlqry01), pool.query(sqlqry02)]);

    // check if either of the query results contain rows
    if (results01.rows?.length) {
      res.status(200).json({ Type: "SUCCESS", Data: results01.rows });
    } else if (results02.rows?.length) {
      res.status(200).json({ Type: "SUCCESS", Data: results02.rows });
    } else {
      res.status(200).json({ Type: "ERROR", Msg: "Oops! error on getting olr data in database for the fabric yy request" });
    }
  } catch (error) {
    res.status(200).json({ Type: "ERROR", Msg: error.message });
  }
}
