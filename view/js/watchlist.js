$(document).ready(function() {
    $.ajax({
      url: '/watchList',
      type: 'GET',
      success: function(response) {
        let titles = response.temp;
        var titleList = $("#watchList-display"); // assuming you have a <ul> with id="title-list" in your HTML
        titleList.prepend("<li>Here is your watchlist:</li>");

  for (var i = 0; i < titles.length; i++) {
    if (titles[i]) {
      var title = titles[i].primaryTitle;
      var titleType = titles[i].titleType;
      var listItem = $("<li></li>").text(title + " (Title type: " + titleType + ")");
      titleList.append(listItem);
    }
  }
        
      },
      error: function(error) {
        console.log(error);
      }
    });
  });