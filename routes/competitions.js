var Competitions = require('./../models/Competitions');
var User = require('./../models/User');
var ObjectId = require('node-restful').mongoose.Schema.ObjectId;


var competitionRoute = {
  define: function(app, prefixAPI) {
    Competitions.methods(['get', 'post']);


    Competitions.route('new.post', function(req, res) {
      var sendError = function(e){
        res.status(500);
        // TODO: log the err and don't send it
        return res.send(err);
      };

      var userId = req.body.userId,
          name = req.body.name,
          public = req.body.public || true;
      console.log(userId, name, public);

      // Update the competitions
      var competitionsQuery = Competitions.findOneAndUpdate(
        { name: name}, 
        { $push: { users: ObjectId(userId) } },
        {upsert: true, new: true},
       
        function(err, result) {
          // If the create/update competition failed => return 500
          if(err || ! result._id){
            return sendError(err);
          }
          // Update the user
          var userQuery = User.findOneAndUpdate(
            { _id: userId }, 
            { $push: { competitions: ObjectId(result._id) } },
            function(err, result){
              if(err || ! result._id){
                return sendError(err);
              }
              // Return the user updated
              res.status(200);
              return res.send(result);
            }
          );
        }
      );


    });


    Competitions.register(app, prefixAPI + '/competitions');
  }
};

module.exports = competitionRoute;
