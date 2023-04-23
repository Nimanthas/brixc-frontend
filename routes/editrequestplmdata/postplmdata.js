const { pool } = require('../dbconfig');
const moment = require('moment');
const configData = require('../../common/config.list');
const plmweburl = require('../plmurl').apiurl;
const plmSessionNameApi = require('./plmseasonname');
const plmSessionApi = require('./plmsessiontoken');
const axios = require('axios');

module.exports = async (req, res) => {
  try {
    //console.log("request body: ", req.body);
    if (!Object.keys(req.body).length) {
      throw new Error('Oops! empty data set in api body.');
    }
    if (Object.keys(req.body).length < 3) {
      throw new Error("Oops! can't find correct dataset");
    }

    const plmToken = await plmSessionApi(req, res);
    //console.log('plm Token: ', plmToken);

    // Filter config data based on customer ID
    const filteredConfig = configData.filter(config => config.cus_id === 1);
    if (!filteredConfig?.length) {
      throw new Error("Oops! can't find correct dataset to post upload olr data.");
    }
    const config = filteredConfig[0]?.plmValidations;

    const plmBomDetails = await getplmbomrevisedata(req, res, plmToken);
    //console.log('BOM data output: ', plmBomDetails);

    if (!plmBomDetails || !plmBomDetails?.BomData) {
      throw new Error('Failed to fetch BOM details.');
    }

    const [fabricItems, plmColorData] = await Promise.all([
      getplmbomitems(req, res, plmBomDetails?.BomData?.items, plmToken, config),
      updateplmcolordata(req, res, plmBomDetails?.Colorways, config)
    ]);

    if (fabricItems?.length) {
      const [savePLMItems, savePLMYYData] = await Promise.all([
        postplmitemdata(req, res, fabricItems, plmToken, config),
        postplmyydata(req, res, plmToken, config)
      ]);
      const output = [{ saveplmitems: savePLMItems, saveplmyyata: savePLMYYData, Colorways: plmBomDetails?.Colorways, BomData: plmBomDetails?.BomData }];
      res.status(200).json({ Type: 'SUCCESS', Data: output, Msg: "plm data successfully updated." });
    } else {
      throw new Error('Opss! failed to fetch fabric items.');
    }
  } catch (error) {
    //console.log('Error in post plm data:', error);
    return res.status(500).json({ Type: "ERROR", Msg: String(error) });
  }
};

//Step 01: get plm bom revisions
//Start: get plm bom revision data
async function getplmbomrevisedata(req, res, plmToken) {
  try {
    // Extract the "revbomid" property from the HTTP request body
    const { revbomid } = req.body;
    // Check if the fabric ID and color set are valid
    if (!revbomid) {
      throw new Error("Oops! invalid input data set in get plm bom revise data.");
    }
    //console.log("revbomid: ", revbomid);
    // Use Axios to make an HTTP GET request to the PLM API to retrieve BOM revision data
    const data = await axios.get(`${plmweburl}/csi-requesthandler/api/v2/apparel_bom_revisions/${encodeURIComponent(revbomid)}`, { headers: { Cookie: plmToken } });
    //console.log("apparel_bom_revisions: ", data);
    // Use Promise.all() to asynchronously fetch data for all colorways in the BOM
    const colorways = await Promise.all(
      data?.data.bom_product_colors?.map(async (color, index) => {
        // Use Axios to make an HTTP GET request to the PLM API to retrieve colorway data
        const { data: colorData } = await axios.get(`${plmweburl}/csi-requesthandler/api/v2/colorways/${encodeURIComponent(color)}`, { headers: { Cookie: plmToken } });
        // If the colorway data doesn't have a "node_name" property, return null to filter it out later
        if (!colorData.node_name) { return null; }
        // Return an object with selected properties from the colorway data
        return { id: color, name: colorData.node_name, desc: colorData.description, garmentway: colorData.bx_garment_way, colorway: colorData.bx_colorway_name, seq: index + 1 };
      })
      // Use then() to filter out any null values returned by the Promise.all() call
    ).then((colors) => colors.filter(Boolean));

    // Send an HTTP response with a success status code and a JSON body containing the BOM revision data and colorway data
    return { BomData: data?.data, Colorways: colorways };
  } catch (error) {
    // If an error occurs, send an HTTP response with an appropriate error status code and a JSON body containing an error message
    throw new Error(`Failed to get the revised bom item details. Error: ${error}`);
  }
};
//End: get plm bom revision data
//End Step 01

