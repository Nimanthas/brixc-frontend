const { MongoClient } = require('mongodb');
const settings = require("../../../settings");

module.exports = async (req) => {
  try {
    // Check if the request body is empty
    if (Object.keys(req).length === 0) {
      throw new Error('Empty data set');
    }

    // Check if the request body contains exactly 7 elements
    if (Object.keys(req).length !== 7) {
      throw new Error('Incorrect dataset');
    }

    const { token_id, token_type, token_name, token, token_status, option, expires_in } = req;
    const last_updated = new Date().toISOString();
    const expired_on = new Date(Date.now() + (expires_in - settings.api_token_expiring_tolerance) * 1000).toISOString();

    // Establish a connection to the MongoDB database
    const client = await MongoClient.connect(settings.mongodb_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db(settings.mongodb_name);

    let collection = db.collection("token_manager");
    let result;

    if (option === 'insert') {
      // Insert a new document and return the inserted document
      result = await collection.insertOne({
        token_type,
        token_name,
        token,
        token_status,
        last_updated,
        expired_on
      });
    } else if (option === 'update') {
      // Update the document and return the updated document
      result = await collection.findOneAndUpdate(
        { _id: token_id },
        {
          $set: {
            token_type,
            token_name,
            token,
            token_status,
            last_updated,
            expired_on
          }
        },
        { returnOriginal: false }
      );
    } else if (option === 'delete') {
      // Delete the document and return the deleted document
      result = await collection.findOneAndDelete({ _id: token_id });
    } else {
      throw new Error('Invalid update option');
    }

    client.close();

    if (!result.value) {
      throw new Error('Document not found');
    }

    return { rows: result.value, expired_on };
  } catch (error) {
    throw new Error('Error in saving token details, ' + error.message);
  }
};
