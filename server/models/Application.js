const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  exhibitionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Exhibition', 
    required: true 
  },
  companyName: { 
    type: String, 
    required: true,
    trim: true
  },
  contactPerson: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  services: {
    type: String,
    default: ''
  },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'confirmed', 'rejected'], 
    default: 'pending' 
  },
  amount: {
    type: Number,
    default: 0
  },
  paidAt: {
    type: Date
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Application', ApplicationSchema);