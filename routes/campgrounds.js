
var express = require('express');
var router =express.Router();
var Campground = require('../models/campground');
var middleware =require("../middleware");
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
router.post('/',middleware.isLoggedIn,function(req,res)
{
    //get data from form and add campgrounds array
    var name = req.body.name;
    var image =req.body.image;
    var desc =req.body.description;
    var author ={
        id:req.user._id,
        username:req.user.username
    }
    var newCampGround ={name:name,image:image, description: desc, author: author }
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
router.get('/new',middleware.isLoggedIn,function(req,res)
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

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
    //check if user is loggedIn 

        Campground.findById(req.params.id,function(err,foundCampground){
           if (err) {
               console.log(err);
           } else {
               res.render("campgrounds/edit",{campground:foundCampground});
           }
        });        

});
//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){

    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if (err) {
             res.redirect('/campgrounds');      
        } else {
             res.redirect('/campgrounds/'+req.params.id);
        }
    })
})


//DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership,function (req,res) {

    Campground.findByIdAndRemove(req.params.id,(err)=>{
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });   

});



module.exports =router;