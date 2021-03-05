const {
  user
} = require('../models/') // import user models
const passport = require('passport'); // import passport
const jwt = require('jsonwebtoken'); // import jsonwebtoken
const {
  ObjectId
} = require('mongodb') // Import ObjectId from mongodb
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    user: 'sokaglints@gmail.com',
    pass: 'Soka2021'
  },
  tls: {
    rejectUnauthorized: false
  }
})
class UserController {

  async getAll(req, res) {
    user.find({},
      '_id email fullname description phone profilePic').then(result => {
      res.json({
        status: 'success',
        data: result
      })
    })
  }

  async getOne(req, res) {
    user.findOne({
      _id: req.user._id
    }, '_id email fullname description phone profilePic').then(result => {
      res.json({
        status: "Success",
        data: result
      })
    })
  }

  // if user signup
  async signup(user, req, res) {
    // get the req.user from passport authentication
    const body = {
      email: user.email,
      _id: user._id,
      fullname: user.fullname
    };
    // create jwt token from body variable
    const token = jwt.sign({
      user: body
    }, 'secret_password')

    const mailOptions = {
      from: 'sokaglints@gmail.com',
      to: user.email,
      subject: 'Verify Email Address for SOKA',
      text: `Hello, ${user.fullname}\n\n` + 'Thanks for registering for an account on SOKA! Before we get started, we just need to confirm that is you. Click the link below to verify your email address:\n\n https://' + req.headers.host + '/auth/confirm_acount?confirmation_token=' + token + '\n\n Best Regards,\n Soka Team'
    }
    // req.headers.host
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) throw err
      console.log('Email sent: ' + info.response);
    })

    res.status(200).json({
      message: "Register success, check your email to verify!"
    })
  }

  // if user login
  async login(req, res) {
    // get the req.user from passport authentication
    const body = {
      email: req.user.email,
      _id: req.user._id,
      fullname:req.user.fullname
      
    };

    // create jwt token from body variable
    const token = jwt.sign({
      user: body
    }, 'secret_password')
    
    // success to create token
    res.status(200).json({
      message: 'Login success!',
      token: token,
      role: req.user.role
    })
  }

  async loginOauth(req, res) {
    try {
      console.log(req.user);
      let body = {
        _id: req.user._id,
        email: req.user.email,
     
      };

      let token = jwt.sign({
        user: body
      }, 'secret_password');

      return res.status(200).json({
        message: "Login success!",
        token: token,
        role: req.user.role
      });
    } catch (e) {
        return res.status(500).json({
        message: "Internal Server Error",
        errors: e
      })
    }
  }

  async failed(req, res) {
    try {
    
      return res.status(500).json({
        message: "Internal Server Error"
      });
    } catch (e) {
      return res.status(500).json({
        message: "Internal Server Error",
        errors: e
      });
    }
  }


  async update(req, res) {

    let newData = {}

    if (req.body.fullname) newData.fullname = req.body.fullname
    if (req.body.description) newData.description = req.body.description
    if (req.body.phone) newData.phone = req.body.phone
    if (req.body.price) newData.price = req.body.price
    if (req.body.description) newData.description = req.body.description
    if (req.file) newData.profilePic = req.file === undefined ? "profile-picture.jpg" : req.file.filename

    user.findOneAndUpdate({
      _id: req.user._id
    }, {
      $set: newData
    }, {
      new: true
    }).then(() => {
      return user.findOne({
        _id: req.user._id
      }, 'id email fullname description phone profilePic')
    }).then(result => {
      res.json({
        status: "Success",
        data: result
      })
    })
  }

  
  async delete(req, res) {
    user.delete({
      _id: req.params.id
    }).then(() => {
      res.json({
        status: "success",
        data: null
      })
    })
  }

  async authorization(user, req, res) {
    try {
      // If success, it will be return the user information (id, email, and role)
      return res.status(200).json({
        status: "Success!",
        message: "Authorized!",
        user: user
      })
    } catch (e) {
      // If error, it will return the message of error
      return res.status(401).json({
        status: "Error!",
        message: "Unauthorized!",
      })
    }
  }

  async confirm_acount(req, res) {
    try {
      const {
        confirmation_token
      } = req.query

      const extractJwt = jwt.decode(confirmation_token)

      const userVerify = await user.findOne({
        email: extractJwt.user.email
      })

      if (!userVerify) {
        throw new Error('User not found')
      }

      user.findOneAndUpdate({
        _id: extractJwt.user._id
      }, {
        isVerified: true
      }).then(result => {
        result
      })
      // If success, it will be return the user information (id, email, and role)
      return res.status(200).json({
        status: "Verification Success",
        message: "Login to continnue"
      })
    } catch (e) {
      // If error, it will return the message of error
      return res.status(401).json({
        status: "Error!",
        message: "Unauthorized!",
      })
    }
  }


}



module.exports = new UserController; // export UserController
