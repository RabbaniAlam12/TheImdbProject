function handleUnsubscribe() {
    const unsubscribeCheckbox = document.getElementsByName('unsubscribe')[0];
    const updatesCheckbox = document.getElementsByName('email-updates')[0];
    const triviaCheckbox = document.getElementsByName('email-trivia')[0];

    if (unsubscribeCheckbox.checked) {
      updatesCheckbox.checked = false;
      triviaCheckbox.checked = false;
    }
  }

  function handleUpdatesOrTrivia() {
    const unsubscribeCheckbox = document.getElementsByName('unsubscribe')[0];
    const updatesCheckbox = document.getElementsByName('email-updates')[0];
    const triviaCheckbox = document.getElementsByName('email-trivia')[0];

    if (updatesCheckbox.checked || triviaCheckbox.checked) {
      unsubscribeCheckbox.checked = false;
    }
  }

  // Add event listeners to the updates and trivia checkboxes
  const updatesCheckbox = document.getElementsByName('email-updates')[0];
  const triviaCheckbox = document.getElementsByName('email-trivia')[0];
  updatesCheckbox.addEventListener('click', handleUpdatesOrTrivia);
  triviaCheckbox.addEventListener('click', handleUpdatesOrTrivia);

function emailPreferences(){
    let updatesValue = document.getElementsByName('email-updates')[0].checked ? 'yes' : 'no';
    let triviaValue = document.getElementsByName('email-trivia')[0].checked ? 'yes' : 'no';
    let unsubscribeValue = document.getElementsByName('unsubscribe')[0].checked ? 'yes' : 'no';
    let email = document.getElementsByName('email-pref-email')[0].value;

    let userPreference = {
        updates: updatesValue,
        trivia: triviaValue,
        unsubscribe: unsubscribeValue,
        email:email
    }

    return userPreference;
}

$('#email-pref-btn').click((event)=>{
    event.preventDefault();
    let user = emailPreferences();
    console.log(user.fName);
    $.ajax({
        url: '/emailPreference',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            email: user.email,
            checkUpdate: user.updates,
            checkTrivia: user.trivia,
            checkUnsubscribe: user.unsubscribe
        }),
        success: function(response){
            console.log("success", response.message);
            $("#email-update").text("Email Preferences Updated!");
        }
    });
    


});

