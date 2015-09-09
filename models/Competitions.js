var restful = require('node-restful'),
    mongoose = restful.mongoose;


// MONGO SCHEMA
var Schema = mongoose.Schema;

var competitionsSchema = new Schema({
  name: {type:'string', required:true},
  public: {type: 'boolean', required:true, default: true},
  users:{type: [Schema.ObjectId], ref: 'user', default: []},
});

var competitions = restful.model('competitions', competitionsSchema);

exports = module.exports = competitions;