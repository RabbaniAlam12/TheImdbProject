const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
      type: String,
      required: true,
      unique: true,
      validate:{
        validator: function (email) {
        // Regular expression for email validation
        const emailRegex = /\S+@\S+\.\S+/;
        return emailRegex.test(email);
      },
      message: props => `${props.value} is not a valid email address`
      }
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (password) {
          // Regular expression for password validation
          const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
          return passwordRegex.test(password);
        },
        message: props => `${props.value} is not a valid password. Password should contain at least 8 characters, one uppercase letter, one lowercase letter, and one number`
      }
    },
    userName: {
      type: String,
      required: false
    },
    watchList: [],
    emailPreference: [{type: Object}]
}, {collection: 'user'});

// hash the password before saving the user
userSchema.pre('save', async function (next) {
    const user = this;
  
    if (user.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  
    next();
});

const User = mongoose.model('user', userSchema);

module.exports = User;