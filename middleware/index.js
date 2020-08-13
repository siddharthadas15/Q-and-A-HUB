var middlewareObj={};
var Question=require("../models/questions.js");
var Answer=require("../models/answer.js");



middlewareObj.isLoggedin=function isLoggedin(req,res,next)
{
 if(req.isAuthenticated())   
 {
     return next();
 }
 res.redirect("/login");
};

middlewareObj.checkQuestionOwnership=function(req,res,next)
{
    if(req.isAuthenticated())
    {
        Question.findById(req.params.id,function(err, que) {
           if(err)
           res.redirect("back");
           else
           {
               if(que.userId==req.user._id)
               {
                   next();
               }
               else
               res.redirect("back");
           }
        });
    }
    else
    {
        res.redirect("back");
    }
    
};



middlewareObj.checkAnswerOwnership=function(req,res,next)
{
    if(req.isAuthenticated())
    {
        Answer.findById(req.params.id,function(err,ans) {
           if(err)
           res.redirect("back");
           else
           {
               if(ans.userId==req.user._id)
               {
                   next();
               }
               else
               res.redirect("back");
           }
        });
    }
    else
    {
        res.redirect("back");
    }
    
};


module.exports=middlewareObj;