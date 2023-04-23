const ActiveDirectory = require('activedirectory');

module.exports = (req, res) => {
  
  //Check Body Is Empty
  if(req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(200).json({Type: "ERROR", Msg : "Oops! Empty Data Set."})
       return;
  }
//Check Element Count
  if(Object.keys(req.body).length != 2) {
    res.status(200).json({Type: "ERROR", Msg : "Oops! Can't Find Correct Dataset"})
       return;
  }

  
  var config = { url: 'ldaps://col-dc-01.brandixlk.org:636',
               baseDN: 'dc=domain,dc=com',
               username: req.body.username.toLowerCase(),
               password: req.body.password,
               tlsOptions: {
                rejectUnauthorized: false
              } };

    var ad = new ActiveDirectory(config);
    var username = req.body.username.toLowerCase();
    var password = req.body.password;
    // Authenticate
   ad.authenticate(username, password, function(err, auth) {
        if (err) {
            
            res.status(200).json({ Type: "ERROR", Msg : "Oops! User Details are not valid. Please Try again!"});
            return;
        }
        else
        {
          if (auth) {
            
            res.status(200).json({Type: 'SUCCESS', username : username})
            return;
            
          }
          else {
            
            res.status(200).json({ Type: "ERROR", Msg : "User Not Found. Please Check your Username and Password Again"});
            return;
          }
        }
        
    });
  
    
};