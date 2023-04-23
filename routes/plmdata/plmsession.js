const axios = require('axios');
const plmurl = require('../plmurl');
const { pool } = require('../dbconfig');

module.exports = (req, res) => {

    pool.query('SELECT * FROM sys_plmsettings;', (error, results) => {
        if (error) {
          res.status(200).json({ Type: "ERROR", Msg: error.message })
          return;
        }
        else {
            var plmweburl = results.rows[0].plmurl;
            var plmuser = results.rows[0].plmuser;
            var plmpassword = results.rows[0].plmpassword;

            axios.post(`${plmweburl}/csi-requesthandler/api/v2/session`, {
            username: `${plmuser}`,
            password: `${plmpassword}`
            // username: 'BFF API User',
            // password: 'P@ssw0rd@4'
            }).then(response => {
                res.status(200).json({Type: 'SUCCESS', Token : response.data.token})
                return;
            }).catch(error1 => {
                res.status(200).json({Type: 'ERROR', Msg : error1})
                return;
            })
        }
    
      })
 
    

};