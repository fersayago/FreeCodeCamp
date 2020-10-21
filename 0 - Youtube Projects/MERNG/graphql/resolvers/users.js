const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require('apollo-server')

const { validateRegisterInput, validateLoginInput } = require('../../util/validators');
const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");

function generateToken(user){
    return jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
      );
}

module.exports = {
  Mutation: {
    async validateLoginInput(_, {username, password}){

        //TODO: Choca el validateLoginInput por versionado 
        //timestamp 1:09:00 - 1:11:00
        const {errors, valid} = validateLoginInput(username, password);
        const user = await User.findOne({ username });

        if(!user){
            errors.general = 'User not found';
            throw new UserInputError('User not found', { errors });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match){
            errors.general = 'Wrong credentials';
            throw new UserInputError('Wrong credentials', { errors });
        }

        const token = generateToken(user)

        return {
            ...user._doc,
            id: user._id,
            token,
          };
    },
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } },
      context,
      info
    ) {
      //DONE: Validate user data
      const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
      if (!valid) {
          throw new UserInputError('Errors', { errors });
      }
      //DONE: Make sure user doesn't already exist
      const user = User.findOne({ username });
      if (user){
          throw new UserInputError('username is taken', {
              errors: {
                  username: 'This username is taken'
              }
          })
      }
      //DONE: hash password and create auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateToken(res)

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
