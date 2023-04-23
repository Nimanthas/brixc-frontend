const axios = require('axios')
const plmurl = require('../plmurl')
const plmSessionApi = require('./plmsessiontoken');

module.exports = async (req, res) => {

    var revbomid = req.body.revbomid;

    var colorways = [];

    const plmToken = await plmSessionApi(req, res);


    var enc_revbomid = encodeURIComponent(revbomid);
    var plmweburl = plmurl.apiurl;

    const resp = await axios.get(`${plmweburl}/csi-requesthandler/api/v2/apparel_bom_revisions/${enc_revbomid}`, {
        headers: {
            Cookie: `${plmToken}`
        }
    });

    for (var i = 0; i < resp.data.bom_product_colors.length; i++) {
        var val_seq = i + 1;
        let resp2 = await getColor(resp.data.bom_product_colors[i]);

        if (resp2.node_name !== '') {

            colorways.push({ id: resp.data.bom_product_colors[i], name: resp2.node_name, desc: resp2.description, garmentway: resp2.bx_garment_way, colorway: resp2.bx_colorway_name, seq: val_seq });

        }
    }

    res.status(200).json({ Type: 'SUCCESS', Dataset: resp.data, colorways: colorways })
    return;


    async function getColor(val_item) {

        var letterNumber = encodeURIComponent(val_item);

        if (letterNumber !== "" && val_item !== "centric%3A") {
            let resp_color = await axios.get(`${plmweburl}/csi-requesthandler/api/v2/colorways/${letterNumber}`, {
                headers: {
                    Cookie: `${plmToken}`
                }
            });

            if (resp_color.status === 200) {
                return ({ node_name: resp_color.data.node_name, description: resp_color.data.description, bx_garment_way: resp_color.data.bx_garment_way, bx_colorway_name: resp_color.data.bx_colorway_name });
            }
            else {
                return ({ node_name: '', description: '', bx_garment_way: '', bx_colorway_name: '' });
            }
        }
        else {
            return ({ node_name: '', description: '', bx_garment_way: '', bx_colorway_name: '' });
        }

    }

};


