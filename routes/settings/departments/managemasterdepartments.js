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

    const { department_id, department_name, department_status, option } = req.body;
    const last_updated = moment().format('YYYY-MM-DD HH:mm:ss');

    let sqlqry = '';
    let values = [];

    if (option === 'insert') {
      sqlqry = 'INSERT INTO public.master_departments(department_name, department_status, last_updated) VALUES ($1, $2, $3) RETURNING department_id;';
      values = [department_name, department_status, last_updated];
    } else if (option === 'update') {
      sqlqry = 'UPDATE public.master_departments SET department_name = $1, department_status = $2, last_updated = $3 WHERE department_id = $4 RETURNING department_id;';
      values = [department_name, department_status, last_updated, department_id];
    } else if (option === 'delete') {
      sqlqry = 'DELETE FROM public.master_departments WHERE department_id = $1 RETURNING department_id;';
      values = [department_id];
    } else {
      throw new Error('Invalid update option');
    }

    const { rows } = await pool.query(sqlqry, values);

    res.status(200).json({ type: 'SUCCESS', message: `New department ${option}ed successfully!`, data: rows });
  } catch (error) {
    res.status(200).json({ type: 'ERROR', message: error.message });
  }
};
