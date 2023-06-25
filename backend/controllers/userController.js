//express-async-handler is a simple middleware for handling exceptions
//inside of async express routes an passing them to your express error handlers
import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'
import config from '../config/config.js'
import bcrypt from 'bcryptjs';

import nodemailer from 'nodemailer'
import randomstring from 'randomstring'

const sendResetPasswordMail = async (name, email, token, res) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtpout.secureserver.net',
      port: 465,
      secure: true,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword,
      },
    });

    const mailOptions = {
      from: config.emailUser,
      to: email,
      subject: 'Reset Password - bigbasketuae.com',
      html: `<p> Hi ${name}, please copy the link and <a href="http://localhost:3000/reset-password?token=${token}">reset the password</a>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(400).send({ success: false, message: 'Failed to send reset password email' });
      } else {
        console.log('Mail has been sent:', info.response);
        res.status(200).send({ success: true, message: 'Reset password email sent. Please check your email inbox and reset the password' });
      }
    });
  } catch (error) {
    res.status(500).send({ success: false, message: 'An error occurred while sending the reset password email' });
  }
};


//@desc Auth user & get token
//@route POST /api/users/login
//@access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

//@desc Register a new user
//@route POST /api/users/
//@access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('User already exist')
  }
  const user = await User.create({
    name,
    email,
    password,
  })
  if (user) {
    //201 means something is created
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

//@desc GET user profile
//@route GET /api/users/profile
//@access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

//@desc Update user profile
//@route PUT /api/users/profile
//@access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }
    const updatedUser = await user.save()
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

//@desc GET all users
//@route GET /api/users
//@access Private/Admin
//private means protected route
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

//@desc Delete  user
//@route DELETE /api/users/:id
//@access Private/Admin
//private means protected route
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.deleteOne()
    res.json({ message: 'removed' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

//@desc GET user by ID
//@route GET /api/users/:id
//@access Private/Admin
//private means protected route
const getUserById = asyncHandler(async (req, res) => {
  //dont want to fetch password
  const user = await User.findById(req.params.id).select('-password')
  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})
// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin
    if (req.body.password) {
      user.password = req.body.password
    }
    const updatedUser = await user.save()
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})
const forgotPassword = asyncHandler(async (req, res) => {
  try {
    console.log(req.body);
    const email = req.body.email;
    const userData = await User.findOne({ email: email });
    console.log(userData);
    if (userData) {
      const randomString = randomstring.generate();
      const data = await User.updateOne({ email: email }, { $set: { token: randomString } });
      sendResetPasswordMail(userData.name, userData.email, randomString, res);
    } else {
      res.status(400).send({ success: false, message: 'This email does not exist.' });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: 'An error occurred while processing the request.' });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  try {
    const token = req.query.token;
    const tokenData = await User.findOne({ token: token });
    if (tokenData) {
      const password = req.body.password;
      console.log(password);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const userData = await User.findByIdAndUpdate(
        tokenData._id,
        { $set: { password: hashedPassword, token: '' } },
        { new: true }
      );
      res.status(200).send({
        success: true,
        msg: 'User password has been reset',
        data: userData,
      });
    } else {
      res.status(200).send({ success: false, msg: 'This link has expired' });
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
});




export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  forgotPassword,
  resetPassword
}
