//var connection = require('./config');
//connection = connection.connection;

var start;
var end;
var db = function(){
  this.sql = "";
  this.sqltype = 0;
  /* SLECTE */
  this.table = "";
  this.fieldlist = [];
  this.condition = [];
  this.orderby = "";
  /* INSERT */
  this.datakey =[];
  this.datavalue =[];
}

db.prototype.init = function () {
  this.sql = "";
  this.table = "";
  this.fieldlist = [];
  this.condition = [];
  this.orderby = "";
  this.sqltype = 0;
};

/* SELECT */
db.prototype.select = function(){
  start = new Date().getTime();
  this.sql += "SELECT ";
  this.sqltype = 1;
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

db.prototype.where = function(condition) {
  this.condition.push(condition);
  return this;
};

db.prototype.order = function(order,type) {
  if(type === undefined) {
    type = true;
  }
  else{
    type = false;
  }
  this.orderby = " ORDER BY " + order + ((type) ? " DESC ": " ASC ");
  return this;
};

db.prototype.SelectQueryBuilder = function(){
  for(var i in this.fieldlist){
    if(i == this.fieldlist.length-1){
      this.sql += this.fieldlist[i];
    }
    else{
      this.sql += (this.fieldlist[i] + ",");
    }
  }

  this.sql += " FROM " + this.table;

  if(this.condition.length > 0){
    this.sql += " WHERE ";
    for(var i in this.condition){
      if(i == this.condition.length-1){
        this.sql += this.condition[i];
      }
      else{
        this.sql += (this.condition[i] + ",");
      }
    }
  }
  if(this.orderby !=""){
    this.sql += this.orderby;
  }
}

/* INSERT */
db.prototype.insert = function (){
  start = new Date().getTime();
  this.sql += "INSERT ";
  this.sqltype = 2;
  return this;
};

db.prototype.into = function (table){
  this.sql += "INTO "+table;
  return this;
};

db.prototype.set = function (data){
  for(var i in data){
    this.datakey.push(i);
    if(typeof data[i] === "string"){
      this.datavalue.push("'"+data[i]+"'");
    }
    else{
      this.datavalue.push(data[i]);
    }
  }
  return this;
};

db.prototype.InsertQueryBuilder = function (){
  this.sql +=" (";
  for(var i in this.datakey){
    if(i == this.datakey.length-1){
      this.sql += this.datakey[i];
    }
    else{
      this.sql += this.datakey[i]+",";
    }
  }
  this.sql +=") VALUE (";
  for(var i in this.datavalue){
    if(i == this.datavalue.length-1){
      this.sql += this.datavalue[i];
    }
    else{
      this.sql += this.datavalue[i]+",";
    }
  }
  this.sql +=") ";
};


db.prototype.run = function (callback){
  switch (this.sqltype) {
    case 1:
      this.SelectQueryBuilder();
      break;
    case 2:
      this.InsertQueryBuilder();
      break;
    default:
      console.log("Error");
      break;
  }
  console.log(this.sql);
  var sql = this.sql;
  this.init();
  /*
  connection.query(sql,function(err, results, fields){
    if (err) throw err;
    callback(results);
  });
  */
};

var d = new db();
d.select().field("*").from("course").where("id=1233").order("id").run();
d.select().field("name").field("id").from("student").order("id",false).run();
d.insert().into("s").set(x).run();
