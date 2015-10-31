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

      // Search for a competitions
      var competitionsQuery = Competitions.findOne(
        { name: name}, 
        function(err, competition) {
          // If don't find failed => return 500
          if(err) sendError(err);
          // Update the user
          var userQuery = User.findById(userId, function (err, user){

            // If don't find failed => return 500
            if(err || ! user._id) sendError(err);

            // update a user and the competition 
            user.competitions.push(objectId(competition._id));
            competiton.users.push(objectId(userId));

            // save both
            user.save(function (err) {
              if (err) return sendError(err);
              competiton.save(function(err){
                if(err) return sendError(err);
                res.send(user);
              });
            });
          });

        },
        {upsert: true, new: true}
      );


    });


    Competitions.register(app, prefixAPI + '/competitions');
  }
};

module.exports = competitionRoute;
