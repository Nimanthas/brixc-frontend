const { pool } = require('../dbconfig');

module.exports = async (req, res) => {

  const client = await pool.connect();

  try {
    const { fabyyid } = req.params;

    await client.query('BEGIN');

    const sqlqry_selectolr = `SELECT fabyy_id, color FROM olr_items WHERE fabyy_id='${fabyyid}' GROUP BY fabyy_id, color;`;
    const results_selectolr = await client.query(sqlqry_selectolr);

    await Promise.all(results_selectolr.rows.map(async ({ fabyy_id, color }) => {
      const sqlqry_updateolr = `UPDATE olr_items SET graphic=subqry.graphicno FROM 
        (SELECT string_agg(DISTINCT plm_item_desc, ',') AS graphicno FROM plm_items 
        WHERE plm_fab_type='Embellishments and Graphics' AND fabyy_id='${fabyy_id}' AND gmt_color_order IN 
        (SELECT cw_order FROM plm_colorways WHERE fabyy_id='${fabyy_id}' AND UPPER(cw_name)=UPPER('${color}'))) AS subqry 
        WHERE fabyy_id='${fabyy_id}' AND UPPER(color)=UPPER('${color}');`;

      await client.query(sqlqry_updateolr);
    }));

    await client.query('COMMIT');

  } catch (error) {
    await client.query('ROLLBACK');
    res.status(200).json({ Type: 'ERROR', Msg: 'an error occurred while syncing graphic details.' + error.message });
  } finally {
    client.release();
    res.status(200).json({ Type: 'SUCCESS', Msg: 'graphic details syncing completed.' });
  }
};
