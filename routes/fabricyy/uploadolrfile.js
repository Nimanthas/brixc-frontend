/*
 * code refactored by NimanthaH on 15/04/23. the original api was developed to process the excel in front end and send the json 
 * to backend for save data into database. in refactored code the excel will be directly pushed into backend and from backend via config file 
 * the excel will process and all error handelings will be managed in backend. the old api can be found under uploadolr.js
 */

const { pool } = require('../dbconfig');
const moment = require('moment');
const XLSX = require('xlsx');
const configData = require('../../common/config.list');

// Export an asynchronous function that takes request and response objects as arguments
module.exports = async (req, res) => {
  // Extract parameters and files from the request object
  const { params, files } = req;
  const { fabyyid, sizetempid } = params;

  try {
    // Check if the file parameter is missing from the request
    if (!files?.file) {
      return res.status(400).json({ Type: "SUCCESS", Msg: 'Oops! no file was uploaded.' });
    }
    // Filter config data based on customer ID
    const filteredConfig = configData.filter(config => config.cus_id === 1);
    // Check if no matching config data was found
    if (!filteredConfig?.length) {
      return res.status(200).json({ Type: "ERROR", Msg: "Oops! can't find correct dataset to post upload olr data." });
    }
    // Select the first matching config data
    const config = filteredConfig[0];
    // Read the uploaded file as an XLSX workbook
    const workbook = XLSX.read(files.file.data);
    // Select the sheet with the specified name from the workbook
    const sheet = workbook?.Sheets[config.sheetName];
    // Check if no matching sheet was found
    if (!sheet) {
      return res.status(400).json({ Type: "ERROR", Msg: `Oops! no sheet found with name ${config.sheetName}.` });
    }
    // Convert the sheet data to a JSON array
    const data = XLSX.utils.sheet_to_json(sheet);
    // Check if the sheet data is empty
    if (!data?.length) {
      return res.status(400).json({ Type: "ERROR", Msg: `Oops! no data found in sheet with name ${config.sheetName}.` });
    }
    // Retrieve request data related to the specified ID
    const requestData = await getFabricYYRequestDetailsbyRequestId(fabyyid);
    // Check if no matching request data was found
    if (!requestData?.length) {
      return res.status(400).json({ Type: "ERROR", Msg: `Oops! unable to get the details related to request : ${fabyyid}. The request may be dropped or declared invalid.` });
    }
    // Transform the sheet data using the specified config and request data
    const transformedData = await transformArray(data, config, requestData[0].cus_sty_no);
    // Check if the transformed data is empty
    if (!transformedData?.length) {
      return res.status(400).json({ Type: "ERROR", Msg: `Oops! no data found in olr sheet related to style: ${requestData[0].cus_sty_no}. This can be caused by incorrect file format or the style details is not found.` });
    }
    // Delete existing OLR data related to the specified request ID
    await deleteOLRDetailsFromOLRDatabyRequestId(fabyyid);
    // Join the transformed data with additional data based on the specified join parameters, if applicable
    let joinedData = transformedData;
    if (config.joinParameters?.join) {
      // Retrieve size template data related to the specified ID
      const sizeTemplateData = await getSizeNamesbyTemplateId(sizetempid);
      // Check if no matching size template data was found
      if (!sizeTemplateData?.length) {
        return res.status(400).json({ Type: "ERROR", Msg: `Oops! no data found for size template id: ${sizetempid}.` });
      }
      //Join data
      joinedData = innerJoin(transformedData, sizeTemplateData, config.joinParameters.data01Key, config.joinParameters.data02Key);
    }
    //Insert processed data into olr table
    await insertDataintoOLRTable(joinedData, fabyyid);
    //Return sucess response
    return res.status(200).json({ Type: "SUCCESS", Msg: "olr list added successfully !", data: joinedData, fabyyid });
  } catch (error) {
    //Return error
    return res.status(400).json({ Type: "ERROR", Msg: String(error) });
  }
};

