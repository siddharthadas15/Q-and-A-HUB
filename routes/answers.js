var express=require("express");
var router=express.Router();
var Question=require("../models/questions"),
      Answer=require("../models/answer"),
      User=require("../models/User");
      
      var middleware=require("../middleware");
      
      router.get("/qanda/:id/ans/new",middleware.isLoggedin,function(req, res) {
        Question.findById(req.params.id,function(err,question)
        {
           if(err)
           console.log(err);
           else
           res.render("answers/answerform",{q:question});
        });
  
});



router.get("/myanswer",middleware.isLoggedin,function(req, res) {
   User.findById(req.user._id).populate("usera").exec(function(err,user)
    {
        
        if(err)
        console.log(err);
        else
        {
            
          // console.log(user.usera);
        res.render("answers/myanswer",{a:user.usera});
        }
    });
});

router.get("/qanda/ans/:id",function(req,res)
{
    Question.findById(req.params.id).populate("answers").exec(function(err,question)
    {
        if(err)
        console.log(err);
        else
        {
           
        res.render("answers/answer",{q:question});
        }
    });
});


router.post("/qanda/ans/:ansid",middleware.isLoggedin,function(req,res)
{
   Question.findById(req.params.ansid,function(err,question)
    {
       if(err)
       {
       console.log(err);
       res.redirect("/qanda");
       }
       else
      {
         
          Answer.create({Answer:req.body.answer,aq:{id:question._id,title:question.title,description:question.description},userId:req.user._id},function(err,ans)
          {
             if(err)
             console.log(err);
             else{
                 console.log("======================");
                 console.log(ans);
                 console.log("=======================");
                 User.findById(req.user._id,function(err,user){
                     if(err)
                     console.log(err);
                     else
                     {
                     user.usera.push(ans);
                     user.save(function(err,user)
                     {
                        if(err)
                        console.log(err);
                        else
                        {
                             question.answers.push(ans);
                 question.save(function(err,cc)
                 {
                    if(err)
                    console.log(err);
                    else
                    {
                        res.redirect("/qanda/ans/"+question._id);
                        //console.log(cc);
                    }
                 });
                        }
                     });
                     }
                 });
                
             }
          });
      }
    });    
});
      
      
      router.get("/qanda/:id/ans/:ans_id/edit",middleware.isLoggedin,function(req, res) {
   Answer.findById(req.params.ans_id,function(err, answer) {
       if(err)
       console.log(err);
       else
       res.render("answers/editans",{qid:req.params.id,ans:answer});
   }); 
});




router.post("/qanda/:id/ans/:ans_id",middleware.isLoggedin,function(req, res) {
   Answer.findByIdAndUpdate(req.params.ans_id,{Answer:req.body.answer},function(err,answer)
   
  {
     if(err)
     console.log(err);
     else
     res.redirect("/qanda/ans/"+req.params.id);
  }); 
});
      
//===========================================
//==============Delete Answer======================
//=================================================
var fans={};

function fun550(req,res,next)
{
    fans={};
    Answer.findById(req.params.id,function(err,answer) {
        if(err)
        console.log(err);
        else
        {
         fans=answer;
        // console.log(fans);
         next();
        }
    });
}
function fun551(req,res,next)
{
    console.log(fans);
    User.findById(req.user._id,function(err,user) {
        if(err)
        console.log(err);
        else
        {
            console.log(user);
            user.usera.pull(req.params.id);
            
           user.save(function(err,user)
           {
              if(err)
              console.log(err);
              else
              next();
           });
        }
    });
}

function fun552(req,res,next)
{
    Question.findById(fans.aq.id,function(err, question) {
       if(err)
       console.log(err);
       else
       {
           question.answers.pull(fans._id);
           question.save(function(err,question)
           {
              if(err)
              console.log(err);
              else
              next();
           });
       }
    });
}

var ar=[fun550,fun551,fun552];

router.get("/deletea/:id",middleware.checkAnswerOwnership,ar,function(req, res) {
  Answer.findByIdAndRemove(req.params.id,function(err)
    {
       if(err)
       console.log(err);
       else
       res.redirect("back");
    });
});


      
module.exports=router;