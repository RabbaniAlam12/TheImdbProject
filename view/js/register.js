function newUser() {
    let fName = $('#fName').val();
    let lName = $('#lName').val();
    let email = $('#email').val();
    let userName = $('#userName').val();
    let password = $('#password').val();
    let con_pass = $('#con_pass').val();

    let user = {
        fName: fName,
        lName: lName,
        email: email,
        userName: userName,
        password: password,
        con_pass: con_pass
    }

    return user;
}

$('#user-reg-btn').click((event)=>{
    event.preventDefault();
    let user = newUser();
    console.log(user.fName);
    $.ajax({
        url: '/register',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            firstName: user.fName,
            lastName: user.lName,
            userName: user.userName,
            email: user.email,
            password: user.password,
            confirmPass: user.con_pass,
        }),
        success: function(response){
            console.log("success", response.message);
            $("#display-register").text("Registration Successful!");
        },
        error: function(xhr, status, error){
            var errorMessage = xhr.status + ': ' + xhr.statusText
            alert('Error - ' + errorMessage);
        }

    });
    


});
