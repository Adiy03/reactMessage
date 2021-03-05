const path = require('path');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
const passport = require('passport'); // Import passport
const localStrategy = require('passport-local').Strategy; // Import Strategy
const {
  user
} = require('../../models') // Import user model
const bcrypt = require('bcrypt'); // Import bcrypt
const JWTstrategy = require('passport-jwt').Strategy; // Import JWT Strategy
const ExtractJWT = require('passport-jwt').ExtractJwt; // Import ExtractJWT
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

// If user sign up
passport.use(
  'signup',
  new localStrategy({
      'usernameField': 'email', 
      'passwordField': 'password', // field for password from req.body.password
      passReqToCallback: true // read other requests
    },
    async (req, username, password, done) => {
      // Create user data
      user.create({
        email: username, // email get from usernameField (req.body.email)
        password: bcrypt.hashSync(password, 10), // password get from passwordField (req.body.passport)
        fullname: req.body.fullname,
        role: 'user',
        description:'edit your description here',
        profilePic:'profile-picture.jpg',
        phone:'xxx-xxxxxxxxx'
        // role get from req.body.role
      }).then(result => {
        // If success, it will return authorization with req.user
        return done(null, result, {
          message: 'User created!'
        })
      }).catch(err => {
        console.log(err);
        // If error, it will return not authorization
        return done(null, false, {
          message: "User can't be created"
        })
      })
    },
  )
);

// If user login
passport.use(
  'login',
  new localStrategy({
      'usernameField': 'email', // username from req.body.email
      'passwordField': 'password' // password from req.body.password
    },
    async (username, password, done) => {
      // find user depends on email
      const userLogin = await user.findOne({

          email:username

      })

      // if user not found
      if (!userLogin) {
        return done(null, false, {
          message: 'User is not found!'
        })
      }

      // if user found and validate the password of user
      const validate = await bcrypt.compare(password, userLogin.password);

      // if wrong password
      if (!validate) {
        return done(null, false, {
          message: 'Wrong password!'
        })
      }

      // login success
      return done(null, userLogin, {
        message: 'Login success!'
      })
    }
  )
)

passport.use(
  'jwt',
  new JWTstrategy({
      secretOrKey: 'secret_password', // It must be same with secret key when created token
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken() // It will extract token from req.header('Authorization')
    },
    async (token, done) => {
      try {
        // Find the user depends on token that have been extracted
        const userLogin = await user.findOne({
          email: token.user.email
        }, 'email role');

        // If user is not found, it will make Unauthorized and make a message
        if (!userLogin) {
          return done(null, false, {
            message: 'User not found!'
          })
        };

        // If success, it will return userLogin variable that can be used in the next step
        return done(null, userLogin, {
          message: "Authorized!"
        });
      } catch (e) {
        // If error, it will create this message
        return done(null, false, {
          message: "Unauthorized!"
        });
      }
    }
  )
)


// Strategy for transaction role
passport.use(
  'user',
  new JWTstrategy({
      secretOrKey: 'secret_password', // key for jwt
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken() // extract token from authorization
    },
    async (token, done) => {
      // find user depend on token.user.email
      const userLogin = await user.findOne({

        email: token.user.email

      })

      // if user.role includes transaksi it will next
      if (userLogin.role.includes('user')) {
        return done(null, userLogin)


      }

      // if user.role not includes transaksi it will not authorization
      return done(null, false)
    }
  )
  )



  passport.use(
    'manager',
    new JWTstrategy({
        secretOrKey: 'secret_password', // key for jwt
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken() // extract token from authorization
      },
      async (token, done) => {
        // find user depend on token.user.email
        const userLogin = await user.findOne({
  
          email: token.user.email
  
        })
  
        // if user.role includes transaksi it will next
        if (userLogin.role.includes('manager')) {
          return done(null, token.user)
        }
  
        // if user.role not includes transaksi it will not authorization
        return done(null, false)
      }
    )
  )

passport.use(
  'superUser',
  new JWTstrategy({
      secretOrKey: 'secret_password', // key for jwt
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken() // extract token from authorization
    },
    async (token, done) => {
      // find user depend on token.user.email
      const userLogin = await user.findOne({

        email: token.user.email

      })

      // if user.role includes transaksi it will next
      if (userLogin.role.includes('superUser')) {
        return done(null, token.user)
      }

      // if user.role not includes transaksi it will not authorization
      return done(null, false)
    }
  )
)

passport.use(
  'google',
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let userLogin = await user.findOne({
        
          email: profile.emails[0].value
        
      });

      
      if (!userLogin) {
        userLogin = await user.create({
          email: profile.emails[0].value,
          password: "this is password for google!",
          role:'user'
        });
       
      }
      return done(null, userLogin);
    } catch (e) {
      console.log(e);
      return done(null, false);
    }
    
  }
));

// passport.use(
//   'facebook',
//   new FacebookStrategy({
//     clientID: process.env.FACEBOOK_APP_ID,
//     clientSecret: process.env.FACEBOOK_APP_SECRET,
//     callbackURL: process.env.FACEBOOK_CALLBACK_URL,
//     profileFields: ['id', 'displayName', 'photos', 'email']
//   },
//   async (accessToken, refreshToken, profile, done) => {
//     try {
//       let userLogin = await user.findOne({
//         where: {
//           email: profile.emails[0].value
//         }
//       });

//       if (!userLogin) {
//         userLogin = await user.create({
//           email: profile.emails[0].value,
//           password: "this is password for facebook!"
//         });
//       }

//       return done(null, userLogin);
//     } catch (e) {
//       return done(null, false);
//     }
//   }
// ));

// passport.use(
//   'twitter',
//   new TwitterStrategy({
//     consumerKey: process.env.TWITTER_CONSUMER_KEY,
//     consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
//     callbackURL: process.env.TWITTER_CALLBACK_URL,
//     userProfileURL: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true'
//   },
//   async function(token, tokenSecret, profile, done) {
//     try {
//       let userLogin = await user.findOne({
//         where: {
//           email: profile.emails[0].value,
//         }
//       });

//       if (!userLogin) {
//         userLogin = await user.create({
//           email: profile.emails[0].value,
//           password: "this is password for twitter!"
//         });
//       }

//       return done(null, userLogin);
//     } catch (e) {
//       return done(null, false);
//     }
//   }
// ));