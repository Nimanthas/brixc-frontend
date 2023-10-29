const mongodbclient = require('../../dbconfig');
const settings = require("../../../settings");
const moment = require('moment');
const getzoomrefreshtoken = require('./getzoomrefreshtoken');

module.exports = async (token_id) => {
  try {
    if (!token_id) {
      throw new Error("Oops! Empty data set in header on get tags request.");
    }

    // Get the MongoDB client
    const client = await mongodbclient();

    // Access the database and collection
    let collection = client.db(settings.mongodb_name).collection('token_manager');

    // Build a filter to find the token by _id
    const filter = { token_id: token_id };

    // Find the token document matching the filter
    let tokenDocument = await collection.find(filter).sort({ token_id: -1 }).toArray();

    if (tokenDocument[0] != null) {
      // Get the current time
      const current_time = moment().format('YYYY-MM-DD HH:mm:ss');
      let { token, expired_on } = tokenDocument[0];

      // Convert the 'expired_on' field to a Date object
      const _expired_on = moment(expired_on, 'YYYY-MM-DD HH:mm:ss');

      // Calculate the difference in seconds
      const differenceInSeconds = _expired_on.diff(current_time, 'seconds');

      // Check for remaining time in the token
      if (differenceInSeconds < 5) {

        token = await getzoomrefreshtoken(token, filter);

        // Update the token in the MongoDB collection
        await collection.updateOne(filter, { $set: { token: token } });
      }

      // Close the MongoDB client when done
      //client.close();
      // Return the token
      return token;
    } else {
      throw new Error("Token not found");
    }
  } catch (error) {
    throw new Error(`Error in getting or updating the token details: ${error.message}`);
  }
};
