const axios = require('axios');
const plmurl = require('../plmurl');
const plmSessionApi = require('./plmsessiontoken');

// Export an async function that handles the request and response
module.exports = async (req, res) => {
    // Get the API URL and PLM token using functions from other modules
    const { apiurl } = plmurl;
    const plmToken = await plmSessionApi(req, res);

    // Get the style season ID from the request body
    const styleseasonid = req.body.seasonid;
    // Encode the style season ID for use in the API URL
    const enc_styleseasonid = encodeURIComponent(styleseasonid);
    // Call the getApprovedBomList function to get the list of approved BOMs
    const bomlist = await getApprovedBomList(apiurl, enc_styleseasonid, plmToken);

    if (!bomlist) {
        res.status(400).json({ Type: 'Error', Msg: 'Opss! there is no approved BOMSs found.' });
    }

    // Send a JSON response with the list of approved BOMs
    res.status(200).json({ Type: 'SUCCESS', Data: bomlist });
};

// Async function to get the list of approved BOMs
async function getApprovedBomList(apiurl, enc_styleseasonid, plmToken) {
    // Call the PLM API to get the list of BOMs for the given style season ID
    const resp = await axios.get(`${apiurl}/csi-requesthandler/api/v2/styles/${enc_styleseasonid}/data_sheets/apparel_boms`, {
        params: { skip: 0, limit: 50 },
        headers: { Cookie: plmToken }
    });

    // Use Promise.all to run the getIsApproved function on each BOM in parallel
    const approvedBomList = await Promise.all(
        resp.data.map(async (bom) => {
            // Call the getIsApproved function to check if the BOM is approved
            const bomstatus = await getIsApproved(bom.latest_revision, apiurl, plmToken);
            // If the BOM is approved, add it to the list with its ID, latest revision, and node name
            if (bomstatus.state === 'APPROVED') {
                return { id: bom.id, latest_revision: bom.latest_revision, node_name: bom.node_name };
            }
        })
    );

    // Filter out any undefined values (i.e., BOMs that were not approved)
    return approvedBomList.filter((bom) => bom !== undefined);
}

// Async function to check if a BOM is approved
async function getIsApproved(val_item, apiurl, plmToken) {
    // Encode the BOM's latest revision for use in the API URL
    const letterNumber = encodeURIComponent(val_item);
    if (letterNumber !== '' && val_item !== 'centric%3A') {
        try {
            // Call the PLM API to get the state of the BOM's latest revision
            const bomstatus = await axios.get(`${apiurl}/csi-requesthandler/api/v2/apparel_bom_revisions/${letterNumber}`, {
                headers: {
                    Cookie: plmToken
                }
            });
            // Return an object with the state of the BOM's latest revision
            return { state: bomstatus.data.state };
        } catch (error) {
            // Log any errors and return an object with an empty state
            return res.status(400).json({ Type: "ERROR", Msg: error.message });
        }
    } else {
        // Return an object with an empty state if the latest revision is invalid
        return { state: '' };
    }
}
