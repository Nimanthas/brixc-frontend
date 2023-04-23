const { pool } = require('../dbconfig');
const moment = require('moment');

module.exports = async (req, res) => {
  let output = [];
  try {
    const [requestDetails, plmItems, plmBOMItems, plmColorways, olrSizes, olrData, sizeTemplates] = await Promise.all([
      getfabricyyrequestdetails(req, res),
      getplmitemsindb(req, res),
      getplmbomitems(req, res),
      getplmcolorways(req, res),
      getolrsizes(req, res),
      getolrdata(req, res),
      getsizetemplates(req, res)
    ]);

    output = [{ requestdetails: requestDetails?.rows, plmitems: plmItems?.rows, plmbomitems: plmBOMItems?.rows, plmcolorways: plmColorways?.rows, olrsizes: olrSizes?.rows, olrdata: olrData?.rows, sizetemplates: sizeTemplates?.rows }];

    res.status(200).json({ Type: "SUCCESS", Data: output });
  } catch (error) {
    console.log("error in getfabricyyrequestrefresheddata :", error);
    res.status(400).json({ Type: "ERROR", Msg: error.message });
  }
};

//get plm items in db
async function getplmitemsindb(req, res) {
  try {
    // Get fabricyyid from request parameters
    const { fabyyid } = req.params;

    //Check the validity of fabyyid
    if (!fabyyid) {
      throw new Error("Oops! empty data set in header on get plm items in database for the fabric yy request.");
    }

    const sqlqry = `WITH max_item_id AS (
                      SELECT MAX(item_id) AS item_id, MAX(plm_item_id) AS plm_item_id, fabyy_id, plm_item_name, plm_item_desc, plm_color, vpono, gmt_color_order
                      FROM plm_items_vpo
                      WHERE fabyy_id = ${fabyyid} AND plm_fab_type = 'Fabric'
                      GROUP BY fabyy_id, plm_item_name, plm_item_desc, plm_color, vpono, gmt_color_order
                    )
                    SELECT mi.item_id, mi.plm_item_id, pv.plm_actual, pv.plm_item_name, pv.plm_item_desc, pv.plm_colorway_type, pv.plm_supplier, 
                          pv.plm_fab_type, pv.plm_cw, pv.plm_placement, pv.plm_color, pv.vpono, pv.item_price,
                          TO_CHAR(pv.item_ordering::date,'yyyy/mm/dd') AS item_ordering,
                          TO_CHAR(pv.item_order_rev1::date,'yyyy/mm/dd') AS item_order_rev1,
                          TO_CHAR(pv.item_order_rev2::date,'yyyy/mm/dd') AS item_order_rev2,
                          TO_CHAR(pv.item_order_rev3::date,'yyyy/mm/dd') AS item_order_rev3,
                          pv.item_comment, pv.gmt_color_order,
                          (SELECT DISTINCT plm_colorways.cw_name 
                            FROM plm_colorways 
                            WHERE plm_colorways.fabyy_id = ${fabyyid} AND plm_colorways.cw_order = pv.gmt_color_order 
                            LIMIT 1) AS cw_name
                    FROM max_item_id mi
                    JOIN plm_items_vpo pv ON pv.item_id = mi.item_id AND pv.plm_item_name = mi.plm_item_name AND 
                    pv.plm_item_desc = mi.plm_item_desc AND pv.plm_color = mi.plm_color AND 
                    pv.vpono = mi.vpono AND pv.gmt_color_order = mi.gmt_color_order;`;
    return await pool.query(sqlqry);
  } catch (error) {
    console.log("error in getplmitemsindb: ", error);
    // Handle errors by sending error response with error message
    res.status(200).json({ Type: "ERROR", Msg: error.message });
  }
}
//get fabric yy request details
async function getfabricyyrequestdetails(req, res) {
  try {
    // Get fabricyyid from request parameters
    const { fabyyid } = req.params;

    // Check the validity of fabyyid
    if (!fabyyid) {
      throw new Error("Oops! empty data set in header on get fabric yy request details.");
    }

    // Construct SQL query to fetch data
    const sqlqry = `SELECT m.*, d.*, c.cus_name, f.fac_name 
                    FROM fabricyy_master m 
                    INNER JOIN sys_customer c ON m.cus_id = c.cus_id 
                    INNER JOIN sys_factory f ON m.fac_id = f.fac_id
                    LEFT JOIN fabricyy_details d ON m.fabyy_id = d.fabyy_id 
                    WHERE m.fabyy_status != 'Delete' AND m.fabyy_id = '${fabyyid}'`;

    // Execute SQL query and get result rows
    return await pool.query(sqlqry);
  } catch (error) {
    console.log("error in getfabricyyrequestdetails: ", error);
    // Handle errors by sending error response with error message
    res.status(400).json({ Type: "ERROR", Msg: error.message });
  }
}
//get plm bom items
async function getplmbomitems(req, res) {
  try {
    // Get fabricyyid from request parameters
    const { fabyyid } = req.params;

    //Check the validity of fabyyid
    if (!fabyyid) {
      throw new Error("Oops! empty data set in header on plm bom items in database for the fabric yy request.");
    }

    const sqlqry = `SELECT DISTINCT i.*, c.cw_name AS gmt_color
                  FROM plm_items i
                  INNER JOIN plm_colorways c ON c.fabyy_id = i.fabyy_id AND c.cw_order = i.gmt_color_order
                  WHERE i.fabyy_id = ${fabyyid}
                  ORDER BY i.plm_fab_type, i.plm_placement, gmt_color, c.cw_name;`;

    return await pool.query(sqlqry);
  } catch (error) {
    console.log("error in getplmbomitems: ", error);
    // Handle errors by sending error response with error message
    res.status(200).json({ Type: "ERROR", Msg: error.message });
  }
};
//get plm colorways
async function getplmcolorways(req, res) {
  try {
    // Get fabricyyid from request parameters
    const { fabyyid } = req.params;

    //Check the validity of fabyyid
    if (!fabyyid) {
      throw new Error("Oops! empty data set in header on get plm colorways in database for the fabric yy request.");
    }

    const sqlqry = `SELECT plm_cw_id, cw_name, cw_desc, colorway, garmentway, cw_order
                  FROM plm_colorways
                  WHERE fabyy_id = ${fabyyid}
                  ORDER BY cw_order;`;

    return await pool.query(sqlqry);
  } catch (error) {
    console.log("error in getplmcolorways: ", error);
    // Handle errors by sending error response with error message
    res.status(200).json({ Type: "ERROR", Msg: error.message });
  }
};
//get olr sizes
async function getolrsizes(req, res) {
  try {
    // Get fabricyyid from request parameters
    const { fabyyid } = req.params;

    //Check the validity of fabyyid
    if (!fabyyid) {
      throw new Error("Oops! empty data set in header on get olr sizes in database for the fabric yy request.");
    }

    const sqlqry = `SELECT sizename 
                  FROM olr_sizeset 
                  WHERE fabyy_id = ${fabyyid};`;

    return await pool.query(sqlqry);
  } catch (error) {
    console.log("error in getplmcolorways: ", error);
    // Handle errors by sending error response with error message
    res.status(200).json({ Type: "ERROR", Msg: error.message });
  }
};
//get olr data
async function getolrdata(req, res) {
  // Get fabricyyid from request parameters
  const { fabyyid } = req.params;

  // Check if req.params is undefined or null
  if (!fabyyid) {
    res.status(200).json({ Type: "ERROR", Msg: "Oops! empty data set in header on get olr data in database for the fabric yy request." });
    return;
  }

  try {
    //define queries
    const sqlqry01 = `WITH sub_totals AS (
                    SELECT 
                      olr_item_id, 
                      COALESCE(s1_qty, 0) + COALESCE(s2_qty, 0) + COALESCE(s3_qty, 0) + COALESCE(s4_qty, 0) + COALESCE(s5_qty, 0) + 
                      COALESCE(s6_qty, 0) + COALESCE(s7_qty, 0) + COALESCE(s8_qty, 0) + COALESCE(s9_qty, 0) + COALESCE(s10_qty, 0) + 
                      COALESCE(s11_qty, 0) + COALESCE(s12_qty, 0) + COALESCE(s13_qty, 0) + COALESCE(s14_qty, 0) + COALESCE(s15_qty, 0) + 
                      COALESCE(s16_qty, 0) + COALESCE(s17_qty, 0) + COALESCE(s18_qty, 0) + COALESCE(s19_qty, 0) + COALESCE(s20_qty, 0) + 
                      COALESCE(s21_qty, 0) + COALESCE(s22_qty, 0) + COALESCE(s23_qty, 0) + COALESCE(s24_qty, 0) + COALESCE(s25_qty, 0) + 
                      COALESCE(s26_qty, 0) + COALESCE(s27_qty, 0) + COALESCE(s28_qty, 0) + COALESCE(s29_qty, 0) + COALESCE(s30_qty, 0) AS sub_total 
                    FROM olr_items 
                    WHERE fabyy_id = ${fabyyid}
                  )
                  SELECT 
                    oi.*, 
                    st.sub_total 
                  FROM olr_items oi 
                  JOIN sub_totals st ON oi.olr_item_id = st.olr_item_id 
                  WHERE oi.fabyy_id = ${fabyyid}
                  ORDER BY oi.color, oi.vpono;`;
    const sqlqry02 = `SELECT * FROM public.olr_data WHERE fabyy_id = ${fabyyid};`;

    // use Promise.all to execute both SQL queries in parallel
    const [results01, results02] = await Promise.all([pool.query(sqlqry01), pool.query(sqlqry02)]);

    // check if either of the query results contain rows
    if (results01.rows?.length) {
      return results01;
    } else if (results02.rows?.length) {
      return results02;
    } else {
      return {rows: []};
    }
  } catch (error) {
    res.status(200).json({ Type: "ERROR", Msg: error.message });
  }
}
//get size templates
async function getsizetemplates(req, res) {
  let results = [];
  try {
    // Get fabricyyid from request parameters
    const { fabyyid } = req.params;

    //Check the validity of fabyyid
    if (!fabyyid) {
      throw new Error("Oops! empty data set in header on get size templates from database for the fabric yy request.");
    }

    const sqlqry = `SELECT temp_id, temp_name 
                  FROM sys_sizetemplate 
                  INNER JOIN fabricyy_master ON sys_sizetemplate.cus_id = fabricyy_master.cus_id
                  WHERE temp_active = 'true' AND fabricyy_master.fabyy_id = '${fabyyid}' 
                  ORDER BY temp_name;`;

    return await pool.query(sqlqry);
  } catch (error) {
    console.log("error in getsizetemplates: ", error);
    // Handle errors by sending error response with error message
    res.status(200).json({ Type: "ERROR", Msg: error.message });
  }
};
