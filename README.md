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

2.Create file name config.json

It should like this

```json
{
    dbhost : 'database host',
    dbuser : 'database user',
    dbpw : 'database password',
    dbname : 'database name'
}
```
