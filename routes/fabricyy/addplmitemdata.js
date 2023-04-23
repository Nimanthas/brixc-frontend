const { pool } = require('../dbconfig');
const axios = require('axios');
const plmurl = require('../plmurl');

module.exports = async (req, res) => {

  //Check Body Is Empty

  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {

    res.status(200).json({ Type: "ERROR", Msg: "Oops! Empty Data Set." })
    return;

  }

  //Check Element Count

  if (Object.keys(req.body).length < 3) {

    res.status(200).json({ Type: "ERROR", Msg: "Oops! Can't Find Correct Dataset" })
    return;

  }

    const var_fabricyyid = req.body.fabric_yyid;
    const var_itemset = req.body.itemset;
    const var_token = req.body.token;

    var plmweburl = plmurl.apiurl;

    
    //Amendmant 
    if(!req.body?.isAmendmant){
      var sqlqry_delete = `DELETE FROM plm_items WHERE fabyy_id='${var_fabricyyid}';`;
      var response_delete = await query(sqlqry_delete);
      console.log(`DELETE FROM plm_items WHERE fabyy_id=${var_fabricyyid}`);
    }

    for (var row_itemset in var_itemset) 
    {
      var obj_itemset = var_itemset[row_itemset];
      var obj_itemset_colors = var_itemset[row_itemset].color_way_colors;
      var inc_val = 0;

      for (var row_itemset_colors in obj_itemset_colors)
      {
        inc_val = inc_val + 1;
        var nameofmatcolor = await getcolorname(obj_itemset_colors[row_itemset_colors]);

        var letterNumber_check = /^[0-9a-zA-Z]+$/;

        if(nameofmatcolor.colorcode.match(letterNumber_check))
        {
            if(nameofmatcolor.node_name !== "")
            { 
              var valitem_name = String(obj_itemset.item_name).replace(/'/g, "''");
              var valitem_placement = String(obj_itemset.placement).replace(/'/g, "''");
              var valitem_description = String(obj_itemset.description).replace(/'/g, "''");
              var valitem_color_way_type = String(obj_itemset.color_way_type).replace(/'/g, "''");
              var valitem_supplier = String(obj_itemset.supplier).replace(/'/g, "''");
              var valitem_material_type = String(obj_itemset.material_type).replace(/'/g, "''");
              var valitem_nameofmatcolor = String(nameofmatcolor.node_name).replace(/'/g, "''");

                var sqlqry_insert = `INSERT INTO plm_items(fabyy_id, plm_item_id, plm_actual, plm_item_name, plm_item_desc, plm_colorway_type, plm_supplier, plm_fab_type, plm_cw, plm_placement, plm_color, gmt_color_order)
                VALUES ('${var_fabricyyid}', '${obj_itemset.id}', '${obj_itemset.actual}', '${valitem_name}', 
                '${valitem_description}', '${valitem_color_way_type}', '${valitem_supplier}', 
                '${valitem_material_type}', '${obj_itemset.cuttable_width}', 
                '${valitem_placement}', '${valitem_nameofmatcolor}', '${inc_val}');`;
                
                var response_insert = await query(sqlqry_insert);
            }
        } 
      }
    }

    res.status(200).json({ Type: "SUCCESS", Msg: "Item List Successfully Added."})
    return;
 
    async function getcolorname(val_color)
    {
        var letterNumber = /^[0-9a-zA-Z]+$/;

            if(val_color.match(letterNumber) && val_color !== "centric%3A")
            {
                let resp_1 = await axios.get(`${plmweburl}/csi-requesthandler/api/v2/color_materials/${val_color}`, {
                    headers: {
                        Cookie:`${var_token}`
                    }
                    });

                    if(resp_1.status === 200)
                    {
                        return ({node_name: resp_1.data.node_name, node_id:resp_1.data.id, colorcode:val_color});
                    }
                    else
                    {
                        return ({node_name: '', colorcode:val_color});
                    } 
            }
            else
            {
                return ({node_name: '', colorcode:val_color});
            }
        
    }
  
    async function query(q) {
      const client = await pool.connect()
      let res
      try {
        await client.query('BEGIN')
        try {
          res = await client.query(q)
          await client.query('COMMIT')
        } catch (err) {
          await client.query('ROLLBACK')
          throw err
        }
      } finally {
        client.release()
      }
      return res
    }
    
};