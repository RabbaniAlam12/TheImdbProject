## Features table:

| Feature                                   |
|-------------------------------------------|
| Movie and Tv Search Engine                |
| User registration and login               |
| Email preference                          |
| Trivia + Integration with third party API |
| Account management                        |
| Watchlist                                 |
| Error Logging(Bonus feature)              |


## Client Side
Welcome to the imdb website! the user will need to create an account by registering first. This is a quick and easy process that will enable you to enjoy all the content that this site has to offer.

During the registration process, you will need to provide your first and last name, a unique username, and a valid email address. Your email address is mandatory as it will be used to verify your account and to send you important updates and notifications.

In addition, you will need to create a strong password that meets the following criteria:

At least 8 characters long
At least one number
At least one lowercase letter
At least one uppercase letter
At least one symbol
This password requirement is to ensure that your account remains secure and protected from potential hacks or unauthorized access.

Once you have entered all the necessary information, you will be able to access all the features of the website, including the ability to search for and add movies and TV series to your watchlist, take quizzes, and manage your account settings.

If you already have an account with us, you can simply log in using your registered email address and password.

The navigation bar of this website is designed to provide you with easy access to all of the key features of this platform. At the top of the page, you will see a range of clickable buttons that enable you to quickly navigate to different sections of the site.

Clicking the "Show search" button will load the search bars for movies and TV series. Once the search is loaded, you will be able to enter keywords to find your favorite movies or TV shows. Additionally, you will have the option to add these titles to your watchlist, enabling you to keep track of your favorite content.

If you want to view your watchlist directly, you can click on the "Watchlist" button. This will display all the movies and TV series that you have added to your watchlist, allowing you to easily keep track of the content that you want to watch in the future.

For those who enjoy a good challenge, this website offers a "Quiz" feature that lets you test your knowledge of movies and TV shows. By clicking on this button, you can select the number of questions and the difficulty level. Once you complete the quiz, you will receive a final score to see how well you did.

The "Account management" button allows you to update your personal information, including your name, email address, and password. This feature ensures that you can keep your account up-to-date and secure.

Finally, clicking on the "Email Preferences" button will allow you to set your email preferences, including the types of emails you would like to receive from us. This feature even allows you to unsubscribe from promotional emails that you no longer want to receive.

Overall, this navigation bar is designed to provide you with easy access to all the features that this website has to offer. With just a few clicks, you can explore and enjoy the best movies and TV shows around.

While I make every effort to ensure that this website is functioning smoothly, there may be times when errors occur. Please note that error logging and handling is done on the server-side, which means that you may not be able to see the exact cause of the error if there is a problem with your input.

To avoid any issues during the registration process, I ask that you input all the required information as per the instructions provided. This includes your first and last name, a unique username, a valid email address, and a password that meets the specified criteria.

Please ensure that you follow the password requirements carefully to avoid any issues with your account.

## Server Side

### How to run this server:

### To recreate the database:
1. Download the source file for title.basics.tsv.gz called **data.tsv** from https://drive.google.com/drive/folders/1kPQgX8ITXsnaC_UXz1g_C-WwoS_Ar2ZS?usp=sharing. Note that the access has been set to everyone.
2. Once you download the file navigate to the directory containing data.tsv and then import the data in your mongodb database using the following code:
    `mongoimport --db=imdb --type=tsv --headerline --collection=titles data.tsv`
3. After that navigate to the directory of the project and run the command `npm i` to install all the dependencies.
4. After the dependecies are installed,run the mongod server by using command `mongod` and then run the test using `npm test` which should pass all the 14 mocha tests (7 for success and 7 for failures of the features). Make sure you have added {'test': "mocha"} under the script of the _package.json_ file. 

### To manually test the server:
1. Navigate to the root directory of the project and run the command `mongod` to establish a connection to the database
2. In a different terminal run the code `nodemon app.mjs` to connect to the database.
3. You can send http requests to the server using the endpoints that I created with the necessary query parameters and request body.


### Modules and their usage:
1. axios: it was used for making http requests to the server
2. bcrypt: it was used for hashing the user password
3. chai: I used the chai assertion library to write the test codes
4. dotenv: A zero-dependency module that loads environment variables from a .env file
5. jsonwebtoken: I used it for generating and verifying JSON Web Tokens
6. mocha: I used it to test the http requests
7. mongoose: I used it to model the schemas
8. nodemon: I used it to automatically restart the node app when file changes were made.
9. sinon: I used it to mock the test data
10. validator: I used it to validate fields like email and username
11. winston: I used it to log the errors

## Feature explanation (All codes are in the controller.js file and the test file is in the folder **test**):
1. **Movie and Tv Search Engine** - The endpoints for searching movies and tv series are still separate, but their functionality is quite similar. This feature is mainly a GET request which will attempt to find movies or tv shows in the 'titles' collection of the 'imdb' dataset, with the title to be found being sent by the client in the query parameter, and return all the results found, which would include the string in the query parameter. Case-sensitivity has been taken into consideration, and I have also included a check to ensure that the user is sending a request with the title information for the search to be successful. I have also added pagination to display data in multiple pages if a lot of results are returned by the search, with each page displaying 10 results. The response body includes all the movie/tv series titles found, the current page number, the total number of pages created to hold the results, the start page and the end page. Another query parameter could be the page number that the user might want to view, if no page number is found in the query, then I just display the first page. I have used try/catch which enables us to catch any errors, and I have also implemented error logging and all the error logs can be found in the file "error.log" which is in the same directory as the code. You can test this feature manually after connecting to the server and sending the http request with the title to be searched as a required parameter(it would fail if the "primaryTitle" is not provided). A mocha test has also been implemented for this feature, showing both success and failure cases which can be tested using the instructions mentioned below. The endpoints for this feature are ('/findMovies') and ('/findTvSeries').

