// import required modules
const axios = require('axios');
const { pool } = require('../dbconfig');

// define the asynchronous function as a request handler
module.exports = async (req, res) => {
  try {
    // execute the database query to fetch sys_plmsettings and extract the required fields from the first row
    const { plmurl, plmuser, plmpassword } = (await pool.query('SELECT * FROM sys_plmsettings;')).rows[0];

    // send a POST request to the PLM API to create a new session and extract the token from the response
    const { data: { token } } = await axios.post(`${plmurl}/csi-requesthandler/api/v2/session`, {
      username: plmuser,
      password: plmpassword,
    });

    // return the token as the response
    return token;
  } catch (error) {
    // send a 500 error response if there's an error and return null
    //console.log("error in getting plm token: ", error.message);
    throw new Error('Error retrieving PLM token: ' + error.message);
  }
};
