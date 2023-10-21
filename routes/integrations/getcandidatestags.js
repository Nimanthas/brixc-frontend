const { pool } = require('../dbconfig');

module.exports = async (req, res) => {
  try {
    // Get candidate_external_id from request parameters
    const { candidate_external_id } = req.params;

    // Check the validity of candidate_external_id
    if (!candidate_external_id) {
      throw new Error('Oops! empty data set in header on get candidate tags request.');
    }

    // Example data
    const rows = [
      {
        'job_id': 1,
        'job_external_id': 'blank',
        'job_title': 'software engineer',
        'candidate_id': 1,
        'candidate_external_id': 'blank02',
        'candidate_name': 'Inukshi Senarathne',
        'candidates_tags': {
          'neuroticism': 'high',
          'openness': 'low',
          'extraversion': 'very high',
          'conscientiousness': 'neutral',
          'agreeableness': 'very low'
        }
      },
      {
        'job_id': 1,
        'job_title': 'software engineer',
        'candidate_id': 2,
        'candidate_external_id': 'blank01',
        'candidate_name': 'Nimantha Hennayake',
        'candidates_tags': {
          'neuroticism': 'high',
          'openness': 'low',
          'extraversion': 'high',
          'conscientiousness': 'neutral',
          'agreeableness': 'low'
        }
      }
    ];

    const filtered_data = candidate_external_id === 'blank' ? rows : rows.filter(row => row.candidate_external_id === candidate_external_id);

    // Send a successful response with result rows
    res.status(200).json({ type: 'SUCCESS', data: filtered_data });
  } catch (error) {
    // Handle errors by sending an error response with an error message
    res.status(500).json({ type: 'ERROR', message: error.message });
  }
};
