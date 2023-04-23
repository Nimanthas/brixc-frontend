const { pool } = require('../dbconfig');
const moment = require('moment');
const axios = require('axios');
const plmurl = require('../plmurl');

module.exports = async (req, res) => {

  //Check Body Is Empty

  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {

    res.status(200).json({ Type: "ERROR", Msg: "Oops! Empty Data Set." })
    return;

  }

  //Check Element Count
console.log(`Lenght : ${Object.keys(req.body).length}`)
  if (Object.keys(req.body).length < 5) {

    res.status(200).json({ Type: "ERROR", Msg: "Oops! Can't Find Correct Dataset" })
    return;

  }

  var plmweburl = plmurl.apiurl;

  const var_fabricyyid = req.body.fabric_yyid;
  const var_plmstyleid = req.body.plmstyleid;
  const var_plmseasonid = req.body.plmseasonid;
  const var_plmbomid = req.body.plmbomid;
  const var_update = moment().format("YYYY-MM-DD HH:mm:ss");
  const var_token = req.body.token;

  
  
  //Amendmant 
if(!req.body?.isAmendmant){
    var sqlqry_delete = `DELETE FROM fabricyy_details WHERE fabyy_id='${var_fabricyyid}';`;
    pool.query(sqlqry_delete);
    console.log(`DELETE FROM fabricyy_details WHERE fabyy_id=${var_fabricyyid}`);
  }

  var seasonname = await getseaonname(var_plmseasonid,var_token);

  var bomname = await getbomname(var_plmbomid,var_token);

  var sqlqry = `INSERT INTO fabricyy_details(fabyy_id, plm_style, plm_seasonid, plm_seasonname, plm_bomid, plm_bomname, bom_syncdt) VALUES ('${var_fabricyyid}','${var_plmstyleid}','${var_plmseasonid}','${seasonname}','${var_plmbomid}','${bomname}','${var_update}');`;

  pool.query(sqlqry, (error, results) => {
    if (error) {
        res.status(200).json({ Type: "ERROR", Msg: "Ooops We Found Some Errors."})
        return;
    }
    else {
     
        res.status(200).json({ Type: "SUCCESS", Msg: "PLM Bom Data updated."})
        return;
    }

  })

  async function getseaonname(val_season,token)
    {
        var letterNumber = /^[0-9a-zA-Z]+$/;

            if(val_season.match(letterNumber))
            {
                let resp_1 = await axios.get(`${plmweburl}/csi-requesthandler/api/v2/seasons/${val_season}`, {
                    headers: {
                        Cookie:`${token}`
                    }
                    });

                    if(resp_1.status === 200)
                    {
                        return (resp_1.data.node_name);
                    }
                    else
                    {
                        return ('');
                    } 
            }
            else
            {
                return ('');
            }
        
    }

  
    async function getbomname(val_bom,token)
    {
        var letterNumber = /^[0-9a-zA-Z]+$/;

            if(val_bom.match(letterNumber))
            {
                let resp_1 = await axios.get(`${plmweburl}/csi-requesthandler/api/v2/apparel_boms/${val_bom}`, {
                    headers: {
                        Cookie:`${token}`
                    }
                    });

                    if(resp_1.status === 200)
                    {
                        return (resp_1.data.node_name);
                    }
                    else
                    {
                        return ('');
                    } 
            }
            else
            {
                return ('');
            }
        
    }

};