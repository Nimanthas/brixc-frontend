// Import necessary modules
const axios = require('axios');
const { pool } = require('../dbconfig');
const plmurl = require('../plmurl');
const plmSessionApi = require('./plmsessiontoken');

// Export an async function as the module's main function
module.exports = async (req, res) => {
    try {
        // Get the session token from PLM
        const plmToken = await plmSessionApi(req, res);

        // Get the style ID from the request body
        const { styleid } = req.body;
        // Get the PLM API URL from a config file
        const { apiurl } = plmurl;

        // Make an HTTP GET request to retrieve styles from PLM
        const { data } = await axios.get(`${apiurl}/csi-requesthandler/api/v2/styles`, {
            params: {
                node_name: encodeURIComponent(styleid), // Specify the style ID to retrieve
                active: true, // Filter out inactive styles
                bx_style_status: 'Confirmed', // Filter by the 'Confirmed' status
                skip: 0, // Skip the first 0 records
                limit: 50 // Retrieve a maximum of 50 records
            },
            headers: { Cookie: plmToken } // Pass the session token as a cookie
        });

        // Create an array of seasons using data from the previous request
        const seasonlist = await Promise.all(data.map(async ({ parent_season: parentSeason, id: idstyle }) => {
            // Make an HTTP GET request to retrieve the season for each style
            const { data: { id: idseason, node_name: fs } } = await axios.get(`${apiurl}/csi-requesthandler/api/v2/seasons/${encodeURIComponent(parentSeason)}`, {
                headers: { Cookie: plmToken } // Pass the session token as a cookie
            });
            return { idstyle, idseason, fs }; // Return an object with the style ID, season ID, and season name
        }));

        // Send a response with the array of seasons
        res.status(200).json({ Type: 'SUCCESS', Data: seasonlist });
    } catch (error) {
        // Send an error response if an error occurs
        res.status(500).json({ Type: 'ERROR', Msg: error.message, Data: [] });
    }
};
