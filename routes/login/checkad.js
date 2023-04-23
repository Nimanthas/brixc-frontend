const ActiveDirectory = require('activedirectory');
const adErrors = require('../../common/ad.errors.list');

const config = {
  url: 'ldaps://col-dc-01.brandixlk.org:636',
  baseDN: 'dc=domain,dc=com',
  tlsOptions: {
    rejectUnauthorized: false
  }
};

const findCode = (text, target) => {
  const regex = new RegExp(`${target}\\s+(\\w+)`, 'i');
  const match = regex.exec(text);
  return match?.[1];
};

module.exports = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate request body
    if (!username || !password || Object.keys(req.body).length !== 2) {
      return res.status(400).json({ error: 'Opss! invalid request data' });
    }

    const ad = new ActiveDirectory({ ...config, username: username.toLowerCase(), password });

    ad.authenticate(username, password, (err, auth) => {
      if (err) {
        const errorCode = findCode(err.message, 'data')?.trim();
        const errorObject = adErrors.find(item => item.code === errorCode);
        return res.status(200).json({ Type: 'ERROR', Msg: `User details are not valid. Please try again! ${errorObject?.error}. (${err.message})` });
      }

      if (auth) {
        return res.status(200).json({ Type: 'SUCCESS', username });
      } else {
        return res.status(200).json({ Type: 'ERROR', Msg: 'User authentication failed. Please try again!' });
      }
    });
  } catch (error) {
    return res.status(401).json({ Type: 'ERROR', Msg: error.message });
  }
};
