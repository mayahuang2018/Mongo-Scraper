// When user clicks the "Scraping New Articles" button

$(document).on("click", ".scrape-new", function() {
    alert('Articles up-to-date!');
  
    $.ajax({
      method: "GET",
      url: "/scrape"
    })
      .done(function(data) {
        location.reload();
      });
  });


// When user clicks the "favourite" button
$(document).on("click", ".saveArticle", function() {
    $(this).addClass("disabled");
    var thisId = $(this).attr("id");
    console.log(thisId);
  
    $.ajax({
      method: "POST",
      url: "/articles/save/" + thisId,
     
    })
    
    .done(function(data) {
        console.log(data);
    });
  });


//when user clicks "DELETE FROM SAVED" to delete an article from savedArticles
$(document).on("click",".deleteArticle", function (){
    event.preventDefault();
    var thisId = $(this).attr("data");
    console.log(thisId);
    $.ajax({
        method: "POST",
        url: "/articles/delete/" + thisId
    }).done(function(data) {
        window.location = "/saved"
        console.log(data)
    })
  });



  
  