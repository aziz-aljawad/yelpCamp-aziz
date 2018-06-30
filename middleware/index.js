var Campground =require('../models/campground');
var Comment =require('../models/comment');
var middlewareObj ={};
middlewareObj.checkCampgroundOwnership =function(req,res,next){
        if (req.isAuthenticated() ) {
            Campground.findById(req.params.id,function(err,foundCampground){
                if (err) {
                    req.flash("error","Campground is not found");
                    res.redirect('back');
                } else {
                    //does the user own the campground
                    if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin ) {
                        next();
                    } else {
                        req.flash("error","You do not have premission to do that");
                        res.redirect("back");
                    }
                }
            });        
        } else {
            req.flash("error","You to be loggedIn to do that")
            res.redirect("back");
        }
    }
middlewareObj.checkCommentOwnership =function(req,res,next){
        if (req.isAuthenticated() ) {
            Comment.findById(req.params.comment_id,function(err,foundComment){
                if (err) {
                     res.redirect('back');
                } else {
                    //does the user own the comment
                    if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin ) {
                       next();
                    } else {
                        req.flash("error","You DO NOT HAVE PREMISSION TO DO THAT");
                        res.redirect("back");
                    }
                }
            });        
        } else {
            res.redirect("back");
        }
    }

middlewareObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();

    }
     req.flash("error", "You need to login to do that!")
     res.redirect('/login');
}

module.exports = middlewareObj;