//Step 02: get revised bom details and save the data
//Start: get plm bom filtered items
//get plm bom items from plm relevant to bom items
async function getplmbomitems(req, res, itemlistids, plmToken, config) {
  try {
    const items_fabric = [];
    const { matTypes, plmSkipValue } = config;

    for (const itemId of itemlistids) {
      const material = encodeURIComponent(itemId);
      if (material === '' || itemId === plmSkipValue) continue;

      const { data: { actual, bom_line_quote, bx_colorway_type, colorways_color, bx_garment_way, node_name } } = await axios.get(`${plmweburl}/csi-requesthandler/api/v2/part_materials/${material}`, { headers: { Cookie: plmToken } });

      const nameofitem = await getitemname(actual, plmToken, plmSkipValue);
      const dataofsupplier = await getsupplierdata(bom_line_quote, plmToken, plmSkipValue);
      const nameofmattype = await getmaterialtype(nameofitem.product_type, plmToken, plmSkipValue);
      const minimumcuttablewidth = await getcuttablewidth(dataofsupplier.latest_revision, plmToken, plmSkipValue);


      const isMatch = matTypes.some(matType => {
        if (matType?.matType !== nameofmattype?.node_name) return false;
        if (matType?.validateSubTypes && !matType?.matSubTypes.includes(node_name)) return false;
        return true;
      });

      if (isMatch) {
        items_fabric.push({
          id: itemId, actual, placement: node_name, color_way_type: bx_colorway_type, color_way_colors: colorways_color,
          garment_way: bx_garment_way, cuttable_width: minimumcuttablewidth?.cw, item_name: nameofitem?.node_name, description: nameofitem?.description,
          supplier: dataofsupplier?.node_name, material_type: nameofmattype?.node_name,
        });
      }
    }
    return items_fabric;
  } catch (error) {
    //console.error(error);
    throw new Error(`Failed to get the plm bom item details. Error: ${error}`);
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
    }
  } else {
    throw new Error(`Mandatory columns are not defined for this customer.`);
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
        concatenateKeys?.forEach(concatenateKey => {
          const { newKey, keysToConcatenate, delimiter } = concatenateKey;
          const valuesToConcatenate = keysToConcatenate.map(k => outputObj[k]).filter(v => v !== undefined);
          const concatenatedValue = valuesToConcatenate.join(delimiter);
          outputObj[newKey] = concatenatedValue;
        });
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
//get item name by item code
async function getitemname(val_item, plmToken, plmSkipValue) {
  try {
    const material = encodeURIComponent(val_item);
    if (material === "" || val_item === plmSkipValue) { return { node_name: '', description: '', product_type: '' }; }
    const response = await axios.get(`${plmweburl}/csi-requesthandler/api/v2/materials/${material}`, { headers: { Cookie: plmToken } });
    return { node_name: response?.data.node_name, description: response?.data.description, product_type: response?.data.product_type };
  } catch (error) {
    //console.error(error);
    throw new Error(`Failed to get the item details for item: ${val_item}. Error: ${error}`);
  }
};
//get latest supplier by suplier id
async function getsupplierdata(valSupplier, plmToken, plmSkipValue) {
  try {
    const supplier = encodeURIComponent(valSupplier);
    if (supplier === "" || valSupplier === plmSkipValue) { return { node_name: "", latest_revision: "" }; }
    const resp = await axios.get(`${plmweburl}/csi-requesthandler/api/v2/supplier_items/${supplier}`, { headers: { Cookie: plmToken } });
    return { node_name: resp?.data.node_name, latest_revision: resp?.data?.latest_revision };
  } catch (error) {
    //console.error(error);
    throw new Error(`Failed to get the supplier details for suplier: ${valSupplier}. Error: ${error}`);
  }
};
//get material types
async function getmaterialtype(val_materialtype, plmToken, plmSkipValue) {
  try {
    const materialType = encodeURIComponent(val_materialtype);
    if (materialType === "" || val_materialtype === plmSkipValue) { return { node_name: "" }; }
    const resp_3 = await axios.get(`${plmweburl}/csi-requesthandler/api/v2/material_types/${materialType}`, { headers: { Cookie: plmToken } });
    return { node_name: resp_3?.status === 200 ? resp_3?.data.node_name : "" };
  } catch (error) {
    //console.error(error);
    throw new Error(`Failed to get the material type details for material type: ${val_materialtype}. Error: ${error}`);
  }
};
//get revised supplier item by item
async function getcuttablewidth(val_supp_item_rev, plmToken, plmSkipValue) {
  return '54'; //This was added becuase there is an error in plm api
  try {
    if (!val_supp_item_rev || val_supp_item_rev === plmSkipValue) { return { cw: '' }; }
    const supplierItem = encodeURIComponent(val_supp_item_rev);
    const response = await axios.get(`${plmweburl}/csi-requesthandler/api/v2/supplier_item_revisions/${supplierItem}`, { Cookie: plmToken });
    if (response.status === 200) { return { cw: response.data }; }
    return { cw: '' };
  } catch (error) {
    //console.error(error);
    throw new Error(`Failed to get the cuttable width for supplier item: ${val_supp_item_rev}. Error: ${error}`);
  }
};
//End: get plm bom items

//Start: get plm revised bom color details
// Define the handler function for adding PLM colors
async function updateplmcolordata(req, res, colorset, config) {
  try {
    // Get the fabric ID and color set from the request body
    const { fabric_yyid } = req.body;
    // Check if the fabric ID and color set are valid
    if (!fabric_yyid || !colorset || colorset.length === 0) {
      throw new Error("Oops! invalid input data set in update plm color data.");
    }
    // Get the dye roots from the filtered config data
    const { dyeRoots } = config;

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
      return colorset;
    } catch (error) {
      // If an error occurs, roll back the transaction and throw the error
      await client.query('ROLLBACK');
      throw new Error(`Failed to insert plm colorways details into table. Error: ${error}`);
    } finally {
      // Release the database connection
      client.release();
    }
  } catch (error) {
    // If an error occurs, log it and send an error response
    //console.error(err);
    throw new Error(`Failed to update plm color data. Error: ${error}`);
  }
};
// Map a color name to a new name using the dye roots
function dyerootmap(value, dyeRoots) {
  let result = value;
  try {
    for (const regex of dyeRoots) {
      result = result.replace(regex[0], regex[1]);
    }
    return result;
  } catch (error) {
    throw new Error(`Failed to get the dye root map for color: ${value}. Error: ${error}`);
  }
};
//End: get plm revised bom color details

