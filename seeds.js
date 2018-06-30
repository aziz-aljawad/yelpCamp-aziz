var mongoose =require("mongoose");
var Campground =require("./models/campground");
var Comment = require("./models/comment");
var data =
[
    {
        name: "Cloud's Rest",
        image: "https://drive.google.com/uc?id=1vJy3hWKlKPqMviXYnuOb56nS7fn2JN7q",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac scelerisque enim. Suspendisse sed mi egestas, luctus diam et, elementum nulla. Aenean eget laoreet velit. Vestibulum quis venenatis tellus. Maecenas sagittis sit amet purus id egestas. Praesent scelerisque egestas felis, sed vestibulum ligula mattis quis. Etiam at ipsum odio. Curabitur laoreet purus ut tincidunt fermentum. In vitae iaculis quam, sed fermentum orci."
    },
    {
        name: "Desert Mesa",
        image: "https://drive.google.com/uc?id=1EJyuJLbeZZmTj2uo1Aiut63ZfWvH6QoC",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac scelerisque enim. Suspendisse sed mi egestas, luctus diam et, elementum nulla. Aenean eget laoreet velit. Vestibulum quis venenatis tellus. Maecenas sagittis sit amet purus id egestas. Praesent scelerisque egestas felis, sed vestibulum ligula mattis quis. Etiam at ipsum odio. Curabitur laoreet purus ut tincidunt fermentum. In vitae iaculis quam, sed fermentum orci. "
    },
    {
        name: "Canyon Floor",
        image: "https://drive.google.com/uc?id=15s3YstoCmYJFkAxQYa06ivWCLwGHJ-vI",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac scelerisque enim. Suspendisse sed mi egestas, luctus diam et, elementum nulla. Aenean eget laoreet velit. Vestibulum quis venenatis tellus. Maecenas sagittis sit amet purus id egestas. Praesent scelerisque egestas felis, sed vestibulum ligula mattis quis. Etiam at ipsum odio. Curabitur laoreet purus ut tincidunt fermentum. In vitae iaculis quam, sed fermentum orci."
    }
];

function seedDB()
{
    //To Remove all campgrounds 
    Campground.remove({}, function(err){
        if(err) {
            console.log(err);
        }
    console.log("remove campgrounds");
        //add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed,function(err,campground){
                if(err){
                    console.log(err);
                } else{
                    console.log("added a campground");
                    //comment creation
                    Comment.create({
                            text: "This Place is great, but I wish there was internet",
                            author: "Homer"
                        },function(err,comment){
                            if (err){
                                console.log(err)
                            } else{
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created  a new comment");
                            }
                        });
                }
            });
        });
    
    });


}
module.exports =seedDB;