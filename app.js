
//dependcies
var express =require("express");
var app =express();
var bodyParser =require("body-parser");
var mongoose =require("mongoose");
    mongoose.connect("mongodb://localhost/yelp_camp");
    app.use(bodyParser.urlencoded({extended:true}));
    app.set("view engine","ejs");

//SCHEMA SETUP 

var campgroundSchema = new mongoose.Schema(
    {
        name:String,
        image:String,
        description:String
    });

var Campground = mongoose.model("Campground",campgroundSchema);


// Campground.create(   
//     {
//         name: "lion's rest",
//         image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg",
//         description: "This camp is natural habitat for many animals around the world weather is cool all year long"
//     },
//     function(error,campground)
//     {
//         if (error) 
//         {
//             console.log(error);    
//         }
//         else
//         {
//             console.log("Successfully created:- \n"+campground )
//         }
//     });


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
            res.render('index',{campgrounds: campgrounds});
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
    res.render("new.ejs")
})
app.get('/campgrounds/:id',function(req,res)
{
    Campground.findById(req.params.id,function(err,foundCampground)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("show",{campground :foundCampground });
            
        }

    });
});
const port = 12345
app.listen(port,function()
{
    console.log(`connected to port ${port}`);    
});