//Transform excel json output into standard pre-defined json
function transformArray(inputArray, config, filterValue) {
  const { outputModel, fieldMappings, groupingSpec, arrayKeySpecs, mergeKeys, filterKey, mandatoryKeys, concatenateKeys } = config;

  // Validate that all mandatory keys are present in the input objects
  if (mandatoryKeys != undefined && mandatoryKeys != null && mandatoryKeys.length > 0) {
    const missingKeys = mandatoryKeys.filter(key => !inputArray.some(obj => obj.hasOwnProperty(key)));
    if (missingKeys.length > 0) {
      throw new Error(`The mandatory columns are missing in excel. Missing columns: ${missingKeys.join(', ')}`);
      return;
    }
  } else {
    throw new Error(`Mandatory columns are not defined for this customer.`);
    return;
  }

  //Transform filter value
  filterValue = filterValue?.toLowerCase().trim();

  const outputArray = inputArray
    .filter(inputObj => inputObj[filterKey]?.toLowerCase().trim() === filterValue)
    .map(inputObj => {
      // Rename fields
      const outputObj = {};
      Object.entries(inputObj).forEach(([inputKey, inputValue]) => {
        const mapping = fieldMappings?.find(m => m.inputKey === inputKey);
        const outputKey = mapping ? mapping.outputKey : inputKey;
        const config = mapping ? mapping.config : undefined;
        let outputValue = inputValue;
        if (config) {
          if (config.split && inputValue != undefined) {
            outputValue = String(inputValue).split(config.split);
          }
          if (config.trim) {
            if (Array.isArray(outputValue)) {
              outputValue = outputValue.map(v => v.trim());
            } else if (outputValue != undefined) {
              outputValue = String(outputValue).trim();
            }
          }
          if (config.replace) {
            if (Array.isArray(outputValue)) {
              outputValue = outputValue.map(v =>
                config.replace.reduce((prev, curr) => prev.replace(curr, ''), v)
              );
            } else {
              outputValue = config.replace.reduce(
                (prev, curr) => prev.replace(curr, ''),
                String(outputValue)
              );
            }
          }
        }
        outputObj[outputKey] = outputValue;
      });

      // Concatenate keys
      if (concatenateKeys) {
        const { newKey, keysToConcatenate, delimiter } = concatenateKeys;
        const valuesToConcatenate = keysToConcatenate.map(k => outputObj[k]).filter(v => v !== undefined);
        const concatenatedValue = valuesToConcatenate.join(delimiter);
        outputObj[newKey] = concatenatedValue;
      }

      // Add grouping fields
      if (groupingSpec) {
        const { field, spans } = groupingSpec;
        const fieldValue = outputObj[field];
        spans?.forEach(([start, end], i) => {
          const key = `${field}_${start}_${end}`;
          outputObj[key] = fieldValue?.substring(start, end) || undefined;
        });
      }

      // Add array keys
      if (arrayKeySpecs) {
        arrayKeySpecs?.forEach(spec => {
          outputObj[spec.key] = spec.repeatValue;
        });
      }

      // Merge keys
      if (mergeKeys) {
        mergeKeys?.forEach(key => {
          const valuesToMerge = Object.keys(outputObj)
            .filter(k => k.startsWith(key))
            .map(k => outputObj[k])
            .filter(v => v !== undefined);
          outputObj[key] = valuesToMerge.join('_');
        });
      }

      return outputObj;
    });

  // Rename output fields to match model and filter out any extra keys
  return outputArray?.map(outputObj => {
    const renamedOutputObj = {};
    Object.entries(outputObj).forEach(([outputKey, outputValue]) => {
      const inputKey = Object.keys(outputModel).find(k => outputModel[k] === outputKey);
      if (inputKey) {
        renamedOutputObj[inputKey] = outputValue;
      }
    });
    return renamedOutputObj;
  });
}
//Join to get only matching data
function innerJoin(arr1, arr2, key1, key2) {
  // Create an array to store the joined results
  const results = [];
  //console.log('input parameters: ', arr1, arr2, key1, key2)
  try {
    if (arr1.length < 1 || arr2.length < 1 || key1 == '' || key2 == '') {
      throw new Error(`inner join failed due to input parameters are not in correct format.`);
      return;
    }
    // Create a map of key-value pairs from arr2
    const map2 = new Map(arr2.map(obj => [obj[key2], obj]));
    // Loop through each object in arr1
    for (const obj1 of arr1) {
      // Get the value of the key1 for this object
      const value1 = obj1[key1];
      // If the value of the key1 exists in the map2, add the joined object to the results
      if (map2.has(value1)) {
        // Combine the objects
        const obj2 = map2.get(value1);
        const joinedObj = { ...obj1, ...obj2 };
        results.push(joinedObj);
      }
    }
  } catch (error) {
    //throw error
    throw new Error(`failed to perform the inner join.` + error);
  }
  return results;
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

  // Connect to the database pool
  const client = await pool.connect();
  try {
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
  // Connect to the database pool
  const client = await pool.connect();
  try {
    // Query to select all size names from the sys_sizeorder table for a given size template ID and order them by size order
    const sqlqry = `SELECT * FROM sys_sizeorder WHERE temp_id='${sizetempid}' ORDER BY size_order ASC;`;
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
//insert all data into olr table from processed json
async function insertDataintoOLRTable(data, fabyy_id) {
  // Check that the input parameters are valid
  if (!data || !Array.isArray(data) || !data.length || !fabyy_id) {
    throw new Error(`data insert failed no matching data was found with filters (check for data in excel and for filters. ex: size template to olr size) or the insert function input parameters are not in correct format.`);
  }

  // Connect to the database
  const client = await pool.connect();

  try {
    // Start a transaction
    await client.query('BEGIN');

    // Define the SQL query to insert the data into the table
    const query = 'INSERT INTO olr_data(fabyy_id, custname, division, maststyledesc, custstyle, custstyledesc, mastcolordesc, custsizedesc, orderqty, season, vpono, techpackno) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);';

    // Loop through each row of data and execute the query to insert it into the table
    for (const row of data) {
      await client.query(query, [
        fabyy_id,
        row.custname,
        row.divisioncode?.substring(0, 9),
        row.maststyledesc,
        row.custstyle ?? '',
        row.custstyledesc ?? '',
        row.mastcolordesc,
        row.mastsizedesc,
        row.orderqty,
        row.season,
        row.vpono,
        row.techpackno
      ]);
    }

    // Commit the transaction
    await client.query('COMMIT');
    return true;

  } catch (error) {
    // If an error occurs, roll back the transaction and throw an error with a message that includes the original error
    await client.query('ROLLBACK');
    throw new Error(`Failed to insert data into olr_data table. Error: ${error}`);

  } finally {
    // Release the database connection back to the pool
    client.release();
  }
}

