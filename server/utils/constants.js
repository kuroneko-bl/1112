const USER_ROLES = {
    ADMIN: 'admin',
    DIRECTOR: 'director',
    USER: 'user'
  };
  
  const EXHIBITION_STATUS = {
    PLANNING: 'planning',
    PREPARATION: 'preparation',
    ACTIVE: 'active',
    COMPLETED: 'completed'
  };
  
  const APPLICATION_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
    CONFIRMED: 'confirmed',
    REJECTED: 'rejected'
  };
  
  const getStatusText = (status) => {
    const statuses = {
      [APPLICATION_STATUS.PENDING]: 'На рассмотрении',
      [APPLICATION_STATUS.PAID]: 'Оплачено',
      [APPLICATION_STATUS.CONFIRMED]: 'Подтверждено',
      [APPLICATION_STATUS.REJECTED]: 'Отклонено'
    };
    return statuses[status] || status;
  };
  
  module.exports = {
    USER_ROLES,
    EXHIBITION_STATUS,
    APPLICATION_STATUS,
    getStatusText
  };