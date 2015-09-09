var restful = require('node-restful'),
    mongoose = restful.mongoose;


// MONGO SCHEMA
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {type:'string', required:true},
  password: {type: 'string', required:true},
  email: {type: 'string', required:false},
  competitions:{type: [Schema.ObjectId], ref: 'competitions', default: []},
  pronostics: {type: [{}], default: []},
  date: {type: 'string', default: Date()},
});

var user = restful.model('user', userSchema);

exports = module.exports = user;