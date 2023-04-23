const axios = require('axios');
const configData = require('../../common/config.list');
const plmweburl = require('../plmurl').apiurl;
const plmSessionApi = require('./plmsessiontoken');

module.exports = async (req, res) => {
    try {
        const { itemlistids } = req.body;
        const items_fabric = [];

        const plmToken = await plmSessionApi(req, res);

        // Filter config data based on customer ID
        const filteredConfig = configData.filter(config => config.cus_id === 1);
        if (filteredConfig?.length === 0) {
            throw new Error("Oops! can't find correct dataset to post upload olr data.");
        }
        const config = filteredConfig[0]?.plmValidations;
        const { matTypes, plmSkipValue } = config;

        for (const itemId of itemlistids) {
            const letterNumber = encodeURIComponent(itemId);
            if (letterNumber === '' || itemId === plmSkipValue) continue;

            const { data: { actual, bom_line_quote, bx_colorway_type, colorways_color, bx_garment_way, node_name } } = await axios.get(`${plmweburl}/csi-requesthandler/api/v2/part_materials/${letterNumber}`, { headers: { Cookie: plmToken } });

            const nameofitem = await getitemname(actual, plmToken, plmSkipValue);
            const dataofsupplier = await getsupplierdata(bom_line_quote, plmToken, plmSkipValue);
            const nameofmattype = await getmaterialtype(nameofitem.product_type, plmToken, plmSkipValue);
            const minimumcuttablewidth = 54; //await getcuttablewidth(dataofsupplier.latest_revision, plmToken, plmSkipValue);

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
        res.status(200).json({ Type: 'SUCCESS', Data: items_fabric });
    } catch (error) {
        console.error(error);
        res.status(500).json({ Type: 'ERROR', Msg: error.message });
    }
};

//get item name by item code
async function getitemname(val_item, plmToken, plmSkipValue) {
    try {
        const letterNumber = encodeURIComponent(val_item);
        if (letterNumber === "" || val_item === plmSkipValue) { return { node_name: '', description: '', product_type: '' }; }
        const response = await axios.get(`${plmweburl}/csi-requesthandler/api/v2/materials/${letterNumber}`, { headers: { Cookie: plmToken } });
        return { node_name: response?.data.node_name, description: response?.data.description, product_type: response?.data.product_type };
    } catch (error) {
        console.error(error);
        return { node_name: '', description: '', product_type: '' };
    }
};
//get latest supplier by suplier id
async function getsupplierdata(valSupplier, plmToken, plmSkipValue) {
    try {
        const letterNumber = encodeURIComponent(valSupplier);
        if (letterNumber === "" || valSupplier === plmSkipValue) { return { node_name: "", latest_revision: "" }; }
        const resp = await axios.get(`${plmweburl}/csi-requesthandler/api/v2/supplier_items/${letterNumber}`, { headers: { Cookie: plmToken } });
        return { node_name: resp?.data.node_name, latest_revision: resp?.data?.latest_revision };
    } catch (error) {
        console.error(error);
        return { node_name: "", latest_revision: "" };
    }
};
//get material types
async function getmaterialtype(val_materialtype, plmToken, plmSkipValue) {
    try {
        const letterNumber = encodeURIComponent(val_materialtype);
        if (letterNumber === "" || val_materialtype === plmSkipValue) { return { node_name: "" }; }
        const resp_3 = await axios.get(`${plmweburl}/csi-requesthandler/api/v2/material_types/${letterNumber}`, { headers: { Cookie: plmToken } });
        return { node_name: resp_3?.status === 200 ? resp_3?.data.node_name : "" };
    } catch (error) {
        console.error(error);
        return { node_name: "" };
    }
};
//get revised supplier item by item
async function getcuttablewidth(val_supp_item_rev, plmToken, plmSkipValue) {
    try {
        if (!val_supp_item_rev || val_supp_item_rev === plmSkipValue) { return { cw: '' }; }
        const letterNumber = encodeURIComponent(val_supp_item_rev);
        const response = await axios.get(`${plmweburl}/csi-requesthandler/api/v2/supplier_item_revisions/${letterNumber}`, { Cookie: plmToken });
        if (response.status === 200) { return { cw: response.data }; }
        return { cw: '' };
    } catch (error) {
        console.error(error);
        return { cw: '' };
    }
};



