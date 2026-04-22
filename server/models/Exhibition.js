const mongoose = require('mongoose');

const ExhibitionSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  theme: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  director: {
    type: String,
    trim: true
  },
  status: { 
    type: String, 
    enum: ['planning', 'preparation', 'active', 'completed'], 
    default: 'planning' 
  },
  concept: {
    type: String,
    default: ''
  },
  businessProgram: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: 'Выставочный павильон Технопарк'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Виртуальное поле для проверки дат
ExhibitionSchema.virtual('isActive').get(function() {
  const now = new Date();
  return this.startDate <= now && this.endDate >= now;
});

ExhibitionSchema.set('toJSON', { virtuals: true });
ExhibitionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Exhibition', ExhibitionSchema);