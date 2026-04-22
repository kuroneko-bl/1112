const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    // Получаем заголовок Authorization
    const authHeader = req.headers['authorization'];
    
    // Добавляем отладочный вывод
    console.log('Auth header:', authHeader);
    
    // Если заголовка нет - не блокируем запрос, просто помечаем что пользователь не авторизован
    if (!authHeader) {
        req.user = null;
        return next();
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
        req.user = null;
        return next();
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Token verify error:', err.message);
        req.user = null;
        next();
    }
};

// Для маршрутов, где авторизация обязательна
const requireAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Требуется авторизация' });
    }
    next();
};

const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Доступ запрещен. Требуются права администратора' });
    }
    next();
};

const requireDirectorOrAdmin = (req, res, next) => {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'director')) {
        return res.status(403).json({ error: 'Доступ запрещен. Требуются права директора или администратора' });
    }
    next();
};

module.exports = { authenticate, requireAuth, requireAdmin, requireDirectorOrAdmin };