var User = require('./../models/User');

var userRoute = {
  define: function(app, prefixAPI) {
    User.methods(['get', 'post']);

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

    User.register(app, prefixAPI + '/users');
  }
};

module.exports = userRoute;
