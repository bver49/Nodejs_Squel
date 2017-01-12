//var connection = require('./config');
//connection = connection.connection;

var start;
var end;
var db = function(){
  this.sql = "";
  this.sqlType = 0;
  this.limitAmt = "";
  /* SLECTE */
  this.tableName = "";
  this.fieldList = [];
  this.condition = [];
  this.orderby = "";
  /* INSERT */
  this.datakey =[];
  this.datavalue =[];
  /* Join */
  this.joinTable = "";
}

db.prototype.init = function () {
  this.sql = "";
  this.sqlType = 0;
  this.limitAmt = "";
  /* SLECTE */
  this.tableName = "";
  this.fieldList = [];
  this.condition = [];
  this.orderby = "";
  /* INSERT */
  this.datakey =[];
  this.datavalue =[];
  /* Join */
  this.joinTable = "";
};

/* SELECT */
db.prototype.select = function(){
  start = new Date().getTime();
  this.sql += "SELECT ";
  this.sqlType = 1;
  return this;
};

db.prototype.from = function (table) {
  this.tableName = table;
  return this;
};

db.prototype.field = function (field){
  this.fieldList.push(field);
  return this;
};

db.prototype.where = function(condition) {
  this.condition.push(condition);
  return this;
};

db.prototype.SelectQueryBuilder = function(){
  for(var i in this.fieldList){
    if(i == this.fieldList.length-1){
      this.sql += this.fieldList[i]+" ";
    }
    else{
      this.sql += (this.fieldList[i] + ",");
    }
  }

  this.sql += "FROM " + this.tableName;
  if(this.condition.length > 0){
    this.ConditionBuilder();
  }

  if(this.orderby !=""){
    this.sql += this.orderby;
  }
  if(this.limitAmt !=""){
    this.sql += this.limitAmt;
  }
}

/* INSERT */
db.prototype.insert = function (){
  start = new Date().getTime();
  this.sql += "INSERT ";
  this.sqlType = 2;
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

/* DELETE */
db.prototype.delete = function(){
  start = new Date().getTime();
  this.sql += "DELETE ";
  this.sqlType = 3;
  return this;
};

db.prototype.DeleteQueryBuilder = function (){

  this.sql += "FROM " + this.tableName;
  if(this.condition.length > 0){
    this.ConditionBuilder();
  }
  if(this.orderby !=""){
    this.sql += this.orderby;
  }
  if(this.limitAmt !=""){
    this.sql += this.limitAmt;
  }
};

/* UPDATE */
db.prototype.update = function (){
  this.sql += "UPDATE ";
  this.sqlType = 4;
  return this;
}

db.prototype.table = function (table) {
  this.tableName = table;
  return this;
};

db.prototype.UpdateQueryBuilder = function(){
  this.sql += this.tableName+" ";
  this.sql += "SET ";
  for(var i in this.datakey){
    if(i == this.datakey.length-1){
      this.sql += (this.datakey[i]+"="+this.datavalue[i]);
    }
    else{
      this.sql += (this.datakey[i]+"="+this.datavalue[i]+",");
    }
  }
  if(this.condition.length > 0){
    this.ConditionBuilder();
  }
}
/* innerjoin */
db.prototype.join = function (table){
  this.joinTable = table;
  this.sqlType = 5;
  return this;
};

db.prototype.JoinQueryBuilder = function() {

  for(var i in this.fieldList){
    if(i == this.fieldList.length-1){
      this.sql += this.fieldList[i]+" ";
    }
    else{
      this.sql += (this.fieldList[i] + ",");
    }
  }
  this.sql += "FROM " + this.tableName + " INNER JOIN " + this.joinTable;

  if(this.condition.length > 0){
    this.ConditionBuilder();
  }
  if(this.orderby !=""){
    this.sql += this.orderby;
  }
  if(this.limitAmt !=""){
    this.sql += this.limitAmt;
  }
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
}

db.prototype.limit = function(number) {
  this.limitAmt += "LIMIT "+number;
  return this;
};

db.prototype.ConditionBuilder = function() {

  if(this.sqlType == 5 ){
    this.sql += " ON ";
  }
  else{
    this.sql += " WHERE ";
  }
  for(var i in this.condition){
    if(i == this.condition.length-1){
      this.sql += "("+this.condition[i]+")";
    }
    else{
      this.sql += ("("+this.condition[i]+")"+ " AND ");
    }
  }
};

db.prototype.run = function (callback){
  switch (this.sqlType) {
    case 1:
      this.SelectQueryBuilder();
      break;
    case 2:
      this.InsertQueryBuilder();
      break;
    case 3:
      this.DeleteQueryBuilder();
      break;
    case 4:
      this.UpdateQueryBuilder();
      break;
    case 5:
      this.JoinQueryBuilder();
      break;
    default:
      console.log("Error");
      break;
  }
  console.log(this.sql);
  var sql = this.sql;
  end = new Date().getTime();
  var time = end - start;
  console.log("Execute time: "+time+" ms");
  this.init();
  connection.query(sql,function(err, results, fields){
    if (err) throw err;
    callback(results);
  });
};

db.prototype.get = function (callback){
  switch (this.sqlType) {
    case 1:
      this.SelectQueryBuilder();
      break;
    case 2:
      this.InsertQueryBuilder();
      break;
    case 3:
      this.DeleteQueryBuilder();
      break;
    case 4:
      this.UpdateQueryBuilder();
      break;
    case 5:
      this.JoinQueryBuilder();
      break;
    default:
      console.log("Error");
      break;
  }
  console.log(this.sql);
  var sql = this.sql;
  end = new Date().getTime();
  var time = end - start;
  console.log("Execute time: "+time+" ms");
  this.init();
  connection.query(sql,function(err, results, fields){
    if (err) throw err;
    return results;
  });
};

db.prototype.test = function (){
  switch (this.sqlType) {
    case 1:
      this.SelectQueryBuilder();
      break;
    case 2:
      this.InsertQueryBuilder();
      break;
    case 3:
      this.DeleteQueryBuilder();
      break;
    case 4:
      this.UpdateQueryBuilder();
      break;
    case 5:
      this.JoinQueryBuilder();
      break;
    default:
      console.log("Error");
      break;
  }
  console.log(this.sql);
  var sql = this.sql;
  end = new Date().getTime();
  var time = end - start;
  console.log("Execute time: "+time+" ms");
  this.init();
};

var x ={
  'dpt':'IIM'
}

var d = new db();

d.select().field("*").from("course").where("id=1233").order("id").limit(10).test();
d.insert().into("s").set(x).test();
d.delete().from("student").where("name=3").where("x>5").test();
d.update().table("user").where("id=5").set(x).test();
d.select().field("student.classid").field("student.id").from("student").join("class").where("student.classid=class.id").test();
