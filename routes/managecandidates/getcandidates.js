const mongodbclient = require('../dbconfig');
const settings = require("../../settings");
const headers = require("../../commonconfigs/table.headers.configs");
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
  try {
    // Get candidate_id from request parameters
    const { candidate_id } = req.params;

    // Check the validity of candidate_id
    if (!candidate_id) {
      throw new Error("Oops! Empty data set in header on get tags request.");
    }

    // Get the MongoDB client
    const client = await mongodbclient();

    // Access the database and collection
    let collection = client.db(settings.mongodb_name).collection("candidates");

    const filter = candidate_id === '0' ? {} : { _id: new ObjectId(candidate_id) };

    // Use the aggregation framework to perform the left join with "jobs" collection
    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: "jobs",
          localField: "job_id",
          foreignField: "_id",
          as: "jobData"
        }
      },
      {
        $unwind: {
          path: "$jobData",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "candidates_tags",
          localField: "_id",
          foreignField: "candidate_id",
          as: "tags"
        }
      },
      {
        $unwind: {
          path: "$tags",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "master_tags",
          let: { tag_id: "$tags.tag_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$tag_id"] }
              }
            }
          ],
          as: "tag_data"
        }
      },
      {
        $unwind: {
          path: "$tag_data",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: "$_id",
          candidate_external_id: { $first: "$candidate_external_id" },
          candidate_name: { $first: "$candidate_name" },
          candidate_email: { $first: "$candidate_email" },
          candidate_contact_number: { $first: "$candidate_contact_number" },
          job_title: { $first: "$jobData.job_title" },
          candidate_status: { $first: "$candidate_status" },
          tags: { $push: { tag_name: "$tag_data.tag_name" } },
          inbound_date: { $first: "$inbound_date" },
          last_updated: { $first: "$last_updated" },
          meeting_id: { $first: "$meeting_id" },
          join_url: { $first: "$join_url" }
        }
      }
    ];

    const results = await collection.aggregate(pipeline).sort({ last_updated: -1 }).toArray();

    // Send a successful response with result documents
    res.status(200).json({ type: "SUCCESS", data: results, header: headers?.candidates_data_headers });

    // Close the MongoDB client when done
    //client.close();
  } catch (error) {
    // Handle errors by sending an error response with an error message
    res.status(200).json({ type: "ERROR", message: error.message });
  }
};