required parameters for successful implementation : _primaryTitle_


2. **User registration and login** - The endpoints for registration and login are separate and they can be found in the _controller.js_ file. The register feature allows a user to create an account by inputting necessary information(Email, password, first and last name, password, confirmation of password and a valid username). All these information are collected by the code from the request body and then stored in separate variables. All the mentioned information is required, and even if a single one of them is missing, the code will throw and error and ask the user to fill all the required fields. I have addded checks to see whether the email and username provided have already been used or not. If those checks pass, then I create a new user in the "user" collection in the "imdb" dataset with the information provided. I have used bcrypt to hash the password before storing to the database, because securing sensitive information was one of the main goals for this implementation. I also compare whether the password entered and the confirmation password entered are equal or not. I send necessary messages as response, and also implemented error logging and all the error logs can be found in the file "error.log" which is in the same directory as the code. You can test this feature manually after connecting to the server and sending the http request to the ('/register') endpoint, with the following information in the request body: email, password, confirmPass, firstName, lastName, userName.

required fields for registering - email && password && firstName && lastName && confirmPass && userName
required fields for login - email_or_username && password

3. **Email preference** - This feature allows users to create or change their email preferences. The feature has a POST and a GET request, where the POST request creates or updates the user's preference and the GET returns the latest preferences of the user. The code checks if the 'email' field exists in the query parameter, and if not found, it responds with a status code of 400. If found, find the user by their email from the 'user' collection in the 'imdb' dataset, and wait for the database to return the result. Based on the combination of reqBody.checkUpdate, reqBodycheckTrivia, and reqBody.checkUnsubscribe values, update the user's email preferences. Save the updates into the user's database record. Respond with a status code of 200. To fail the feature, you can make the request without providing an email, since that is a required parameter. Mocha tests for the success and failure of this feature has been implemented. Error logging has also been implemented and logged in the same error.log file.

required query parameter for success of the feature: _email_

4. **Trivia + Integration with third party API** - The code is divided into two parts: One creates a quiz based on user preferences, and the other checks the user's answers and scores the quiz. 

Part 1 - quiz creation ('/trivia')

First, the code extracts the number of questions and difficulty level from the request query.
If the number of questions is not provided, it returns an error message with a 400 status code.
The code then constructs an URL with the given parameters to call an external trivia API.
The code makes a GET request to the API using the constructed URL, and waits for a response.
The response data is stored in variables for later use.
The code then loops through the responses received from the API to extract and store the questions, correct answers and incorrect answers separately.
For each question, the code randomly selects a position to insert the correct answer among the incorrect answers, effectively shuffling the answer options.
The shuffled options are stored for each question.
The stored data is logged to the console.
The responses are sent to the user as a JSON response with status code 200.

Part 2 - quiz scoring ('/trivia/game')

The code receives a POST request with the user's quiz responses, including the questions, correct answers and selected options.
It creates a count variable to store the number of questions answered correctly, and loops through the selected options, comparing them to the correct answers.
For each response, if the selected option is correct, it increments the count and adds a message indicating that the answer was correct. Otherwise, it adds a message indicating that the answer was incorrect along with the correct answer.
It also calculates the user's score and logs it to the console.
Finally, it sends a JSON response to the user.

To fail this feature, you can exclude the 'numOfQuestions' or 'difficulty' query parameters when sending the GET request. The third party API that I used for this feature is: https://the-trivia-api.com

required query parameters for the GET request: _numOfQuestions_ , _difficulty_

5. **Account management** - This feature allows users to update their information that is stored in the database. When a request is received, the code first retrieves the user's information from the database based on their email. If the user doesn't exist, it sends back an error status code and message. If the user does exist, the code checks for several properties that can be updated, including first name, last name, username, and password. If any of these properties are included in the request body, the code updates the corresponding property for the user in the database. If a new username is included, it first checks that the new username isn't already in use by another user. If a new password is included, it checks that the old password matches the user's current password, and that the new password and confirmed password match each other, before updating the password in the database. Finally, the updated user information is saved in the database and a success message is returned to the user. If an error occurs at any point in the process, an error message is returned to the user instead. Error logging has been implemented and mocha tests have been written for both success and failure cases. To fail the feature, you can send the request without the 'email' field in the request body.

request type: PUT
endpoint: ('/manageAccount')
required request body field: _email_, _userName_

6. **Watchlist** - This is a feature that handles HTTP requests related to a user's watchlist. The first implementation creates an HTTP POST request for adding a new title to the watchlist, the second implementation is a GET request to display all titles in the user's watchlist, and the third is a DELETE request to remove a specific title from the list.Error logging has been implemented and mocha tests have been written for both success and failure cases. To fail the feature, you can send the  request without the 'email' field in the request body.

endpoint: ('/watchList')
required query parameter: _email_ 

### Database-explanation for usage of mongoose:
I used mongoose to create two schemas for the database, one is for the collection **titles** which contains all the information about movies and tv shows and the second one is for the collection **user** which will store information for all the users. Creating these schemas have helped us to easily communicate with the database as it ensures that the documents have the correct structure and types of data.

