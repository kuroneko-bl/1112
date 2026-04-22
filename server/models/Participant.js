const mongoose = require('mongoose');

const ParticipantSchema = new mongoose.Schema({
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
  standNumber: {
    type: String,
    default: ''
  },
  products: {
    type: String,
    default: ''
  },
  isLaureate: { 
    type: Boolean, 
    default: false 
  },
  award: {
    type: String,
    default: ''
  },
  awardPlace: {
    type: Number,
    min: 1,
    max: 3
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Participant', ParticipantSchema);