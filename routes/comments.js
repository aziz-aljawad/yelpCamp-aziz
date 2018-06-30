var express = require('express');
var router =express.Router({mergeParams: true });
var Campground = require('../models/campground')
var Comment = require('../models/comment')
var Comment = require('../models/comment')
//=============================//
//    COMMENTS ROUTES          //
//=============================//

router.get('/new',isLoggedIn,function(req,res)
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

router.post('/',isLoggedIn,function (req,res)
{
        //find a Campground by id
        Campground.findById(req.params.id,function(err,foundCampground)
        {
            if (err){
                console.log(err);
                res.redirect('/camgrounds');
            } else{
                console.log(req.body.comment);
                Comment.create(req.body.comment,function (err,newComment)
                {
                    if (err){
                        console.log(err);    
                    } else{
                        //add username and id to comment
                        newComment.author.id =req.user._id;
                        newComment.author.username =req.user.username;
                        //save comment
                        newComment.save();
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
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();

    }
     res.redirect('/login');
}
module.exports =router;