const errorHandler = (err, req, res, next) => {
    console.error('Ошибка:', err.message);
    
    // Ошибки валидации Mongoose
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: 'Ошибка валидации', details: errors });
    }
    
    // Дублирование ключа (уникальность)
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ error: `Значение "${field}" уже существует` });
    }
    
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  };
  
  module.exports = errorHandler;