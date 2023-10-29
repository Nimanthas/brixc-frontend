const mongodbclient = require('../dbconfig');
const settings = require("../../settings");
const { ObjectId } = require('mongodb');
module.exports = async (req, res) => {
  try {
    const client = await mongodbclient();

    if (Object.keys(req.body).length === 0) {
      throw new Error('Empty data set');
    }

    if (Object.keys(req.body).length !== 4) {
      throw new Error('Incorrect dataset');
    }

    let { candidate_id, tag_id, taging_status, option } = req.body;

    let collection = client.db(settings.mongodb_name).collection("candidates_tags");

    let result;
    candidate_id = new ObjectId(candidate_id);
    tag_id = new ObjectId(tag_id);

    if (option === 'insert') {
      // Direct insert implementation
      const insertDoc = {
        candidate_id, tag_id, taging_status
      };

      result = await collection.insertOne(insertDoc);
    } else if (option === 'update') {
      // Update implementation
      const filter = { candidate_id, tag_id };
      const updateDoc = {
        $set: {
          candidate_id, tag_id, taging_status
        }
      };

      result = await collection.findOneAndUpdate(filter, updateDoc);

      if (!result) {
        // Handle the case where no existing document was found for update
        throw new Error('No document found for update');
      }
    } else if (option === 'delete') {
      // Delete implementation
      const deleteResult = await collection.findOneAndDelete({ _id: candidate_id });

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

    res.status(200).json({ type: 'SUCCESS', message: `Candidate tag ${option}ed successfully!`, data: result.value });
  } catch (error) {
    res.status(200).json({ type: 'ERROR', message: error.message });
  }
};
