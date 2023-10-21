const { pool } = require('../../dbconfig');
const moment = require('moment');

module.exports = async (req, res) => {
  try {
    // Check if the request body is empty
    if (Object.keys(req.body).length === 0) {
      throw new Error('Empty data set');
    }

    // Check if the request body contains exactly 5 elements
    if (Object.keys(req.body).length !== 5) {
      throw new Error('Incorrect dataset');
    }

    const { tag_type, tag_id, tag_name, tag_status, option } = req.body;
    const last_updated = moment().format('YYYY-MM-DD HH:mm:ss');

    let sqlqry = '';
    let values = [];

    if (option === 'insert') {
      sqlqry = 'INSERT INTO public.master_tags(tag_type, tag_name, tag_status, last_updated) VALUES ($1, $2, $3, $4) RETURNING tag_id;';
      values = [tag_type, tag_name, tag_status, last_updated];
    } else if (option === 'update') {
      sqlqry = 'UPDATE public.master_tags SET tag_type = $1, tag_name = $2, tag_status = $3, last_updated = $4 WHERE tag_id = $5 RETURNING tag_id;';
      values = [tag_type, tag_name, tag_status, last_updated, tag_id];
    } else if (option === 'delete') {
      sqlqry = 'DELETE FROM public.master_tags WHERE tag_id = $1 RETURNING tag_id;';
      values = [tag_id];
    } else {
      throw new Error('Invalid update option');
    }

    const { rows } = await pool.query(sqlqry, values);

    res.status(200).json({ type: 'SUCCESS', message: `New tag ${option}ed successfully!`, data: rows });
  } catch (error) {
    res.status(200).json({ type: 'ERROR', message: error.message });
  }
};
