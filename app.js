
//dependcies
var express =require("express");
var app =express();
var bodyParser =require("body-parser");
var mongoose =require("mongoose");
var seedDB =require("./seeds");

//models
var Campground =require("./models/campground");
var Comment = require("./models/comment");
// var User = require("./models/user");
//CONFIG
mongoose.connect("mongodb://localhost/yelp_camp_v5");
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
seedDB();





app.get('/',function(req,res)
{
    res.render('landing')
});
app.get('/campgrounds',function(req,res)
{
    //get all campground 
    Campground.find({},function (err,campgrounds)
    {
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

app.get('/campgrounds/:id/comments/new',function(req,res)
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

app.post('/campgrounds/:id/comments',function (req,res)
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

const port = 12345
app.listen(port,function()
{
    console.log(`connected to port ${port}`);    
});
