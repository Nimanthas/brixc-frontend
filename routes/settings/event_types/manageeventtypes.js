const { pool } = require('../../dbconfig');
const moment = require('moment');

module.exports = async (req, res) => {
  try {
    // Check if the request body is empty
    if (Object.keys(req.body).length === 0) {
      throw new Error('Empty data set');
    }

    // Check if the request body contains exactly 4 elements
    if (Object.keys(req.body).length !== 4) {
      throw new Error('Incorrect dataset');
    }

    const { event_type_id, event_type, event_type_status, option } = req.body;
    const last_updated = moment().format('YYYY-MM-DD HH:mm:ss');

    let sqlqry = '';
    let values = [];

    if (option === 'insert') {
      sqlqry = 'INSERT INTO public.master_event_types(event_type, event_type_status, last_updated) VALUES ($1, $2, $3) RETURNING event_type_id;';
      values = [event_type, event_type_status, last_updated];
    } else if (option === 'update') {
      sqlqry = 'UPDATE public.master_event_types SET event_type = $1, event_type_status = $2, last_updated = $3 WHERE event_type_id = $4 RETURNING event_type_id;';
      values = [event_type, event_type_status, last_updated, event_type_id];
    } else if (option === 'delete') {
      sqlqry = 'DELETE FROM public.master_event_types WHERE event_type_id = $1 RETURNING event_type_id;';
      values = [event_type_id];
    } else {
      throw new Error('Invalid update option');
    }

    const { rows } = await pool.query(sqlqry, values);

    res.status(200).json({ Type: 'SUCCESS', Msg: `New event type ${option}ed successfully!`, Data: rows });
  } catch (error) {
    res.status(200).json({ Type: 'ERROR', Msg: error.message });
  }
};
