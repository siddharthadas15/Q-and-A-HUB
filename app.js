var express=require("express");
var app=express();
var mongoose=require("mongoose");
var Question=require("./models/questions.js"),
Answer=require("./models/answer.js"),
bparser=require("body-parser");
var passport=require("passport"),
LocalStrategy=require("passport-local"),
User=require("./models/User.js");
//===============================================
//App Setup
//===============================================
app.use(bparser.urlencoded({extended:true}));
app.set("view engine","ejs");
mongoose.connect("mongodb://localhost/qanda");
const connection=mongoose.connection;
connection.once('open',function()
{
console.log("mogo starter");
});
//==========================================
//Passport Config.
//==========================================
app.use(require("express-session")({
    secret:"SD15's encode and decode mesaage",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next)
{
   res.locals.CurrentUser=req.user;
   next();
});

//====================================================
//==============ROUTES Import==========================

var QuestionRoutes=require("./routes/questions.js"),
AnswerRoutes=require("./routes/answers.js"),
UserRoutes=require("./routes/users.js"),
IndexRoutes=require("./routes/index.js");

//============================================
//============Routes========================
app.get("/",function(req,res)
{
  res.render("landing");
});


app.use(QuestionRoutes);
app.use(AnswerRoutes);
app.use(UserRoutes);
app.use(IndexRoutes);
//===========================================
//==============================================

app.listen(8080,function()
{
   console.log("Serve Started"); 
});