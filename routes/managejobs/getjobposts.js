const mongodbclient = require('../dbconfig');
const settings = require("../../settings");
const headers = require("../../commonconfigs/table.headers.configs");
const { ObjectId } = require('mongodb');

module.exports = async (req, res) => {
  try {
    // Get job_id from request parameters
    const { job_id } = req.params;

    // Check the validity of job_id
    if (!job_id) {
      throw new Error("Oops! Empty data set in header on get tags request.");
    }

    // Get the MongoDB client
    const client = await mongodbclient();

    // Access the database and collection
    let collection = client.db(settings.mongodb_name).collection("jobs");

    const filter = job_id === '0' ? {} : { _id: new ObjectId(job_id) };

    // Use the aggregation framework with left joins
    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: "master_job_types",
          let: { job_type_id: "$job_type_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$job_type_id"] }
              }
            }
          ],
          as: "job_with_type"
        }
      },
      {
        $unwind: {
          path: "$job_with_type",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "master_locations",
          let: { job_location_id: "$job_location_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$job_location_id"] }
              }
            }
          ],
          as: "job_with_location"
        }
      },
      {
        $unwind: {
          path: "$job_with_location",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          job_external_id: 1,
          job_title: 1,
          job_description: 1,
          specialization: 1,
          salary: 1,
          currency: 1,
          job_status: 1,
          last_updated: 1,
          job_type: "$job_with_type.job_type",
          job_type_status: 1,
          job_type_last_updated: 1,
          location_address: {
            $concat: ["$job_with_location.location_name", ", ", "$job_with_location.location_address"]
          }
        }
      },
      {
        $lookup: {
          from: "job_tags",
          localField: "_id",
          foreignField: "job_id",
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
          job_external_id: { $first: "$job_external_id" },
          job_title: { $first: "$job_title" },
          job_description: { $first: "$job_description" },
          specialization: { $first: "$specialization" },
          salary: { $first: "$salary" },
          currency: { $first: "$currency" },
          job_status: { $first: "$job_status" },
          last_updated: { $first: "$last_updated" },
          job_type: { $first: "$job_type" },
          location_address: { $first: "$location_address" },
          tags: { $push: { tag_name: "$tag_data.tag_name" } },
        }
      }
    ];

    const results = await collection.aggregate(pipeline).toArray();

    // Send a successful response with result documents
    res.status(200).json({ type: "SUCCESS", data: results, header: headers?.job_posts_data_headers });

    // Close the MongoDB client when done
    //client.close();
  } catch (error) {
    // Handle errors by sending an error response with an error message
    res.status(200).json({ type: "ERROR", message: error.message });
  }
};
