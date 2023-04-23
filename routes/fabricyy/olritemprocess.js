const { pool } = require('../dbconfig');
const moment = require('moment');

module.exports = async (req, res) => {

  const var_fabyyid = req.params.fabyyid;
  const var_sizetempid = req.params.sizetempid;

  var result_del_olrcolor = await deleteRows(`DELETE FROM olr_colorset WHERE fabyy_id='${var_fabyyid}';`);

  var result_ins_olrcolor = await insertRows(`INSERT INTO olr_colorset(fabyy_id, colorname, flex, vpono, division) SELECT fabyy_id,mastcolordesc as colorname,RIGHT(mastcolordesc, 4) as flex,vpono,division FROM olr_data WHERE fabyy_id='${var_fabyyid}' GROUP BY mastcolordesc,vpono,division,fabyy_id ORDER BY mastcolordesc,vpono,division;`)

  var result_del_olrsize = await deleteRows(`DELETE FROM olr_sizeset WHERE fabyy_id='${var_fabyyid}';`);

  var result_ins_olrsize = await insertRows(`INSERT INTO olr_sizeset(fabyy_id, sizename) SELECT olr_data.fabyy_id,olr_data.custsizedesc as sizename FROM olr_data JOIN sys_sizeorder ON sys_sizeorder.size_name = olr_data.custsizedesc AND sys_sizeorder.temp_id = '${var_sizetempid}' WHERE fabyy_id='${var_fabyyid}' GROUP BY olr_data.custsizedesc,sys_sizeorder.size_order,olr_data.fabyy_id ORDER BY sys_sizeorder.size_order;`)
  
  var result_update_yymaster = await insertRows(`UPDATE fabricyy_master SET yy_desc=subtable.maststyledesc,yy_item=subtable.custstyledesc,yy_season=subtable.season FROM (SELECT maststyledesc,custstyledesc,season,fabyy_id FROM olr_data WHERE fabyy_id ='${var_fabyyid}' LIMIT 1) AS subtable WHERE fabricyy_master.fabyy_id =subtable.fabyy_id;`);

  res.status(200).json({ Type: "SUCCESS", Msg: "Item List Processing Successfully."})
  return;

  async function deleteRows(sqlqry_delete){
      try {
          
        const res = await pool.query(sqlqry_delete);
        return ({Type:"SUCCESS" });
      } catch (err) {
        return ({Type:"ERROR" });
      }
  }

  async function insertRows(sqlqry_insert){
        try {
            
          const res = await pool.query(sqlqry_insert);
          return ({Type:"SUCCESS" });
        } catch (err) {
          return ({Type:"ERROR" });
        }
  }

  async function selectFrom(selectqry) {
    try {
      const res = await pool.query(selectqry);
      return ({Type:"SUCCESS", Data: res.rows });
    } catch (err) {
      return ({Type:"ERROR", Data: err.stack });
    }
  }

}