var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"ecommercee"
  });
  
  con.connect(function(err) {
    if(err){
      console.log(err)
    }else{
      console.log("connected")
    }
  });

  module.exports=con;