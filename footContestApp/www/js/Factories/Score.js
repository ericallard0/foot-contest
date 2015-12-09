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
    // same winner +20
    if((predict.predictHome > predict.predictAway && 
      match.result.goalsHomeTeam > match.result.goalsAwayTeam)
      || (predict.predictHome < predict.predictAway && 
      match.result.goalsHomeTeam < match.result.goalsAwayTeam)){
      score += 20;
    }
    // Else: 0
    else{
      return 0;
    } 
    // same result +80
    if(predict.predictHome === match.result.goalsHomeTeam
       && predict.predictAway === match.result.goalsAwayTeam){
      return 80;
    }
    // same goal dif +60
    if(predict.predictHome - predict.predictAway ===
      match.result.goalsHomeTeam - match.result.goalsAwayTeam){
      return 60;
    }
    // same goal for one team +20
    if(predict.predictHome === match.result.goalsHomeTeam ){
      score += 20;
    }
    // same goal for one team +20
    if(predict.predictAway === match.result.goalsAwayTeam ){
      score += 20;
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
        var p = _.groupBy(user.predictions, 'matchId')
        angular.forEach(p, function(predict){
          predict = _.last(predict)
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


  Score.getAllPastPredicted = function(users, fixtures){
    // Dictionary of predicted match from the user-group
    var predicted = {};
    // Array of result for each users
    var results = users.map(function(user){
      var userResults = [];
    
      angular.forEach(user.predictions, function(prediction){
        var match = _.findWhere(fixtures, {matchId : prediction.matchId});
        var result = Score.getMatchScore(match, prediction);
        if(result !== undefined){
          if(!predicted[prediction.matchId]){
            predicted[prediction.matchId] = {
              date: new Date(match.date),
              score:  result
            }
          }else{
            predicted[prediction.matchId].score += result;
          }
          userResults.push({
            date: new Date(match.date),
            result: result,
            match: match,
            matchId: match.matchId,
            prediction: prediction
          });
        }
      });

      return {
        user: user,
        data: userResults
      };
    });
    // Get array of items like: [matchId, date] 
    predicted = _.pairs(predicted);
    // Sort by date
    predicted = _.sortBy(predicted, function(e){
      return e[1].date.getTime();
    });
    var numberOfUsers = results.length;
    // Get result for each users and each predicted match 
    results = results.map(function(ur){
      var userResults = [];
      var userResultsSum = [];
      var globalResults = [];
      var globalResultsSum = [];
      var userGap = [];
      var userGapSum = [];
      var currentScore = 0;
      var currentGlobalScore = 0;
      angular.forEach(predicted, function(e){
        var matchId = e[0];
        var userResult = _.findWhere(ur.data, {matchId: matchId});
        var result = 0;
        var globalResult = (e[1].score)/numberOfUsers;
        if(userResult){
          result = userResult.result;
        }
        currentScore += result;
        currentGlobalScore += globalResult;
        userResults.push(result);
        userResultsSum.push(currentScore);
        globalResults.push(globalResult);
        globalResultsSum.push(currentGlobalScore);
        userGap.push(result - globalResult);
        userGapSum.push(currentScore - currentGlobalScore);
      });
      ur.userResults = userResults;
      ur.userResultsSum = userResultsSum;
      ur.globalResults = globalResults;
      ur.globalResultsSum = globalResultsSum;
      ur.userGap = userGap;
      ur.userGapSum = userGapSum;
      ur.data = userGap;
      ur.name = ur.user.username;
      return ur;
    });

    return {
      predicted: predicted,
      results: results
    };
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