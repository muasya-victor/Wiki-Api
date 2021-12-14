const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const app = express()

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
mongoose.connect("mongodb://localhost:27017/wikiDB");

//creating schema
const articleSchema = {
    title: String,
    content:String
};
//create collection name "Article"
const Article = mongoose.model("Article", articleSchema);


/////////////////////////////////////////////handling "/articles route"/////////////////////////////////////////////
app.route("/articles")

    .get(function (req, res){
    Article.find({},function (err, foundArticles){
        if(!err){
            res.send(foundArticles)
            // res.render("article", {results: foundArticles})
        }else {
            console.log(err);
        }
    });
})//end of get

    .post((req, res)=>{
    const newArticle = new Article({
        title:req.body.title,
        content: req.body.content
    })

    newArticle.save(function (err){
        if (!err){
            res.send("successfully added an item")
        }else{
            res.send("error adding item")
            console.log(err)
        }
    })
})//end of post

    .delete((req,res)=>{
    Article.deleteMany((error => {
        if (!error){
            res.send("items deleted successfully")
        }else{
            res.send("failed to delete")
            console.log(error)
        }
    }))
})//end of delete
///////////////////////////////////////////// end of "/articles route"/////////////////////////////////////////////


///////////////////////////////////////////// target specific article"/////////////////////////////////////////////
app.route("/articles/:articleTitle")
    .get((req,res)=>{
        Article.findOne({title: req.params.articleTitle}, (err, result) => {
            if (!result) {
                res.send("no result with such a name ")
            } else {
                res.send(result)
            }
        })
    })//end of get
    .put((req, res)=>{
        Article.updateOne({title: req.params.articleTitle}, {title: req.body.title, content: req.body.content}, (err)=>{
                if (!err){
                    res.send("successfully updated article")
                    console.log({title:req.body.title, content: req.body.content})
                }else {
                    res.send("none found and changed")
                    console.log(err)
                }
            }
        )
    })//end of put
    .patch((req, res)=>{
        Article.updateOne(
            {title: req.params.articleTitle},
            {$set: req.body },
            // {title: req.body.title, content: req.body.content},
            (err)=>{
                if (!err){
                    res.send("successfully updated article")
                    console.log({title:req.body.title, content: req.body.content})
                }else {
                    res.send("none found and updated")
                    console.log(err)
                }
            }
        )
    })//end of patch
    .delete((req,res)=>{
        Article.deleteOne({title: req.params.articleTitle}, (err)=>{
            if(!err){
                res.send("deleted article successfully")
            }else{
                res.send(err)
            }
        })
    });//end of delete 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
///////////////////////////////////////////// end of targeting specific article "/////////////////////////////////////////////
app.listen(process.env.PORT|| 3000, ()=>{
    console.log("server up and running");
})