//Start: save plm retrived items in database
//save plm items in database
async function postplmitemdata(req, res, itemset, plmToken, config) {
  try {
    const { fabric_yyid, isAmendmant } = req.body;
    const { plmSkipValue, letterNumber } = config;
    //console.log('plm fabric items: ', itemset);

    const promises = itemset?.map(async (obj_itemset) => {
      const { color_way_colors, ...rest } = obj_itemset;
      const sanitizedRest = Object.fromEntries(Object.entries(rest).map(([k, v]) => [k, sanitizeString(v)]));
      let inc_val = 0;
      if (!isAmendmant) {
        const sqlqry_delete = `DELETE FROM plm_items WHERE fabyy_id='${fabric_yyid}';`;
        await pool.query(sqlqry_delete);
      }
      //console.log("color_way_colors: ",color_way_colors);
      const colorwayPromises = color_way_colors?.map(async (color) => {
        const nameofmatcolor = await getcolorname(color, plmSkipValue, letterNumber, plmToken, plmweburl);
        const sanitizedColor = sanitizeString(nameofmatcolor.node_name);
        //console.log("sanitizedColor: ",sanitizedColor);
        if (sanitizedColor && !sanitizedColor.match(letterNumber)) {
          const { item_name, placement, description, color_way_type, supplier, material_type, cuttable_width } = sanitizedRest;
          inc_val += 1;
          const sqlqry_insert = `INSERT INTO plm_items(fabyy_id, plm_item_id, plm_actual, plm_item_name, plm_item_desc, plm_colorway_type, plm_supplier, plm_fab_type, plm_cw, plm_placement, plm_color, gmt_color_order)
            VALUES ('${fabric_yyid}', '${obj_itemset.id}', '${obj_itemset.actual}', '${sanitizeString(item_name)}', '${sanitizeString(description)}', '${sanitizeString(color_way_type)}', '${sanitizeString(supplier)}', '${sanitizeString(material_type)}', '${sanitizeString(cuttable_width)}', '${sanitizeString(placement)}', '${sanitizedColor}', '${inc_val}');`;
          await pool.query(sqlqry_insert);
        }
      });
      await Promise.all(colorwayPromises);
    });
    await Promise.all(promises);
    return { Type: 'SUCCESS', Msg: 'success' };
  } catch (error) {
    throw new Error(`Failed to post plm item related data. Error: ${error}`);
  }
};
//get color names
async function getcolorname(val_color, plmSkipValue, letterNumber, plmToken, plmweburl) {
  if (!val_color.match(letterNumber) || val_color === plmSkipValue) { return { node_name: '', colorcode: val_color }; }
  try {
    const response = await axios.get(`${plmweburl}/csi-requesthandler/api/v2/color_materials/${val_color}`, { headers: { Cookie: `${plmToken}` } });
    return { node_name: response?.data.node_name, node_id: response?.data.id, colorcode: val_color };
  } catch (error) {
    throw new Error(`Failed to fletch the color related data for color: ${val_color}. Error: ${error}`);
  }
}
//sanitize prase
function sanitizeString(value) {
  return String(value).replace(/'/g, "''");
}

//End: save plm retrived items in database

//Start: save yy data that retieved from plm
//save yy data
async function postplmyydata(req, res, plmToken, config) {
  try {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      throw new Error("Oops! empty input data set in request headers.");
    }

    if (Object.keys(req.body).length < 5) {
      throw new Error("Oops! can't find correct dataset in request body in post plm yy data.");
    }

    const { letterNumber } = config;
    const { isAmendmant, fabric_yyid, plmstyleid, plmseasonid, plmbomid } = req.body;

    const var_fabricyyid = fabric_yyid;
    const var_plmstyleid = plmstyleid;
    const var_plmseasonid = plmseasonid;
    const var_plmbomid = plmbomid;
    const var_update = moment().format("YYYY-MM-DD HH:mm:ss");
    const var_token = plmToken;

    if (!isAmendmant) {
      const sqlqry_delete = `DELETE FROM fabricyy_details WHERE fabyy_id='${var_fabricyyid}';`;
      await pool.query(sqlqry_delete);
    }

    const seasonname = await getseasonname(var_plmseasonid, letterNumber, var_token);
    const bomname = await getbomname(var_plmbomid, var_token, letterNumber);
    const sqlqry = `INSERT INTO fabricyy_details(fabyy_id, plm_style, plm_seasonid, plm_seasonname, plm_bomid, plm_bomname, bom_syncdt) VALUES ('${var_fabricyyid}','${var_plmstyleid}','${var_plmseasonid}','${seasonname}','${var_plmbomid}','${bomname}','${var_update}');`;

    await pool.query(sqlqry);
    return { Type: 'SUCCESS', Msg: 'success' };
  } catch (error) {
    throw new Error(`Failed to insert the data to fabric yy- details. Error: ${error}`);
  }
};
//get bom name
async function getbomname(val_bom, token, letterNumber) {
  if (!val_bom.match(letterNumber)) {
    return '';
  }

  try {
    const { data } = await axios.get(`${plmweburl}/csi-requesthandler/api/v2/apparel_boms/${val_bom}`, {
      headers: { Cookie: token },
    });

    return data.node_name || '';
  } catch (error) {
    //console.error(error);
    throw new Error(`Failed to fletch the season related data for bom id: ${val_bom}. Error: ${error}`);
  }
}
//get season name
async function getseasonname(val_season, letterNumber, plmToken) {
  try {
    if (!val_season?.match(letterNumber)) return '';
    const { data, status } = await axios.get(`${plmweburl}/csi-requesthandler/api/v2/seasons/${val_season}`, { headers: { Cookie: plmToken } });
    return status === 200 ? data.node_name : '';
  } catch (error) {
    //console.error(error);
    throw new Error(`Failed to fetch the season related data for season id: ${val_season}. Error: ${error}`);
  }
}

//End: save yy data that retieved from plm
//End Step 02


