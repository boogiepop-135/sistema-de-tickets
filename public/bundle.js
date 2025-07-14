// Sistema de Tickets - Bundle.js con Router
console.log("Inicializando Sistema de Tickets con Router...");

// Configurar URL del backend
window.BACKEND_URL = "https://sample-service-name-8sgu.onrender.com";
window.currentUser = null;

// Router simple
const router = {
    currentPath: window.location.pathname,
    
    navigate(path) {
        window.history.pushState({}, '', path);
        this.currentPath = path;
        this.render();
    },
    
    render() {
        const app = document.getElementById('app');
        if (!app) return;
        
        // Limpiar contenido anterior
        app.innerHTML = '';
        
        // Renderizar según la ruta
        switch(this.currentPath) {
            case '/':
                this.renderHome();
                break;
            case '/login':
                this.renderLogin();
                break;
            case '/create-ticket':
                this.renderCreateTicket();
                break;
            case '/admin-tickets':
                this.renderAdminTickets();
                break;
            case '/admin-users':
                this.renderAdminUsers();
                break;
            default:
                this.renderHome();
        }
    },
    
    renderNavbar() {
        return `
            <nav class="navbar navbar-expand-lg navbar-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); box-shadow: 0 4px 20px rgba(0,0,0,0.1)">
                <div class="container">
                    <a href="/" class="navbar-brand d-flex align-items-center" onclick="router.navigate('/')">
                        <i class="fas fa-ticket-alt me-2" style="font-size: 1.5rem;"></i>
                        <span class="fw-bold">Sistema de Tickets</span>
                    </a>
                    <div class="navbar-nav ms-auto d-flex flex-row align-items-center">
                        ${window.currentUser ? `
                            <span class="navbar-text me-3 text-light">
                                Bienvenido, <strong>${window.currentUser.username}</strong>
                                <span class="badge bg-warning text-dark ms-2">${window.currentUser.role}</span>
                            </span>
                            ${window.currentUser.role === 'admin' ? `
                                <a href="/admin-tickets" class="nav-link me-2" onclick="router.navigate('/admin-tickets')">Admin Tickets</a>
                                <a href="/admin-users" class="nav-link me-2" onclick="router.navigate('/admin-users')">Admin Usuarios</a>
                            ` : ''}
                            <a href="/create-ticket" class="nav-link me-2" onclick="router.navigate('/create-ticket')">Crear Ticket</a>
                            <button class="btn btn-outline-light btn-sm" onclick="logout()">
                                <i class="fas fa-sign-out-alt me-1"></i>Cerrar Sesión
                            </button>
                        ` : `
                            <a href="/login" class="nav-link" onclick="router.navigate('/login')">
                                <i class="fas fa-sign-in-alt me-1"></i>Iniciar Sesión
                            </a>
                        `}
                    </div>
                </div>
            </nav>
        `;
    },
    
    renderHome() {
        document.getElementById('app').innerHTML = `
            <div class="h-100">
                ${this.renderNavbar()}
                <div style="min-height: 80vh; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);">
                    <div class="container py-5">
                        <div class="row align-items-center mb-5">
                            <div class="col-lg-6">
                                <h1 class="display-4 fw-bold text-primary mb-4">
                                    <i class="fas fa-ticket-alt me-3"></i>
                                    Sistema de Tickets
                                </h1>
                                <p class="lead mb-4">
                                    Gestiona y resuelve tickets de soporte de manera eficiente.
                                    Plataforma completa para atención al cliente y soporte técnico.
                                </p>
                                <div class="d-flex gap-3 mb-3">
                                    ${!window.currentUser ? `
                                        <button class="btn btn-danger btn-lg" onclick="initDatabase()">
                                            <i class="fas fa-database me-2"></i>
                                            Inicializar Base de Datos
                                        </button>
                                        <button class="btn btn-primary btn-lg" onclick="router.navigate('/login')">
                                            <i class="fas fa-sign-in-alt me-2"></i>
                                            Iniciar Sesión
                                        </button>
                                    ` : `
                                        <button class="btn btn-primary btn-lg" onclick="router.navigate('/create-ticket')">
                                            <i class="fas fa-plus me-2"></i>
                                            Crear Ticket
                                        </button>
                                        ${window.currentUser.role === 'admin' ? `
                                            <button class="btn btn-success btn-lg" onclick="router.navigate('/admin-tickets')">
                                                <i class="fas fa-tasks me-2"></i>
                                                Ver Tickets
                                            </button>
                                        ` : ''}
                                    `}
                                </div>
                                ${!window.currentUser ? `
                                    <div class="alert alert-warning">
                                        <strong>⚠️ PASO 1:</strong> Haz clic en "Inicializar Base de Datos" primero.<br>
                                        <strong>📝 PASO 2:</strong> Luego usa las credenciales para iniciar sesión.<br><br>
                                        <strong>Usuarios disponibles:</strong><br>
                                        • admin / admin123 (administrador)<br>
                                        • user / user123 (usuario)<br>
                                        • Levi / Leaguejinx1310- (administrador)
                                    </div>
                                ` : ''}
                            </div>
                            <div class="col-lg-6">
                                <div class="text-center">
                                    <i class="fas fa-headset text-primary" style="font-size: 8rem; opacity: 0.7;"></i>
                                </div>
                            </div>
                        </div>

                        <!-- Features Section -->
                        <div class="row">
                            <div class="col-md-4 mb-4">
                                <div class="card h-100 shadow-sm">
                                    <div class="card-body text-center">
                                        <i class="fas fa-ticket-alt text-primary mb-3" style="font-size: 3rem;"></i>
                                        <h5 class="card-title">Crear Tickets</h5>
                                        <p class="card-text">Reporta problemas o solicita soporte de manera fácil y rápida.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 mb-4">
                                <div class="card h-100 shadow-sm">
                                    <div class="card-body text-center">
                                        <i class="fas fa-chart-line text-success mb-3" style="font-size: 3rem;"></i>
                                        <h5 class="card-title">Seguimiento</h5>
                                        <p class="card-text">Monitorea el estado de tus tickets en tiempo real.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4 mb-4">
                                <div class="card h-100 shadow-sm">
                                    <div class="card-body text-center">
                                        <i class="fas fa-users text-info mb-3" style="font-size: 3rem;"></i>
                                        <h5 class="card-title">Gestión</h5>
                                        <p class="card-text">Administra tickets y usuarios desde un panel centralizado.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ${this.renderFooter()}
            </div>
        `;
    },
    
    renderLogin() {
        document.getElementById('app').innerHTML = `
            <div class="h-100">
                ${this.renderNavbar()}
                <div style="min-height: 80vh; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); display: flex; align-items: center;">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-md-6">
                                <div class="card shadow-lg border-0">
                                    <div class="card-body p-5">
                                        <div class="text-center mb-4">
                                            <i class="fas fa-user-circle text-primary mb-3" style="font-size: 4rem;"></i>
                                            <h3>Iniciar Sesión</h3>
                                        </div>
                                        <form id="loginForm">
                                            <div class="mb-3">
                                                <label for="username" class="form-label">Nombre de Usuario</label>
                                                <input type="text" class="form-control" id="username" required>
                                            </div>
                                            <div class="mb-3">
                                                <label for="password" class="form-label">Contraseña</label>
                                                <input type="password" class="form-control" id="password" required>
                                            </div>
                                            <button type="submit" class="btn btn-primary w-100">
                                                <i class="fas fa-sign-in-alt me-2"></i>
                                                Iniciar Sesión
                                            </button>
                                        </form>
                                        <div id="loginMessage" class="mt-3"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Configurar el formulario de login
        document.getElementById('loginForm').addEventListener('submit', handleLogin);
    },
    
    renderCreateTicket() {
        if (!window.currentUser) {
            this.navigate('/login');
            return;
        }
        
        document.getElementById('app').innerHTML = `
            <div class="h-100">
                ${this.renderNavbar()}
                <div style="min-height: 80vh; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding-top: 2rem;">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-md-8">
                                <div class="card shadow-lg border-0">
                                    <div class="card-header bg-primary text-white">
                                        <h4 class="mb-0">
                                            <i class="fas fa-plus me-2"></i>
                                            Crear Nuevo Ticket
                                        </h4>
                                    </div>
                                    <div class="card-body p-4">
                                        <form id="ticketForm">
                                            <div class="row">
                                                <div class="col-md-12 mb-3">
                                                    <label for="title" class="form-label">Título *</label>
                                                    <input type="text" class="form-control" id="title" required>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-6 mb-3">
                                                    <label for="priority" class="form-label">Prioridad</label>
                                                    <select class="form-select" id="priority">
                                                        <option value="low">Baja</option>
                                                        <option value="medium" selected>Media</option>
                                                        <option value="high">Alta</option>
                                                        <option value="urgent">Urgente</option>
                                                    </select>
                                                </div>
                                                <div class="col-md-6 mb-3">
                                                    <label for="category" class="form-label">Categoría</label>
                                                    <select class="form-select" id="category">
                                                        <option value="general" selected>General</option>
                                                        <option value="technical">Técnico</option>
                                                        <option value="billing">Facturación</option>
                                                        <option value="other">Otro</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="mb-3">
                                                <label for="description" class="form-label">Descripción *</label>
                                                <textarea class="form-control" id="description" rows="4" required placeholder="Describe tu problema o solicitud detalladamente..."></textarea>
                                            </div>
                                            <div class="d-flex gap-2">
                                                <button type="submit" class="btn btn-primary">
                                                    <i class="fas fa-save me-2"></i>
                                                    Crear Ticket
                                                </button>
                                                <button type="button" class="btn btn-secondary" onclick="router.navigate('/')">
                                                    <i class="fas fa-arrow-left me-2"></i>
                                                    Volver
                                                </button>
                                            </div>
                                        </form>
                                        <div id="ticketMessage" class="mt-3"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                ${this.renderFooter()}
            </div>
        `;
        
        // Configurar el formulario de ticket
        document.getElementById('ticketForm').addEventListener('submit', handleCreateTicket);
    },
    
    renderAdminTickets() {
        if (!window.currentUser || window.currentUser.role !== 'admin') {
            this.navigate('/login');
            return;
        }
        
        document.getElementById('app').innerHTML = `
            <div class="h-100">
                ${this.renderNavbar()}
                <div style="min-height: 80vh; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding-top: 2rem;">
                    <div class="container">
                        <div class="card shadow-lg border-0">
                            <div class="card-header bg-primary text-white">
                                <h4 class="mb-0">
                                    <i class="fas fa-tasks me-2"></i>
                                    Panel de Administración - Tickets
                                </h4>
                            </div>
                            <div class="card-body">
                                <div id="ticketsContainer">
                                    <div class="text-center p-4">
                                        <i class="fas fa-spinner fa-spin fa-2x text-primary mb-3"></i>
                                        <p>Cargando tickets...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Cargar tickets
        loadAdminTickets();
    },
    
    renderAdminUsers() {
        if (!window.currentUser || window.currentUser.role !== 'admin') {
            this.navigate('/login');
            return;
        }
        
        document.getElementById('app').innerHTML = `
            <div class="h-100">
                ${this.renderNavbar()}
                <div style="min-height: 80vh; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding-top: 2rem;">
                    <div class="container">
                        <div class="card shadow-lg border-0">
                            <div class="card-header bg-primary text-white">
                                <h4 class="mb-0">
                                    <i class="fas fa-users me-2"></i>
                                    Administrar Usuarios
                                </h4>
                            </div>
                            <div class="card-body">
                                <div id="usersContainer">
                                    <div class="text-center p-4">
                                        <i class="fas fa-spinner fa-spin fa-2x text-primary mb-3"></i>
                                        <p>Cargando usuarios...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Cargar usuarios
        loadAdminUsers();
    },
    
    renderFooter() {
        return `
            <footer class="bg-dark text-white py-4 mt-auto">
                <div class="container">
                    <div class="row">
                        <div class="col-md-6">
                            <h5><i class="fas fa-ticket-alt me-2"></i>Sistema de Tickets</h5>
                            <p class="mb-0">Plataforma completa para gestión de soporte técnico y atención al cliente.</p>
                        </div>
                        <div class="col-md-3">
                            <h6>Enlaces Rápidos</h6>
                            <ul class="list-unstyled">
                                <li><a href="/" class="text-light" onclick="router.navigate('/')">Inicio</a></li>
                                <li><a href="/login" class="text-light" onclick="router.navigate('/login')">Iniciar Sesión</a></li>
                                ${window.currentUser ? `
                                    <li><a href="/create-ticket" class="text-light" onclick="router.navigate('/create-ticket')">Crear Ticket</a></li>
                                ` : ''}
                            </ul>
                        </div>
                        <div class="col-md-3">
                            <h6>Contacto</h6>
                            <p class="mb-1"><i class="fas fa-envelope me-2"></i>soporte@tickets.com</p>
                            <p class="mb-1"><i class="fas fa-phone me-2"></i>+1 (555) 123-4567</p>
                            <p class="mb-0"><i class="fas fa-clock me-2"></i>24/7 Disponible</p>
                        </div>
                    </div>
                    <hr class="my-3">
                    <div class="row align-items-center">
                        <div class="col-md-6">
                            <p class="mb-0">&copy; 2025 Sistema de Tickets. Todos los derechos reservados.</p>
                        </div>
                        <div class="col-md-6 text-md-end">
                            <small class="text-muted">Versión 1.0.0 | Desarrollado con Flask & Bootstrap</small>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    }
};

