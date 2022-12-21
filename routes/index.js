var express = require('express');
var router = express.Router();
var con= require('../config/config')
const {checkuser}=require('../middleware/checkuser');
/* GET home page. */
let razorpay = require('../payments/razorpay')
router.get('/', function(req, res, next) {
  let sql="select * from products"
  con.query(sql,(err,products)=>{
    if(err){
      console.log(err)
    }else{  
      if(req.session.user){
        var user = req.session.user;
        var userid=req.session.user.id;
        var sql3="select count(*) as cartdata from cart where userId=?"
        con.query(sql3,[userid],(err,rows)=>{
          console.log(rows)
          let cart = rows[0].cartdata;
          user.cart=cart;
          res.render('user/userhome',{user,products});
        })
      }else{ 
        console.log(products)
        res.render('user/userhome',{products});
    }
     
      
    }
  });
});

 router.get('/cart',  (req,res)=>{
  var user = req.session.user;
  let userid=user.id;
  var total = 0;
  var sql ="select products.id,products.Name,products.description,products.price,products.img,cart.userId,cart.qty from products inner join cart on products.id =cart.productid where cart.userId=?";
  con.query(sql,[userid],(err,result)=>{
    if(err){
      console.log(err)   
    }else{
      console.log(result)
      let products=result;
      products.forEach(obj => {
          console.log(typeof("price",obj.price));
          console.log(typeof("qty",obj.qty));
          total = parseInt(obj.price) * obj.qty + total;
        });
      console.log("total:",total)
      let GST =(total*18)/100;
      let  subtotal= total + GST;
      user.total=total;
      user.GST=GST;
      user.subtotal=subtotal;
     res.render('user/cart',{user,products})
    }
  })
 
});
router.get('/userlogin',(req,res)=>{
  res.render('user/userlogin')
});
router.get('/userRegistration',(req,res)=>{
  res.render('user/userRegistration')
});
  router.post('/RegData', (req, res) => {
    console.log(req.body.email)
    let userMail = req.body.email;
    let sql = "select * from user where email=?";
    con.query(sql, [userMail], (err, row) => {
      if (err) {
        console.log(err)
      } else {
        if (row.length > 0) {
          console.log("email exist")
        } else {
          let data = req.body;
          let q = "insert into user set?";
          con.query(q, data, function (err, result) {
            if (err) {
              console.log(err)
            } else {
              console.log("data inserted")
              res.redirect('/userlogin')
            }
          })
        }
      }
    })
    console.log(req.body)

  });
