function findTvShow(){
    let tvShow = $("#tv").val();
    console.log(tvShow);
    return tvShow;
}

$("#find-tvShows-btn").click((event) => {
    event.preventDefault();
    let tvShow = findTvShow();
    console.log(tvShow);
    $("#loading").show();
    $.ajax({
        url: '/findTvSeries',
        type: 'GET',
        contentType: 'application/json',
        data: {primaryTitle: tvShow},
        success: function(response){
            // console.log("success", response);
            // for (let i = 0; i < response.tvSeries.length; i++){
            //     $("#searchResultsTv").text("Your search for the Tv show "+ response.tvSeries[i].primaryTitle + ":");
            //     $("#primaryTitleTv").text("Title: "+ response.tvSeries[i].primaryTitle);
            //     $("#startYearTv").text("Released year: "+ response.tvSeries[i].startYear);
            //     $("#genreTv").text("Genre type: "+ response.tvSeries[i].genre);
            //     $("#runTimeMinutesTv").text("Duration: "+ response.tvSeries[i].runTimeMinutes);
            // }
            console.log("success", response);
            $("#loading").hide(); // hide loading animation
            $("#searchResultsTv").text("Search results: ");

            // Create and append new elements for each item retrieved
            for (let i = 0; i < response.tvSeries.length; i++){
                let id = response.tvSeries[i]._id;
                let div = $("<div>");
                let title = $("<p>").text("Title: "+ response.tvSeries[i].primaryTitle);
                let year = $("<p>").text("Released year: "+ response.tvSeries[i].startYear);
                let genre = $("<p>").text("Genre type: "+ response.tvSeries[i].genre);
                let duration = $("<p>").text("Duration: "+ response.tvSeries[i].runTimeMinutes);
                let addToWatchlistBtn = $("<button>").text("Add to watchlist").click(function(){
                    addToWatchList(response.tvSeries[i].primaryTitle,id);
                });
        
                div.append(title, year, genre, duration,addToWatchlistBtn);
                $("#searchResultsTv").append(div);
            }
        },     
        error: function(xhr, status, error){
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Error - ' + errorMessage);
        }
    });
});

function addToWatchList(title,id) {
    $.ajax({
        url: '/watchList',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ titleId: id, email:"test@test.com" }),
        success: function(response) {
            console.log("success", response.message);
        },
        error: function(xhr, status, error) {
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Error - ' + errorMessage);
        }
    });

    alert("Added to watchlist: " + title);
}
