const { pool } = require('../dbconfig');

module.exports = async (req, res) => {

  const client = await pool.connect();

  try {
    const { itemid, value, datafield, type } = req?.body;
    const { fabyyid } = req?.params;
    console.log('req?.body: req?.params: ', req?.body, req?.params);

    await client.query('BEGIN');
    let sqlqry_updateplmitem = '';

    if (type === 'all') {
      sqlqry_updateplmitem = `UPDATE plm_items_vpo SET ${datafield} = '${value}' WHERE fabyy_id=${fabyyid};`;
    } else {
      sqlqry_updateplmitem = `UPDATE plm_items_vpo SET ${datafield} = '${value}' WHERE item_id='${itemid}' AND fabyy_id=${fabyyid};`;
    }
    console.log('sqlqry_updateplmitem: ', sqlqry_updateplmitem);
    const results_olritem = await client.query(sqlqry_updateplmitem);

    await client.query('COMMIT');
    res.status(200).json({ Type: 'SUCCESS', Msg: `plm bom item '${datafield}' details update completed.`, Data: results_olritem });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(200).json({ Type: 'ERROR', Msg: 'an error occurred while update plm bom item details.' + error.message });
  } finally {
    client.release();
  }
};


