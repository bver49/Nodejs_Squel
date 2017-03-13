var db = require('./nodejs-squel');
var config = require('./config');
db.config = {
  'host': config.dbhost,
  'user': config.dbuser,
  'password': config.dbpw,
  'database': config.dbname
}
db.promise=true;
db.connect();

db.select().field("*").from("user").run().then(function(user){
  console.log(user);
},function(err){
  console.log(err);
});
