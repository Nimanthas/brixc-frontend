const { pool } = require('../dbconfig');

module.exports = async (req, res) => {

  const client = await pool.connect();

  try {
    const { itemid, gw, plant } = req?.body;

    await client.query('BEGIN');

    const sqlqry_updateolritem = `UPDATE olr_items SET garmentway='${gw}',prod_plant='${plant}' WHERE olr_item_id='${itemid}';`;
    const results_olritem = await client.query(sqlqry_updateolritem);

    await client.query('COMMIT');
    res.status(200).json({ Type: 'SUCCESS', Msg: 'olr size wise item details update completed.', Data: results_olritem });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(200).json({ Type: 'ERROR', Msg: 'an error occurred while update size wise olr item details.' + error.message });
  } finally {
    client.release();
  }
};


