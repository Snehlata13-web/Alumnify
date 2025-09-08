const mongoose = require('mongoose');

const alumniProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  collegeName: {
    type: String,
    required: true,
    trim: true
  },
  graduationYear: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear()
  },
  currentCompany: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  industry: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  availableForMentorship: {
    type: Boolean,
    default: false
  },
  availableForDonation: {
    type: Boolean,
    default: false
  },
  linkedin: {
    type: String,
    trim: true
  },
  profilePicture: {
    type: String,
    default: 'https://via.placeholder.com/150' // Placeholder online image
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AlumniProfile', alumniProfileSchema);