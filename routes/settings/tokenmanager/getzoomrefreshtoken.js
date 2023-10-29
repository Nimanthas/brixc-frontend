// import required modules
const axios = require('axios');
const mongodbclient = require('../../dbconfig');
const settings = require("../../../settings");

// Define the asynchronous function as a request handler
module.exports = async (access_token, filter) => {
  try {
    // Get MongoDB client
    const client = await mongodbclient();

    // Access the database and collection for Zoom connection settings
    const collection = client.db(settings.mongodb_name).collection('zoom_connection_settings');

    // Find the first document and extract the required fields
    const zoomSettings = await collection.find(filter).sort({ token_id: -1 }).toArray();

    if (zoomSettings[0] == null) {
      throw new Error('Zoom connection settings not found in the database.');
    }

    const { zoom_account_id, zoom_client_id, zoom_client_secret } = zoomSettings[0];

    // Create the base64-encoded authorization string
    const authString = `Basic ${Buffer.from(`${zoom_client_id}:${zoom_client_secret}`).toString('base64')}`;

    // Send a POST request to the Zoom API to revoke the previous access token
    // Uncomment the following code when Zoom provides an endpoint to revoke access tokens.
    /*
    await axios.post('https://zoom.us/oauth/revoke', null, {
      headers: {
        'Authorization': authString,
      },
      params: {
        token: access_token,
      },
    });
    */

    // Send a POST request to the Zoom API to obtain a new access token
    const response = await axios.post(`https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${zoom_account_id}`, null, {
      headers: {
        'Authorization': authString,
      },
    });

    const { access_token, token_type, expires_in } = response.data;

    // Update or insert the token into the MongoDB collection
    const tokensCollection = client.db(settings.mongodb_name).collection('token_manager');

    const result = await tokensCollection.updateOne(
      { token_id: 'zoom_api' },
      {
        $set: {
          token_type,
          token_name: 'zoom',
          token: access_token,
          token_status: 10,
          expires_in,
        },
      },
      { upsert: true }
    );

    if (result.modifiedCount === 0 && result.upsertedCount === 0) {
      throw new Error('Failed to update or insert the token into the database.');
    }

    // Close the MongoDB client
    //client.close();

    // Return the token as the response
    return access_token;
  } catch (error) {
    // Send a 500 error response if there's an error and return null
    throw new Error(`Error retrieving Zoom token: ${error.message}`);
  }
};
