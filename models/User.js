var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");
var UserSchema=new mongoose.Schema({
   username:String,
   userq:[{
       type: mongoose.Schema.Types.ObjectId,
       ref:"Question"
   }],
   usera:[{
       type: mongoose.Schema.Types.ObjectId,
       ref:"Answer"
   }],
   followers:[{username:String,userId:String}],
   following:[{username:String,userId:String}],
   numFollowers : Number,
	numFollowing : Number,
	reqQue:[{
	   type: mongoose.Schema.Types.ObjectId,
       ref:"Question"
	}]
});
UserSchema.plugin(passportLocalMongoose);
var User =mongoose.model("User",UserSchema);
module.exports=User;
