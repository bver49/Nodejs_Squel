var db = require('./db');

db = new db();

var data ={
  'dpt':'IIM'
}

db.select().field(["f.*","c.餘額"]).from("follow f").join("course_105_2 c").where("c.id=f.course_id").test(function(follow){
});

db.select().field("*").from("exam").where("tag LIKE '%台大%'").test();
