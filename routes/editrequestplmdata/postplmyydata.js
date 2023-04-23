const { pool } = require('../dbconfig');
const moment = require('moment');
const axios = require('axios');

module.exports = async (req, res) => {
  try {
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      throw new Error("Oops! empty input data set.");
    }

    if (Object.keys(req.body).length < 5) {
      throw new Error("Oops! can't find correct dataset");
    }

    const filteredConfig = configData.filter(config => config.cus_id === 1);

    if (!filteredConfig?.length) {
      throw new Error("Oops! can't find correct dataset to post upload olr data.");
    }

    const config = filteredConfig[0]?.plmValidations;
    const { letterNumber } = config;

    const var_fabricyyid = req.body.fabric_yyid;
    const var_plmstyleid = req.body.plmstyleid;
    const var_plmseasonid = req.body.plmseasonid;
    const var_plmbomid = req.body.plmbomid;
    const var_update = moment().format("YYYY-MM-DD HH:mm:ss");
    const var_token = req.body.token;
    const isAmendmant = req.body?.isAmendmant;

    if (!isAmendmant) {
      const sqlqry_delete = `DELETE FROM fabricyy_details WHERE fabyy_id='${var_fabricyyid}';`;
      await pool.query(sqlqry_delete);
    }

    const seasonname = await getseasonname(var_plmseasonid, letterNumber, var_token);
    const bomname = await getbomname(var_plmbomid, var_token, letterNumber);
    const sqlqry = `INSERT INTO fabricyy_details(fabyy_id, plm_style, plm_seasonid, plm_seasonname, plm_bomid, plm_bomname, bom_syncdt) VALUES ('${var_fabricyyid}','${var_plmstyleid}','${var_plmseasonid}','${seasonname}','${var_plmbomid}','${bomname}','${var_update}');`;

    await pool.query(sqlqry);
    res.status(200).json({ Type: "SUCCESS", Msg: "PLM bom data updated." });
  } catch (error) {
    console.error(error);
    res.status(200).json({ Type: "ERROR", Msg: "Oops! We found some errors query. " + error.message });
  }
};

async function getbomname(val_bom, token, letterNumber) {
  if (!val_bom.match(letterNumber)) {
    return '';
  }

  try {
    const { data } = await axios.get(`${plmweburl}/csi-requesthandler/api/v2/apparel_boms/${val_bom}`, {
      headers: { Cookie: token },
    });

    return data.node_name || '';
  } catch (error) {
    console.error(error);
    return '';
  }
}

async function getseasonname(val_season, letterNumber, plmToken) {
  try {
    if (!letterNumber.test(val_season)) return '';
    const { data, status } = await axios.get(`${plmweburl}/csi-requesthandler/api/v2/seasons/${val_season}`, { headers: { Cookie: plmToken } });
    res.status(200).json({ Type: "SUCCESS", Data: status === 200 ? data.node_name : '' });
  } catch (error) {
    //console.error(error);
    return '';
  }
}
