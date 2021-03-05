const express = require('express'); // import express
const router = express.Router(); // import router
const passport = require('passport'); // import passport
const auth = require('../middlewares/auth/index'); // import passport auth strategy
const UserController = require('../controllers/userController'); // import userController
const userValidator = require('../middlewares/validators/userValidator'); // import userValidator

// if user go to localhost:3000/signup
router.get('/user', UserController.getAll);
router.get('/user/profile', [ passport.authenticate(['user','manager'], {
  session: false
})], UserController.getOne);

//router.get('/:username') ambil profile pic sama username
router.get('/failed', UserController.failed);
router.get('/auth/google', passport.authenticate('google', { session: false, scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/failed' }), UserController.loginOauth);
router.post('/signup', [userValidator.signup, function(req, res, next) {
  passport.authenticate('signup', {
    session: false
  }, function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.status(401).json({
        status: 'Error',
        message: info.message
      });
      return;
    }
    UserController.signup(user, req, res, next);
  })(req, res, next);
}]);
router.post('/login', [userValidator.login, passport.authenticate('login', {
  session: false
})], UserController.login);
router.put('/user/edit', [passport.authenticate(['user','manager'], {
  session: false
}), userValidator.update], UserController.update);
// router.post('/user/:title/:username/wl', UserController.watchlist);
router.delete('/user/delete/:id', [passport.authenticate('superUser', {
  session: false
})], userValidator.delete, UserController.delete)


router.get('/authorization', function(req, res, next) {
  // will be go to login in auth
  passport.authenticate('jwt', {
    session: false
  }, async function(err, user, info) {
    // If error not null
    if (err) {
      return next(err);
    }

    // If user is not exist
    if (!user) {
      res.status(401).json({
        status: 'Error!',
        message: info.message
      });
      return;
    }

    // If not error, it will go to login function in UsersController
    UserController.authorization(user, req, res);
  })(req, res, next);
})

//Verification Email
router.get('/auth/confirm_acount', UserController.confirm_acount)


module.exports = router; // export router
