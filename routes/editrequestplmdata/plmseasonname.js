// import required modules
const axios = require('axios');
const plmSessionApi = require('./plmsessiontoken');

// define the asynchronous function as a request handler
module.exports = async (req, res) => {
  try {
    val_season = req.body.seasionid;
    const plmToken = await plmSessionApi(req, res);
    // Filter config data based on customer ID
    const filteredConfig = configData.filter(config => config.cus_id === 1);
    if (filteredConfig?.length === 0) {
      throw new Error("Oops! can't find correct dataset to get season name.");
    }
    const config = filteredConfig[0]?.plmValidations;
    const { letterNumber } = config;

    if (!letterNumber.test(val_season)) return '';
    const { data, status } = await axios.get(`${plmweburl}/csi-requesthandler/api/v2/seasons/${val_season}`, { headers: { Cookie: plmToken } });
    res.status(200).json({ Type: "SUCCESS", Data: status === 200 ? data.node_name : '' });
  } catch (error) {
    //console.error(error);
    res.status(200).json({ Type: "ERROR", Msg: error.message });
  }
}


