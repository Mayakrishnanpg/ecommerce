var express = require('express');
const con = require('../config/config');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/adminlogin');
});
router.get('/adminHome',(req,res)=>{
  if(req.session.adminData){
    res.render("admin/adminhome")
  }
})
router.post('/adminlogin', function(req, res, next) {
  console.log(req.body)
  let mail="admin@gmail.com";
  let pass="admin"
  let admin = {
    mail,
    pass
  }
  if(mail==req.body.email&&pass==req.body.password){
    console.log("login success")
    req.session.adminData = admin;
    res.redirect('/users/adminHome')
  }else{
    console.log("login error")
    res.redirect('/users')
  }
   
});

router.post('/addproduct',(req,res)=>{
  console.log(req.body);
  console.log(req.files);
  if(!req.files)return res.status(400).send("no files where uploaded");
  var file = req.files.img;
  var upload_img = file.name;
  let sql = "insert into products set ?"
  if(file.mimetype=="image/jpeg" || file.mimetype=="image.png" ||  file.mimetype=="image.gif")
  file.mv("public/images/products/"+file.name,function(err){
    if (err){
      res.send("error while uploading img")
    }else{
      var data = req.body;
      data.img=upload_img;
      con.query(sql,data,(err,result)=>{
        if(err){
          console.log(err)
        }else{
          res.redirect('/users/adminhome')
        }
      })
    }
  })
})
router.get('/order',(req,res)=>{
  var sql="select products.id,products.Name,products.price,cart.userId,cart.qty from products inner join cart on products.id =cart.productid where cart.userId=? and cart.status ='purchased'";
  let user = req.session.user;
  con.query(sql,(err,res)=>{
    if(err){
      console.log(err)
    }else{
      console.log("my order",result)
      res.render('admin,order',{result})
    }
  })
})

module.exports = router;
