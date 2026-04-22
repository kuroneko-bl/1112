const Application = require('../models/Application');

const getAll = async (req, res) => {
    try {
        let filter = {};
        // Если пользователь не авторизован или не админ - показываем только pending
        if (!req.user || req.user.role !== 'admin') {
            filter = { status: 'pending' };
        }
        const applications = await Application.find(filter).populate('exhibitionId');
        res.json(applications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const create = async (req, res) => {
    try {
        // Для создания заявки нужна авторизация
        if (!req.user) {
            return res.status(401).json({ error: 'Для подачи заявки необходимо авторизоваться' });
        }
        const application = new Application(req.body);
        await application.save();
        res.json(application);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const markAsPaid = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Доступ запрещен' });
        }
        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status: 'paid', paidAt: new Date() },
            { new: true }
        );
        if (!application) {
            return res.status(404).json({ error: 'Заявка не найдена' });
        }
        res.json(application);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateStatus = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Доступ запрещен' });
        }
        const { status } = req.body;
        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!application) {
            return res.status(404).json({ error: 'Заявка не найдена' });
        }
        res.json(application);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { getAll, create, markAsPaid, updateStatus };