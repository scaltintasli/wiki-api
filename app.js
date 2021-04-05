const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })

const articlesSchema = {
  title: String,
  content: String
};

const Article = mongoose.model(
  "Article",
  articlesSchema
);

///////////////////////
//chained route for articles starts.
///////////////////////
app.route("/articles")

.get(function(req, res) {
  Article.find(function(err, foundArticles){
    if(!err) {
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  });
})

.delete((req, res) => {
  Article.deleteMany(function (err) {
      if(err) {
        res.send(err);
      } else {
        res.send("Succesfully deleted all articles")
      }
  });
})

.post(function(req,res) {
  const newArticle = new Article( {
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err) {
    if(err) {
      res.send(err);
    } else {
      res.send("Succesfully added a new article.")
    }
  });
});
//////////////////////
//chained route ends.
//////////////////////

///////////////////////////////
//chained route for specific artile
//////////////////////////////
app.route("/articles/:articleTitle").get(function(req, res) {
  Article.findOne({title: req.params.articleTitle}, function(err, resultArticle) {
    if(err) {
      res.send(err);
    } else {
      res.send(resultArticle);
    }
  });

}).put(function(req, res) {
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err) {
      if(err){
        res.send(err);
      } else {
        res.send("Succesfully updated.")
      }
    }
  );

}).patch(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err) {
      if(err) {
        res.send(err);
      } else {
        res.send("Succesfully patched.")
      }
    }
  );

}).delete(function(req, res) {
  Article.deleteOne({title: req.params.articleTitle},function (err) {
      if(err) {
        res.send(err);
      } else {
        res.send("Succesfully deleted the article")
      }
  });
});

///////////////////////////////
//chained route for specific artile ends.
//////////////////////////////


let port = process.env.PORT;
if(port == null || port == "") {
  port = 8000;
}

app.listen(port, function(){
  console.log("Server Started")
});
