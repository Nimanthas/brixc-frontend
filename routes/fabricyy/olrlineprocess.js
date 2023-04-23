const { pool } = require('../dbconfig');
const moment = require('moment');

module.exports = async (req, res) => {

  const var_fabyyid = req.params.fabyyid;
  const var_sizetempid = req.params.sizetempid;

  var qry_del_olritems = `DELETE FROM olr_items WHERE fabyy_id='${var_fabyyid}';`;

  var result_del_olritems = await query(qry_del_olritems);

  var qry_get_olrcolor = `SELECT colorname,flex,vpono,division FROM apiurl WHERE fabyy_id='${var_fabyyid}' ORDER BY colorname,vpono,division;`;

  var result_get_olrcolor = await query(qry_get_olrcolor);

  var qry_get_olrsizes = `SELECT sizename FROM olr_sizeset JOIN sys_sizeorder ON sys_sizeorder.size_name = olr_sizeset.sizename AND sys_sizeorder.temp_id = '${var_sizetempid}' WHERE fabyy_id='${var_fabyyid}' ORDER BY sys_sizeorder.size_order;`;

  var result_get_olrsizes = await query(qry_get_olrsizes);

      for (var row_olrcolor in result_get_olrcolor.rows)
      {
        var obj_olrcolor = result_get_olrcolor.rows[row_olrcolor];
        
        var insertrow = await query(`INSERT INTO olr_items(fabyy_id,color, flex, vpono, division, garmentway, prod_plant) VALUES ('${var_fabyyid}','${obj_olrcolor.colorname}','${obj_olrcolor.flex}','${obj_olrcolor.vpono}','${obj_olrcolor.division}','','');`);
        var valinc = 0;

        for (var row_olrsizes in result_get_olrsizes.rows)
        {
          var obj_olrsizes = result_get_olrsizes.rows[row_olrsizes];
          valinc = valinc+1;

          var qry_update = `UPDATE olr_items SET s${valinc}_name='${obj_olrsizes.sizename}', s${valinc}_qty=temptable.orderqty FROM (SELECT COALESCE(SUM(orderqty),0) as orderqty FROM olr_data WHERE fabyy_id='${var_fabyyid}' AND mastcolordesc='${obj_olrcolor.colorname}' AND custsizedesc='${obj_olrsizes.sizename}' AND vpono='${obj_olrcolor.vpono}') AS temptable WHERE fabyy_id='${var_fabyyid}' AND color='${obj_olrcolor.colorname}' AND vpono='${obj_olrcolor.vpono}';`
      
          var result_update_olritems = await query(qry_update);
        }
      }
      
      res.status(200).json({ Type: "SUCCESS", Msg: "Item List Successfully Added."})
      return;
      
  //Postgres Query Run With Async Await
  async function query(query) {
    const client = await pool.connect()
    let res
    try {
      await client.query('BEGIN');
      try 
      {
        res = await client.query(query)
        await client.query('COMMIT');
      } 
      catch (error) 
      {
        await client.query('ROLLBACK');
        res.status(200).json({ Type: "ERROR", Msg: error.message });
      }
    } 
    finally 
    {
      client.release();
      return res;
    }
  }

}