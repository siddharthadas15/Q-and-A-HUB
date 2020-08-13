var express=require("express");
var router=express.Router();
var Question=require("../models/questions"),
      Answer=require("../models/answer"),
      User=require("../models/User");
var passport=require("passport");


//==========================================
//============Sign Up=======================
router.get("/register",function(req, res) {
   res.render("register"); 
});


router.post("/register",function(req, res) {
   User.register(new User({username:req.body.username}),req.body.password,function(err,user)
   {
      if(err)
      {
          console.log(err);
          res.redirect("register");
      }
      passport.authenticate("local")(req,res,function()
      {
          res.redirect("/qanda");
      });
   }); 
});



//============================================
//===================Login====================
router.get("/login",function(req, res) {
   res.render("login"); 
});



router.post("/login",passport.authenticate("local",{
     successRedirect:"/qanda",
    failureRedirect:"/login"
}),function(req, res) {
    
});

//==============================================
//=====================Logout=================
router.get("/logout",function(req, res) {
   req.logout();
   res.redirect("/");
});




   module.exports=router;