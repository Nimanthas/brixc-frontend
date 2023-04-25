const { pool } = require('../dbconfig');

module.exports = async (req, res) => {

  const var_fabyyid = req.params.fabyyid;
  const var_sizetempid = req.params.sizetempid;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Delete rows from olr_colorset table
    const deleteColorSetQuery = `DELETE FROM olr_colorset WHERE fabyy_id='${var_fabyyid}';`;
    await client.query(deleteColorSetQuery);

    // Insert rows into olr_colorset table
    const insertColorSetQuery = `INSERT INTO olr_colorset(fabyy_id, colorname, flex, vpono, division)
      SELECT fabyy_id, mastcolordesc as colorname, RIGHT(mastcolordesc, 4) as flex, vpono, division
      FROM olr_data WHERE fabyy_id='${var_fabyyid}'
      GROUP BY mastcolordesc, vpono, division, fabyy_id
      ORDER BY mastcolordesc, vpono, division;`;
    await client.query(insertColorSetQuery);

    // Delete rows from olr_sizeset table
    const deleteSizeSetQuery = `DELETE FROM olr_sizeset WHERE fabyy_id='${var_fabyyid}';`;
    await client.query(deleteSizeSetQuery);

    // Insert rows into olr_sizeset table
    const insertSizeSetQuery = `INSERT INTO olr_sizeset(fabyy_id, sizename)
      SELECT olr_data.fabyy_id, olr_data.custsizedesc as sizename
      FROM olr_data JOIN sys_sizeorder
      ON sys_sizeorder.size_name = olr_data.custsizedesc AND sys_sizeorder.temp_id = '${var_sizetempid}'
      WHERE fabyy_id='${var_fabyyid}'
      GROUP BY olr_data.custsizedesc, sys_sizeorder.size_order, olr_data.fabyy_id
      ORDER BY sys_sizeorder.size_order;`;
    await client.query(insertSizeSetQuery);

    // Update yy_desc, yy_item, and yy_season in fabricyy_master table
    const updateYYMasterQuery = `UPDATE fabricyy_master SET yy_desc=subtable.maststyledesc,yy_item=subtable.custstyledesc,yy_season=subtable.season
      FROM (SELECT maststyledesc, custstyledesc, season, fabyy_id
            FROM olr_data
            WHERE fabyy_id ='${var_fabyyid}' LIMIT 1) AS subtable
      WHERE fabricyy_master.fabyy_id =subtable.fabyy_id;`;
    await client.query(updateYYMasterQuery);

    await client.query('COMMIT');

    res.status(200).json({ Type: "SUCCESS", Msg: "Item List Processing Successfully."})
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
    res.status(200).json({ Type: "ERROR", Msg: "Error Processing Item List" });
  } finally {
    client.release();
  }
};
