// Sistema de Tickets - Bundle.js
console.log("Inicializando Sistema de Tickets...");

// Configurar URL del backend
window.BACKEND_URL = "https://sample-service-name-8sgu.onrender.com";

// Función para manejar la navegación
function navigate(path) {
    window.location.href = path;
}

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

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    const app = document.getElementById('app');
    if (!app) return;

    // HTML básico de la aplicación
    app.innerHTML = `
        <div class="h-100">
            <nav class="navbar navbar-expand-lg navbar-dark" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); box-shadow: 0 4px 20px rgba(0,0,0,0.1)">
                <div class="container">
                    <a href="/" class="navbar-brand d-flex align-items-center">
                        <i class="fas fa-ticket-alt me-2" style="font-size: 1.5rem;"></i>
                        <span class="fw-bold">Sistema de Tickets</span>
                    </a>
                    <div class="navbar-nav ms-auto">
                        <a href="/login" class="nav-link">Iniciar Sesión</a>
                    </div>
                </div>
            </nav>

            <div style="min-height: 80vh; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);">
                <div class="container py-5" id="main-content">
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
                            <div class="d-flex gap-3">
                                <button class="btn btn-primary btn-lg" onclick="navigate('/login')">
                                    <i class="fas fa-sign-in-alt me-2"></i>
                                    Iniciar Sesión
                                </button>
                                <button class="btn btn-outline-primary btn-lg" onclick="showCreateTicketForm()">
                                    <i class="fas fa-plus me-2"></i>
                                    Crear Ticket
                                </button>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="text-center">
                                <i class="fas fa-headset text-primary" style="font-size: 8rem; opacity: 0.7;"></i>
                            </div>
                        </div>
                    </div>

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

            <footer class="bg-dark text-white py-4 mt-5">
                <div class="container text-center">
                    <p>&copy; 2025 Sistema de Tickets. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    `;

    // Manejar formularios y navegación
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Manejar clicks en enlaces
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="/"]')) {
            e.preventDefault();
            const href = e.target.getAttribute('href');
            navigate(href);
        }
    });
}

// Función para mostrar formulario de crear ticket
function showCreateTicketForm() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card shadow">
                    <div class="card-header bg-primary text-white">
                        <h4 class="mb-0">
                            <i class="fas fa-plus me-2"></i>
                            Crear Nuevo Ticket
                        </h4>
                    </div>
                    <div class="card-body">
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
                                <button type="button" class="btn btn-secondary" onclick="location.reload()">
                                    <i class="fas fa-arrow-left me-2"></i>
                                    Volver
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Manejar envío del formulario
    document.getElementById('ticketForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        
        try {
            const response = await fetchAPI('/api/ticket', {
                method: 'POST',
                body: JSON.stringify({
                    title,
                    description,
                    user_id: 1 // Temporal - debería venir del usuario autenticado
                })
            });
            
            if (response.ok) {
                alert('Ticket creado exitosamente');
                location.reload();
            } else {
                alert('Error al crear ticket');
            }
        } catch (error) {
            alert('Error de conexión');
        }
    });
}

console.log("Sistema de Tickets cargado correctamente");