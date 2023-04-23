const axios = require('axios');
const plmurl = require('../plmurl');
const plmSessionApi = require('./plmsessiontoken');

module.exports = async (req, res) => {
    try {
        const { revbomid } = req.body;

        const plmToken = await plmSessionApi(req, res);

        const { data } = await axios.get(`${plmurl.apiurl}/csi-requesthandler/api/v2/apparel_bom_revisions/${encodeURIComponent(revbomid)}`, {
            headers: { Cookie: plmToken }
        });

        const colorways = await Promise.all(
            data.bom_product_colors.map(async (color, index) => {
                const { data: colorData } = await axios.get(`${plmurl.apiurl}/csi-requesthandler/api/v2/colorways/${encodeURIComponent(color)}`, {
                    headers: { Cookie: plmToken }
                });

                if (!colorData.node_name) {
                    return null;
                }

                return { id: color, name: colorData.node_name, desc: colorData.description, garmentway: colorData.bx_garment_way, colorway: colorData.bx_colorway_name, seq: index + 1 };
            })
        ).then((colors) => colors.filter(Boolean));

        res.status(200).json({ Type: 'SUCCESS', Data: data, colorways });
    } catch (error) {
        res.status(error.response?.status ?? 500).json({ Type: 'ERROR', Message: error.message });
    }
};
