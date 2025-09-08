const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  event_id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const institutionProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  institutionId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  departments: [{
    type: String,
    trim: true
  }],
  contactEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  events: [eventSchema],
  profilePicture: {
    type: String,
    default: 'https://via.placeholder.com/150' // Placeholder online image
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('InstitutionProfile', institutionProfileSchema);