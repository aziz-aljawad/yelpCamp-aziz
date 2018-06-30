
var express = require('express');
var router =express.Router();
var Campground = require('../models/campground')
router.get('/',function(req,res)
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
router.post('/',function(req,res)
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
            res.redirect('/');
        }
    });
});
router.get('/new',function(req,res)
{
    res.render("campgrounds/new")
})
router.get('/:id',function(req,res)
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
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();

    }
     res.redirect('/login');
}
module.exports =router;