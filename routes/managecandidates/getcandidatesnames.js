const mongodbclient = require('../dbconfig');
const settings = require('../../settings');
const headers = require('../../commonconfigs/table.headers.configs');
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
  try {
    // Get candidate_name from request parameters
    const { candidate_name } = req.params;

    // Check the validity of candidate_name
    if (!candidate_name) {
      throw new Error("Oops! Empty data set in header on get candidates request.");
    }

    // Get the MongoDB client
    const client = await mongodbclient();

    // Access the database and collection
    let collection = client.db(settings.mongodb_name).collection('candidates');

    const filter = candidate_name === '0' ? {} : {
      candidate_name: {
        $regex: new RegExp(candidate_name, 'i'), // 'i' for case-insensitive search
      }
    };

    // Use the aggregation framework to perform the left join with "jobs" collection
    const pipeline = [
      { $match: filter },
      { $project: { _id: 1, candidate_name: 1 } }
    ];

    const results = await collection.aggregate(pipeline).toArray();

    // Send a successful response with result documents
    res.status(200).json({ type: 'SUCCESS', data: results });

    // Close the MongoDB client when done
    client.close();
  } catch (error) {
    // Handle errors by sending an error response with an error message
    res.status(200).json({ type: 'ERROR', message: error.message });
  }
};
