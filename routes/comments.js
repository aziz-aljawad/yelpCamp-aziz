var express = require('express');
var router =express.Router({mergeParams: true });
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var Comment = require('../models/comment');
var middleware =require("../middleware");
//=============================//
//    COMMENTS ROUTES          //
//=============================//

router.get('/new',middleware.isLoggedIn,function(req,res)
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

router.post('/',middleware.isLoggedIn,function (req,res)
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
                Comment.create(req.body.comment,function (err,newComment)
                {
                    if (err)
                    {
                        req.flash("error","Something went wrong");
                        console.log(err);    
                    }
                    else
                    {
                        //add username and id to comment
                        newComment.author.id =req.user._id;
                        newComment.author.username =req.user.username;
                        //save comment
                        newComment.save();
                        foundCampground.comments.push(newComment);
                        foundCampground.save();

                        //campground
                        
                        req.flash("success","succesfully added a new comment")
                         res.redirect('/campgrounds/'+foundCampground._id);
                    }
                })
            }
        })
        //create new comment
        //connect a new comment to campground
        //redirect to campground/:id
});
//EDIT COMMENT ROUTE
router.get("/:comment_id/edit",middleware.checkCommentOwnership,function (req,res) {
    Comment.findById(req.params.comment_id,function(err,foundComment){
        if (err) {
             res.redirect('back');
            console.log(err);         
        } else {
            res.render("comments/edit",{campground_id: req.params.id,comment:foundComment});    
        }
    })
})
//UPDATE COMMENT ROUTE
router.put("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,UpdatedComment){
        if (err) {
             res.redirect('back');
        } else {
             res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});
//COMMENT DESTROY
router.delete("/:comment_id",middleware.checkCommentOwnership,function(req,res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if (err) {
            req.flash("success","Comment deleted.");
            res.redirect('back');
        } else {
             res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});


module.exports =router;