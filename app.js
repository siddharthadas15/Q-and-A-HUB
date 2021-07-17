if (process.env.NODE_ENV !== "production") {
   require('dotenv').config();
}

var express=require("express");
var app=express();
var mongoose=require("mongoose");
var Question=require("./models/questions.js"),
Answer=require("./models/answer.js"),
bparser=require("body-parser");
var passport=require("passport"),
LocalStrategy=require("passport-local"),
session = require('express-session'),
MongoDBStore = require('connect-mongo')(session);
User=require("./models/User.js");
//===============================================
//App Setup
//===============================================
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
const dbUrl=process.env.DB_URL||"mongodb://localhost/qanda";
mongoose.connect(dbUrl);
const connection=mongoose.connection;
connection.once('open',function()
{
console.log("mogo starter");
});
//==========================================
//Passport Config.
//==========================================
const secret=process.env.SECRET||"SD15's encode and decode mesaage";
const store = new MongoDBStore({
   url: dbUrl,
   secret,
   touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
   console.log("SESSION STORE ERROR", e);
});

app.use(session({
   store,
    secret,
    resave:false,
    saveUninitialized:false,
    cookie: {
      httpOnly: true,
      // secure: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
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