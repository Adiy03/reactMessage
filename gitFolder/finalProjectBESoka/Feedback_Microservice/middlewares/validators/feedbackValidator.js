const {
  feedback
} = require('../../models')
const {
  check,
  validationResult,
  matchedData,
  sanitize
} = require('express-validator'); //form validation & sanitize form params
const axios = require('axios'); // Import axios
const https = require('https'); // Import https


module.exports = {
  getByField: [
    check('feedback').custom(async (value, {
      req
    }) => {
      let getFieldAPI = {
        method: 'get',
        url: `https://soka.kuyrek.com:3001/field/${req.params.id_field}`
      };

      let responseGetField = await axios(getFieldAPI);
      let getField = responseGetField.data;

      return feedback.find({
        field: getField.data.fieldName
      }).then(result => {
        if (result.length == 0) {
          throw new Error('There is no feedback available')
        }
      })
    }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: errors.mapped()
        });
      }
      next();
    },
  ],
  getByUser: [
    check('feedback').custom((value, {
      req
    }) => {
      return feedback.find({
        email: req.user.email
      }).then(result => {
        if (result.length == 0) {
          throw new Error('There is no feedback available. Let\'s make your first review!')
        }
      })
    }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: errors.mapped()
        });
      }
      next();
    },
  ],
  create: [

    check('user').custom(async (value, {
      req
    }) => {
      const userFeedback = await feedback.find({
        email: req.user.email
        })
        console.log(userFeedback);
      
        if (userFeedback.length !== 0){
        for (let i=0; i < userFeedback.length; i++){

          if (userFeedback[i].id_booking == req.params.id) {
            throw new Error(`cannot add more review`)
          }
        }
      }
    }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: errors.mapped()
        });
      }
      next();
    },
  ],
  update: [
    check('id').custom(value => {
      return feedback.findOne({
        _id: value
      }).then(b => {
        if (!b) {
          throw new Error('feedback id does not exist');
        }
      })
    }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: errors.mapped()
        });
      }
      next();
    },
  ],
  delete: [
    check('id').custom(value => {
      return feedback.findOne({
        _id: value
      }).then(result => {
        if (!result) {
          throw new Error('feedback id does not exist!')
        }
      })
    }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({
          errors: errors.mapped()
        });
      }
      next();
    },
  ]
}
