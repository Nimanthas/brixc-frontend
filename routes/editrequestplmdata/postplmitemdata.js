const { pool } = require('../dbconfig');
const axios = require('axios');
const plmweburl = require('../plmurl').apiurl;
const plmSessionApi = require('./plmsessiontoken');
const configData = require('../../common/config.list');
const requestDetails = require('../common/getrequestdetails');

module.exports = async (req, res) => {
  try {
    const { fabric_yyid, itemset, isAmendmant } = req.body;
    const plmToken = await plmSessionApi(req, res);
    //get request details by id
    let request = await requestDetails(req, res, fabyyid);
    // Filter config data based on customer ID
    const filteredConfig = configData.filter(config => config.cus_id === request?.cus_id);
    if (filteredConfig?.length === 0) {
      throw new Error("Oops! can't find correct dataset to post upload olr data.");
    }
    const config = filteredConfig[0]?.plmValidations;
    const { plmSkipValue, letterNumber } = config;
    if (!Object.keys(req.body).length) { return res.status(200).json({ Type: 'ERROR', Msg: 'Oops! empty data set in request header.' }); }
    if (Object.keys(req.body).length < 3) { return res.status(200).json({ Type: 'ERROR', Msg: "Oops! can't find correct dataset input in request header." }); }
    const promises = itemset.map(async (obj_itemset) => {
      const { color_way_colors, ...rest } = obj_itemset;
      const sanitizedRest = Object.fromEntries(Object.entries(rest).map(([k, v]) => [k, sanitizeString(v)]));
      let inc_val = 0;
      if (!isAmendmant) {
        const sqlqry_delete = `DELETE FROM plm_items WHERE fabyy_id='${fabric_yyid}';`;
        await pool.query(sqlqry_delete);
      }
      const colorwayPromises = color_way_colors.map(async (color) => {
        const nameofmatcolor = await getcolorname(color, plmSkipValue, letterNumber, plmToken, plmweburl);
        const sanitizedColor = sanitizeString(nameofmatcolor.node_name);
        if (sanitizedColor && sanitizedColor.match(letterNumber)) {
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
    return res.status(200).json({ Type: 'SUCCESS', Msg: 'item list successfully added.' });
  } catch (error) {
    return res.status(200).json({ Type: 'ERROR', Msg: error.message });
  }
};

//get color names
async function getcolorname(val_color, plmSkipValue, letterNumber, plmToken, plmweburl) {
  if (!val_color.match(letterNumber) || val_color === plmSkipValue) { return { node_name: '', colorcode: val_color }; }
  try {
    const response = await axios.get(`${plmweburl}/csi-requesthandler/api/v2/color_materials/${val_color}`, { headers: { Cookie: `${plmToken}` } });
    return { node_name: response?.data.node_name, node_id: response?.data.id, colorcode: val_color };
  } catch (error) {
    throw error;
  }
};
//sanitize prase
function sanitizeString(value) {
  return String(value).replace(/'/g, "''");
};

