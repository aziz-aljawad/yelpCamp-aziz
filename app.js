var express =require('express');
var app =express();
var bodyParser =require("body-parser");
var campgrounds =
[
    {name: "wolf den",image: "https://pixabay.com/get/ec31b90f2af61c22d2524518b7444795ea76e5d004b0144393f3c17bafeab3_340.jpg"},
    {name: "lion's rest",image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg"},
    {name: "eagle hills",image: "https://farm8.staticflickr.com/7042/7121867321_65b5f46ef1.jpg"},
    {name: "wolf den",image: "https://pixabay.com/get/ec31b90f2af61c22d2524518b7444795ea76e5d004b0144393f3c17bafeab3_340.jpg"},
    {name: "lion's rest",image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg"},
    {name: "eagle hills",image: "https://farm8.staticflickr.com/7042/7121867321_65b5f46ef1.jpg"},
    {name: "wolf den",image: "https://pixabay.com/get/ec31b90f2af61c22d2524518b7444795ea76e5d004b0144393f3c17bafeab3_340.jpg"},
    {name: "lion's rest",image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg"},
    {name: "eagle hills",image: "https://farm8.staticflickr.com/7042/7121867321_65b5f46ef1.jpg"}
];
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.get('/',function(req,res)
{
    res.render('landing')
});
app.get('/campgrounds',function(req,res)
{

    res.render('campgrounds',{campgrounds: campgrounds});
});
app.post('/campgrounds',function(req,res)
{

    //get data from form and add campgrounds array
    var name = req.body.name;
    var image =req.body.image;
    var newCampGround ={name:name,image:image}
    campgrounds.push(newCampGround)
    //redirect back to campgrounds
     res.redirect('/campgrounds');
});
app.get('/campgrounds/new',function(req,res)
{
    res.render("new.ejs")
})
const port = 12345
app.listen(port,function()
{
    console.log(`connected to port ${port}`);    
});