// Require necessary dependencies
const axios = require('axios');
const plmurl = require('../plmurl');
const plmSessionApi = require('./plmsessiontoken');

// Export an asynchronous function to handle the HTTP request
module.exports = async (req, res) => {
    try {
        // Extract the "revbomid" property from the HTTP request body
        const { revbomid } = req.body;
        // Check if the fabric ID and color set are valid
        if (!revbomid) {
          throw new Error("Oops! invalid input data set in get plm bom revise data.");
        }
        // Call an asynchronous function to get a PLM session token
        const plmToken = await plmSessionApi(req, res);
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
        res.status(200).json({ Type: 'SUCCESS', Data: [], BomData: data, Colorways: colorways });
      } catch (error) {
        // If an error occurs, send an HTTP response with an appropriate error status code and a JSON body containing an error message
        res.status(error.response?.status ?? 500).json({ Type: 'ERROR', Message: error.message });
      }
};
