const mongodbclient = require('../../dbconfig'); // Import your MongoDB client function
const moment = require('moment');
const settings = require("../../../settings");

module.exports = async (req, res) => {
  try {
    const client = await mongodbclient();

    // Check if the request body is empty
    if (Object.keys(req.body).length === 0) {
      throw new Error('Empty data set');
    }

    // Check if the request body contains exactly 5 elements
    if (Object.keys(req.body).length !== 3) {
      throw new Error('Incorrect dataset');
    }

    const { department_name, department_status, option } = req.body;
    const last_updated = moment().format('YYYY-MM-DD HH:mm:ss');

    let collection = client.db(settings.mongodb_name).collection("master_departments"); // Update the collection name

    let result;

    if (option === 'insert' || option === 'update') {
      const filter = { department_name }; // Assuming location_id is a unique identifier
      const updateDoc = {
        $set: { department_name, department_status, last_updated }
      };

      const options = {
        upsert: true, // Create a new document if not found
        returnOriginal: false, // Return the modified document
      };

      result = await collection.findOneAndUpdate(filter, updateDoc, options);

      if (!result) {
        // Handle the case where no existing document was found (result is null)
        result = {
          value: { department_name, department_status, last_updated },
        };
      }

      // Close the MongoDB client when done
      client.close();
    } else if (option === 'delete') {
      // Delete implementation
      const deleteResult = await collection.findOneAndDelete({ department_name });

      if (deleteResult === null || !deleteResult) {
        // Handle the case where no existing document was found for deletion
        throw new Error('No document found for deletion');
      }

      result = deleteResult;
    } else {
      throw new Error('Invalid update option');
    }

    res.status(200).json({ type: 'SUCCESS', message: `Department ${option}ed successfully!`, data: result.value });
  } catch (error) {
    res.status(200).json({ type: 'ERROR', message: error.message });
  }
};

