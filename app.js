
//dependcies
var express =require("express");
var app =express();
var bodyParser =require("body-parser");
var mongoose =require("mongoose");
var flash =require("connect-flash");
var passport =require("passport");
var LocalStrategy =require("passport-local");
var methodOverride = require("method-override");
var PassportLocalMongoose =require("passport-local-mongoose");
var seedDB =require("./seeds");

//models
var Campground =require("./models/campground");
var Comment = require("./models/comment"); 
var User = require("./models/user");

//ROUTES
var commentRoutes       =require('./routes/comments');
var campgroundRoutes    =require('./routes/campgrounds');
var indexRoutes                =require('./routes/index');

//CONFIG
mongoose.connect("mongodb://localhost/yelp_camp_v12");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

//PASSPORT CONFIG
app.use(require('express-session')({
    secret: "rusty is dog that every cat hate",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
    res.locals.currentUser =req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use(indexRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);

const port = 12345
app.listen(port,function()
{
    console.log(`connected to port ${port}`);    
});
