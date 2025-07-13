import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

const AdminTickets = ({ user }) => {
    const [tickets, setTickets] = useState([]);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(true);
    const { user: authUser } = useAuth();

    const currentUser = user || authUser;

    useEffect(() => {
        const fetchTickets = async () => {
            if (!currentUser || currentUser.role !== "admin") return;

            setMsg("");
            setLoading(true);

            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tickets?user_id=${currentUser.id}`);
                const data = await res.json();
                if (res.ok) {
                    setTickets(data);
                } else {
                    setMsg(data.msg || "Error al obtener tickets");
                }
            } catch (err) {
                setMsg("Error de red");
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [currentUser]);

    if (!currentUser || currentUser.role !== "admin") {
        return (
            <div style={{
                minHeight: '80vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                display: 'flex',
                alignItems: 'center'
            }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card shadow-lg border-0">
                                <div className="card-body text-center p-5">
                                    <i className="fas fa-shield-alt text-danger mb-3" style={{ fontSize: '4rem' }}></i>
                                    <h3>Acceso Denegado</h3>
                                    <p className="text-muted">Solo los administradores pueden ver esta página</p>
                                    <a href="/" className="btn btn-primary">
                                        <i className="fas fa-home me-2"></i>
                                        Volver al Inicio
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        const badges = {
            'open': 'bg-success',
            'in-progress': 'bg-warning',
            'closed': 'bg-secondary',
            'pending': 'bg-info'
        };
        return badges[status] || 'bg-primary';
    };

    const getPriorityIcon = (priority) => {
        const icons = {
            'urgent': 'fas fa-exclamation-circle text-danger',
            'high': 'fas fa-arrow-up text-warning',
            'medium': 'fas fa-minus text-info',
            'low': 'fas fa-arrow-down text-success'
        };
        return icons[priority] || 'fas fa-minus text-secondary';
    };

    return (
        <div style={{
            minHeight: '80vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            paddingTop: '2rem'
        }}>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow-lg border-0">
                            <div className="card-header bg-gradient text-white" style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            }}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <h3 className="card-title mb-0">
                                        <i className="fas fa-tasks me-2"></i>
                                        Panel de Administración - Tickets
                                    </h3>
                                    <span className="badge bg-light text-dark">
                                        {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>
                            <div className="card-body p-0">
                                {loading ? (
                                    <div className="text-center p-5">
                                        <i className="fas fa-spinner fa-spin fa-2x text-primary mb-3"></i>
                                        <p>Cargando tickets...</p>
                                    </div>
                                ) : msg ? (
                                    <div className="alert alert-danger m-4">
                                        <i className="fas fa-exclamation-triangle me-2"></i>
                                        {msg}
                                    </div>
                                ) : tickets.length === 0 ? (
                                    <div className="text-center p-5">
                                        <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                                        <h5>No hay tickets disponibles</h5>
                                        <p className="text-muted">Los tickets aparecerán aquí cuando los usuarios los creen</p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th scope="col">
                                                        <i className="fas fa-hashtag me-1"></i>
                                                        ID
                                                    </th>
                                                    <th scope="col">
                                                        <i className="fas fa-heading me-1"></i>
                                                        Título
                                                    </th>
                                                    <th scope="col">
                                                        <i className="fas fa-align-left me-1"></i>
                                                        Descripción
                                                    </th>
                                                    <th scope="col">
                                                        <i className="fas fa-info-circle me-1"></i>
                                                        Estado
                                                    </th>
                                                    <th scope="col">
                                                        <i className="fas fa-user me-1"></i>
                                                        Usuario
                                                    </th>
                                                    <th scope="col">
                                                        <i className="fas fa-cogs me-1"></i>
                                                        Acciones
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tickets.map((ticket) => (
                                                    <tr key={ticket.id}>
                                                        <td>
                                                            <span className="badge bg-primary">#{ticket.id}</span>
                                                        </td>
                                                        <td>
                                                            <strong>{ticket.title}</strong>
                                                        </td>
                                                        <td>
                                                            <span className="text-truncate d-inline-block" style={{ maxWidth: '200px' }}>
                                                                {ticket.description}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${getStatusBadge(ticket.status)}`}>
                                                                {ticket.status || 'Abierto'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <span className="badge bg-secondary">
                                                                ID: {ticket.user_id}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="btn-group btn-group-sm">
                                                                <button className="btn btn-outline-primary" title="Ver detalles">
                                                                    <i className="fas fa-eye"></i>
                                                                </button>
                                                                <button className="btn btn-outline-success" title="Marcar como resuelto">
                                                                    <i className="fas fa-check"></i>
                                                                </button>
                                                                <button className="btn btn-outline-danger" title="Eliminar">
                                                                    <i className="fas fa-trash"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                {tickets.length > 0 && (
                    <div className="row mt-4">
                        <div className="col-md-3 mb-3">
                            <div className="card bg-success text-white">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <h4>{tickets.filter(t => t.status === 'open').length}</h4>
                                            <p className="mb-0">Abiertos</p>
                                        </div>
                                        <i className="fas fa-folder-open fa-2x"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3">
                            <div className="card bg-warning text-white">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <h4>{tickets.filter(t => t.status === 'in-progress').length}</h4>
                                            <p className="mb-0">En Progreso</p>
                                        </div>
                                        <i className="fas fa-spinner fa-2x"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3">
                            <div className="card bg-info text-white">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <h4>{tickets.filter(t => t.status === 'pending').length}</h4>
                                            <p className="mb-0">Pendientes</p>
                                        </div>
                                        <i className="fas fa-clock fa-2x"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3">
                            <div className="card bg-secondary text-white">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <h4>{tickets.filter(t => t.status === 'closed').length}</h4>
                                            <p className="mb-0">Cerrados</p>
                                        </div>
                                        <i className="fas fa-check-circle fa-2x"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="d-flex justify-content-end mb-3">
                    <a href="/admin-users" className="btn btn-outline-secondary me-2">
                        <i className="fas fa-users me-1"></i> Administrar Usuarios
                    </a>
                    <button className="btn btn-outline-success" onClick={async () => {
                        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/export_tickets?admin_id=${currentUser.id}`);
                        if (res.ok) {
                            const blob = await res.blob();
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'tickets.xlsx';
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                        } else {
                            setMsg("Error al exportar");
                        }
                    }}>
                        <i className="fas fa-file-excel me-1"></i> Exportar a Excel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminTickets;
