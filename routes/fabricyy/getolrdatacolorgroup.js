const { pool } = require('../dbconfig');
const moment = require('moment');

module.exports = async (req, res) => {

  const var_fabyyid = req.params.fabyyid;

  var sqlqry =`SELECT color,sum(s1_qty) as s1_qty,
	sum(s2_qty) as s2_qty,
	sum(s3_qty) as s3_qty,
	sum(s4_qty) as s4_qty,
	sum(s5_qty) as s5_qty,
	sum(s6_qty) as s6_qty,
	sum(s7_qty) as s7_qty,
	sum(s8_qty) as s8_qty,
	sum(s9_qty) as s9_qty,
	sum(s10_qty) as s10_qty,
	sum(s11_qty) as s11_qty,
	sum(s12_qty) as s12_qty,
	sum(s13_qty) as s13_qty,
	sum(s14_qty) as s14_qty,
	sum(s15_qty) as s15_qty,
	sum(s16_qty) as s16_qty,
	sum(s17_qty) as s17_qty,
	sum(s18_qty) as s18_qty,
	sum(s19_qty) as s19_qty,
	sum(s20_qty) as s20_qty,
	sum(s21_qty) as s21_qty,
	sum(s22_qty) as s22_qty,
	sum(s23_qty) as s23_qty,
	sum(s24_qty) as s24_qty,
	sum(s25_qty) as s25_qty,
	sum(s26_qty) as s26_qty,
	sum(s27_qty) as s27_qty,
	sum(s28_qty) as s28_qty,
	sum(s29_qty) as s29_qty,
	sum(s30_qty) as s30_qty, 
  SUM(COALESCE(s1_qty,0)+COALESCE(s2_qty,0)+COALESCE(s3_qty,0)+COALESCE(s4_qty,0)+
  COALESCE(s5_qty,0)+COALESCE(s6_qty,0)+COALESCE(s7_qty,0)+COALESCE(s8_qty,0)+
  COALESCE(s9_qty,0)+COALESCE(s10_qty,0)+COALESCE(s11_qty,0)+COALESCE(s12_qty,0)+
  COALESCE(s13_qty,0)+COALESCE(s14_qty,0)+COALESCE(s15_qty,0)+COALESCE(s16_qty,0)+
  COALESCE(s17_qty,0)+COALESCE(s18_qty,0)+COALESCE(s19_qty,0)+COALESCE(s20_qty,0)+
  COALESCE(s21_qty,0)+COALESCE(s22_qty,0)+COALESCE(s23_qty,0)+COALESCE(s24_qty,0)+
  COALESCE(s25_qty,0)+COALESCE(s26_qty,0)+COALESCE(s27_qty,0)+COALESCE(s28_qty,0)+
  COALESCE(s29_qty,0)+COALESCE(s30_qty,0)) as sub_total FROM olr_items WHERE fabyy_id='${var_fabyyid}' GROUP BY color ORDER BY color;`;

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