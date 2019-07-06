//
var express = require("express");
var exphbs = require("express-handlebars")
// var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");


var path = require("path");
var PORT = process.env.PORT || 8080;

// Initialize Express
var app = express();

// Use morgan logger for logging requests
// app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static(path.join(__dirname, "/public")));

//
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/nytWorldNews";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

mongoose.connection.once("open", function () {
  console.log("database connected");
});

mongoose.connection.on("error", function (error) {
  console.log("Mongoose Error: ", error);
});


// Routes

// scrape new articles
app.get("/scrape", function (req, res) {

  axios.get("https://www.nytimes.com/section/world").then(function (response) {

    // Load the HTML into cheerio and save it to a variable

    var $ = cheerio.load(response.data);
    let count = 0
    // the app should scrape and display the following information for each article:

    $("article").each(function (i, element) {
    
      // An empty object to save the data that we'll scrape
    var result = {};

      // Headline - the title of the article
      // Summary - a short summary of the article
      //  URL - the url to the original article

     result.title = $(element).find("h2").text();
     result.summary = $(element).find("p").text();
     result.link = "https://www.nytimes.com/" + $(element).find("a").attr("href");

      // Each scraped article should be saved to the application database
      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
          count++;
        })
        .catch(function (err) {
          // If an error occurred, console.log it
          console.log(err);
        });

    });

    // res.render("index",{ results: results });
     res.send("Scrape Complete");
  });


});

//home
app.get("/", function (req, res) {
  // If we were able to successfully find Articles, send them to the index page
  db.Article.find({}).then(function (dbArticle) { 
    const retrievedArticles = dbArticle;
    let hbsObject;
    hbsObject = {
      articles: dbArticle
    };
    res.render("index", hbsObject);
  })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for getting all Articles we scraped from the db
app.get("/articles", function (req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// // Route for saving/updating article to be saved
// app.put("/saved/:id", function(req, res) {

//   db.Article
//     .findByIdAndUpdate({ _id: req.params.id }, { $set: { saved: true }})
//     .then(function(dbArticle) {
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       res.json(err);
//     });
// });

// If we were able to successfully find any Article, send them back to the client
app.get("/saved", function (req, res) {
  db.Article.find({ saved: true })
    .then(function (retrievedArticles) {   
      let hbsObject;
      hbsObject = {
        articles: retrievedArticles
      };
      res.render("saved", hbsObject);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

//最后检查一下 data 和 dbArticle 怎么回事

app.post("/articles/save/:id", function (req, res) {
  db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
    .then(function (data) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(data);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });;
});

app.post("/articles/delete/:id", function (req, res) {
  // Use the article id to find and update its saved boolean
  db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false, "notes": [] })
    .then(function (data) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(data);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });;
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function (dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// app.delete("/note/:id", function (req, res) {
//   // Create a new note and pass the req.body to the entry
//   db.Note.findByIdAndRemove({ _id: req.params.id })
//       .then(function (dbNote) {

//           return db.Article.findOneAndUpdate({ note: req.params.id }, { $pullAll: [{ note: req.params.id }]});
//       })
//       .then(function (dbArticle) {
//           // If we were able to successfully update an Article, send it back to the client
//           res.json(dbArticle);
//       })
//       .catch(function (err) {
//           // If an error occurred, send it to the client
//           res.json(err);
//       });
// });

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
