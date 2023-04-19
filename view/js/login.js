function existingUser() {
    let userNameLogin= $('#userNameOrEmail').val();
    let pass = $('#passwordLogin').val();

    let creds = {
        user: userNameLogin,
        pass: pass
    }
    
    return creds;
}

$('#user-login-btn').click((event)=>{
        event.preventDefault();
        let user = existingUser();
        $.ajax({
            url: '/login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                email_or_username: user.user,
                password: user.pass,
            }),
            success: function(response){
                console.log("success", response);
                if (response.bool == 1){
                    $("#display-login").text("Login Successful!")
                    let searchPageLink = '<a href="showSearch.html" id="search-page-link"></a>';
                    $("body").append(searchPageLink);
                    $("#search-page-link").get(0).click();
                }
            },
            error: function(xhr, status, error){
                var errorMessage = xhr.status + ': ' + xhr.statusText
                alert('Error - ' + errorMessage);
            }
        });
    
    
});


