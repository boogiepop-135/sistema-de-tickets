// Temporary bundle.js - will be replaced by build process
console.log("Loading React app...");

// Set backend URL if not defined
if (!window.import) {
    window.import = { meta: { env: { VITE_BACKEND_URL: "https://sample-service-name-8sgu.onrender.com" } } };
}

// Basic app initialization
document.addEventListener('DOMContentLoaded', function() {
    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = '<div class="container mt-5"><h1>Sistema de Tickets</h1><p>Cargando aplicación...</p></div>';
    }
});