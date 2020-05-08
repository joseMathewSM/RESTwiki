const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true, useUnifiedTopology:true});
const articleSchema = {
  title: String,
  content: String
}
const Article = mongoose.model("Article", articleSchema);


app.route("/articles")
  .get(function(req,res){
    Article.find({}, function(err, results){
      if(!err){
        res.send(results)
      }else{
        res.send(err)
      }
    });
  })
  .post(function(req,res){
    const article = new Article({
      title : req.body.title,
      content: req.body.content
    });
    article.save(function(err){
      if(!err){
        res.send("Sucess")
      }else{
        res.send(err)
      }
    });
  })
  .delete(function(req,res){
    Article.deleteMany(function(err){
      if(!err){
        res.send("Success")
      }else{
        res.send(err)
      }
    });
  });

app.route("/articles/:title")
  .get(function(req,res){
    Article.findOne({title: req.params.title}, function(err,result){
      if(!err){
        res.send(result)
      }else{
        res.send(err)
      }
    });
  })
  .put(function(req,res){
    Article.update(
      {title:req.params.title},
      {title:req.body.title, content:req.body.content},
      {overwrite:true},
      function(err){
        if(!err){
          res.send("sucess")
        }else{
          res.send(err)
        }
      }
    );
  })
  .patch(function(req,res){
    Article.update(
      {title:req.params.title},
      {$set : req.body},
      function(err){
        if(!err){
          res.send("Sucess")
        }else{
          res.send(err)
        }
      });
  })
  .delete(function(req,res){
    Article.deleteOne({title:req.params.title},function(err){
      if(!err){
        res.send("Successfully deleted.")
      }else{
        res.send("Failure")
      }
    })
  });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
