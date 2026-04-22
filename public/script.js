const API_URL = 'http://localhost:5000/api';
let currentUser = null;
let authToken = null;

// Проверка авторизации
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
        authToken = token;
        currentUser = JSON.parse(user);
        updateUIForAuth();
        return true;
    }
    return false;
}

function updateUIForAuth() {
    if (currentUser) {
        document.querySelectorAll('#userInfo').forEach(el => {
            if (el) {
                el.style.display = 'inline';
                el.innerHTML = ` ${currentUser.fullName || currentUser.username} (${currentUser.role === 'admin' ? 'Админ' : currentUser.role === 'director' ? 'Директор' : 'Пользователь'})`;
            }
        });
        document.querySelectorAll('#logoutBtn').forEach(el => {
            if (el) {
                el.style.display = 'inline';
                el.onclick = logout;
            }
        });
        document.querySelectorAll('#dashboardLink').forEach(el => {
            if (el) el.style.display = 'inline';
        });
        
        if (currentUser.role === 'admin' || currentUser.role === 'director') {
            const adminPanel = document.getElementById('adminPanel');
            if (adminPanel) adminPanel.style.display = 'block';
        }
        
        // Загрузка данных
        loadExhibitionsForSelect();
        loadApplications();
        loadParticipants();
        loadContracts();
        loadReportSelect();
        
        if (currentUser.role === 'admin') {
            loadStatistics();
        }
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Загрузка выставок для select
async function loadExhibitionsForSelect() {
    if (!authToken) return;
    try {
        const res = await fetch(`${API_URL}/exhibitions`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const exhibitions = await res.json();
        
        const selects = document.querySelectorAll('#exhibitionSelect, #contractExhibition, #reportExhibition');
        selects.forEach(select => {
            if (select) {
                select.innerHTML = '<option value="">-- Выберите --</option>' + 
                    exhibitions.map(ex => `<option value="${ex._id}">${ex.name} (${new Date(ex.startDate).toLocaleDateString()})</option>`).join('');
            }
        });
    } catch (err) {
        console.error(err);
    }
}

// Подача заявки
if (document.getElementById('applicationForm')) {
    document.getElementById('applicationForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!authToken) {
            alert('Для подачи заявки необходимо авторизоваться');
            window.location.href = 'login.html';
            return;
        }
        
        const application = {
            exhibitionId: document.getElementById('exhibitionSelect').value,
            companyName: document.getElementById('companyName').value,
            contactPerson: document.getElementById('contactPerson').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            services: document.getElementById('services').value,
            status: 'pending'
        };
        
        try {
            const res = await fetch(`${API_URL}/applications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(application)
            });
            if (res.ok) {
                const msgDiv = document.getElementById('appMsg');
                if (msgDiv) {
                    msgDiv.innerHTML = '<div class="alert alert-success">Заявка успешно отправлена! Ожидайте подтверждения.</div>';
                    document.getElementById('applicationForm').reset();
                    setTimeout(() => msgDiv.innerHTML = '', 5000);
                }
            } else {
                const err = await res.json();
                alert('Ошибка: ' + err.error);
            }
        } catch (err) {
            console.error(err);
            alert('Ошибка при отправке заявки');
        }
    });
}

// Загрузка заявок
async function loadApplications() {
    if (!authToken) return;
    try {
        const res = await fetch(`${API_URL}/applications`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const applications = await res.json();
        
        const container = document.getElementById('applicationsList');
        if (!container) return;
        
        if (applications.length === 0) {
            container.innerHTML = '<p> Нет заявок</p>';
            return;
        }
        
        container.innerHTML = `
            <table class="table">
                <thead>
                    <tr>
                        <th>Компания</th>
                        <th>Выставка</th>
                        <th>Услуги</th>
                        <th>Статус</th>
                        ${currentUser.role === 'admin' ? '<th>Действия</th>' : ''}
                    </tr>
                </thead>
                <tbody>
                    ${applications.map(app => `
                        <tr>
                            <td>${escapeHtml(app.companyName)}</td>
                            <td>${app.exhibitionId?.name || 'N/A'}</td>
                            <td>${escapeHtml(app.services || '-')}</td>
                            <td class="status-${app.status}">${getStatusText(app.status)}</td>
                            ${currentUser.role === 'admin' ? `
                                <td>
                                    ${app.status === 'pending' ? `<button class="btn btn-success btn-sm" onclick="payApplication('${app._id}')">💰 Оплачено</button>` : ''}
                                    ${app.status === 'paid' ? `<button class="btn btn-primary btn-sm" onclick="updateStatus('${app._id}', 'confirmed')">✅ Подтвердить</button>` : ''}
                                    ${app.status === 'pending' ? `<button class="btn btn-danger btn-sm" onclick="updateStatus('${app._id}', 'rejected')">❌ Отклонить</button>` : ''}
                                </td>
                            ` : ''}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (err) {
        console.error(err);
    }
}

function getStatusText(status) {
    const statuses = { 
        pending: 'На рассмотрении', 
        paid: 'Оплачено', 
        confirmed: 'Подтверждено', 
        rejected: 'Отклонено' 
    };
    return statuses[status] || status;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

window.payApplication = async function(id) {
    const res = await fetch(`${API_URL}/applications/${id}/pay`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    if (res.ok) {
        loadApplications();
        alert('Заявка отмечена как оплаченная');
    }
};

window.updateStatus = async function(id, status) {
    const res = await fetch(`${API_URL}/applications/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ status })
    });
    if (res.ok) {
        loadApplications();
        alert('Статус обновлен');
    }
};

// Создание выставки
if (document.getElementById('createExhibitionForm')) {
    document.getElementById('createExhibitionForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const exhibition = {
            name: document.getElementById('exhName').value,
            theme: document.getElementById('exhTheme').value,
            startDate: document.getElementById('exhStart').value,
            endDate: document.getElementById('exhEnd').value,
            director: document.getElementById('exhDirector').value,
            concept: document.getElementById('exhConcept').value,
            status: 'planning'
        };
        
        const res = await fetch(`${API_URL}/exhibitions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify(exhibition)
        });
        
        if (res.ok) {
            alert('Выставка создана');
            e.target.reset();
            loadExhibitionsForSelect();
            loadReportSelect();
        } else {
            const err = await res.json();
            alert('Ошибка: ' + err.error);
        }
    });
}

// Загрузка участников
async function loadParticipants() {
    if (!authToken) return;
    const res = await fetch(`${API_URL}/participants`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const participants = await res.json();
    
    const container = document.getElementById('participantsList');
    if (!container) return;
    
    if (participants.length === 0) {
        container.innerHTML = '<p> Нет зарегистрированных участников</p>';
        return;
    }
    
    container.innerHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>Компания</th>
                    <th>Выставка</th>
                    <th>Стенд</th>
                    <th>Товары/услуги</th>
                    <th>Лауреат</th>
                    ${currentUser.role === 'admin' ? '<th>Действия</th>' : ''}
                </tr>
            </thead>
            <tbody>
                ${participants.map(p => `
                    <tr>
                        <td>${escapeHtml(p.companyName)}</td>
                        <td>${p.exhibitionId?.name || 'N/A'}</td>
                        <td>${p.standNumber || '-'}</td>
                        <td>${escapeHtml(p.products || '-')}</td>
                        <td>${p.isLaureate ? ` ${p.award || 'Победитель'} ${p.awardPlace ? `(${p.awardPlace} место)` : ''}` : '❌'}</td>
                        ${currentUser.role === 'admin' ? `
                            <td>
                                ${!p.isLaureate ? `<button class="btn btn-warning btn-sm" onclick="setLaureate('${p._id}')"> Сделать лауреатом</button>` : ''}
                            </td>
                        ` : ''}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

window.setLaureate = async function(id) {
    const award = prompt('Введите название награды (например: Золотая медаль)');
    const place = prompt('Введите место (1, 2 или 3)');
    
    const res = await fetch(`${API_URL}/participants/${id}/laureate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({ award, awardPlace: parseInt(place) })
    });
    if (res.ok) {
        loadParticipants();
        alert('Участник отмечен как лауреат!');
    }
};

// Контракты
if (document.getElementById('contractForm')) {
    document.getElementById('contractForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const contract = {
            exhibitionId: document.getElementById('contractExhibition').value,
            buyer: document.getElementById('contractBuyer').value,
            seller: document.getElementById('contractSeller').value,
            product: document.getElementById('contractProduct').value,
            quantity: parseInt(document.getElementById('contractQuantity').value) || 0,
            amount: parseInt(document.getElementById('contractAmount').value) || 0
        };
        
        const res = await fetch(`${API_URL}/contracts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify(contract)
        });
        
        if (res.ok) {
            alert('Контракт добавлен');
            e.target.reset();
            loadContracts();
        }
    });
}

async function loadContracts() {
    if (!authToken) return;
    const res = await fetch(`${API_URL}/contracts`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const contracts = await res.json();
    
    const container = document.getElementById('contractsList');
    if (!container) return;
    
    if (contracts.length === 0) {
        container.innerHTML = '<p>📄 Нет заключенных контрактов</p>';
        return;
    }
    
    container.innerHTML = `
        <h4 style="margin-top: 20px;">Заключенные контракты</h4>
        <table class="table">
            <thead>
                <tr><th>№ контракта</th><th>Выставка</th><th>Покупатель</th><th>Продавец</th><th>Товар</th><th>Кол-во</th><th>Сумма (руб.)</th><th>Дата</th></tr>
            </thead>
            <tbody>
                ${contracts.map(c => `
                    <tr>
                        <td>${c.contractNumber || '-'}</td>
                        <td>${c.exhibitionId?.name || 'N/A'}</td>
                        <td>${escapeHtml(c.buyer)}</td>
                        <td>${escapeHtml(c.seller)}</td>
                        <td>${escapeHtml(c.product)}</td>
                        <td>${c.quantity}</td>
                        <td>${c.amount.toLocaleString()}</td>
                        <td>${new Date(c.signedAt).toLocaleDateString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Загрузка select для отчета
async function loadReportSelect() {
    if (!authToken) return;
    const res = await fetch(`${API_URL}/exhibitions`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const exhibitions = await res.json();
    
    const select = document.getElementById('reportExhibition');
    if (select) {
        select.innerHTML = '<option value="">-- Выберите выставку --</option>' + 
            exhibitions.map(ex => `<option value="${ex._id}">${ex.name}</option>`).join('');
    }
}

window.loadReport = async function() {
    const exhibitionId = document.getElementById('reportExhibition').value;
    if (!exhibitionId) {
        alert('Выберите выставку');
        return;
    }
    
    const res = await fetch(`${API_URL}/statistics/exhibition/${exhibitionId}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const stats = await res.json();
    
    const container = document.getElementById('reportContent');
    container.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card"><div class="stat-number">${stats.participantsCount}</div><div class="stat-label">Участников</div></div>
            <div class="stat-card"><div class="stat-number">${stats.applicationsCount}</div><div class="stat-label">Оплаченных заявок</div></div>
            <div class="stat-card"><div class="stat-number">${stats.contractsCount}</div><div class="stat-label">Контрактов</div></div>
            <div class="stat-card"><div class="stat-number">${stats.totalContractAmount.toLocaleString()} ₽</div><div class="stat-label">Общая сумма</div></div>
            <div class="stat-card"><div class="stat-number">${stats.laureatesCount}</div><div class="stat-label">Лауреатов</div></div>
        </div>
        <h4>📦 Представленные товары и услуги:</h4>
        <p>${stats.productsList || 'Нет данных'}</p>
        <h4>📋 Список контрактов:</h4>
        <table class="table">
            <thead><tr><th>Покупатель</th><th>Продавец</th><th>Товар</th><th>Сумма</th></tr></thead>
            <tbody>
                ${stats.contracts.map(c => `
                    <tr><td>${escapeHtml(c.buyer)}</td><td>${escapeHtml(c.seller)}</td><td>${escapeHtml(c.product)}</td><td>${c.amount.toLocaleString()} ₽</td></tr>
                `).join('')}
            </tbody>
        </table>
    `;
};

// Статистика для админа
async function loadStatistics() {
    const res = await fetch(`${API_URL}/statistics/all`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const stats = await res.json();
    
    const container = document.getElementById('statsGrid');
    if (container) {
        container.innerHTML = `
            <div class="stat-card"><div class="stat-number">${stats.totalExhibitions}</div><div class="stat-label">Всего выставок</div></div>
            <div class="stat-card"><div class="stat-number">${stats.totalParticipants}</div><div class="stat-label">Всего участников</div></div>
            <div class="stat-card"><div class="stat-number">${stats.totalContracts}</div><div class="stat-label">Всего контрактов</div></div>
            <div class="stat-card"><div class="stat-number">${stats.totalApplications}</div><div class="stat-label">Всего заявок</div></div>
            <div class="stat-card"><div class="stat-number">${stats.pendingApplications}</div><div class="stat-label">В обработке</div></div>
            <div class="stat-card"><div class="stat-number">${stats.totalRevenue.toLocaleString()} ₽</div><div class="stat-label">Общий оборот</div></div>
        `;
    }
}

// Инициализация
checkAuth();