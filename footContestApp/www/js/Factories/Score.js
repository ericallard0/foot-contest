angular.module('ScoreFactory', [])
.factory('Score', [
  'User',
  'Foot',
  '$http',
  '$q',
  function (
    User,
    Foot,
    $http,
    $q
  ) {
  
  var Score = {};

  Score.getMatchScore = function(match, predict){
    // If the match is not done yet => no score to add
    if(!match || match.status !== 'FINISHED') return 0;
    // same result +70
    if(predict.predictHome === match.result.goalsHomeTeam
       && predict.predictAway === match.result.goalsAwayTeam){
      return 70;
    }
    // same goal dif +50
    if(predict.predictHome - predict.predictAway ===
      match.result.goalsHomeTeam - match.result.goalsAwayTeam){
      return 50;
    }
    // same winner +20
    if((predict.predictHome > predict.predictAway && 
      match.result.goalsHomeTeam > match.result.goalsAwayTeam)
      || (predict.predictHome < predict.predictAway && 
      match.result.goalsHomeTeam < match.result.goalsAwayTeam)){
      return 20;
    }
    // ELSE
    return 0;
  };

  Score.getAllScores = function(){
    // Request data about all users and all match
    var getUsers = User.getAll();
    var getFoot = Foot.getFixtures();

    var defered = $q.defer();
    // When all data are received
    $q.all([getUsers, getFoot])
    .then(function(data){
      var users = data[0].data;
      var foot = data[1].data;
      var fixtures = foot.fixtures;

      // Update each fixture with matchId
      fixtures = fixtures.map(function(fixt){
        fixt.matchId = _.last(fixt._links.self.href.split('/'));
        return fixt;
      });

      angular.forEach(users, function(user, index){
        user.score = 0;
        // for each predicted match of each user
        angular.forEach(user.predictions, function(predict){
          // Get exact result
          var match = _.findWhere(fixtures, {matchId : predict.matchId});
          user.score += Score.getMatchScore(match, predict);
        });
        // Update the users array with the user score
        users[index] = user;
      });

      defered.resolve(users);
    });
    
    return defered.promise;
  }

  return Score;
}]);