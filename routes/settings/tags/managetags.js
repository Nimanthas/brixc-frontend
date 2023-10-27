const mongodbclient = require('../../dbconfig');
const settings = require("../../../settings");

module.exports = async (req, res) => {
  try {
    const client = await mongodbclient();

    if (Object.keys(req.body).length === 0) {
      throw new Error('Empty data set');
    }

    if (Object.keys(req.body).length !== 4) {
      throw new Error('Incorrect dataset');
    }

    const { tag_type, tag_name, tag_status, option } = req.body;
    const last_updated = new Date();

    let collection = client.db(settings.mongodb_name).collection("master_tags");

    let result;

    if (option === 'insert' || option === 'update') {
      const filter = { tag_type, tag_name };
      const updateDoc = {
        $set: { tag_type, tag_name, tag_status, last_updated }
      };

      const options = {
        upsert: true, // Create a new document if not found
        returnOriginal: false, // Return the modified document
      };

      result = await collection.findOneAndUpdate(filter, updateDoc, options);

      if (!result) {
        // Handle the case where no existing document was found (result is null)
        result = {
          value: { tag_type, tag_name, tag_status, last_updated },
        };
      }
      // Close the MongoDB client when done
      client.close();
    } else if (option === 'delete') {
      // Delete implementation
      const deleteResult = await collection.findOneAndDelete({ tag_type, tag_name });

      if (deleteResult === null || !deleteResult) {
        // Handle the case where no existing document was found for deletion
        throw new Error('No document found for deletion');
      }

      result = deleteResult;
    } else {
      throw new Error('Invalid update option');
    }

    res.status(200).json({ type: 'SUCCESS', message: `Tag ${option}ed successfully!`, data: result.value });
  } catch (error) {
    res.status(200).json({ type: 'ERROR', message: error.message });
  }
};
