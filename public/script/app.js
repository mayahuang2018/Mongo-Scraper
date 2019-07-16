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

  //when user clicks "ARTICLE NOTES" button
  $(document).ready(function(){
  $('.modal').modal(); 
  
});

  // $(document).on("click",".addNote",function(){
  //   var thisId = $(this).attr("data");
  //   console.log(thisId);
      
  // });

   //when user clicks "Save Note" button
   $(document).on("click",".saveNote", function() {
    var thisId = $(this).attr("data-id");
    console.log(thisId);
    if (!$("#noteText" + thisId).val()) {
        alert("please enter a note to save")
    }else {
      $.ajax({
            method: "POST",
            url: "/notes/saved/" + thisId,
            data: {
              text: $("#noteText" + thisId).val()
            }
          }).done(function(data) {
              // Log the response
              console.log(data);
              // Empty the notes section
              $("#noteText" + thisId).val("");
              // window.location = "/saved"
          });
    }
});

//when user clicks  "DeleteNote" button
// $(document).on("click",".deleteNote", function() {
//     var noteId = $(this).attr("data-note-id");
//     var articleId = $(this).attr("data-article-id");
//     $.ajax({
//         method: "DELETE",
//         url: "/notes/delete/" + noteId + "/" + articleId
//     }).done(function(data) {
//         console.log(data)
//         window.location = "/saved"
//     })
// });



  
  