const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();
app.set("view engine", ejs);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/MemeDB");
const memeSchema = new mongoose.Schema({
    title: String,
    content: String
});
const meme = mongoose.model('meme', memeSchema);

// ********************for all memes ********************

app.route("/memes")
    .get(function (req, res) {
        meme.find({}, function (err, foundMeme) {
            if (!err) {
                res.send(foundMeme);
            } else {
                res.send(err);
            }

        });
    })
    .post(function (req, res) {
        // console.log(req.body.title);
        // console.log(req.body.content);

        const newMeme = new meme({
            title: req.body.title,
            content: req.body.content
        });

        newMeme.save(function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send("successfully added new meme");
            }
        });

    })
    .delete(function (req, res) {
        meme.deleteMany({}, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send("sucessfully deleted all memes");
            }
        });
    });

// ********************for specific memes ********************
app.route("/memes/:memeTitle")
.get(function(req,res){
    meme.findOne( {title:req.params.memeTitle} , function(err,foundMeme){
        if(!err){
            res.send(foundMeme);
        }else{
            res.send("no meme found");
        }
    })
})
.put(function(req,res){
    meme.updateOne(
        {title:req.params.memeTitle},
        { title:req.body.title , content:req.body.content},
        function(err){
            if(!err)
            res.send("successfully updated "+req.params.memeTitle);
        }
    )
})
.patch(function(req,res){
    meme.updateOne(
        {title:req.params.memeTitle},
        {title:req.body.title , content:req.body.content},
        function(err){
            if(!err)
            res.send("successfully updated "+req.params.memeTitle);
        }
    )
})
.delete(function(req,res){
    meme.deleteOne({title:req.params.memeTitle},function(err){
        if(!err)
        res.send("sucessfully deleted " + req.params.memeTitle);
    })
})



app.listen(3000, function () {
    console.log("server is running at port 3000.")
})