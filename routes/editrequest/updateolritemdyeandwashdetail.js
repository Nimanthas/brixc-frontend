const { pool } = require('../dbconfig');

module.exports = async (req, res) => {

  const client = await pool.connect();

  try {
    const { fabyyid } = req.params;

    await client.query('BEGIN');

    const sqlqry_selectolr = `SELECT fabyy_id, color FROM olr_items WHERE fabyy_id='${fabyyid}' GROUP BY fabyy_id, color;`;
    const results_selectolr = await client.query(sqlqry_selectolr);

    await Promise.all(results_selectolr.rows.map(async ({ fabyy_id, color }) => {
      const sqlqry_updateolr = `UPDATE olr_items SET wash_dye = subqry.washdye FROM 
        (SELECT string_agg(Distinct(plm_item_desc), ',') AS washdye FROM plm_items 
        WHERE plm_fab_type='Washes and Finishes' AND fabyy_id='${fabyy_id}' AND gmt_color_order IN 
        (SELECT cw_order FROM plm_colorways WHERE fabyy_id='${fabyy_id}' AND upper(cw_name)=upper('${color}'))) AS subqry 
        WHERE fabyy_id='${fabyy_id}' AND upper(color)=upper('${color}');`;

      await client.query(sqlqry_updateolr);
    }));

    await client.query('COMMIT');

  } catch (error) {
    await client.query('ROLLBACK');
    res.status(200).json({ Type: 'ERROR', Msg: 'an error occurred while syncing dye and wash details.' + error.message });
  } finally {
    client.release();
    res.status(200).json({ Type: 'SUCCESS', Msg: 'dye and wash details syncing completed.' });
  }
};
