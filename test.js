var db = require('./dbv2');

db.select().field(["f.*","c.餘額"]).from("follow f").join("course_105_2 c").where("c.id=f.course_id").test();

db.select().field("*").from("user").where("id=1").test();

db.insert().into("user").set({'name':'Andy'}).test();

db.update().table("user").set({'name':'Andy'}).where("id=1").test();

db.delete().from("user").where("id=1").where("name=Andy").test();

db.select().field("*").from("exam").where("id NOT IN",["1","2","3"]).where("tag LIKE '%台大%'").limit(1).order("id").test();
