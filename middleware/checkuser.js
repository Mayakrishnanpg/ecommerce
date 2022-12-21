module.exports={
    checkuser:(req,res,next)=>{
        if(req.session.user){
            console.log("session created",req.session.user)
            next();
        }
    else{
        res.redirect("/");
    }
}
}
