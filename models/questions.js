var mongoose=require("mongoose");
var QSchema=new mongoose.Schema({
   title:String,
   description:String,
   answers:[{
       type: mongoose.Schema.Types.ObjectId,
       ref:"Answer"
   }],
   userId:String,
   likes:Number,
   likedBy:[String]
});
var Question =mongoose.model("Question",QSchema);
module.exports=Question;