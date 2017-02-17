/*
SELECT 1
INSERT 2
DELETE 3
UPDATE 4
*/
var mysql = require('mysql');
var chalk = require('chalk');
var config = require('./config');
var db_config = {
  host: config.dbhost,
  user: config.dbuser,
  password: config.dbpw,
  database: config.dbname
};

var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config);
  connection.connect(function(err) {
    if (err) {
      console.log('error when connecting to db: ', err);
      setTimeout(handleDisconnect, 2000);
    }
  });
  connection.on('error', function(err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

var db = {
  'select': function() {
    var start = new Date().getTime();
    return {
      'from': from,
      'field': field,
      'where': where,
      'whereCheck':whereCheck,
      'limit':limit,
      'order':order,
      'join': join,
      'test': test,
      'run': run,
      'get': get,
      'sqlobj': {
        'sql': "SELECT ",
        'sqlType': 1,
        'limitAmt': "",
        'tableName': "",
        'fieldList': [],
        'condition': [],
        'orderby': [],
        'joinTable': "",
        'start': start
      }
    }
  },
  'insert': function() {
    var start = new Date().getTime();
    return {
      'into': into,
      'set': set,
      'where': where,
      'test': test,
      'run': run,
      'sqlobj': {
        'sql': "INSERT ",
        'sqlType': 2,
        'tableName': "",
        'condition': [],
        'datakey': [],
        'datavalue': [],
        'start': start
      }
    }
  },
  'delete': function() {
    var start = new Date().getTime();
    return {
      'from': from,
      'where': where,
      'test': test,
      'run': run,
      'sqlobj': {
        'sql': "DELETE ",
        'sqlType': 3,
        'tableName': "",
        'condition': [],
        'start': start
      }
    }
  },
  'update': function() {
    var start = new Date().getTime();
    return {
      'table': table,
      'where': where,
      'set': set,
      'test': test,
      'run': run,
      'sqlobj': {
        'sql': "UPDATE ",
        'sqlType': 4,
        'tableName': "",
        'condition': [],
        'datakey': [],
        'datavalue': [],
        'start': start
      }
    }
  }
}

function from(table) {
  this.sqlobj.tableName = table;
  return this;
}

function field(field) {
  if (this.sqlobj.sqlType != 1) {
    throw chalk.red("Error: field() Must follow with select()");
  } else {
    if (typeof field == "object") {
      for (var i in field) {
        this.sqlobj.fieldList.push(field[i]);
      }
    } else {
      this.sqlobj.fieldList.push(field);
    }
    return this;
  }
}

function where(condition, value) {
  if (typeof value === "undefined") {
    this.sqlobj.condition.push(condition);
  } else {
    if (typeof value == "string") {
      this.sqlobj.condition.push(condition + "'" + value + "'");
    } else if (typeof value == "object") {
      var _in = " (";
      for (var i in value) {
        if (typeof value[i] == "string") {
          _in += "'" + value[i] + "'";
        } else {
          _in += value[i];
        }
        if (i != value.length - 1) {
          _in += ",";
        }
      }
      _in += ")";
      this.sqlobj.condition.push(condition + _in);
    } else {
      this.sqlobj.condition.push(condition + value);
    }
  }
  return this;
}

function join(table) {
  this.sqlobj.joinTable = table;
  return this;
}

function order(order, type) {
  if (type === undefined) {
    type = "ASC";
  } else {
    type = "DESC";
  }
  this.sqlobj.orderby.push(order + " " + type);
  return this;
}

function limit(number) {
  this.sqlobj.limitAmt += " LIMIT " + number;
  return this;
}

function whereCheck(condition, value) {
  if (value !== null) {
    this.sqlobj.condition.push(condition);
  }
  return this;
}

function into(table) {
  if (this.sqlobj.sqlType != 2) {
    throw chalk.red("Error: into() Must follow with insert()");
  } else {
    this.sqlobj.sql += "INTO " + table;
    return this;
  }
}

function set(data) {
  if (this.sqlobj.sqlType != 2 && this.sqlobj.sqlType != 4) {
    throw chalk.red("Error: set() Must follow with insert() or update()");
  } else {
    for (var i in data) {
      this.sqlobj.datakey.push(i);
      if (typeof data[i] === "string") {
        this.sqlobj.datavalue.push("'" + data[i] + "'");
      } else {
        this.sqlobj.datavalue.push(data[i]);
      }
    }
    return this;
  }
}

function table(table) {
  if (this.sqlobj.sqlType != 4) {
    throw chalk.red("Error: table() Must follow with update()");
  } else {
    this.sqlobj.tableName = table;
    return this;
  }
}

function SelectQueryBuilder(obj) {
  for (var i in obj.fieldList) {
    if (i == obj.fieldList.length - 1) {
      obj.sql += obj.fieldList[i] + " ";
    } else {
      obj.sql += (obj.fieldList[i] + ",");
    }
  }

  obj.sql += "FROM " + obj.tableName;
  if (obj.condition.length > 0) {
    ConditionBuilder(obj);
  }

  if (obj.orderby.length != 0) {
    obj.sql += " ORDER BY ";
    for (var i in obj.orderby) {
      if (i == obj.orderby.length - 1) {
        obj.sql += obj.orderby[i] + " ";
      } else {
        obj.sql += obj.orderby[i] + " , ";
      }
    }
  }
  if (obj.limitAmt != "") {
    obj.sql += obj.limitAmt;
  }
  return obj.sql;
}

function InsertQueryBuilder(obj) {
  obj.sql += " (";
  for (var i in obj.datakey) {
    if (i == obj.datakey.length - 1) {
      obj.sql += obj.datakey[i];
    } else {
      obj.sql += obj.datakey[i] + ",";
    }
  }
  obj.sql += ") VALUE (";
  for (var i in obj.datavalue) {
    if (i == obj.datavalue.length - 1) {
      obj.sql += obj.datavalue[i];
    } else {
      obj.sql += obj.datavalue[i] + ",";
    }
  }
  obj.sql += ") ";
  return obj.sql;
}

function DeleteQueryBuilder(obj) {
  obj.sql += "FROM " + obj.tableName;
  if (obj.condition.length > 0) {
    ConditionBuilder(obj);
  }
  return obj.sql;
}

function UpdateQueryBuilder(obj) {
  obj.sql += obj.tableName + " ";
  obj.sql += "SET ";
  for (var i in obj.datakey) {
    if (i == obj.datakey.length - 1) {
      obj.sql += (obj.datakey[i] + "=" + obj.datavalue[i]);
    } else {
      obj.sql += (obj.datakey[i] + "=" + obj.datavalue[i] + ",");
    }
  }
  if (obj.condition.length > 0) {
    ConditionBuilder(obj);
  }
  return obj.sql;
}

function JoinQueryBuilder(obj) {

  for (var i in obj.fieldList) {
    if (i == obj.fieldList.length - 1) {
      obj.sql += obj.fieldList[i] + " ";
    } else {
      obj.sql += (obj.fieldList[i] + ",");
    }
  }
  obj.sql += "FROM " + obj.tableName + " INNER JOIN " + obj.joinTable;

  if (obj.condition.length > 0) {
    ConditionBuilder(obj);
  }
  if (obj.orderby.length != 0) {
    obj.sql += " ORDER BY ";
    for (var i in obj.orderby) {
      if (i == obj.orderby.length - 1) {
        obj.sql += obj.orderby[i] + " ";
      } else {
        obj.sql += obj.orderby[i] + " , ";
      }
    }
  }
  if (obj.limitAmt != "") {
    obj.sql += obj.limitAmt;
  }
  return obj.sql;
}

function ConditionBuilder(obj) {
  if (obj.sqlType == 1) {
    if (obj.joinTable != "") {
      obj.sql += " ON ";
    } else {
      obj.sql += " WHERE ";
    }
  } else {
    obj.sql += " WHERE ";
  }
  for (var i in obj.condition) {
    if (i == obj.condition.length - 1) {
      obj.sql += obj.condition[i];
    } else {
      obj.sql += obj.condition[i] + " AND ";
    }
  }
  return obj.sql;
}

function run(callback) {
  switch (this.sqlobj.sqlType) {
    case 1:
      if (this.sqlobj.joinTable != "") {
        this.sqlobj.sql = JoinQueryBuilder(this.sqlobj);
      } else {
        this.sqlobj.sql = SelectQueryBuilder(this.sqlobj);
      }
      break;
    case 2:
      this.sqlobj.sql = InsertQueryBuilder(this.sqlobj);
      break;
    case 3:
      this.sqlobj.sql = DeleteQueryBuilder(this.sqlobj);
      break;
    case 4:
      this.sqlobj.sql = UpdateQueryBuilder(this.sqlobj);
      break;
    default:
      console.log("Error");
      break;
  }
  console.log("\n" + this.sqlobj.sql);
  var sql = this.sqlobj.sql;
  connection.query(sql, function(err, results, fields) {
    var end = new Date().getTime();
    var time = end - this.sqlobj.start;
    console.log(chalk.green("Execute time: " + time + " ms"));
    callback(results, err);
  });
}

function get(callback) {
  switch (this.sqlobj.sqlType) {
    case 1:
      if (this.sqlobj.joinTable != "") {
        this.sqlobj.sql = JoinQueryBuilder(this.sqlobj);
      } else {
        this.sqlobj.sql = SelectQueryBuilder(this.sqlobj);
      }
      break;
    case 2:
      this.sqlobj.sql = InsertQueryBuilder(this.sqlobj);
      break;
    case 3:
      this.sqlobj.sql = DeleteQueryBuilder(this.sqlobj);
      break;
    case 4:
      this.sqlobj.sql = UpdateQueryBuilder(this.sqlobj);
      break;
    default:
      console.log("Error");
      break;
  }
  console.log("\n" + this.sqlobj.sql);
  var sql = this.sqlobj.sql;
  connection.query(sql, function(err, results, fields) {
    if (err) throw err;
    var end = new Date().getTime();
    var time = end - this.sqlobj.start;
    console.log(chalk.green("Execute time: " + time + " ms"));
    return results;
  });
}

function test() {
  switch (this.sqlobj.sqlType) {
    case 1:
      if (this.sqlobj.joinTable != "") {
        this.sqlobj.sql = JoinQueryBuilder(this.sqlobj);
      } else {
        this.sqlobj.sql = SelectQueryBuilder(this.sqlobj);
      }
      break;
    case 2:
      this.sqlobj.sql = InsertQueryBuilder(this.sqlobj);
      break;
    case 3:
      this.sqlobj.sql = DeleteQueryBuilder(this.sqlobj);
      break;
    case 4:
      this.sqlobj.sql = UpdateQueryBuilder(this.sqlobj);
      break;
    default:
      console.log("Error");
      break;
  }
  var sql = this.sqlobj.sql;
  console.log("\n" + sql);
  var end = new Date().getTime();
  var time = end - this.sqlobj.start;
  console.log(chalk.green("Execute time: " + time + " ms"));
}

module.exports = db;
