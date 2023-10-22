// import required modules
const axios = require('axios');
const { pool } = require('../../dbconfig');
const managetokens = require('./managetokens');

// define the asynchronous function as a request handler
module.exports = async (access_token) => {
  try {
    
    // execute the database query to fetch sys_plmsettings and extract the required fields from the first row
    const { zoom_account_id, zoom_client_id, zoom_client_secret } = (await pool.query('SELECT zoom_base_url, zoom_account_id, zoom_client_id, zoom_client_secret FROM public.zoom_connection_settings;')).rows[0];

    // Create the base64-encoded authorization string
    const authString = `Basic ${btoa(`${zoom_client_id}:${zoom_client_secret}`)}`;

    // Send a POST request to the Zoom API to revoke the previous access token
    // await axios.post('https://zoom.us/oauth/revoke', null, {
    //   headers: {
    //     'Authorization': authString,
    //   },
    //   params: {
    //     token: access_token, 
    //   },
    // });

    // send a POST request to the PLM API to create a new session and extract the token from the response
    const { data: { access_token, token_type, expires_in, } } = await axios.post(`https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${zoom_account_id}`, null, {
      headers: {
        'Authorization': authString,
      },
    });

    const { rows, expired_on } = await managetokens({ 'token_id': 'zoom_api', 'token_type': token_type, 'token_name': 'zoom', 'token': access_token, 'token_status': 10, 'option': 'update', 'expires_in': expires_in });

    if (!rows?.token_id && !expired_on) {
      throw new Error(`Failed to save the refreshed token into the database.`);
    }

    // return the token as the response
    return access_token;

  } catch (error) {
    // send a 500 error response if there's an error and return null
    // console.log("error in getting plm token: ", error.message);
    throw new Error(`Error retrieving zoom token: ${error.message}`);
  }
};
