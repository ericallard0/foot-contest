angular.module('ScoreFactory', [])
.factory('Score', [
  'User',
  'Foot',
  '$http',
  '$q',
  '$rootScope',
  function (
    User,
    Foot,
    $http,
    $q,
    $rootScope
  ) {
  
  var Score = {};

  Score.getMatchScore = function(match, predict){
    // If the prediction does not exist
    // Or if the match is not done yet => no score to add
    if(predict.predictHome === undefined || !match || match.status !== 'FINISHED') return undefined;
    var score = 0;
    // same result +70
    if(predict.predictHome === match.result.goalsHomeTeam
       && predict.predictAway === match.result.goalsAwayTeam){
      return 60;
    }
    // same goal dif +50
    if(predict.predictHome - predict.predictAway ===
      match.result.goalsHomeTeam - match.result.goalsAwayTeam){
      return 40;
    }
    // same goal for one team +20
    if(predict.predictHome === match.result.goalsHomeTeam ){
      score += 20;
    }
    // same goal for one team +20
    if(predict.predictAway === match.result.goalsAwayTeam ){
      score += 20;
    }
    // same winner +20
    if((predict.predictHome > predict.predictAway && 
      match.result.goalsHomeTeam > match.result.goalsAwayTeam)
      || (predict.predictHome < predict.predictAway && 
      match.result.goalsHomeTeam < match.result.goalsAwayTeam)){
      score += 20
    }
    // ELSE
    return score;
  };

  Score.getSortedUsers = function(options){
    var getUsers, getFoot;
    // Request data about all users and all match
    if(options.users && options.users.length > 0){
      getUsers = $q.when(options.users);
    }
    else{
      getUsers = User.getAll();
    }

    if(options.fixtures && options.fixtures.length > 0){
      getFoot = $q.when(options.fixtures);
    }
    else{
      getFoot = Foot.getFixtures();
    }

    var defered = $q.defer();
    // When all data are received
    $q.all([getUsers, getFoot])
    .then(function(data){
      var users = data[0];
      var fixtures = data[1];

      $rootScope.fixtures = fixtures;
      
      angular.forEach(users, function(user, index){
        user.score = 0;
        // for each predicted match of each user
        angular.forEach(user.predictions, function(predict){
          // Get exact result
          var match = _.findWhere(fixtures, {matchId : predict.matchId});
          user.score += Score.getMatchScore(match, predict) || 0;
        });
        // Update the users array with the user score
        users[index] = user;
      });
      users = _.sortBy(users, 'score').reverse();
      defered.resolve(users);
    });
    
    return defered.promise;
  };

  Score.getRank = function(users, user){
    return _.findIndex(users, function(e){
      return e._id == user._id;
    }) +1;
  };

  Score.mapResults = function(predictions){
    var p;
    if(! $rootScope.fixtures.length){
      p = Foot.getFixtures();
    }
    else{
      p = $q.when($rootScope.fixtures);
    }
    
    return p.then(function(fixtures){
      var results = [];      
      angular.forEach(predictions, function(predict){
        // Get exact result
        var match = _.findWhere(fixtures, {matchId : predict.matchId});
        var result = Score.getMatchScore(match, predict);
        if(result !== undefined){
          results.push({
            date: new Date(match.date),
            result: result,
            match: match,
            prediction: predict
          })
        }
      });
      var results = _.sortBy(results, function(e){
        return e.date.getTime();
      });
      return results;
    });
  }

  Score.usersBet = function(matchId, users, fixture){
    var getUsers;
    var defered = $q.defer();    
    if(users && users.length > 0){
      getUsers = $q.when(users);
    }
    else{
      getUsers = User.getAll();
    }
    getUsers.then(function(users){
      // get the prediction of each users
      var maped =  _.map(users, function(u){
        var userPrediction  ={
          username: u.username,
          prediction: _.findWhere(u.predictions, { matchId: matchId })
        };
        // Add the user score if the match is done
        if(fixture.status === "FINISHED" && userPrediction.prediction)
          userPrediction.score = Score.getMatchScore(fixture, userPrediction.prediction);
        return userPrediction;
      });
      // remove users who did not predict
      defered.resolve({
        users: users,
        data: _.filter(maped, function(e){
          return !! e.prediction;
        })
      });
    });
    return defered.promise;
  };

  return Score;
}]);