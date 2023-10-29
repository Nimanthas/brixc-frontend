const mongodbclient = require('../dbconfig');
const settings = require("../../settings");
const { ObjectId } = require('mongodb');
const moment = require('moment');

module.exports = async (req, res) => {
  try {
    const client = await mongodbclient();

    if (Object.keys(req.body).length === 0) {
      throw new Error('Empty data set');
    }

    if (Object.keys(req.body).length !== 5) {
      throw new Error('Incorrect dataset');
    }

    let { task_id, candidate_id, task_status, option } = req.body;
    const last_updated = moment().format('YYYY-MM-DD HH:mm:ss');

    let collection = client.db(settings.mongodb_name).collection("analyze_tasks");

    let result;
    candidate_id = new ObjectId(candidate_id);

    if (option === 'insert') {
      // Direct insert implementation
      const insertDoc = {
        task_id, candidate_id, task_status, last_updated
      };

      result = await collection.insertOne(insertDoc);
    } else if (option === 'update') {
      // Update implementation
      const filter = { task_id: task_id };
      const updateDoc = {
        $set: {
          task_status, last_updated
        }
      };

      result = await collection.findOneAndUpdate(filter, updateDoc);

      if (!result) {
        // Handle the case where no existing document was found for update
        throw new Error('No document found for update');
      }
    } else if (option === 'delete') {
      // Delete implementation
      const deleteResult = await collection.findOneAndDelete({ task_id: task_id });

      if (deleteResult === null || !deleteResult) {
        // Handle the case where no existing document was found for deletion
        throw new Error('No document found for deletion');
      }

      result = deleteResult;
    } else {
      throw new Error('Invalid update option');
    }

    // Close the MongoDB client when done
    //client.close();

    res.status(200).json({ type: 'SUCCESS', message: `Candidate ${option}ed successfully!`, data: result.value });
  } catch (error) {
    res.status(200).json({ type: 'ERROR', message: error.message });
  }
};
