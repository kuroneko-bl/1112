const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema({
  exhibitionId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Exhibition', 
    required: true 
  },
  buyer: {
    type: String,
    required: true,
    trim: true
  },
  seller: {
    type: String,
    required: true,
    trim: true
  },
  product: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0
  },
  amount: {
    type: Number,
    default: 0,
    min: 0
  },
  contractNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  signedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Генерация номера контракта перед сохранением
ContractSchema.pre('save', async function(next) {
  if (!this.contractNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Contract').countDocuments();
    this.contractNumber = `К-${year}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Contract', ContractSchema);