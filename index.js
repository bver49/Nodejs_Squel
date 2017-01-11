var connection = require('./config');
connection = connection.connection;

var db = function(){
  this.sql= "";
  this.table = "";
  this.fieldlist = [];
  this.condition = [];
}

db.prototype.init = function () {
  this.sql= "";
  this.table = "";
  this.fieldlist = [];
  this.condition = [];
};

db.prototype.select = function () {
  this.sql += "SELECT ";
  return this;
};

db.prototype.from = function (table) {
  this.table = table;
  return this;
};

db.prototype.field = function (field){
  this.fieldlist.push(field);
  return this;
};

db.prototype.run = function () {

  for(var i in this.fieldlist){
    if(i == this.fieldlist.length-1){
      this.sql+=this.fieldlist[i];
    }else{
      this.sql+= (this.fieldlist[i]+",");
    }
  }

  this.sql += " FROM "+this.table;

  if(this.condition.length > 0){
    this.sql+= " WHERE ";
    for(var i in this.condition){
      if(i == this.condition.length-1){
        this.sql+=this.condition[i];
      }else{
        this.sql+= (this.condition[i]+",");
      }
    }
  }

  console.log(this.sql);
  this.init();
};

db.prototype.where = function(condition) {
  this.condition.push(condition);
  return this;
};

var d = new db();
d.select().field("name").field("id").from("student").where("id=5").run();
