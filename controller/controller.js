const express = require('express');
const imdbTitles = require('../models/imdbModel.js');
const User = require('../models/userInformation.js')
const winston = require( 'winston');
const bcrypt = require( 'bcrypt');
const jwt = require( 'jsonwebtoken');
const dotenv = require( 'dotenv');
const axios = require( 'axios');
const validator = require( 'validator');
const session = require('express-session');


dotenv.config();
const router = express.Router();

//************************* Error logging ***********/
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log' })
  ]
});

//***************** USER ********************/
router.post('/register', async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const confirmPass = req.body.confirmPass;
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const userName = req.body.userName;


      if (email && password && firstName && lastName && confirmPass && userName) {

        // check if the username is already taken
        const existingUserName = await User.findOne({ userName });

        // check if the email is already taken
        const existingUser = await User.findOne({ email });
      
        if (existingUser) {
          return res.status(409).json({ message: 'Email is already taken' });
        };

        if (existingUserName) {
          return res.status(409).json({ message: 'Username is already taken' });
        };
    
        if (password === confirmPass) {
          // create a new user
          const newUser = new User({ email, password, firstName, lastName, userName});
      
          // save the user to the database
          await newUser.save();
      
          // return a success message
          res.json({ message: 'User created successfully' });
        }
        else {
          res.json({ message: 'Passwords do not match' });
        }
      }
      
      else {
        res.status(400).json({message: "Please fill all the required fields."})
      }

    } catch (error) {
      logger.error(error.message);
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
});

router.post('/login', async (req, res) => {
  try {
    let { email_or_username, password } = req.body;
    let user;

    if (email_or_username && password) {

      if(validator.isEmail(email_or_username)){

        user = await User.findOne({ email : email_or_username });
        if (!user) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }
      } else {
        user = await User.findOne({ userName : email_or_username });
        if (!user) {
          return res.status(401).json({ error: 'Invalid username or password' });
        }
      }
    
      // check if the password is correct
      const isMatch = await bcrypt.compare(password, user.password);
    
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }    

      // generate a JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
      // return the token
      // console.log("User authentication successful!");
      let success = {message: "User has been verified and logged in."}
      let bool = 1;
      console.log(user.email);
      req.session.email = user.email;
      res.status(200).json({ token, userId: user._id, success, bool }); //this will be used later for protected requests by the user
    }

    else {
      res.json({message: "Please provide both your email and password to login."})
    }

  
    // check if the user exists
  } catch (error) {
    logger.error(error.message);
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});


