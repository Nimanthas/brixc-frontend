const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

module.exports = async (req, res) => {
  try {
    const { params, files } = req;
    const { candidate_id } = params;

    if (!files?.video) {
      throw new Error('Oops! no files were found in request inputs.');
    }

    // // Create a form data object and append the file
    // const formData = new FormData();
    // formData.append('video', fs.createReadStream(files.video.path)); // Assuming "video" is the form field name

    // // Define the API endpoint
    // const apiUrl = `${settings.analyzer_url}/analyzevideo`;

    // // Make a POST request to the API using Axios
    // const response = await axios.post(apiUrl, formData, {
    //   headers: {
    //     ...formData.getHeaders(),
    //   },
    // });

    // console.log(response.data);

    const last_updated = moment().format('YYYY-MM-DD HH:mm:ss');

    res.status(200).json({ type: 'SUCCESS', message: 'Video and candidate data submitted successfully!' });
  } catch (error) {
    res.status(500).json({ type: 'ERROR', message: error.message });
  }
};
