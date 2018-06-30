var mongoose =require("mongoose");
var Campground =require("./models/campground");
var Comment = require("./models/comment");
var data =
[
    {
        name: "Cloud's Rest",
        image: "https://goo.gl/8cdZEY",
        description: "blah blah blah  blah  blah  blah  blah  blah  blah  blah "
    },
    {
        name: "Desert Mesa",
        image: "https://drive.google.com/uc?id=1EJyuJLbeZZmTj2uo1Aiut63ZfWvH6QoC",
        description: "blah blah blah  blah  blah  blah  blah  blah  blah  blah "
    },
    {
        name: "Canyon Floor",
        image: "https://drive.google.com/uc?id=15s3YstoCmYJFkAxQYa06ivWCLwGHJ-vI",
        description: "blah blah blah  blah  blah  blah  blah  blah  blah  blah "
    }
];

function seedDB()
{
    //To Remove all campgrounds 
    Campground.remove({}, function(err)
    {
        if(err)
        {
            console.log(err);
        }
    console.log("remove campgrounds");
        //add a few campgrounds
        data.forEach(function(seed)
        {
            Campground.create(seed,function(err,campground)
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    console.log("added a campground");
                    //comment creation
                    Comment.create(
                        {
                            text: "This Place is great, but I wish there was internet",
                            author: "Homer"
                        },function(err,comment)
                        {
                            if (err)
                            {
                                console.log(err)
                            }
                            else
                            {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new a comment");
                            }
                        });
                }
            });
        });
    
    });


}
module.exports =seedDB;