const { pool } = require('../dbconfig');
const moment = require('moment');

module.exports = async (req, res) => {

  //Check body is empty
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(200).json({ Type: "ERROR", Msg: "Oops! Empty Data Set in Hedaer on Post Upload OLR Data" });
    return;
  }

  //Check element count
  if (Object.keys(req.body).length < 2) {
    res.status(200).json({ Type: "ERROR", Msg: "Oops! Can't Find Correct Dataset to Post Upload OLR Data" });
    return;
  }

  //Set varaiables from body parameters
  const var_fabyyid = req.body.fabyyid != undefined && req.body.fabyyid != null ? req.body.fabyyid : "";
  const var_olrdataset = req.body.olrdata != undefined && req.body.olrdata != null ? req.body.olrdata : "";
  const var_sizetempid = req.body.sizetempid != undefined && req.body.sizetempid != null ? req.body.sizetempid : "";

  var qry_delete = `DELETE FROM olr_data WHERE fabyy_id='${var_fabyyid}';`; //Query 01: delete all data from OLR Data tabale for fabric request
  var response_delete = await query(qry_delete);

  var qry_sizetemp = `SELECT size_name FROM sys_sizeorder WHERE temp_id='${var_sizetempid}' ORDER BY size_order ASC;`; //Query 02: delete all data from OLR Data tabale for fabric request
  var response_sizetemp = await query(qry_sizetemp);

  for (var row_olrdataset in var_olrdataset) {
    var obj_olrdataset = var_olrdataset[row_olrdataset];

    var CUSTNAME = String(obj_olrdataset.CUSTNAME).replace(/'/g, "''");
    var DIVISIONCODE = String(obj_olrdataset.DIVISIONCODE).replace(/'/g, "''");
    var VPONO = String(obj_olrdataset.VPONO).trim().replace(/'/g, "''");
    var TECHPACKNO = String(obj_olrdataset.TECHPACKNO).trim().replace(/'/g, "''");
    var MASTSTYLEDESC = String(obj_olrdataset.MASTSTYLEDESC).trim().replace(/'/g, "''");
    var CUSTSTYLE = String(obj_olrdataset.CUSTSTYLE).trim().replace(/'/g, "''");
    var CUSTSTYLEDESC = String(obj_olrdataset.CUSTSTYLEDESC).trim().replace(/'/g, "''");
    var MASTCOLORDESC = String(obj_olrdataset.MASTCOLORDESC).trim().replace(/'/g, "''");
    var MASTSIZEDESC = String(obj_olrdataset.MASTSIZEDESC).trim().replace(/'/g, "''");
    var ORDERQTY = String(obj_olrdataset.ORDERQTY).trim().replace(/'/g, "''");
    var SEASON = String(obj_olrdataset.SEASON).trim().replace(/'/g, "''");

    for (var row_insizeset in response_sizetemp.rows) {
      var obj_insizeset = response_sizetemp.rows[row_insizeset];
      var size_inupper = obj_insizeset.size_name.toUpperCase();
      var mastsize_inupper = MASTSIZEDESC.toUpperCase();

      if (size_inupper === mastsize_inupper) {
        var sql_qry = `INSERT INTO olr_data(fabyy_id, custname, division, maststyledesc, custstyle, custstyledesc, mastcolordesc, custsizedesc, orderqty, season, vpono, techpackno) VALUES('${var_fabyyid}', '${CUSTNAME}', '${DIVISIONCODE}', '${MASTSTYLEDESC}', '${CUSTSTYLE}', '${CUSTSTYLEDESC}', '${MASTCOLORDESC}', '${MASTSIZEDESC}', '${ORDERQTY}', '${SEASON}', '${VPONO}', '${TECHPACKNO}');`;
        await query(sql_qry);
      }
    }
  }


  res.status(200).json({ Type: "SUCCESS", Msg: "OLR List Added Successfully !" })
  return;
};

//Postgres Query Run With Async Await
async function query(query) {
  const client = await pool.connect();
  let response;
  try 
  {
    await client.query('BEGIN');
    try 
    {
      response = await client.query(query);
      await client.query('COMMIT');
    } 
    catch (error) 
    {
      await client.query('ROLLBACK');
      res.status(200).json({ Type: "ERROR", Msg: error.message });
    }
  } 
  finally 
  {
    client.release();
    return response;
  }
}




//Get fabric yy request details by request id to get parameters
async function getFabricYYRequestDetailsbyRequestId(fabyy_id) {
  // Define the SQL query to retrieve the data
  const sqlqry = `SELECT fm.*, fc.cus_name, ff.fac_name, fd.* 
    FROM fabricyy_master fm
    INNER JOIN sys_customer fc ON fm.cus_id = fc.cus_id 
    INNER JOIN sys_factory ff ON fm.fac_id = ff.fac_id
    LEFT JOIN fabricyy_details fd ON fm.fabyy_id = fd.fabyy_id 
    WHERE fm.fabyy_status != 'Delete' AND fm.fabyy_id = $1`;

  try {
    // Connect to the database pool
    const client = await pool.connect();
    // Execute the SQL query with the given ID parameter
    const result = await client.query(sqlqry, [fabyy_id]);
    // Return the retrieved rows
    return result.rows;
  } catch (error) {
    // Throw an error if the database query fails
    throw new Error(`Failed to retrieve fabric YY request details: ${error}`);
  } finally {
    // Release the client connection after the query is done
    client.release();
  }
}
//Get sizes in size templete data
async function getSizeNamesbyTemplateId(sizetempid) {
  try {
    // Query to select all size names from the sys_sizeorder table for a given size template ID and order them by size order
    const sqlqry = `SELECT * FROM sys_sizeorder WHERE temp_id='${sizetempid}' ORDER BY size_order ASC;`;
    // Connect to the database pool
    const client = await pool.connect();
    // Execute the query and retrieve the results
    const result = await client.query(sqlqry);
    // Return the array of size objects
    return result.rows;
  } catch (error) {
    // Throw an error message if there's a problem with the query execution
    throw new Error(`Failed to retrieve size names for template ID ${sizetempid}: ${error}`);
  } finally {
    // Release the client connection after the query is done
    client.release();
  }
}
//Database: delete exsisting data from olr table
function deleteOLRDetailsFromOLRDatabyRequestId(fabyy_id) {
  // Use a parameterized query to prevent SQL injection attacks
  const sqlqry = {
    text: 'DELETE FROM olr_data WHERE fabyy_id = $1',
    values: [fabyy_id]
  };
  // Use async/await instead of Promises for improved readability and simplicity
  return (async () => {
    // Acquire a client from the connection pool
    const client = await pool.connect();
    try {
      // Start a transaction
      await client.query('BEGIN');
      // Execute the parameterized query to delete the data from the table
      const result = await client.query(sqlqry);
      // Commit the transaction
      await client.query('COMMIT');
      // Return the deleted rows
      return result.rows;
    } catch (error) {
      // Roll back the transaction if an error occurs
      await client.query('ROLLBACK');
      // Throw an error with a helpful message
      throw new Error(`Failed to delete data from the olr_data table: ${error}`);
    } finally {
      // Release the client back into the connection pool
      client.release();
    }
  })();
}