var mongoose=require("mongoose");
var ASchema=new mongoose.Schema({
   Answer:String,
   aq:{
       id:String,
       title:String,
       description:String
   },
      userId:String
});
var Answer =mongoose.model("Answer",ASchema);
module.exports=Answer; 