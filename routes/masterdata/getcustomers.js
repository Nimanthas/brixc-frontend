const { pool } = require('../dbconfig');

module.exports = async (req, res) => {

  
  var sqlqry =`SELECT cus_id, cus_name FROM sys_customer WHERE cus_active='true' ORDER BY cus_name ASC;`;

  pool.query(sqlqry, (error, results) => {
    if (error) {
      res.status(200).json({ Type: "ERROR", Msg: error.message })
      return;
    }
    else {
      res.status(200).json({ Type: "SUCCESS", Data: results.rows })
      return;
    }

  })

};