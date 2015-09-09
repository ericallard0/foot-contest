var crypto = require('crypto');
var q = require('q');
var User = require('./../models/User');

var authenticator = {

  hash : function(pwd){
    return crypto.createHash('md5').update(pwd).digest('hex')
  },

  authenticate : function(uname, pwd){
    pwd = authenticator.hash(pwd);

    var defered = q.defer();
    var authenticUser = User.findOne({
      username:uname,
      password:pwd
    }, function(err, result){
      err ? defered.reject(err) : defered.resolve(result);
    });

    return defered.promise;
  }
}

module.exports = authenticator;
