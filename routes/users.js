var express=require("express");
var router=express.Router();
var Question=require("../models/questions"),
      Answer=require("../models/answer"),
      User=require("../models/User");
var middleware=require("../middleware");


router.get("/user",middleware.isLoggedin,function(req, res) {
   User.find({},function(err,user)
   {
      if(err)
      console.log(err);
      else
      {
          console.log(req.user);
          console.log(user);
          res.render("users/userpage",{u:user});
      }
   });
});


//==============================================
//Follow and Unfollow
//================================================
router.get("/:id/follow",function(req, res) {
   User.findById(req.params.id,function(err, user) {
      if(err)
      console.log(err);
      else
      {
          User.findById(req.user._id,function(err,cuser) {
              if(err)
              console.log(err);
              {
                  if(user.numFollowers==null)
                  user.numFollowers=1;
                  else
                  user.numFollowers++;
                  user.followers.push({username:cuser.username,userId:cuser._id});
                  console.log("done");
                  user.save(function(err,a)
                  {
                     if(err)
                     console.log(err);
                     else
                     {
                          console.log(cuser);
                         if(cuser.numFollowing==null)
                         cuser.numFollowing=1;
                         else
                         cuser.numFollowing++;
                        
                         cuser.following.push({username:user.username,userId:user._id});
                         cuser.save(function(err,mya)
                         {
                            if(err)
                            console.log(err);
                            else
                            {
                                console.log("sucess");
                                console.log(mya);
                                console.log("==============================");
                               res.redirect("/"+req.params.id+"/viewp");
                            }
                         });
                     }
                  });
              }
          });
      }
   }); 
});

//===================================
//Unfollow
//===================================
var user={},cuser={};
function fun1(req,res,next)
{
    User.findById(req.params.id,function(err,user1)
    {
        if(err)
        console.log(err);
        else
        {
            User.findById(req.user._id,function(err,cuser1) {
                if(err)
                console.log(err);
                else
                {
                    user=user1;
                    cuser=cuser1;
                    next();
                }
            });
        }
    });
}
function fun2(req,res,next)
{
   
    for(var i=0;i<user.followers.length;i++)
    {
        if(user.followers[i].userId==cuser._id)
        {
            user.numFollowers--;
            user.followers.remove(user.followers[i]._id);
            user.save(function(err,user)
            {
               if(err)
               console.log(err);
               else
               next();
            });
        }
    }
    
}

function fun3(req,res,next)
{
     console.log("welcome============================");
    for(var i=0;i<cuser.following.length;i++)
    {
        if(cuser.following[i].userId==user._id)
        {
            cuser.numFollowing--;
            cuser.following.remove(cuser.following[i]._id);
            cuser.save(function(err,user)
            {
               if(err)
               console.log(err);
               else
               next();
            });
        }
    }
}
//================================
//========Unfollow==================
//=================================
var funarray=[fun1,fun2,fun3];
router.get("/unfollow/:id",funarray,function(req, res) {
   console.log("sucess"); 
                                   res.redirect("/"+req.params.id+"/viewp");
});





//========================================================
//===================View Profile========================
var follow=0,vuser={};
function fun4(req,res,next)
{
  User.findById(req.params.id).populate("userq").populate("usera").exec(function(err,user) {
      if(err)
      console.log(err);
      else
      {
          vuser=user;
          next();
      }
      
  });
}
function fun5(req,res,next)
{
    follow=0;
    var flag=0;
   
         // vuser=user;
            for(var i=0;i<vuser.followers.length;i++)
            {
                if(vuser.followers[i].userId==req.user._id)
                {
                    console.log("got");
                    follow=1;
                    flag=1;
                   return next();
                }
            }
    if(!flag)
    return next();
}
var arr=[fun4,fun5];
router.get("/:id/viewp",arr,function(req, res) {
    console.log(vuser.usera);
res.render("users/viewprofile",{user:vuser,follow:follow,a:vuser.usera,q:vuser.userq});   
});




//============================================
//=======================Likes===============
//=======================================
router.get("/likes/:id",middleware.isLoggedin,function(req, res) {
    Question.findById(req.params.id,function(err,question)
    {
       if(err)
       console.log(err);
       else
       {
       var found=0;
      for(var i=0;i<question.likedBy.length;i++)
      {
          if(question.likedBy[i]==req.user._id)
          found=1;
      }
      if(found)
      res.redirect('/qanda');
      else
      {
          if(question.likes==null)
          question.likes=1;
          else
          question.likes++;
          question.likedBy.push(req.user._id);
          question.save(function(err,question)
          {
             if(err)
             console.log(err);
             else{
                 console.log(question);
                 res.redirect('/qanda');
             }
          });
      }
       }
    });
});