// middleware to verify JWT token and fetch user data
const authenticate = async (req, res, next) => {
  try {
    // get the JWT token from the Authorization header
    const token = req.header('Authorization').replace('Bearer ', '');

    // verify the JWT token and extract the user ID from the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // fetch the user data from the database based on the ID
    const user = await User.findById(userId);

    if (!user) {
      throw new Error();
    }

    // attach the user data to the request object for subsequent middleware and routes to access
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

router.post('/emailPreference', async(req, res) => {
  try {

    let email = req.session.email;

    if(!req.query.email && !req.session.email){
      return res.status(400).json({ message: "Your email is needed to save your email preferences." });
    }

    let  user = await User.findOne({email: email});
    if(user== null){
      email=req.query.email;
      user = await User.findOne({email: email});
    }
    console.log(email);
    
    let reqBody = req.body;
    
    if (reqBody.checkUpdate === 'no' && reqBody.checkTrivia === 'no' && reqBody.checkUnsubscribe === 'no') {
      user.emailPreference.push({type: 'update', value: false}); 
      user.emailPreference.push({type: 'trivia', value: false});
      user.emailPreference.push({type: 'unsubscribe', value: false});
      user.save();
    }

    else if (reqBody.checkUpdate === 'no' && reqBody.checkTrivia === 'no' && reqBody.checkUnsubscribe === 'yes') {
      user.emailPreference.push({type: 'update', value: false}); 
      user.emailPreference.push({type: 'trivia', value: false});
      user.emailPreference.push({type: 'unsubscribe', value: true});
      user.save();
    }

    else if (reqBody.checkUpdate === 'no' && reqBody.checkTrivia === 'yes' && reqBody.checkUnsubscribe === 'no') {
      user.emailPreference.push({type: 'update', value: false}); 
      user.emailPreference.push({type: 'trivia', value: true});
      user.emailPreference.push({type: 'unsubscribe', value: false});
      user.save();
    }

    else if (reqBody.checkUpdate === 'no' && reqBody.checkTrivia === 'yes' && reqBody.checkUnsubscribe === 'yes') {
      user.emailPreference.push({type: 'update', value: false}); 
      user.emailPreference.push({type: 'trivia', value: true});
      user.emailPreference.push({type: 'unsubscribe', value: true});
      user.save();
    }

    else if (reqBody.checkUpdate === 'yes' && reqBody.checkTrivia === 'no' && reqBody.checkUnsubscribe === 'no') {
      user.emailPreference.push({type: 'update', value: true}); 
      user.emailPreference.push({type: 'trivia', value: false});
      user.emailPreference.push({type: 'unsubscribe', value: false});
      user.save();
    }

    else if (reqBody.checkUpdate === 'yes' && reqBody.checkTrivia === 'no' && reqBody.checkUnsubscribe === 'yes') {
      user.emailPreference.push({type: 'update', value: true}); 
      user.emailPreference.push({type: 'trivia', value: false});
      user.emailPreference.push({type: 'unsubscribe', value: true});
      user.save();
    }

    else if (reqBody.checkUpdate === 'yes' && reqBody.checkTrivia === 'yes' && reqBody.checkUnsubscribe === 'no') {
      user.emailPreference.push({type: 'update', value: true}); 
      user.emailPreference.push({type: 'trivia', value: true});
      user.emailPreference.push({type: 'unsubscribe', value: false});
      user.save();
    }
    
    else {
      user.emailPreference.push({type: 'update', value: true}); 
      user.emailPreference.push({type: 'trivia', value: true});
      user.emailPreference.push({type: 'unsubscribe', value: true});
      user.save();
    }

    res.status(200).json({message: "Email preference updated"})


} catch (error) {
    console.error(error);
    logger.error(error.message);
    res.json({message: `${error}`});
}
})

router.get('/emailPreference', authenticate, async(req, res) => {
  // User validation
  try {
    let user = req.user;
    let email = req.query.email;

    // const user = await User.findOne({email: email});

    let preferences = user.emailPreference;

    // Only going to log values that are true. SO that we know exactly what the preferences are.
    console.log(preferences);

    res.json({message: preferences});
  
  } catch (error){
    console.error(error);
    logger.error(error.message);
    res.json({message: `${error}`});
  }
})

router.put('/manageAccount',  async(req, res) => {
  let firstName;
  let lastName;
  let email;
  let userName;
  let oldPassword;
  let newPassword;
  let newPasswordConfirm;
  // let user;
  let checkUsername;

  let user = req.user;

  try {
    //Take old password check and then update the password
    email = req.session.email;
    console.log(email);
    user = await User.findOne({ email: email});

    if(email== null){
      email = req.body.email;
      user = await User.findOne({ email: email});
    }

    if(!user){
      return res.status(400).json({ message:"User does not exist" });
    }
    
    if(req.body.firstName){
      firstName = req.body.firstName;
      user.firstName = firstName;
    }
    
    if(req.body.lastName){
      lastName = req.body.lastName;
      user.lastName = lastName;
    }
    if (req.body.userName){
      userName = req.body.userName;
      if(user.userName !== userName){
        checkUsername = await User.findOne({ userName: userName});
        if(checkUsername){
          console.log("Username already taken.");
          res.json({message: "Username already taken."})
        } else{
  
          user.userName = userName;
        }
      }

    }
    if(req.body.newPassword){

      newPassword = req.body.newPassword;
      newPasswordConfirm = req.body.newPasswordConfirm;
  
      if (newPassword !== newPasswordConfirm){
          console.log("The new passwords don't match.");
          res.json({message: "The passwords entered don't match. "})
      }
      oldPassword = req.body.oldPassword;
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if(!isMatch){
        console.log("The current password entered is wrong.");
        res.json({message:"The current password entered is incorrect."})
      } else{
        user.password = newPassword; 
  
      }
    }

    await user.save();

    res.json({message: `User updated successfully.`});
  } catch(error) {
    console.error(error);
    logger.error(error.message);
    res.json({message:`${error}`});
  }
})
  
//***************** MOVIES AND TV SHOWS*********/
router.get('/findMovies', async (req, res) => {
    try {
      
      let page = parseInt(req.query.page) || 1;
      let perPage = 10;
      let primary = req.query.primaryTitle;

      console.log("as  ", primary);

      console.log("page  ", page);

      if(!primary){
        return res.status(400).json({ message: "Primary title needed for search." });
        
      }

      const movies = await imdbTitles.find({
        primaryTitle: {$regex: primary, $options: 'i'},
        titleType: 'movie',
      }).exec();

      console.log(movies);
      
      // const movies = await imdbTitles.find({
      //   primaryTitle: primary,
      //   titleType: 'movie',
      // }).exec();

      let totalMovies = movies.length;
      let totalPages = Math.ceil(totalMovies/perPage)

        // Handle edge cases
      if (page < 1 || page > totalPages) {
        return res.status(404).send('Page not found');
      }

       // Calculate the start and end index of movies to return
       const startIndex = (page - 1) * perPage;
       const endIndex = startIndex + perPage;

        // Limit the number of pages displayed
       const maxPages = 5;
       const startPage = Math.max(1, page - Math.floor(maxPages / 2));
       const endPage = Math.min(totalPages, startPage + maxPages - 1);

         // Get the movies to return for the requested page
       const moviesToReturn = movies.slice(startIndex, endIndex);

       const response = {
        movies: moviesToReturn,
        currentPage: page,
        totalPages: totalPages,
        startPage: startPage,
        endPage: endPage,
      };

      res.status(200).json(response);

    } catch (err) {
        logger.error(err.message);
        res.json({message: `Error: ${err.message}`});
        console.error(err);
        res.status(500);
    }
})

router.get('/findTvSeries', async(req, res) => {
    try {

      let perPage = 10;
      let page = parseInt(req.query.page) || 1;
      let primary = req.query.primaryTitle;

      if(!primary){
        return res.status(400).json({ message: "Primary title needed for search." });
      }
      const tvShow = await imdbTitles.find({
        primaryTitle: {$regex: primary, $options: 'i'},
        titleType: 'tvSeries',
      }).exec();

      let totalShows = tvShow.length;
      let totalPages = Math.ceil(totalShows/perPage);

        // Handle edge cases
        if (page < 1 || page > totalPages) {
          return res.status(404).send('Page not found');
        }
  
         // Calculate the start and end index of movies to return
         const startIndex = (page - 1) * perPage;
         const endIndex = startIndex + perPage;
  
          // Limit the number of pages displayed
         const maxPages = 5;
         const startPage = Math.max(1, page - Math.floor(maxPages / 2));
         const endPage = Math.min(totalPages, startPage + maxPages - 1);
  
           // Get the movies to return for the requested page
         const showsToReturn = tvShow.slice(startIndex, endIndex);
  
         const response = {
          tvSeries: showsToReturn,
          currentPage: page,
          totalPages: totalPages,
          startPage: startPage,
          endPage: endPage,
        };
      
        res.json(response);
    } catch (err) {
        res.json({message: `${err}`});
        console.error(err);
        res.status(500);
    }
})

router.post('/watchList', async(req, res) => {
  try {
  
    // check if the user exists
    let email = req.session.email;
    let user = await User.findOne({ email: email});
    console.log(user);

    if(email==null){
      email= req.query.email;
      user = await User.findOne({ email: email});
    }

    if (!user){
      res.send("User not found");
    }

    let titleId = req.body.titleId;
    
    if (req.body.titleId == undefined){
      return res.status(400).json({ message: "You must select a show before adding it to the watchlist" });
    }
    else {
      console.log(titleId);
      user.watchList.push(titleId);
      user.save();
      res.status(200).json({message: "Title added to watchlist"});
    }
  
  } catch (error){
    console.error(error);
    logger.error(error.message);
    res.json({message: `${error}`});
  }
})

router.get('/watchList', async(req, res) => {
  try {
    // check if the user exists
    let email = req.session.email;
    let user = await User.findOne({ email: email});

    let watchList = user.watchList;

    let temp = [];

    for (let i = 0; i < watchList.length; i++){
      let current = watchList[i];
      let title = await imdbTitles.findOne({_id: current});
      temp.push(title);
    }

    console.log(temp);

    res.json({message: "Here is your watchlist.",temp});
  
  } catch (error){
    console.error(error);
    logger.error(error.message);
    res.json({message: `${error}`});
  }
})

router.delete('/watchList', async(req, res) => {
  try {
  
    // check if the user exists
    let email = req.query.email;
    let user = await User.findOne({ email: email});

    let watchList = user.watchList;
    let titleId = req.body;
    titleId = titleId.titleId;

    for (let i = 0; i < watchList.length; i++){

      let current = watchList[i];
      if (titleId == current){
        watchList.splice(i, 1);
        console.log(watchList);
        user.save();
      }
    }

    res.json({message: "watchlist"});
  
  } catch (error){
    console.error(error);
    logger.error(error.message);
    res.json({message: `${error}`});
  }
})

//******************* TRIVIA ********************/
router.get('/trivia', async(req, res) => {
  try {

    const numOfQuestions = req.query.numOfQuestions;
    const difficulty = req.query.difficulty;

    if(!numOfQuestions){
      return res.status(400).json({message: "Please select how many questions you would like to answer."});
    }

    const url = `https://the-trivia-api.com/api/questions?categories=film_and_tv&limit=${numOfQuestions}&difficulty=${difficulty}`; //url from the api
    
    const response =  await axios.get(url);

    const dataLength = response.data.length;
    let allCorrectAnswers = []; // Array of all the correct answers that were received from the api, in sequence of the data received.
    let correctAns; 
    let allIncorrectAnswers = []; // This array contains ANOTHER array returned from the api, which contains all the incorrect answers.
    let incorrectAns;
    let setOfQuestions = [];
    let availableOptions = [];
    
    for (let i = 0; i < dataLength; i++) {
      let randomPosition = Math.floor(Math.random() * 4);
      correctAns = response.data[i].correctAnswer;
      allCorrectAnswers.push(correctAns);

      incorrectAns = response.data[i].incorrectAnswers;
      allIncorrectAnswers.push(incorrectAns)

      let question = response.data[i].question;
      setOfQuestions.push(question);

      availableOptions[i] = allIncorrectAnswers[i];
      availableOptions[i].splice(randomPosition, 0, allCorrectAnswers[i]) ;
    };

    console.log(response.data);
    // console.log("-------\n\n");
    // console.log("List of questions\n\n", setOfQuestions);
    // console.log("-------\n\n");
    // console.log("Correct Answers\n\n", allCorrectAnswers);
    // console.log("-------\n\n");
    // console.log("Inorrect Answers\n\n", allIncorrectAnswers);
    // console.log("-------\n\n");
    // console.log("Available options\n\n", availableOptions);

    for (let i = 0; i < dataLength; i++) {
      console.log(`Question ${i+1}:` , setOfQuestions[i] );
      for (let j = 0; j < availableOptions[i].length; j++){
          console.log(`Option ${j+1}: `, availableOptions[i][j]);
        }
        console.log("-------\n\n");

    } 

    res.status(200).json({setOfQuestions, allCorrectAnswers, availableOptions, message: "Quiz successfully created."});

  } catch (error) {
      console.error(error);
      logger.error(error.message);
      res.json({message: `${error}`});
  }
})

router.post('/trivia/game', async(req, res) => {
try{
  let {setOfQuestions, allCorrectAnswers, selectedOptions} = req.body;
  let count = 0;

  for (let i = 0; i < selectedOptions.length; i++){

    if (selectedOptions[i] == allCorrectAnswers[i]){
      count++;
      selectedOptions[i] = `Your answer is correct, ${allCorrectAnswers[i]}`;
    }

    else {
      selectedOptions[i] = `Your answer is incorrect, the correct answer is ${allCorrectAnswers[i]}`;
    }
  }
  let score = (count/(setOfQuestions.length)) * 100;
  // console.log(`Your quiz score is ${score}%`);
  
  for (let j = 0; j < setOfQuestions.length; j++){
    console.log(setOfQuestions[j]);
    console.log(selectedOptions[j]);
  }

  let successBody = {
    score: score,
    message: `Your quiz score is ${score}%`,
    selectedOptions: selectedOptions,
  };


  // res.json({message: 'kaj korse'});

  res.json(successBody);

  
} catch(error){
      console.error(error);
      logger.error(error.message);
      res.json({message: `${error}`});
}
})

module.exports = router;