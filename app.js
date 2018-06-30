
//dependcies
var express =require("express");
var app =express();
var bodyParser =require("body-parser");
var mongoose =require("mongoose");
var passport =require("passport");
var LocalStrategy =require("passport-local");
var PassportLocalMongoose =require("passport-local-mongoose");
var seedDB =require("./seeds");

//models
var Campground =require("./models/campground");
var Comment = require("./models/comment"); 
var User = require("./models/user");
//CONFIG
mongoose.connect("mongodb://localhost/yelp_camp_v6");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

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
    next();
})

app.get('/',function(req,res)
{
    res.render('landing')
});
app.get('/campgrounds',function(req,res)
{
    //get all campground 
    Campground.find({},function (err,campgrounds)
    {
        console.log(req.user);
        if (err) 
        {
            console.log(err);    
        }
        else
        {
            res.render('campgrounds/index',{campgrounds: campgrounds});
        }
    });
});
app.post('/campgrounds',function(req,res)
{
    //get data from form and add campgrounds array
    var name = req.body.name;
    var image =req.body.image;
    var desc =req.body.description;
    var newCampGround ={name:name,image:image, description: desc }
    //creat a new campground and save to database
    Campground.create(newCampGround,function (err,newlycreated)
    {
        if (err) 
        {
            console.log(err);    
        }
        else
        {
            //redirect back to campgrounds
            res.redirect('/campgrounds');
        }
    });
});
app.get('/campgrounds/new',function(req,res)
{
    res.render("campgrounds/new")
})
app.get('/campgrounds/:id',function(req,res)
{
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(foundCampground);
            res.render("campgrounds/show",{campground :foundCampground });

        }
    });
});


//=============================//
//    COMMENTS ROUTES          //
//=============================//

app.get('/campgrounds/:id/comments/new',isLoggedIn,function(req,res)
{
    //find a Campground by id
    Campground.findById(req.params.id,function (err,foundCampground)
    {
        if (err)
        {
            console.log(err);    
        }
        else
        {
            res.render("comments/new.ejs",{campground: foundCampground});
            
        }
    }); 

});

app.post('/campgrounds/:id/comments',isLoggedIn,function (req,res)
{
        //find a Campground by id
        Campground.findById(req.params.id,function(err,foundCampground)
        {
            if (err)
            {
                console.log(err);
                res.redirect('/camgrounds');
            }
            else
            {
                console.log(req.body.comment);
                Comment.create(req.body.comment,function (err,newComment)
                {
                    if (err)
                    {
                        console.log(err);    
                    }
                    else
                    {
                        foundCampground.comments.push(newComment);
                        foundCampground.save();
                        //campground
                         res.redirect('/campgrounds/'+foundCampground._id);
                    }
                })
            }
        })
        //create new comment
        //connect a new comment to campground
        //redirect to campground/:id
});

//===================
// AUTH ROUTES                    
//===================

//show register form
app.get('/register',function(req,res){
    res.render('register');


});
app.post('/register',function(req,res){
    var newUser =new User({username:req.body.username});
    User.register(newUser,req.body.password,function(err,user){
        if (err) {
            console.log(err);
            return res.render('register');
        } 
        passport.authenticate('local')(req,res,function (param) {  
             res.redirect('/campgrounds');
        });
    });
});
// show login form
app.get('/login',function(req,res){
    res.render('login');
}); 
//handling login logic
app.post('/login',passport.authenticate('local',{
    successRedirect:'/campgrounds',
    failRedirect:'/login' }),function(req,res){
});
//logout route
app.get('/logout',function(req,res){
    req.logout();
     res.redirect('/campgrounds');
})
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();

    }
     res.redirect('/login');
}
const port = 12345
app.listen(port,function()
{
    console.log(`connected to port ${port}`);    
});
