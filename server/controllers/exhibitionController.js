const Exhibition = require('../models/Exhibition');

const getAll = async (req, res) => {
    try {
        console.log('GET /api/exhibitions - Запрос списка выставок');
        const exhibitions = await Exhibition.find().sort({ startDate: -1 });
        console.log(`Найдено выставок: ${exhibitions.length}`);
        res.json(exhibitions);
    } catch (err) {
        console.error('Ошибка в getAll:', err);
        res.status(500).json({ error: err.message });
    }
};

const getById = async (req, res) => {
    try {
        const exhibition = await Exhibition.findById(req.params.id);
        if (!exhibition) {
            return res.status(404).json({ error: 'Выставка не найдена' });
        }
        res.json(exhibition);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const create = async (req, res) => {
    try {
        const exhibition = new Exhibition(req.body);
        await exhibition.save();
        res.json(exhibition);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const update = async (req, res) => {
    try {
        const exhibition = await Exhibition.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!exhibition) {
            return res.status(404).json({ error: 'Выставка не найдена' });
        }
        res.json(exhibition);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const remove = async (req, res) => {
    try {
        const exhibition = await Exhibition.findByIdAndDelete(req.params.id);
        if (!exhibition) {
            return res.status(404).json({ error: 'Выставка не найдена' });
        }
        res.json({ message: 'Выставка удалена' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAll, getById, create, update, remove };