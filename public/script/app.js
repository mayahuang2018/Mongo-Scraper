
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
                renderEmpty();
            }
        });
    }

    //make every JSON object to a card and send cards to "article-container" area
   
    // renders some HTML to the page explaining we don't have any articles to view
         
    function renderEmpty() {
        var emptyAlert = $(
            [ `<div class="#f8bbd0 pink lighten-4 z-depth-5">
                <h5><i class="small material-icons left">error</i>Uh Oh. Looks like we don't have any new articles.</h5>
             </div>
             <main>
                <div class="#f5f5f5 grey lighten-4">
                    <div class="row">
                        <div class="col s12 ">
                            <div class="card #757575 grey darken-1">
                                <div class="card-content white-text center">
                                    <span class="card-title"></span>
                                    <h5>What would you like to do?</h5>
                                </div>
                                <div class="card-action center">
                                    <a class='scrape-new>Try Scraping New Articles</a>
                                    <a href="/saved">Go to Saved Articles</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>`
            ].join("")
        );
        // Appending this data to the page
        articleContainer.append(emptyAlert);
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
            method: "PUT",
            url: "/articles/save/" + articleToSave._id,
            data: articleToSave
        }).then(function (data) {
            // If the data was saved successfully
            if (data.saved) {
                // Run the initPage function again. This will reload the entire list of articles
                initPage();
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
    
    function handleArticleClear() {
        $.get("api/clear").then(function () {
            articleContainer.empty();
           
        });
    }



    


});