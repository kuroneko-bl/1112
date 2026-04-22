const Participant = require('../models/Participant');
const Application = require('../models/Application');
const Contract = require('../models/Contract');
const Exhibition = require('../models/Exhibition');

const getExhibitionStats = async (req, res) => {
  try {
    const exhibitionId = req.params.exhibitionId;
    
    const exhibition = await Exhibition.findById(exhibitionId);
    if (!exhibition) {
      return res.status(404).json({ error: 'Выставка не найдена' });
    }
    
    const participantsCount = await Participant.countDocuments({ exhibitionId });
    const applicationsCount = await Application.countDocuments({ exhibitionId, status: 'paid' });
    const contracts = await Contract.find({ exhibitionId });
    const totalAmount = contracts.reduce((sum, c) => sum + (c.amount || 0), 0);
    const laureatesCount = await Participant.countDocuments({ exhibitionId, isLaureate: true });
    
    // Список представленных товаров и услуг
    const participants = await Participant.find({ exhibitionId });
    const productsList = participants.map(p => p.products).filter(p => p).join(', ');
    
    res.json({
      exhibitionName: exhibition.name,
      participantsCount,
      applicationsCount,
      contractsCount: contracts.length,
      totalContractAmount: totalAmount,
      laureatesCount,
      contracts: contracts,
      productsList,
      startDate: exhibition.startDate,
      endDate: exhibition.endDate
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllStats = async (req, res) => {
  try {
    const totalExhibitions = await Exhibition.countDocuments();
    const totalParticipants = await Participant.countDocuments();
    const totalContracts = await Contract.countDocuments();
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'pending' });
    
    const contracts = await Contract.find();
    const totalRevenue = contracts.reduce((sum, c) => sum + (c.amount || 0), 0);
    
    res.json({
      totalExhibitions,
      totalParticipants,
      totalContracts,
      totalApplications,
      pendingApplications,
      totalRevenue
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getExhibitionStats, getAllStats };