require('dotenv').config()
const Settings = require("../settings");
const { Pool } = require('pg')

const connectionString = `postgresql://${Settings.pg_user}:${Settings.pg_pw}@${Settings.pg_host}:${Settings.pg_port}/${Settings.pg_db}`

const pool = new Pool({
  connectionString: connectionString,
  ssl: false
})

module.exports = { pool }