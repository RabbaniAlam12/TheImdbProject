function updateUser() {
    let fName = $('#fName-update').val();
    let lName = $('#lName-update').val();
    let email = $('#email-update').val();
    let userName = $('#userName-update').val();
    let new_password = $('#password-update').val();
    let con_pass = $('#con_pass-update').val();
    let old_pass =$("#old-pass").val();

    let user = {
        fName: fName,
        lName: lName,
        email: email,
        userName: userName,
        new_password: new_password,
        con_pass: con_pass,
        old_pass: old_pass
    }

    return user;
}

$('#user-update-btn').click((event)=>{
    event.preventDefault();
    let user = updateUser();
    $.ajax({
        url: '/manageAccount',
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({
            firstName: user.fName,
            lastName: user.lName,
            userName: user.userName,
            email: user.email,
            newPassword: user.new_password,
            newPasswordConfirm: user.con_pass,
            oldPassword: user.old_pass
        }),
        success: function(response){
            console.log("success", response.message);
            $("#display-update").text("Update Successful!");
        }
    });
    


});
