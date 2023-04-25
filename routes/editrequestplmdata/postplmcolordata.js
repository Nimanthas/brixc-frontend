// Import necessary modules
const { pool } = require('../dbconfig');
const moment = require('moment');
const configData = require('../../common/config.list');

// Define the handler function for adding PLM colors
module.exports = async (req, res) => {
  try {
    // Get the fabric ID and color set from the request body
    const { fabric_yyid, colorset } = req.body;

    // Check if the fabric ID and color set are valid
    if (!fabric_yyid || !colorset || colorset.length === 0) {
      throw new Error("Oops! invalid input data set.");
    }

    // Filter config data based on customer ID
    const filteredConfig = configData.filter(config => config.cus_id === 1);

    // Check if the filtered config data is empty
    if (!filteredConfig?.length) {
      throw new Error("Oops! can't find correct dataset to post plm colors.");
    }

    // Get the dye roots from the filtered config data
    const { dyeRoots } = filteredConfig[0]?.plmValidations;

    // Connect to the database
    const client = await pool.connect();

    try {
      // Begin a transaction
      await client.query('BEGIN');

      // If this is not an amendment request, delete any existing PLM colorways for the fabric
      if (!req.body?.isAmendmant) {
        await client.query(`DELETE FROM plm_colorways WHERE fabyy_id='${fabric_yyid}'`);
      }

      // For each color in the color set, add a new PLM colorway to the database
      const insertPromises = colorset.map(async (obj_color) => {
        // Map the color name to a new name using the dye roots
        const colorname_new = await dyerootmap(obj_color?.name, dyeRoots);

        // Construct the SQL query for adding the PLM colorway to the database
        const sqlqry_insert = `INSERT INTO plm_colorways(fabyy_id, plm_cw_id, cw_name, cw_desc, colorway, garmentway, cw_order) 
                              VALUES ('${fabric_yyid}', '${obj_color.id}', '${colorname_new.replace(/'/g, "''")}', '${obj_color?.name.replace(/'/g, "''")}', '${obj_color?.colorway.replace(/'/g, "''")}', '${obj_color?.garmentway.replace(/'/g, "''")}', '${obj_color.seq}')`;

        // Execute the SQL query and return the result promise
        return client.query(sqlqry_insert);
      });

      // Wait for all promises to resolve before committing the transaction
      await Promise.all(insertPromises);

      // Commit the transaction and send a success response
      await client.query('COMMIT');
      res.status(200).json({ Type: 'SUCCESS', Msg: "Successfully Added.", Data: colorset });
    } catch (error) {
      // If an error occurs, roll back the transaction and throw the error
      await client.query('ROLLBACK');
      res.status(200).json({ Type: 'ERROR', Msg: error.message });
    } finally {
      // Release the database connection
      client.release();
    }
  } catch (error) {
    // If an error occurs, log it and send an error response
    //console.error(err);
    res.status(200).json({ Type: 'ERROR', Msg: error.message });
  }
};

// Map a color name to a new name using the dye roots
function dyerootmap(value, dyeRoots) {
  let result = value;
  for (const regex of dyeRoots) {
    result = result.replace(regex[0], regex[1]);
  }
  return result;
}
