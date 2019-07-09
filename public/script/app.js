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
    var thisId = $(this).attr("data-id");
    console.log(thisId);
  
    $.ajax({
      method: "POST",
      url: "/articles/save/" + thisId,
     
    })
    
    .done(function(data) {
        console.log(data);
    });
  });


  
  