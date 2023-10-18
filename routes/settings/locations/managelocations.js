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

    const { location_id, location_name, location_address, location_status, option } = req.body;
    const last_updated = moment().format('YYYY-MM-DD HH:mm:ss');

    let sqlqry = '';
    let values = [];

    if (option === 'insert') {
      sqlqry = 'INSERT INTO public.master_locations(location_name, location_address, location_status, last_updated) VALUES ($1, $2, $3, $4) RETURNING location_id;';
      values = [location_name, location_address, location_status, last_updated];
    } else if (option === 'update') {
      sqlqry = 'UPDATE public.master_locations SET location_name = $1, location_address = $2, location_status = $3, last_updated = $4 WHERE location_id = $5 RETURNING location_id;';
      values = [location_name, location_address, location_status, last_updated, location_id];
    } else if (option === 'delete') {
      sqlqry = 'DELETE FROM public.master_locations WHERE location_id = $1 RETURNING location_id;';
      values = [location_id];
    } else {
      throw new Error('Invalid update option');
    }

    const { rows } = await pool.query(sqlqry, values);

    res.status(200).json({ Type: 'SUCCESS', Msg: `New location ${option}ed successfully!`, Data: rows });
  } catch (error) {
    res.status(200).json({ Type: 'ERROR', Msg: error.message });
  }
};
