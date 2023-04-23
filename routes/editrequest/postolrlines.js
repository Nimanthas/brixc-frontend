const { pool } = require('../dbconfig');
const moment = require('moment');

module.exports = async (req, res) => {

  const var_fabyyid = req.params.fabyyid;
  const var_sizetempid = req.params.sizetempid;

  try {
    const client = await pool.connect();
    await client.query('BEGIN');

    const qry_del_olritems = `DELETE FROM olr_items WHERE fabyy_id='${var_fabyyid}';`;
    await client.query(qry_del_olritems);

    const qry_get_olrcolor = `SELECT colorname,flex,vpono,division FROM olr_colorset WHERE fabyy_id='${var_fabyyid}' ORDER BY colorname,vpono,division;`;
    const result_get_olrcolor = await client.query(qry_get_olrcolor);

    const qry_get_olrsizes = `SELECT sizename FROM olr_sizeset JOIN sys_sizeorder ON sys_sizeorder.size_name = olr_sizeset.sizename AND sys_sizeorder.temp_id = '${var_sizetempid}' WHERE fabyy_id='${var_fabyyid}' ORDER BY sys_sizeorder.size_order;`;
    const result_get_olrsizes = await client.query(qry_get_olrsizes);

    const insertPromises = result_get_olrcolor.rows.map(async (row_olrcolor) => {
      const obj_olrcolor = row_olrcolor;

      const insertrow = await client.query(`INSERT INTO olr_items(fabyy_id,color, flex, vpono, division, garmentway, prod_plant) VALUES ('${var_fabyyid}','${obj_olrcolor.colorname}','${obj_olrcolor.flex}','${obj_olrcolor.vpono}','${obj_olrcolor.division}','','');`);
      let valinc = 0;

      await Promise.all(result_get_olrsizes.rows.map(async (row_olrsizes) => {
        const obj_olrsizes = row_olrsizes;
        valinc = valinc+1;

        const qry_update = `UPDATE olr_items SET s${valinc}_name='${obj_olrsizes.sizename}', s${valinc}_qty=temptable.orderqty FROM (SELECT COALESCE(SUM(orderqty),0) as orderqty FROM olr_data WHERE fabyy_id='${var_fabyyid}' AND mastcolordesc='${obj_olrcolor.colorname}' AND custsizedesc='${obj_olrsizes.sizename}' AND vpono='${obj_olrcolor.vpono}') AS temptable WHERE fabyy_id='${var_fabyyid}' AND color='${obj_olrcolor.colorname}' AND vpono='${obj_olrcolor.vpono}';`
        await client.query(qry_update);
      }));
    });

    await Promise.all(insertPromises);
    await client.query('COMMIT');
    res.status(200).json({ Type: "SUCCESS", Msg: "Item List Successfully Added."})
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(200).json({ Type: "ERROR", Msg: error.message });
  } finally {
    client.release();
  }
};
