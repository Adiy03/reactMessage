const mongoose = require("mongoose");
const mongoose_delete = require('mongoose-delete');

const FeedbackSchema = new mongoose.Schema({
  id_booking: {
    type: mongoose.Schema.Types.Mixed
  },
  field: {
    type: String
  },
  email: {
    type: String
  },
  username: {
    type: String,
    required: true
  },
  review: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  versionKey: false
});

FeedbackSchema.plugin(mongoose_delete, {
  overrideMethods: 'all'
});

module.exports = feedback = mongoose.model("feedback", FeedbackSchema, "feedback");
