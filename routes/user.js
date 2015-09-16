var User = require('./../models/User');
var ObjectId = require('node-restful').mongoose.Schema.ObjectId;
var extend = require('extend');
var authenticator = require('./../modules/authenticator');

var userRoute = {
  define: function(app, prefixAPI) {
    User.methods(['get', 'post']);
    // Hash the password before everything
    User.before('post', function(req, res, next) {
      req.body.password = authenticator.hash(req.body.password);
      next();
    });

    // Request a specific user
    User.route('byname.get', function(req, res) {
      var username = req.query.username,
      // Get all user suiting the username given  
      query = User.where({username: username});
      // return all users 
      query.find(function(err, data) {
        if (err) {
          res.status(500);
          // TODO: Log the error but don't send it to the client
          return res.send(err);
        }
        res.status(200);
        return res.send(data);
      });
    });

    // Login
    User.route('login.post', function(req, res){
      var uname = req.body.username;
      var pwd = req.body.password;
      authenticator.authenticate(uname, pwd)
        .then(function(result){
          if(result){
            res.status(200);
            return res.send(result);
          }
          res.status(401);
          return res.send("Authentification failure!");
        },
        function(err){
          res.status(500);
          return res.send(err);
        });
    });

    // Set prediction
    User.route('predict.post', {
      detail: true,
      handler: function(req, res, next) {
        var handleError = function(err){
          res.status(500);
          return res.send(err);
        }
        var userId = req.params.id;
        var matchId = req.body.matchId;
        var predictHome = req.body.predictHome;
        var predictAway = req.body.predictAway;


        User.findById(userId, function (err, doc){
          doc.predictions.push({
            matchId: matchId,
            predictHome: predictHome,
            predictAway: predictAway
          });
          doc.save(function (err) {
            if (err) return handleError(err);
            res.send(doc);
          });
        });
      }
    });

    User.register(app, prefixAPI + '/users');
  }
};

module.exports = userRoute;
