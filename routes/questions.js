var express=require("express");
var router=express.Router();
var Question=require("../models/questions"),
      Answer=require("../models/answer"),
      User=require("../models/User");

var middleware=require("../middleware");



router.get("/qanda/new",middleware.isLoggedin,function(req,res)
{
   res.render("./questions/qform");
});



router.get("/qanda",function(req, res) {
   Question.find({},function(err,question)
   {
      if(err)
      console.log(err);
      else
     {
        res.render("questions/questions",{q:question});
     }
   }) ;
});



router.get("/myquestion",middleware.isLoggedin,function(req, res) {
   User.findById(req.user._id).populate("userq").exec(function(err,user)
    {
        if(err)
        console.log(err);
        else
        {
        res.render("questions/questions",{q:user.userq});
        }
    });
});



router.post("/qanda",middleware.isLoggedin,function(req,res)
{
    console.log(req.body.q);
 Question.create({
     title:req.body.q.title,
     description:req.body.q.description,
     userId:req.user._id,
     likes:null,
     likedBy:[]
 },function(err,question)
 {
    if(err)
    console.log(err);
    else
    {
    req.user.userq.push(question);
    req.user.save(function(err,user)
    {
       if(err)
       console.log(err);
       else
       console.log(user);
    });
    console.log(question);
    res.redirect("/request/"+question._id);
    }
 });
});



router.get("/qanda/edit/:id",middleware.isLoggedin,function(req, res) {
   Question.findById(req.params.id,function(err, question) {
      if(err)
      console.log(err);
      else
      res.render("questions/queedit",{q:question});
   }); 
});





router.post("/qanda/edit/:id",middleware.isLoggedin,function(req, res) {
   Question.findByIdAndUpdate(req.params.id,req.body.q,function(err, answer) {
      if(err)
      console.log(err);
      else
      res.redirect("/qanda");
   }); 
});


//==================================================
//=======================Delete Questions===========
//==================================================

var dque={},ansid=[];
function fun599(req,res,next)
{
    User.find({}).populate("usera").exec(function(err, user) {
       if(err)
       {
           console.log(err);
       }
       else
       {
           for(var i=0;i<user.length;i++)
           {
               for(var j=0;j<user[i].usera.length;j++)
               {
                   if(user[i].usera[j].aq.id==req.params.id)
                   {
                       user[i].usera.pull(user[i].usera[j]._id);
                       user[i].save(function(err,user)
                       {
                          if(err)
                          console.log(err);
                          
                         
                       });
                       
                   }
               }
           }
           next();
       }
    });
}

function fun600(req,res,next)
{
 User.findById(req.user.id,function(err,user) {
     if(err)
     console.log(err);
     else{
         user.userq.pull(req.params.id);
         user.save(function(err,user)
         {
             if(err)
             console.log(err);
             else
             {
                  
              next();
             }
         });
        
     }
 });   
}


function fun601(req,res,next)
{
  User.find({},function(err, user) {
     if(err)
     console.log(err);
     else
     {
         for(var i=0;i<user.length;i++)
         {
             for(var j=0;j<user[i].reqQue.length;j++)
             {
                 if(user[i].reqQue[j]==req.params.id)
                 {
                 user[i].reqQue.pull(req.params.id);
                 user[i].save(function(err,user)
                 {
                    if(err)
                    console.log(err);
                    else{
                        console.log(user);
                          console.log("================yyyyyyyyyy");
                    }
                 });
                 }
             }
         }
         next();
     }
  });  
}




function fun650(req,res,next)
{
    ansid=[];
    Answer.find({},function(err,ans) {
        if(err)
        console.log(err);
        else{
            console.log(ans);
            for(var i=0;i<ans.length;i++)
            {
                if(ans[i].aq.id==req.params.id)
                {
                ansid.push(ans[i]._id);
             //   ansid.push(ans[i]._id);
                }
            }
            console.log(ansid);
            for(var j=0;j<ansid.length;j++)
           {
               Answer.deleteMany({id:ansid[i]}, function (err) {
  if(err) console.log(err);
  console.log("Successful deletion");
});
           }
           next();
        }
    });
}

var da=[fun599,fun600,fun601,fun650];
router.get("/qdelete/:id",middleware.checkQuestionOwnership,da,function(req, res) {
   Question.findByIdAndRemove(req.params.id,function(err)
   {
      if(err)
      console.log(err);
      res.redirect("/qanda");
   });
});



module.exports=router;