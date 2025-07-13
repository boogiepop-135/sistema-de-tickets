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
                                        <button class="btn btn-primary btn-lg" onclick="router.navigate('/login')">
                                            <i class="fas fa-sign-in-alt me-2"></i>
                                            Iniciar Sesión
                                        </button>
                                        <button class="btn btn-outline-primary btn-lg" onclick="createTestUsers()">
                                            <i class="fas fa-users me-2"></i>
                                            Crear Usuarios de Prueba
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
                                    <div class="alert alert-info">
                                        <strong>Usuarios de prueba:</strong><br>
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
                                            <div class="mb-3">
                                                <label for="title" class="form-label">Título</label>
                                                <input type="text" class="form-control" id="title" required>
                                            </div>
                                            <div class="mb-3">
                                                <label for="description" class="form-label">Descripción</label>
                                                <textarea class="form-control" id="description" rows="4" required></textarea>
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
    const messageDiv = document.getElementById('ticketMessage');
    
    try {
        const response = await fetchAPI('/api/ticket', {
            method: 'POST',
            body: JSON.stringify({
                title,
                description,
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

// Cargar tickets del admin
async function loadAdminTickets() {
    try {
        const response = await fetchAPI(`/api/tickets?user_id=${window.currentUser.id}`);
        const data = await response.json();
        
        const container = document.getElementById('ticketsContainer');
        
        if (response.ok && data.length > 0) {
            container.innerHTML = `
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Título</th>
                                <th>Descripción</th>
                                <th>Estado</th>
                                <th>Usuario</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(ticket => `
                                <tr>
                                    <td><span class="badge bg-primary">#${ticket.id}</span></td>
                                    <td><strong>${ticket.title}</strong></td>
                                    <td>${ticket.description}</td>
                                    <td><span class="badge bg-success">${ticket.status || 'Abierto'}</span></td>
                                    <td><span class="badge bg-secondary">ID: ${ticket.user_id}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        } else {
            container.innerHTML = '<div class="text-center p-4"><p>No hay tickets disponibles</p></div>';
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