router.get("/unlike/:id",middleware.isLoggedin,function(req, res) {
   Question.findById(req.params.id,function(err, question) {
      if(err)
      console.log(err);
      else
      {
          for(var i=0;i<question.likedBy.length;i++)
          {
              if(question.likedBy[i]==req.user._id)
              {
                  question.likes--;
                  question.likedBy.remove(question.likedBy[i]);
                  question.save(function(err,question){
                     if(err)
                     console.log(err);
                     else
                     res.redirect('/qanda');
                  });
                  console.log(i);
                  break;
              }
          }
          
      }
   }); 
});
//=================================================
//==========================================Likedby================


var userId=[],username=[],lUser=[];

function findUserId(req,res,next)
{
   Question.findById(req.params.id)
			.then((ans,err)=>{
				if(err) console.log(err);
				else{
					userId = [];
					ans.likedBy.forEach((a=>{
						userId.push(a);
					}));
				}
			}).then(()=>{
				console.log("A1");
				next();
			});
}


function findUserName(req,res,next)
{
    var i=0;
	username=[];
	lUser=[];
//	userId.reverse();
userId.sort();
	console.log(userId);
	userId.forEach((iid)=>{
		User.findById(iid,(err,us)=>{
			if(err) console.log(err);
			else {
			    console.log(iid);
			    
			    var newUser={
            name:us.username,
            id:iid
        };
        lUser.push(newUser);
				//username.push(us.username);
				//console.log(username);
				++i;
				if(i==userId.length){
				      //username.reverse();
					console.log("A2");
					next();
				}
			}
		});
	});
	
}


var likedarray=[findUserId,findUserName];


router.get("/likedby/:id",middleware.isLoggedin,likedarray,function(req, res) {
    res.render("users/likedBypage",{User:lUser});
  //  console.log(lUser);
});

//==================================================
router.get("/myprofile/:id",function(req, res) {
   User.findById(req.params.id).populate("usera").populate("userq").exec(function(err,user) {
       if(err)
       console.log(err);
       else
       {
          res.render("users/myuprofile",{user:user,a:user.usera,q:user.userq});
       }
   }); 
});


//==========================================
//===========User Request=======================
//===============================================
var users=[],found=0;
function fun88(req,res,next){
	found=0;
	users=[];
	User.find({username:req.body.username})
		.then((user,err)=>{
			if(err) console.log(err);
			else{
				users=user;
				if(user.length==0){	
					return next();
				}
				else{
					found=1;
					return next();
				}
			}
		});
	
}


var funnarray = [fun88];
router.post("/",middleware.isLoggedin,funnarray,(req,res)=>{
	res.render("users/searchuser",{u:users,found:found});
});
//==============================================
//============Question Search===================
//==============================================
var qs=[],found1=0;
function fun888(req,res,next){
	found1=0;
	users=[];
	Question.find({title:req.body.title})
		.then((q,err)=>{
			if(err) console.log(err);
			else{
				qs=q;
				if(q.length==0){	
					return next();
				}
				else{
					found1=1;
					return next();
				}
			}
		});
	
}


var funnnarray = [fun888];
router.post("/ques",middleware.isLoggedin,funnnarray,(req,res)=>{
	res.render("questions/sques",{q:qs,found:found1});
});
//=================================================
//==============request question===================
//=================================================
router.get("/request/:qid",middleware.isLoggedin,function(req, res) {
    User.find({},function(err, user) {
        if(err)
        console.log(err);
        else
       res.render("users/requestpage",{u:user,found:1,qid:req.params.qid}); 
    });
});

var found3=0;
router.get("/:uid/requestus/:qid",middleware.isLoggedin,function(req, res) {
    found3=0;
   User.findById(req.params.uid,function(err,user) {
      if(err)
      console.log(err);
      else
      {
          for(var i=0;i<user.reqQue.length;i++)
          {
              if(req.params.qid==user.reqQue[i])
              found3=1;
          }
          if(!found3)
          {
          Question.findById(req.params.qid,function(err, question) {
              if(err)
              console.log(err);
              else
              {
                 
              user.reqQue.push(req.params.qid);
          user.save(function(err,user)
          {
             if(err)
             console.log(err);
             else
             {
           
             console.log(user);
              res.redirect('back');
             }
          });
              }
          });
         
      }
      else
      {
            console.log(user);
         res.redirect('back');  
      }
      }
   }); 
    
});

router.get("/myque/:id",middleware.isLoggedin,function(req, res) {
    User.findById(req.params.id).populate("reqQue").exec(function(err, question) {
        if(err)
        console.log(err);
        else
        {
            
            res.render("users/myreqq",{q:question.reqQue});
        }
    });
});


router.get("/delreq/:id",middleware.isLoggedin,function(req, res) {
   User.findById(req.user._id,function(err,user) {
       if(err)
       console.log(err);
       else
       {
           user.reqQue.pull(req.params.id);
           user.save(function(err,user)
           {
              if(err)
              console.log(err);
              else
              res.redirect('back');
           });
       }
   }); 
});



 

 module.exports=router;
