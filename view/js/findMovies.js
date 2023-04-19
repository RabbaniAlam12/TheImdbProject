function findMovie(){
    let movie = $("#movies").val();
    return movie;
}

$("#find-movies-btn").click((event) => {
    event.preventDefault();
    let movie = findMovie();
    console.log(movie);
    $("#loading").show();
    $.ajax({
        url: '/findMovies',
        type: 'GET',
        contentType: 'application/json',
        data: {primaryTitle: movie},
        success: function(response){
            console.log("success", response);
            $("#loading").hide(); // hide loading animation
            $("#searchResults").text("Search results: ");
            for (let i = 0; i < response.movies.length; i++){
                let id = response.movies[i]._id;
                let div = $("<div>");
                let title = $("<p>").text("Title: "+ response.movies[i].primaryTitle);
                let year = $("<p>").text("Released year: "+ response.movies[i].startYear);
                let genre = $("<p>").text("Genre type: "+ response.movies[i].genre);
                let duration = $("<p>").text("Duration: "+ response.movies[i].runTimeMinutes);
                let addToWatchlistBtn = $("<button>").text("Add to watchlist").click(function(){
                    addToWatchlist(response.movies[i].primaryTitle,id);
                 
                });
                let line = $('<br>') ;  
                
        
                div.append(title, year, genre, duration,addToWatchlistBtn,line);
                $("#searchResults").append(div);
            }
        },     
        error: function(xhr, status, error){
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Error - ' + errorMessage);
        }
    });
});

function addToWatchlist(title,id) {
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