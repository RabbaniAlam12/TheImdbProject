// import chai from 'chai';
// import sinon from 'sinon';
// import axios from 'axios';
// import assert from 'assert';
// import bcrypt from 'bcrypt';
// import User from '../models/userInformation.mjs';
// import app from '../app.mjs';
// import chaiHttp from 'chai-http';
// import { generateMovieMockData, generateTvShowMockData } from './mockData/mockdata.mjs';

const chai = require('chai');
const sinon = require('sinon');
const axios = require('axios');
const assert = require('assert');
const bcrypt = require('bcrypt');
const User = require('../models/userInformation.js');
const app = require('../app.js');
const chaiHttp = require( 'chai-http');
const { generateMovieMockData, generateTvShowMockData } = require( './mockData/mockdata.js');

chai.use(chaiHttp);


let url = 'http://localhost:3000';

const instance = axios.create({
  baseURL: url,
  timeout: 50000, //5 seconds max
  headers: {'content-type': 'application/json'}
});

describe('Final project - Server side', () => {
  describe('Movie and Tv show tests', () => {
    it('should find the movie in the database with the primary title provided', async () => {
      let record = {
        page: 1,
        primaryTitle: 'Pathaan',
      };
      const response = {
        status: 200,
        data: {
          movies: [
            generateMovieMockData()
          ]
        }
      };
      const axiosGetStub = sinon.stub(instance, 'get').returns(response);
      let res = await instance.get('/findMovies', {params: record});
      axiosGetStub.restore();
      assert.equal(res.status, 200);
      assert.equal(res.data.movies[0].primaryTitle, record.primaryTitle);
      assert.equal(res.data.movies[0].startYear, 2023);
    });

    it('should not find the movie in the database without the primary title provided', async () => {
        let record = {
            page: 1,
        };
        const response = {
          status: 404,
          data: {
            movies: [],
            message: "Primary title needed for search."
          },
        };
        const axiosGetStub = sinon.stub(instance, 'get').returns(response);
        let res = await instance.get('/findMovies', {params: record});
        axiosGetStub.restore();
        assert.equal(res.status, 404);
        assert.equal(res.data.message, "Primary title needed for search.");
    });

    it('should find the tv show in the database with the primary title provided', async () => {
        let record = {
            page: 1,
            primaryTitle: 'Modern Family',
        };
        const response = {
          status: 200,
          data: {
            tvSeries: [
                generateTvShowMockData()
            ]
          }
        };
        const axiosGetStub = sinon.stub(instance, 'get').returns(response);
        let res = await instance.get('/findMovies', {params: record});
        axiosGetStub.restore();
        assert.equal(res.status, 200);
        assert.equal(res.data.tvSeries[0].primaryTitle, record.primaryTitle);
    });

    it('should not find the tv show in the database without the primary title provided', async () => {
        let record = {
            page: 1,
        };
        const response = {
          status: 404,
          data: {
            tvSeries: [],
            message: "Primary title needed for search."
          },
        };
        const axiosGetStub = sinon.stub(instance, 'get').returns(response);
        let res = await instance.get('/findMovies', {params: record});
        axiosGetStub.restore();
        assert.equal(res.status, 404);
        assert.equal(res.data.message, "Primary title needed for search.");
    });
  });

  beforeEach(async () => {
    const user = new User({
        emailPreference: [],
        watchList: [],
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'Test@1234',
        confirmPass: 'Test@1234',
        userName: 'johndoe',
    });
    await user.save();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('User registration', () => {
    it('should register a new user', async () => {

        const userData = {
            firstName: 'Rabbani',
            lastName: 'Alam',
            email: 'rabbanialam@gmail.com',
            password: 'abC@1234',
            confirmPass: 'abC@1234',
            userName: 'alamrabbani',
        };
    
        const response = await chai
          .request(app)
          .post('/register')
          .send(userData);
    
        // Assert that the user was successfully registered
        assert.equal(response.status, 200);
        assert.equal(response.body.message, 'User created successfully');
    
        // Assert that the user data was correctly saved in the database
        const user = await User.findOne({ email: userData.email });
        assert.equal(user.firstName, userData.firstName);
        assert.equal(user.lastName, userData.lastName);
        assert.equal(user.email, userData.email);
        assert.equal(user.userName, userData.userName);
    
        // Assert that the password was correctly hashed before saving in the database
        const isPasswordMatch = await bcrypt.compare(userData.password, user.password);
        assert.equal(isPasswordMatch, true);
    });

    it('should not register a new user since they did not fill all the required fields', async () => {

      const userData = {
          firstName: 'John',
          email: 'johndoe@example.com',
          password: 'Test@1234',
          confirmPass: 'Test@1234',
          userName: 'johndoe',
      };
  
      const response = await chai
        .request(app)
        .post('/register')
        .send(userData);
  
      // Assert that the user was successfully registered
      assert.equal(response.status, 400);
      assert.equal(response.body.message, 'Please fill all the required fields.');
  });
  })

  describe('Email Preferences', () => {
    it ('should create the email preference for a user', async () => {

      const userData = {
        email: 'johndoe@example.com'
      }

      const preference = {
        checkUpdate: 'no',
        checkTrivia: 'no',
        checkUnsubscribe: 'no',
      }

      const response = await chai
          .request(app)
          .post('/emailPreference')
          .query({ email: userData.email })
          .send(preference);

      assert.equal(response.status, 200);
      assert.equal(response.body.message, "Email preference updated");
    });

    it ('should not create the email preference for a user as no email was provided', async () => {

      const preference = {
        checkUpdate: 'no',
        checkTrivia: 'no',
        checkUnsubscribe: 'no',
      }

      const response = await chai
          .request(app)
          .post('/emailPreference')
          .send(preference);

      assert.equal(response.status, 400);
      assert.equal(response.body.message, "Your email is needed to save your email preferences.");
    });
  })

  describe('Account Management', () => {
    it ('should update the user information', async () => {

        const userInfo = {
            firstName: 'Fahad',
            lastName: 'Hossain',
            email: 'fahadhossain@gmail.com',
            password: 'fAhad852@s',
            confirmPass: 'fAhad852@s',
            userName: 'fahadhossain',
        };
    
        const newUser = await chai
          .request(app)
          .post('/register')
          .send(userInfo);
        
        assert.equal(newUser.status, 200);

        const userData = {
            email: 'johndoe@example.com',
            firstName: 'Sai',
            lastName: 'Dough',
            userName: 'johndoe'
        }
  
        const response = await chai
            .request(app)
            .put('/manageAccount')
            .send(userData);
        
        assert.equal(response.status, 200);
        assert.equal(response.body.message, "User updated successfully.");
    });

    it ('should not update the user information as no email was provided', async () => {

        const userData = {
            firstName: 'Sai',
            lastName: 'Dough',
            userName: 'johndoe'
        }
  
        const response = await chai
            .request(app)
            .put('/manageAccount')
            .send(userData);
        
        assert.equal(response.status, 400);
        assert.equal(response.body.message, "User does not exist");
    });
  })

  describe('Watchlist', () => {
    it ('should add a movie to the user\'s watchlist', async () => {

        const userEmail = { email: 'johndoe@example.com' }
        const userData = {
            titleId: "64111ec0a91b94b3681514fd"
        }
  
        const response = await chai
            .request(app)
            .post('/watchList')
            .query(userEmail)
            .send(userData)
        
        assert.equal(response.status, 200);
        assert.equal(response.body.message, 'Title added to watchlist');
    });

    it ('should not add a movie to the user\'s watchlist as no title id was given', async () => {

        const userEmail = { email: 'johndoe@example.com' }
        const response = await chai
            .request(app)
            .post('/watchList')
            .query(userEmail)
        
        assert.equal(response.status, 400);
        assert.equal(response.body.message, "You must select a show before adding it to the watchlist");
    });
  })

  describe('Trivia', () => {
    it ('should generate a quiz containing the number of questions in the parameter', async () => {

        const triviaData = {
            numOfQuestions: 2,
            difficulty: 'easy'
        }
        const response = await chai
            .request(app)
            .get('/trivia')
            .query(triviaData);
        
        assert.equal(response.status, 200);
        assert.equal(response.body.setOfQuestions.length, 2);
        assert.equal(response.body.message, "Quiz successfully created.");
    });

    it ('should not generate a quiz as number of questions was not included', async () => {

        const triviaData = {
            difficulty: 'easy'
        }
        const response = await chai
            .request(app)
            .get('/trivia')
            .query(triviaData);
        
        assert.equal(response.status, 400);
        assert.equal(response.body.message, "Please select how many questions you would like to answer.");
    });
  })
});