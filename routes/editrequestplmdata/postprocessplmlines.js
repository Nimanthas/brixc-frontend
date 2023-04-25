const { pool } = require('../dbconfig');

module.exports = async (req, res) => {
  try {
    const { fabyyid } = req.params;

    await pool.query(`DELETE FROM plm_items_vpo WHERE fabyy_id='${fabyyid}';`);

    const client = await pool.connect()
    await client.query('BEGIN');
    const { rows: results_selectplm } = await pool.query(`SELECT * FROM plm_items WHERE fabyy_id='${fabyyid}' ORDER BY gmt_color_order;`);
    const promises = results_selectplm.map(async ({ fabyy_id, plm_item_id, plm_cw, gmt_color_order, ...valitem }) => {
      Object.entries(valitem).forEach(([key, value]) => {
        valitem[key] = (typeof value === 'string') ? value.replace(/'/g, "''") : value;
      });
      const { rows: results_insertvpo } = await pool.query(`INSERT INTO plm_items_vpo(vpono, fabyy_id, plm_item_id, plm_actual, plm_item_name, plm_item_desc, plm_colorway_type, plm_supplier, 
          plm_fab_type, plm_cw, plm_placement, plm_color, item_comment, gmt_color_order, computecolordesc)
        SELECT vpono,${fabyyid},'${plm_item_id}','${valitem.plm_actual}','${valitem.plm_item_name}',
        '${valitem.plm_item_desc}','${valitem.plm_colorway_type}','${valitem.plm_supplier}',
        '${valitem.plm_fab_type}','${plm_cw}','${valitem.plm_placement}',
        '${valitem.plm_color}','',${gmt_color_order}, computecolordesc
        FROM olr_items
        WHERE fabyy_id='${fabyyid}'
        AND upper(computecolordesc) IN (
          SELECT upper(computecolordesc)
          FROM plm_colorways
          WHERE fabyy_id='${fabyyid}'
          AND cw_order='${gmt_color_order}'
        )
        ORDER BY vpono;
      `);
    });
    await Promise.all(promises);
    await client.query('COMMIT');
    res.status(200).json({ Type: 'SUCCESS', Msg: 'plm material combined with vpo successfully.', Data: results_selectplm });
  } catch (error) {
    await pool.query('ROLLBACK');
    //console.error(err);
    res.status(200).json({ Type: 'ERROR', Msg: 'an error occurred while processing the request to update plm vpo items. ' + error });
  }
};
