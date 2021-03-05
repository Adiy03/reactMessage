const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth'); // Import auth
const passport = require('passport'); // import passport
const FeedbackValidator = require('../middlewares/validators/feedbackValidator');
const FeedbackController = require('../controllers/feedbackController');

router.get('/', [passport.authenticate('user', { session: false }), FeedbackValidator.getByUser], FeedbackController.getByUser)
router.get('/:id_field', FeedbackValidator.getByField, FeedbackController.getByField)
router.get('/rating/:id_field', FeedbackController.getRatingField)
router.post('/:id/create', [passport.authenticate('user', { session: false }), FeedbackValidator.create], FeedbackController.create)
router.put('/:id/update', [passport.authenticate('user', { session: false }), FeedbackValidator.update], FeedbackController.update)
router.delete('/:id/delete', [passport.authenticate('user', { session: false })], FeedbackController.delete)


module.exports = router;