router.post('/logData',(req,res)=>{
  console.log(req.body)
  let email=req.body.Username;
  let password=req.body.password;
  console.log(email,password)
  let sql="select * from user where email =? and password";
  con.query(sql,[email,password],(err,row)=>{
    if(err){
      console.log(err)
    }else{
      if(row.length>0){
        console.log("login success")
        console.log(row[0])
        req.session.user=row[0]
       
        res.redirect('/')
      }else{
        console.log("login error")
      }
      
    }
  })

});
router.get("/addtocart/:id",checkuser,(req,res)=>{
  console.log(req.params.id);
  let productId=req.params.id;
  userId=req.session.user.id;
  let sql1="select * from cart where userId = ? and productId=?";
  con.query(sql1,[userId,productId],(err,row)=>{
    if(err){
      console.log(err)
    }else{
      if(row.length>0){
        let q=row[0].qty;
        let cartId=row[0].id;
        q=q+1;
        let sql2="update cart set qty=? where id=?"
        con.query(sql2,[q,cartId],(err,results)=>{
          if(err){
            console.log(err)
          }else{
            res.redirect("/")
          }
        })
      }else{
        let data={
          productId,
          userId
        }
        let sql="insert into cart set ?"
        con.query(sql,data,(err,result)=>{
          if(err){
            console.log(err)
          }else{
            res.redirect("/")
          }
        })
        console.log(" add to cart working..")
      } 
      }
    })
  })
  router.get('/logout',(req,res)=>{
   req.session.destroy();
   res.redirect('/')
  })


   router.get('/addqty/:id',(req,res)=>{
    var id=req.params.id;
    var userid=req.session.user.id;
    var sql="select * from cart where userId = ? and productId =?"
    con.query(sql,[userid,id],(err,row)=>{
      if(err){
        console.log(err)
      }else{
        var Fqty=row[0].qty;
        var newqty=Fqty+1;
        var sql2="update cart set qty = ? where productId= ? and userId = ? "
        con.query(sql2,[newqty,id,userid],(err,result)=>{
          if(err){
            console.log(err)
          }else{
            res.redirect('/cart')
          }
        })
      }
    })
   })


   router.get('/subqty/:id',(req,res)=>{
    var id=req.params.id;
    var userid=req.session.user.id;
    var sql="select * from cart where userid = ? and productid =?"
    con.query(sql,[userid,id],(err,row)=>{
      if(err){
        console.log(err)
      }else{
        var Fqty=row[0].qty;
        var newqty=Fqty-1;
        var sql2="update cart set qty = ? where productid= ? and userid = ? "
        con.query(sql2,[newqty,id,userid],(err,result)=>{
          if(err){
            console.log(err)
          }else{
            res.redirect('/cart')
          }
        })
      }
    })
   })

   router.get("/qtty/:id",(req,res)=>{
    let id =req.params.id;
    console.log(id)
    var userid=req.session.user.id;
    var sql="select * from cart where userId = ? and productId =?"
    con.query(sql,[userid,id],(err,row)=>{
      if(err){
        console.log(err)
      }else{
        var Fqty=row[0].qty;
        var newqty=Fqty+1;
        var sql2="update cart set qty = ? where productId= ? and userId = ? "
        con.query(sql2,[newqty,id,userid],(err,result)=>{
          if(err){
            console.log(err)
          }else{
            res.redirect('/addTocart')
          }
        })
      }
    })
   })  
 router.get("/remove/:id",(req,res)=>{
  var id=req.params.id;
  console.log(id);
  let userid = req.session.user.id;
  sql="DELETE FROM cart where productId=? and userid=?";
  con.query(sql,[id,userid],(err,result)=>{
    if (err){
      console.log(err);
    }else{
      res.redirect('/cart')
    }
  })
 })
 router.get("/createOrder/:amount",(req,res)=>{
    console.log(req.params.amount)
    let amount = req.params.amount
    var options = {
      amount: amount *100,  // amount in the smallest currency unit
      currency: "INR",
      receipt: "order_rcptid_11"
    };
    razorpay.orders.create(options, function(err, order) {
      console.log(order);
      let user = req.session.user;
      res.render('user/checkout',{order,user})
    });
 })
 router.post("/varify",async(req,res)=>{
  console.log(req.body);
  console.log("varify")
  let data=req.body;
  var crypto =require('crypto')
  var order_id = data[  'response[razorpay_order_id]']
  var payment_id=data[ 'response[razorpay_payment_id]']
const razorpay_signature=data['response[razorpay_signature]']
const  key_secret= "P7lTZu45rXiClieYrGgLojiL";
let hmac = crypto.createHmac('sha256', key_secret);
await hmac.update(order_id + "|" + payment_id);
const generated_signature =hmac.digest('hex');
if(razorpay_signature ===generated_signature){
  
  console.log("verified transaction")
  let sql="update cart set status = 'purchased' where userId =?";
  let userId=req.session.user.id;
  con.query(sql,[userId],(err,result)=>{
    if(err){
      console.log(err)
    }else{
      res.redirect('/myorders')
    }
  })
}else{
  console.log("payment error..")
}
 })
 router.get('/myorders',(req,res)=>{
  var sql ="select products.id,products.Name,products.description,products.price,products.img,cart.userId,cart.qty from products inner join cart on products.id =cart.productid where cart.userId=? and cart.status ='purchased'";
  let userId=req.session.user.id;
  let user=req.session.user;
  con.query(sql,[userId],(err,result)=>{
    if(err){
      console.log(err)
    }else{
      console.log(result)
      res.render("user/myorders",{user,result})
    }
  })
 
});
module.exports = router;
