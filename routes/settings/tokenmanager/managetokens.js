const { pool } = require('../../dbconfig');
const moment = require('moment');
const settings = require("../../../settings");

module.exports = async (req) => {
  try {
    // Check if the request body is empty
    if (Object.keys(req).length === 0) {
      throw new Error('Empty data set');
    }

    // Check if the request body contains exactly 5 elements
    if (Object.keys(req).length !== 7) {
      throw new Error('Incorrect dataset');
    }

    const { token_id, token_type, token_name, token, token_status, option, expires_in } = req;
    const last_updated = moment().format('YYYY-MM-DD HH:mm:ss');
    const expired_on = moment(last_updated, 'YYYY-MM-DD HH:mm:ss').add(expires_in - settings.api_token_expireing_tolerance, 'seconds').format('YYYY-MM-DD HH:mm:ss');

    let sqlqry = '';
    let values = [];

    if (option === 'insert') {
      sqlqry = 'INSERT INTO public.token_manager(token_type, token_name, token, token_status, last_updated, expired_on) VALUES ($1, $2, $3, $4, $5, $6) RETURNING token_id;';
      values = [token_type, token_name, token, token_status, last_updated, expired_on];
    } else if (option === 'update') {
      sqlqry = 'UPDATE public.token_manager SET token_type = $1, token_name = $2, token = $3, token_status = $4, last_updated = $5, expired_on = $6 WHERE token_id = $7 RETURNING token_id;';
      values = [token_type, token_name, token, token_status, last_updated, expired_on, token_id];
    } else if (option === 'delete') {
      sqlqry = 'DELETE FROM public.token_manager WHERE token_id = $1 RETURNING token_id;';
      values = [token_id];
    } else {
      throw new Error('Invalid update option');
    }

    const { rows } = await pool.query(sqlqry, values);
    
    return { rows, expired_on };

  } catch (error) {
    throw new Error('Error in saving token details, ' + error.message);
  }
};
