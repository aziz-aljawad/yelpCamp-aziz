var express = require('express');
var router =express.Router();
var passport =require('passport');

var User     = require('../models/user');
var Campground =require('../models/campground');

router.get('/',function(req,res)
{
    res.render('landing')
});

//  |===================|
//  |     AUTH ROUTES   |             
//  |===================|

//show register form
router.get('/register',function(req,res){
    res.render('register',{page: 'register'});


});
router.post('/register',function(req,res){
    var newUser =new User(
        {
            username:req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email:req.body.email,
            avatar:req.body.avatar,

        });
    if(req.body.adminCode === 'sC-admn18' ) {
        newUser.isAdmin =true;
    }
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
          }
        passport.authenticate('local')(req,res,function (param) {  
            
            req.flash("success","welcome to YelpCamp "+user.username);
            res.redirect('/campgrounds');
        });
    });
});
// show login form
router.get('/login',function(req,res){
    res.render('login', {page: 'login'});
}); 
//handling login logic
router.post('/login',passport.authenticate('local',{
    successRedirect:'/campgrounds',
    failRedirect:'/login' }),function(req,res){
});
//logout route
router.get('/logout',function(req,res){
    req.logout();
    req.flash("success","Logged you out");
     res.redirect('/campgrounds');
})
//USER PROFILE
router.get("/users/:id",function(req,res){
    User.findById(req.params.id,function(err,foundUser){
        if (err) {
            req.flash("error","something went wrong");
            return res.redirect("/")
        }  else {

            Campground.find().where('author.id').equals(foundUser._id).exec(function(err,campgrounds){
                if (err) {
                    console.log(err);
                    req.flash("error","something went wrong");
                    return res.redirect("/")
                } else {
                    console.log(campgrounds);
                    res.render("users/show",{user:foundUser,campgrounds:campgrounds});
                }
            });
        }

    });
});
module.exports =router;