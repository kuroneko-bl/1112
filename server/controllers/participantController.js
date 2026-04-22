const Participant = require('../models/Participant');

const getAll = async (req, res) => {
  try {
    const participants = await Participant.find().populate('exhibitionId');
    res.json(participants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const create = async (req, res) => {
  try {
    const participant = new Participant(req.body);
    await participant.save();
    res.json(participant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const setAsLaureate = async (req, res) => {
  try {
    const { award, awardPlace } = req.body;
    const participant = await Participant.findByIdAndUpdate(
      req.params.id, 
      { isLaureate: true, award, awardPlace }, 
      { new: true }
    );
    if (!participant) {
      return res.status(404).json({ error: 'Участник не найден' });
    }
    res.json(participant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getByExhibition = async (req, res) => {
  try {
    const participants = await Participant.find({ exhibitionId: req.params.exhibitionId });
    res.json(participants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, create, setAsLaureate, getByExhibition };