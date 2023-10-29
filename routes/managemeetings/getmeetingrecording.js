const axios = require('axios');
const getzoomtoken = require('../settings/tokenmanager/getzoomtoken');
const settings = require('../../settings');

module.exports = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      throw new Error('Empty data set');
    }

    if (Object.keys(req.body).length !== 1) {
      throw new Error('Incorrect dataset');
    }

    let { meeting_id } = req.body;

    const token = await getzoomtoken('zoom_api');

    if (!token) {
      throw new Error('Invalid token from session');
    }

    // Make a GET request to retrieve all meeting recordings
    const zoom_response = await axios.get(`${settings?.zoom_base_url}/users/me/recordings`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-type': 'application/json',
      },
    });

    if (!zoom_response?.data) {
      throw new Error('Failed to retrieve meeting recordings from Zoom.');
    }

    res.status(200).json({
      type: 'SUCCESS',
      message: 'Meeting recordings retrieved successfully!',
      data: zoom_response?.data,
    });
  } catch (error) {
    res.status(200).json({ type: 'ERROR', message: error.message });
  }
};
