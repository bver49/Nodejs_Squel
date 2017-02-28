# Nodejs_Squel
A mysql module for nodejs

## Introduction

Here is an example on how to use it:

```js

var db = require("nodejs-squel");
db.select().field("*").from("user").where("id=1").test();
// SELECT * FROM user WHERE id=1

```

## Set up

1.npm install

2.Create file name config.js

It should like this

```js

exports.dbhost = 'database host';
exports.dbuser = 'database user';
exports.dbpw = 'database password';
exports.dbname = 'database name';

```

## How to use

```js


```
