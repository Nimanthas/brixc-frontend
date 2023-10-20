const { pool } = require('../../dbconfig');
const moment = require('moment');
const getzoomrefreshtoken = require('./getzoomrefreshtoken');

module.exports = async (token_id) => {
  try {
    if (!token_id) {
      throw new Error("Oops! Empty data set in header on get tags request.");
    }

    const sqlqry = `
      SELECT token, expired_on FROM public.token_manager WHERE token_id = '${token_id}' ORDER BY last_updated DESC LIMIT 1;
    `;

    const { rows } = await pool.query(sqlqry);

    if (rows.length > 0) {

      // Create moment objects for current time and expired_on time
      const current_time = moment();
      const expired_on = moment(rows[0].expired_on, 'YYYY-MM-DD HH:mm:ss');

      // Calculate the difference in seconds
      const differenceInSeconds = expired_on.diff(current_time, 'seconds');

      if (differenceInSeconds < 1) {
        rows[0].token = await getzoomrefreshtoken(rows[0]?.token);
      }
    }

    return rows[0]?.token;
  } catch (error) {
    throw new Error(`Error in getting the token details, ${error.message}`);
  }
};
