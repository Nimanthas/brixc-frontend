require('dotenv').config();
const Settings = require("../settings");
const { Pool } = require('pg');
const { MongoClient, ServerApiVersion } = require('mongodb');

// Start: pg
const connectionString = `postgresql://${Settings.pg_user}:${Settings.pg_pw}@${Settings.pg_host}:${Settings.pg_port}/${Settings.pg_db}`;

const pool = new Pool({
  connectionString: connectionString,
  ssl: false
});

// End: pg

//Start: Mongo
const uri = `mongodb+srv://${Settings.mongodb_user}:${Settings.mongodb_password}@${Settings.mongodb_uri}/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function mongodbclient() {
  try {
    // Connect the client to the MongoDB Atlas cluster
    await client.connect();
    return client;
  } catch (error) {
    console.error(`Error connecting to MongoDB Atlas: ${error}`);
    throw new Error(`Error connecting to MongoDB Atlas: ${error}`);
  }
}

//End: Mongo

module.exports = mongodbclient;