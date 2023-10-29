const mongodbclient = require('../dbconfig');
const settings = require("../../settings");
const headers = require("../../commonconfigs/table.headers.configs");
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
  try {
    // Get candidate_id from request parameters
    const { task_id } = req.params;

    // Check the validity of candidate_id
    if (!task_id) {
      throw new Error("Oops! Empty data set in header on get tags request.");
    }

    // Get the MongoDB client
    const client = await mongodbclient();

    // Access the database and collection
    let collection = client.db(settings.mongodb_name).collection("analyze_tasks");

    const filter = task_id === '0' ? {} : { task_id: task_id, task_status: 10 };

    // Use the aggregation framework to perform the left join with "jobs" collection
    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: "candidates",
          localField: "candidate_id",
          foreignField: "_id",
          as: "candidate"
        }
      },
      {
        $unwind: {
          path: "$candidate",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: "$_id",
          candidate_name: { $first: "$candidate.candidate_name" },
          task_id: { $first: "$task_id" },
          task_status: { $first: "$task_status" },
          last_updated: { $first: "$last_updated" },
        }
      }
    ];

    const results = await collection.aggregate(pipeline).sort({ last_updated: -1 }).toArray();

    // Send a successful response with result documents
    res.status(200).json({ type: "SUCCESS", data: results, header: headers?.pending_jobs_data_headers });

    // Close the MongoDB client when done
    //client.close();
  } catch (error) {
    // Handle errors by sending an error response with an error message
    res.status(200).json({ type: "ERROR", message: error.message });
  }
};
