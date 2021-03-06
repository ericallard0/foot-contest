var _ = require('underscore-node');
var User = require('./../models/User');
var ObjectId = require('node-restful').mongoose.Schema.ObjectId;
var authenticator = require('./../modules/authenticator');
var foot = require('./foot'); 

var canPredict = function(matchId){
  // Check if the match is not started:
  var footData = foot.getData().fixtures;
  if(!footData) return false;
  var fixture = _.findWhere(footData, {matchId: matchId});
  if(!fixture) return false;
  var current = new Date();
  var matchDate = new Date(fixture.date);
  if(current.getTime() > matchDate.getTime()){
    console.log("Too late to predict now " + current.getTime() + " match : " + matchId);
    return false;
  }
  return true;
}

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
      console.log(uname, pwd);
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

        if(!canPredict(matchId)) return handleError("can't predict");

        console.log(userId);
        User.findById(userId, function (err, doc){
          previousPredict = _.findWhere(doc.predictions, {matchId: matchId})
          if (err ||  previousPredict !== undefined){
            return handleError("not able to predict");
          }
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

    User.route('predict.delete', {
      detail: true,
      handler: function(req, res, next) {
        var handleError = function(err){
          res.status(500);
          return res.send(err);
        }
        var userId = req.params.id;
        var predictId = req.query.predictId;
        User.findById(userId, function (err, doc){
          var prediction = doc.predictions.id(predictId);
          if(!canPredict(prediction.matchId)) return handleError("can't predict");
          prediction.remove();
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
