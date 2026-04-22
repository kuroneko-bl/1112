const Contract = require('../models/Contract');

const getAll = async (req, res) => {
  try {
    const contracts = await Contract.find().populate('exhibitionId').sort({ signedAt: -1 });
    res.json(contracts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const contract = new Contract(req.body);
    await contract.save();
    res.json(contract);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getByExhibition = async (req, res) => {
  try {
    const contracts = await Contract.find({ exhibitionId: req.params.exhibitionId });
    res.json(contracts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, create, getByExhibition };