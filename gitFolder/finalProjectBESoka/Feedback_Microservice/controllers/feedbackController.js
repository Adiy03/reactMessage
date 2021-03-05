const {
  feedback
} = require('../models');
const axios = require('axios'); // Import axios
const https = require('https'); // Import https


class FeedbackController {

  async getAll(req, res) {
    feedback.find({}).sort({
      createdAt: 'asc'
    }).then(result => {
      res.json({
        status: "Success",
        data: result
      })
    })
  }

  //
  // async getOne(req, res) {
  //   feedback.findOne({
  //     _id: req.params.id
  //   }).then(result => {
  //     res.json({
  //       status: "Success",
  //       data: result
  //     })
  //   })
  // }

  async getByUser(req, res) {
    feedback.find({
      email: req.user.email
    }).then(result => {
      res.json({
        status: "Success",
        data: result
      })
    })
  }

  // async getByField(req, res) {

  //   let getFieldAPI = {
  //     method: 'get',
  //     url: `https://soka.kuyrek.com:3001/field/${req.params.id_field}`
  //   };

  //   let responseGetField = await axios(getFieldAPI);
  //   let getField = responseGetField.data;

  //   feedback.find({
  //     field: getField.data.fieldName
  //   }).then(result => {
  //     res.json({
  //       status: "Success",
  //       data: result
  //     })
  //   })
  // }

  async getByField(req, res) {
    let getFieldAPI = {
      method: 'get',
      url: `https://soka.kuyrek.com:3001/field/${req.params.id_field}`
    };

    let responseGetField = await axios(getFieldAPI);
    let getField = responseGetField.data;

    feedback.find({
      field: getField.data.fieldName
    }).then(result => {

      let sumAverage = 0;
      result.forEach((item, i) => {
        sumAverage += item.rating
      });
      const averageRating = sumAverage / result.length

      res.json({
        status: "Success",
        data: result,
        ratingAvg: averageRating
      })
    })
  }

  async getRatingField(req, res) {
    let getFieldAPI = {
      method: 'get',
      url: `https://soka.kuyrek.com:3001/field/${req.params.id_field}`
    };

    let responseGetField = await axios(getFieldAPI);
    let getField = responseGetField.data;

    const fillFeedback = await feedback.find({
      field: getField.data.fieldName
    })
    let sumAverage = 0;
    await fillFeedback.forEach((item, i) => {
      sumAverage += item.rating
    });
    const averageRating = sumAverage / fillFeedback.length
    const toFixed = averageRating.toFixed(1)

    if (!isNaN(averageRating)) {
      if (toFixed.split('.')[1] !== '0') {
        res.json({
          status: "Success",
          field: getField.data.fieldName,
          ratingAvg: toFixed
        })
      } else {
        res.json({
          status: "Success",
          field: getField.data.fieldName,
          ratingAvg: toFixed.split('.')[0]
        })
      }
    } else {
      res.json({
        status: "Success",
        field: getField.data.fieldName,
        ratingAvg: 0
      })
    }
  }

  async create(req, res) {

    const agent = new https.Agent({
      rejectUnauthorized: false
    });

    let getBookingAPI = {
      method: 'get',
      url: `https://soka.kuyrek.com:3003/booking/${req.params.id}`,
      headers: {
        'Authorization': req.header('Authorization')
      },
      httpsAgent: agent
    };
    let responseGetBooking = await axios(getBookingAPI);
    let getBooking = responseGetBooking.data;
      if (getBooking.data.transaction == true) {
      feedback.create({
        id_booking: getBooking.data.id,
        field: getBooking.data.field,
        email: req.user.email,
        username: req.user.fullname,
        review: req.body.review,
        rating: req.body.rating
      }).then(result => {
        res.json({
          status: "success",
          data: result
        })
      })
    }
    else{
      res.json({
        status:'You cannot add review to an upcoming match'
      })
    }

  }

  async update(req, res) {
    let newData = {}

    if (req.body.review) newData.review = req.body.review
    if (req.body.rating) newData.rating = req.body.rating

    feedback.findOneAndUpdate({
      _id: req.params.id
    }, {
      $set: newData
    }, {
      new: true
    }).then(() => {
      return feedback.findOne({
        _id: req.params.id
      })
    }).then(result => {
      res.json({
        status: "success",
        data: result
      })
    })
  }

  async delete(req, res) {
    feedback.delete({
      _id: req.params.id
    }).then(() => {
      res.json({
        status: "success",
        data: null
      })
    })
  }

}

module.exports = new FeedbackController;
