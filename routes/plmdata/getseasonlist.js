const axios = require('axios');
const { pool } = require('../dbconfig');
const plmurl = require('../plmurl');
const plmSessionApi = require('./plmsessiontoken');

module.exports = async (req, res) => {
    try {
        const plmToken = await plmSessionApi(req, res);
        const { styleid } = req.body;
        const { apiurl } = plmurl;
        const { data } = await axios.get(`${apiurl}/csi-requesthandler/api/v2/styles`, {
            params: { node_name: encodeURIComponent(styleid), active: true, bx_style_status: 'Confirmed', skip: 0, limit: 50 },
            headers: { Cookie: plmToken }
        });
        const seasonlist = await Promise.all(data.map(async ({ parent_season: parentSeason, id: idstyle }) => {
            const { data: { id: idseason, node_name: fs } } = await axios.get(`${apiurl}/csi-requesthandler/api/v2/seasons/${encodeURIComponent(parentSeason)}`, {
                headers: { Cookie: plmToken }
            });
            return { idstyle, idseason, fs };
        }));
        res.status(200).json({ Type: 'SUCCESS', Data: seasonlist });
    } catch (error) {
        res.status(200).json({ error: error.message });
    }
};
