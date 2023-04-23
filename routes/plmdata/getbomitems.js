const axios = require('axios')
const plmurl = require('../plmurl')

module.exports = async (req, res) => {

    var itemlistids = req.body.itemlistids;
    var usertoken = req.body.token;

    var items_fabric = [];
    var items_fabric_name = [];

    var plmweburl = plmurl.apiurl;

    for (var i = 0; i < itemlistids.length; i++) {
        var letterNumber = encodeURIComponent(itemlistids[i]);

        if (letterNumber !== "" && itemlistids[i] !== "centric%3A") {
            let resp = await axios.get(`${plmweburl}/csi-requesthandler/api/v2/part_materials/${letterNumber}`, {
                headers: {
                    Cookie: `${usertoken}`
                }
            });



            if (resp.status === 200) {

                var nameofitem = await getitemname(resp.data.actual);
                var dataofsupplier = await getsupplierdata(resp.data.bom_line_quote);
                var nameofmattype = await getmaterialtype(nameofitem.product_type);
                var minimumcuttablewidth = await getcuttablewidth(dataofsupplier.latest_revision);


                if (nameofmattype.node_name === "Fabric" || nameofmattype.node_name === "Embellishments and Graphics" || nameofmattype.node_name === "Washes and Finishes") {
                    items_fabric.push({
                        id: itemlistids[i],
                        actual: resp.data.actual,
                        placement: resp.data.node_name,
                        color_way_type: resp.data.bx_colorway_type,
                        color_way_colors: resp.data.colorways_color,
                        garment_way: resp.data.bx_garment_way,
                        cuttable_width: minimumcuttablewidth.cw,
                        item_name: nameofitem.node_name,
                        description: nameofitem.description,
                        supplier: dataofsupplier.node_name,
                        material_type: nameofmattype.node_name,
                    });
                }
            }
        }
    }

    res.status(200).json({ Type: 'SUCCESS', Dataset: items_fabric })
    return;

    async function getitemname(val_item) {

        var letterNumber = encodeURIComponent(val_item);

        if (letterNumber !== "" && val_item !== "centric%3A") {
            let resp_1 = await axios.get(`${plmweburl}/csi-requesthandler/api/v2/materials/${letterNumber}`, {
                headers: {
                    Cookie: `${usertoken}`
                }
            });

            if (resp_1.status === 200) {
                return ({ node_name: resp_1.data.node_name, description: resp_1.data.description, product_type: resp_1.data.product_type });
            }
            else {
                return ({ node_name: '', description: '', product_type: '' });
            }
        }
        else {
            return ({ node_name: '', description: '', product_type: '' });
        }

    }

    async function getsupplierdata(val_supplier) {
        var letterNumber = encodeURIComponent(val_supplier);

        if (letterNumber !== "" && val_supplier !== "centric%3A") {

            let resp_2 = await axios.get(`${plmweburl}/csi-requesthandler/api/v2/supplier_items/${letterNumber}`, {
                headers: {
                    Cookie: `${usertoken}`
                }
            });

            if (resp_2.status === 200) {
                return ({ node_name: resp_2.data.node_name, latest_revision: resp_2.data.latest_revision });
            }
            else {
                return ({ node_name: '', latest_revision: '' });
            }
        }
        else {
            return ({ node_name: '', latest_revision: '' });
        }


    }

    async function getmaterialtype(val_materialtype) {
        var letterNumber = encodeURIComponent(val_materialtype);

        if (letterNumber !== "" && val_materialtype !== "centric%3A") {

            let resp_3 = await axios.get(`${plmweburl}/csi-requesthandler/api/v2/material_types/${letterNumber}`, {
                headers: {
                    Cookie: `${usertoken}`
                }
            });

            if (resp_3.status === 200) {
                return ({ node_name: resp_3.data.node_name });
            }
            else {
                return ({ node_name: '' });
            }
        }
        else {
            return ({ node_name: '' });
        }


    }

    async function getcuttablewidth(val_supp_item_rev) {
        var letterNumber = encodeURIComponent(val_supp_item_rev);

        if (letterNumber !== '' && val_supp_item_rev !== '' && val_supp_item_rev !== "centric%3A") {

            let resp_3 = await axios.get(`${plmweburl}/csi-requesthandler/api/v2/supplier_item_revisions/${letterNumber}`, {
                headers: {
                    Cookie: `${usertoken}`
                }
            });

            if (resp_3.status === 200) {
                return ({ cw: resp_3.data.bx_minimum_cuttable_width });
            }
            else {
                return ({ cw: '' });
            }
        }
        else {
            return ({ cw: '' });
        }


    }

};