// Función para hacer peticiones al backend
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${window.BACKEND_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        return response;
    } catch (error) {
        console.error('Error en petición:', error);
        throw error;
    }
}

// Manejar login
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('loginMessage');
    
    try {
        const response = await fetchAPI('/api/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            window.currentUser = data;
            messageDiv.innerHTML = '<div class="alert alert-success">Login exitoso</div>';
            setTimeout(() => router.navigate('/'), 1000);
        } else {
            messageDiv.innerHTML = `<div class="alert alert-danger">${data.msg}</div>`;
        }
    } catch (error) {
        messageDiv.innerHTML = '<div class="alert alert-danger">Error de conexión</div>';
    }
}

// Manejar crear ticket
async function handleCreateTicket(e) {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const priority = document.getElementById('priority').value;
    const category = document.getElementById('category').value;
    const messageDiv = document.getElementById('ticketMessage');
    
    try {
        const response = await fetchAPI('/api/ticket', {
            method: 'POST',
            body: JSON.stringify({
                title,
                description,
                priority,
                category,
                user_id: window.currentUser.id
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            messageDiv.innerHTML = '<div class="alert alert-success">Ticket creado exitosamente</div>';
            document.getElementById('ticketForm').reset();
        } else {
            messageDiv.innerHTML = `<div class="alert alert-danger">${data.msg}</div>`;
        }
    } catch (error) {
        messageDiv.innerHTML = '<div class="alert alert-danger">Error de conexión</div>';
    }
}

// Cargar tickets del admin con funcionalidades completas
async function loadAdminTickets() {
    try {
        const response = await fetchAPI(`/api/tickets?user_id=${window.currentUser.id}`);
        const data = await response.json();
        
        const container = document.getElementById('ticketsContainer');
        
        if (response.ok && data.length > 0) {
            container.innerHTML = `
                <div class="d-flex justify-content-between mb-3">
                    <h5>Total de Tickets: ${data.length}</h5>
                    <button class="btn btn-success" onclick="exportTickets()">
                        <i class="fas fa-file-excel me-1"></i> Exportar a Excel
                    </button>
                </div>
                
                <!-- Filtros -->
                <div class="row mb-3">
                    <div class="col-md-3">
                        <select class="form-select" id="statusFilter" onchange="filterTickets()">
                            <option value="">Todos los estados</option>
                            <option value="open">Abierto</option>
                            <option value="pending">Pendiente</option>
                            <option value="in_progress">En Progreso</option>
                            <option value="closed">Cerrado</option>
                        </select>
                    </div>
                    <div class="col-md-3">
                        <select class="form-select" id="priorityFilter" onchange="filterTickets()">
                            <option value="">Todas las prioridades</option>
                            <option value="low">Baja</option>
                            <option value="medium">Media</option>
                            <option value="high">Alta</option>
                            <option value="urgent">Urgente</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <input type="text" class="form-control" id="searchTickets" placeholder="Buscar tickets..." onkeyup="filterTickets()">
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="table table-hover" id="ticketsTable">
                        <thead class="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Título</th>
                                <th>Prioridad</th>
                                <th>Estado</th>
                                <th>Categoría</th>
                                <th>Usuario</th>
                                <th>Creado</th>
                                <th>Actualizado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(ticket => `
                                <tr data-ticket-id="${ticket.id}" data-status="${ticket.status}" data-priority="${ticket.priority}">
                                    <td><span class="badge bg-primary">#${ticket.id}</span></td>
                                    <td>
                                        <strong>${ticket.title}</strong><br>
                                        <small class="text-muted">${ticket.description.substring(0, 50)}${ticket.description.length > 50 ? '...' : ''}</small>
                                    </td>
                                    <td><span class="badge bg-${getPriorityColor(ticket.priority)}">${getPriorityText(ticket.priority)}</span></td>
                                    <td><span class="badge bg-${getStatusColor(ticket.status)}">${getStatusText(ticket.status)}</span></td>
                                    <td><span class="badge bg-info">${getCategoryText(ticket.category)}</span></td>
                                    <td><span class="badge bg-secondary">ID: ${ticket.user_id}</span></td>
                                    <td><small>${formatDate(ticket.created_at)}</small></td>
                                    <td><small>${formatDate(ticket.updated_at)}</small></td>
                                    <td>
                                        <div class="btn-group btn-group-sm">
                                            <button class="btn btn-outline-primary" onclick="viewTicket(${ticket.id})" title="Ver detalles">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="btn btn-outline-warning" onclick="editTicket(${ticket.id})" title="Editar">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <div class="btn-group btn-group-sm">
                                                <button class="btn btn-outline-success dropdown-toggle" data-bs-toggle="dropdown" title="Cambiar estado">
                                                    <i class="fas fa-tasks"></i>
                                                </button>
                                                <ul class="dropdown-menu">
                                                    <li><a class="dropdown-item" onclick="changeTicketStatus(${ticket.id}, 'open')">Abierto</a></li>
                                                    <li><a class="dropdown-item" onclick="changeTicketStatus(${ticket.id}, 'pending')">Pendiente</a></li>
                                                    <li><a class="dropdown-item" onclick="changeTicketStatus(${ticket.id}, 'in_progress')">En Progreso</a></li>
                                                    <li><a class="dropdown-item" onclick="changeTicketStatus(${ticket.id}, 'closed')">Cerrado</a></li>
                                                </ul>
                                            </div>
                                            <button class="btn btn-outline-danger" onclick="deleteTicket(${ticket.id})" title="Eliminar">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>

                <!-- Estadísticas -->
                <div class="row mt-4">
                    <div class="col-md-3">
                        <div class="card bg-success text-white">
                            <div class="card-body">
                                <h5>${data.filter(t => t.status === 'open').length}</h5>
                                <p class="mb-0">Abiertos</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card bg-warning text-white">
                            <div class="card-body">
                                <h5>${data.filter(t => t.status === 'pending').length}</h5>
                                <p class="mb-0">Pendientes</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card bg-info text-white">
                            <div class="card-body">
                                <h5>${data.filter(t => t.status === 'in_progress').length}</h5>
                                <p class="mb-0">En Progreso</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card bg-secondary text-white">
                            <div class="card-body">
                                <h5>${data.filter(t => t.status === 'closed').length}</h5>
                                <p class="mb-0">Cerrados</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="text-center p-4">
                    <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                    <h5>No hay tickets disponibles</h5>
                    <p class="text-muted">Los tickets aparecerán aquí cuando se creen</p>
                </div>
            `;
        }
    } catch (error) {
        document.getElementById('ticketsContainer').innerHTML = '<div class="alert alert-danger">Error al cargar tickets</div>';
    }
}

// Cargar usuarios del admin
async function loadAdminUsers() {
    try {
        const response = await fetchAPI(`/api/admin/users?admin_id=${window.currentUser.id}`);
        const data = await response.json();
        
        const container = document.getElementById('usersContainer');
        
        if (response.ok && data.length > 0) {
            container.innerHTML = `
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Rol</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(user => `
                                <tr>
                                    <td><span class="badge bg-primary">#${user.id}</span></td>
                                    <td><strong>${user.username}</strong></td>
                                    <td>${user.email}</td>
                                    <td><span class="badge bg-${user.role === 'admin' ? 'warning' : 'secondary'}">${user.role}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } else {
            container.innerHTML = '<div class="text-center p-4"><p>No hay usuarios disponibles</p></div>';
        }
    } catch (error) {
        document.getElementById('usersContainer').innerHTML = '<div class="alert alert-danger">Error al cargar usuarios</div>';
    }
}

// Función para crear usuarios de prueba
async function createTestUsers() {
    try {
        const response = await fetchAPI('/api/create-test-users', {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Usuarios de prueba creados exitosamente!\n\nUsuarios disponibles:\n- admin / admin123 (admin)\n- user / user123 (user)\n- Levi / Leaguejinx1310- (admin)');
        } else {
            alert(`Error: ${data.msg}`);
        }
    } catch (error) {
        alert('Error de conexión al crear usuarios');
    }
}

// Función para inicializar la base de datos
async function initDatabase() {
    try {
        const response = await fetchAPI('/api/init-database', {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Base de datos inicializada correctamente!\n\nTablas creadas y usuarios disponibles:\n- admin / admin123 (admin)\n- user / user123 (user)\n- Levi / Leaguejinx1310- (admin)');
            return true;
        } else {
            alert(`Error: ${data.msg}`);
            return false;
        }
    } catch (error) {
        alert('Error de conexión al inicializar base de datos');
        return false;
    }
}

// Logout
function logout() {
    window.currentUser = null;
    router.navigate('/');
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Manejar navegación del navegador
    window.addEventListener('popstate', function() {
        router.currentPath = window.location.pathname;
        router.render();
    });
    
    // Manejar clicks en enlaces
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="/"]')) {
            e.preventDefault();
            const href = e.target.getAttribute('href');
            router.navigate(href);
        }
    });
    
    // Renderizar la página inicial
    router.currentPath = window.location.pathname;
    router.render();
});

console.log("Sistema de Tickets con Router cargado correctamente");

// Funciones auxiliares para formatear datos
function getPriorityColor(priority) {
    const colors = {
        'low': 'success',
        'medium': 'warning',
        'high': 'danger',
        'urgent': 'dark'
    };
    return colors[priority] || 'secondary';
}

function getPriorityText(priority) {
    const texts = {
        'low': 'Baja',
        'medium': 'Media',
        'high': 'Alta',
        'urgent': 'Urgente'
    };
    return texts[priority] || priority;
}

function getStatusColor(status) {
    const colors = {
        'open': 'success',
        'pending': 'warning',
        'in_progress': 'info',
        'closed': 'secondary'
    };
    return colors[status] || 'primary';
}

function getStatusText(status) {
    const texts = {
        'open': 'Abierto',
        'pending': 'Pendiente',
        'in_progress': 'En Progreso',
        'closed': 'Cerrado'
    };
    return texts[status] || status;
}

function getCategoryText(category) {
    const texts = {
        'general': 'General',
        'technical': 'Técnico',
        'billing': 'Facturación',
        'other': 'Otro'
    };
    return texts[category] || category;
}

function formatDate(dateString) {
    if (!dateString || dateString === '2025-01-01 00:00:00') return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Funciones para manejar tickets
async function viewTicket(ticketId) {
    try {
        const response = await fetchAPI(`/api/ticket/${ticketId}?user_id=${window.currentUser.id}`);
        const data = await response.json();
        
        if (response.ok) {
            const modalHtml = `
                <div class="modal fade" id="ticketModal" tabindex="-1">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Ticket #${data.id}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <h6>Título:</h6>
                                        <p>${data.title}</p>
                                    </div>
                                    <div class="col-md-6">
                                        <h6>Estado:</h6>
                                        <span class="badge bg-${getStatusColor(data.status)}">${getStatusText(data.status)}</span>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-md-6">
                                        <h6>Prioridad:</h6>
                                        <span class="badge bg-${getPriorityColor(data.priority)}">${getPriorityText(data.priority)}</span>
                                    </div>
                                    <div class="col-md-6">
                                        <h6>Categoría:</h6>
                                        <span class="badge bg-info">${getCategoryText(data.category)}</span>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-md-6">
                                        <h6>Creado:</h6>
                                        <p>${formatDate(data.created_at)}</p>
                                    </div>
                                    <div class="col-md-6">
                                        <h6>Actualizado:</h6>
                                        <p>${formatDate(data.updated_at)}</p>
                                    </div>
                                </div>
                                <div class="mt-3">
                                    <h6>Descripción:</h6>
                                    <p>${data.description}</p>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            const modal = new bootstrap.Modal(document.getElementById('ticketModal'));
            modal.show();
            
            // Limpiar modal después de cerrarlo
            document.getElementById('ticketModal').addEventListener('hidden.bs.modal', function() {
                this.remove();
            });
        } else {
            alert(`Error: ${data.msg}`);
        }
    } catch (error) {
        alert('Error al cargar ticket');
    }
}

async function editTicket(ticketId) {
    try {
        const response = await fetchAPI(`/api/ticket/${ticketId}?user_id=${window.currentUser.id}`);
        const data = await response.json();
        
        if (response.ok) {
            const modalHtml = `
                <div class="modal fade" id="editTicketModal" tabindex="-1">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Editar Ticket #${data.id}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <form id="editTicketForm">
                                    <div class="mb-3">
                                        <label for="editTitle" class="form-label">Título</label>
                                        <input type="text" class="form-control" id="editTitle" value="${data.title}" required>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label for="editPriority" class="form-label">Prioridad</label>
                                            <select class="form-select" id="editPriority" ${window.currentUser.role !== 'admin' ? 'disabled' : ''}>
                                                <option value="low" ${data.priority === 'low' ? 'selected' : ''}>Baja</option>
                                                <option value="medium" ${data.priority === 'medium' ? 'selected' : ''}>Media</option>
                                                <option value="high" ${data.priority === 'high' ? 'selected' : ''}>Alta</option>
                                                <option value="urgent" ${data.priority === 'urgent' ? 'selected' : ''}>Urgente</option>
                                            </select>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label for="editCategory" class="form-label">Categoría</label>
                                            <select class="form-select" id="editCategory" ${window.currentUser.role !== 'admin' ? 'disabled' : ''}>
                                                <option value="general" ${data.category === 'general' ? 'selected' : ''}>General</option>
                                                <option value="technical" ${data.category === 'technical' ? 'selected' : ''}>Técnico</option>
                                                <option value="billing" ${data.category === 'billing' ? 'selected' : ''}>Facturación</option>
                                                <option value="other" ${data.category === 'other' ? 'selected' : ''}>Otro</option>
                                            </select>
                                        </div>
                                    </div>
                                    ${window.currentUser.role === 'admin' ? `
                                        <div class="mb-3">
                                            <label for="editStatus" class="form-label">Estado</label>
                                            <select class="form-select" id="editStatus">
                                                <option value="open" ${data.status === 'open' ? 'selected' : ''}>Abierto</option>
                                                <option value="pending" ${data.status === 'pending' ? 'selected' : ''}>Pendiente</option>
                                                <option value="in_progress" ${data.status === 'in_progress' ? 'selected' : ''}>En Progreso</option>
                                                <option value="closed" ${data.status === 'closed' ? 'selected' : ''}>Cerrado</option>
                                            </select>
                                        </div>
                                    ` : ''}
                                    <div class="mb-3">
                                        <label for="editDescription" class="form-label">Descripción</label>
                                        <textarea class="form-control" id="editDescription" rows="4" required>${data.description}</textarea>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-primary" onclick="saveTicketEdit(${ticketId})">Guardar Cambios</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            const modal = new bootstrap.Modal(document.getElementById('editTicketModal'));
            modal.show();
            
            // Limpiar modal después de cerrarlo
            document.getElementById('editTicketModal').addEventListener('hidden.bs.modal', function() {
                this.remove();
            });
        } else {
            alert(`Error: ${data.msg}`);
        }
    } catch (error) {
        alert('Error al cargar ticket para editar');
    }
}

async function saveTicketEdit(ticketId) {
    const title = document.getElementById('editTitle').value;
    const description = document.getElementById('editDescription').value;
    const priority = document.getElementById('editPriority').value;
    const category = document.getElementById('editCategory').value;
    const status = document.getElementById('editStatus') ? document.getElementById('editStatus').value : undefined;
    
    try {
        const body = {
            title,
            description,
            priority,
            category,
            user_id: window.currentUser.id
        };
        
        if (status) {
            body.status = status;
        }
        
        const response = await fetchAPI(`/api/ticket/${ticketId}`, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Ticket actualizado exitosamente');
            bootstrap.Modal.getInstance(document.getElementById('editTicketModal')).hide();
            loadAdminTickets(); // Recargar la lista
        } else {
            alert(`Error: ${data.msg}`);
        }
    } catch (error) {
        alert('Error al actualizar ticket');
    }
}

async function changeTicketStatus(ticketId, newStatus) {
    try {
        const response = await fetchAPI(`/api/ticket/${ticketId}/status`, {
            method: 'PUT',
            body: JSON.stringify({
                status: newStatus,
                admin_id: window.currentUser.id
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert(`Estado cambiado a: ${getStatusText(newStatus)}`);
            loadAdminTickets(); // Recargar la lista
        } else {
            alert(`Error: ${data.msg}`);
        }
    } catch (error) {
        alert('Error al cambiar estado del ticket');
    }
}

async function deleteTicket(ticketId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este ticket?')) {
        return;
    }
    
    try {
        const response = await fetchAPI(`/api/ticket/${ticketId}?user_id=${window.currentUser.id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Ticket eliminado exitosamente');
            loadAdminTickets(); // Recargar la lista
        } else {
            alert(`Error: ${data.msg}`);
        }
    } catch (error) {
        alert('Error al eliminar ticket');
    }
}

async function exportTickets() {
    try {
        const response = await fetchAPI(`/api/admin/export_tickets?admin_id=${window.currentUser.id}`);
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tickets_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } else {
            alert('Error al exportar tickets');
        }
    } catch (error) {
        alert('Error al exportar tickets');
    }
}

// Función para filtrar tickets
function filterTickets() {
    const statusFilter = document.getElementById('statusFilter').value;
    const priorityFilter = document.getElementById('priorityFilter').value;
    const searchText = document.getElementById('searchTickets').value.toLowerCase();
    
    const rows = document.querySelectorAll('#ticketsTable tbody tr');
    
    rows.forEach(row => {
        const status = row.getAttribute('data-status');
        const priority = row.getAttribute('data-priority');
        const text = row.textContent.toLowerCase();
        
        const matchesStatus = !statusFilter || status === statusFilter;
        const matchesPriority = !priorityFilter || priority === priorityFilter;
        const matchesSearch = !searchText || text.includes(searchText);
        
        if (matchesStatus && matchesPriority && matchesSearch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}