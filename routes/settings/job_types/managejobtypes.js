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

    const { job_type_id, job_type, job_type_status, option } = req.body;
    const last_updated = moment().format('YYYY-MM-DD HH:mm:ss');

    let sqlqry = '';
    let values = [];

    if (option === 'insert') {
      sqlqry = 'INSERT INTO public.master_job_types(job_type, job_type_status, last_updated) VALUES ($1, $2, $3) RETURNING job_type_id;';
      values = [job_type, job_type_status, last_updated];
    } else if (option === 'update') {
      sqlqry = 'UPDATE public.master_job_types SET job_type = $1, job_type_status = $2, last_updated = $3 WHERE job_type_id = $4 RETURNING job_type_id;';
      values = [job_type, job_type_status, last_updated, job_type_id];
    } else if (option === 'delete') {
      sqlqry = 'DELETE FROM public.master_job_types WHERE job_type_id = $1 RETURNING job_type_id;';
      values = [job_type_id];
    } else {
      throw new Error('Invalid update option');
    }

    const { rows } = await pool.query(sqlqry, values);

    res.status(200).json({ Type: 'SUCCESS', Msg: `New job type ${option}ed successfully!`, Data: rows });
  } catch (error) {
    res.status(200).json({ Type: 'ERROR', Msg: error.message });
  }
};
