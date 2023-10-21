const { pool } = require('../dbconfig');
const axios = require('axios');
const getzoomtoken = require('../settings/tokenmanager/getzoomtoken');
const settings = require("../../settings");


module.exports = async (req, res) => {
  try {

    const token = await getzoomtoken('zoom_api');

    if (!token) {
      throw new Error('Invalid token from session');
    }

    // Make a POST request to create a Zoom meeting
    const zoom_response = await axios.post(`${settings?.zoom_base_url}/users/me/meetings`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-type': 'application/json',
      },
    });

    if (!zoom_response?.data) {
      throw new Error('Failed to schedule the meeting in zoom.');
    }

    res.status(200).json({ type: 'SUCCESS', message: `Meeting scheduled successfully!`, data: { 'meeting_id': zoom_response?.data?.id, 'join_url': zoom_response?.data?.join_url } });

  } catch (error) {
    res.status(200).json({ type: 'ERROR', message: error.message });
  }
};
