
$(document).ready(function () {
    // Set the article-container div where all the content will go
    // "save article" ,"clear" and "scrape new article" buttons
    var articleContainer = $(".article-container");
    $(document).on("click", ".saveArticle", handleArticleSave);
    $(document).on("click", ".scrape-new", handleArticleScrape);
    $(".clear").on("click", handleArticleClear);

    //start the scrape
    //"Whenever a user visits your site, the app should scrape stories from a news outlet and display them for the user"
    function initPage() {
        $.get("/api/headlines?saved=false").then(function (data) {
            articleContainer.empty();
            $(".emptyAlert").empty();
            // If we have headlines, render them to the page
            if (data && data.length) {
                    $.ajax({
                        method: "GET",
                        url: "/scrape",
                    }).done(function(data) {
                        console.log(data)
                        window.location = "/"
                    })
                   
            } else {
                // Otherwise render a message explaining we have no articles
                handleArticleClear();
            }
        });
    }
   
    function handleArticleSave() {
        console.log("article saved!")
        // This function is triggered when the user wants to save an article
        // When we rendered the article initially, we attached a javascript object containing the headline id
        // to the element using the .data method. Here we retrieve that.
        var articleToSave = $(this)
            .parents(".card")
            .data();

        // Remove card from page
        $(this)
            .parents(".card")
            .remove();

        articleToSave.saved = true;
        // Using a patch method to be semantic since this is an update to an existing record in our collection
        $.ajax({
            method: "POST",
            url: "/articles/save/" + articleToSave._id,
            data: articleToSave
        }).done(function (data) {
  
            if (data.saved) {
                console.log(data.saved)
                window.location = "/saved"
             }
        });
    }



     // This function handles the user clicking any "scrape new article" buttons
    function handleArticleScrape() {
        $.get("/scrape").then(function (data) {
            // If we are able to successfully scrape the NYTIMES and compare the articles to those
            // already in our collection, re render the articles on the page
            // and let the user know how many unique articles we were able to save
            initPage();
        });
    }
    
    // renders some HTML to the page explaining we don't have any articles to view
         

    function handleArticleClear() {

        articleContainer.empty();
       
        $(".emptyAlert").html("<h5>Uh Oh. Looks like we don't have any new articles.</h5>");
       
    }



    


});