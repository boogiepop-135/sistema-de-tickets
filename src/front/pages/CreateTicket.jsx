import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const CreateTicket = ({ user }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");
    const [category, setCategory] = useState("general");
    const [msg, setMsg] = useState("");
    const [msgType, setMsgType] = useState("");
    const [loading, setLoading] = useState(false);
    const { user: authUser } = useAuth();

    const currentUser = user || authUser;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            setMsg("Debes iniciar sesión para crear un ticket");
            setMsgType("danger");
            return;
        }

        setMsg("");
        setLoading(true);

        try {
            const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/ticket", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    user_id: currentUser.id,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setMsg("Ticket creado correctamente");
                setMsgType("success");
                setTitle("");
                setDescription("");
                setPriority("medium");
                setCategory("general");
            } else {
                setMsg(data.msg || "Error al crear ticket");
                setMsgType("danger");
            }
        } catch (err) {
            setMsg("Error de red");
            setMsgType("danger");
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) {
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
                                    <i className="fas fa-lock text-warning mb-3" style={{ fontSize: '4rem' }}></i>
                                    <h3>Acceso Restringido</h3>
                                    <p className="text-muted">Debes iniciar sesión para crear tickets</p>
                                    <a href="/login" className="btn btn-primary">
                                        <i className="fas fa-sign-in-alt me-2"></i>
                                        Iniciar Sesión
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '80vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            paddingTop: '2rem'
        }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card shadow-lg border-0">
                            <div className="card-header bg-gradient text-white" style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            }}>
                                <h3 className="card-title mb-0">
                                    <i className="fas fa-plus-circle me-2"></i>
                                    Crear Nuevo Ticket
                                </h3>
                            </div>
                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="title" className="form-label">
                                            <i className="fas fa-heading me-2"></i>
                                            Título del Ticket
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            id="title"
                                            placeholder="Describe brevemente el problema"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label htmlFor="priority" className="form-label">
                                                <i className="fas fa-exclamation-triangle me-2"></i>
                                                Prioridad
                                            </label>
                                            <select
                                                className="form-select"
                                                id="priority"
                                                value={priority}
                                                onChange={(e) => setPriority(e.target.value)}
                                            >
                                                <option value="low">Baja</option>
                                                <option value="medium">Media</option>
                                                <option value="high">Alta</option>
                                                <option value="urgent">Urgente</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="category" className="form-label">
                                                <i className="fas fa-tags me-2"></i>
                                                Categoría
                                            </label>
                                            <select
                                                className="form-select"
                                                id="category"
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                            >
                                                <option value="general">General</option>
                                                <option value="technical">Técnico</option>
                                                <option value="billing">Facturación</option>
                                                <option value="account">Cuenta</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="description" className="form-label">
                                            <i className="fas fa-align-left me-2"></i>
                                            Descripción Detallada
                                        </label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            rows="6"
                                            placeholder="Describe el problema en detalle, incluyendo pasos para reproducirlo si aplica..."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-success btn-lg w-100"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin me-2"></i>
                                                Creando ticket...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-paper-plane me-2"></i>
                                                Enviar Ticket
                                            </>
                                        )}
                                    </button>
                                </form>

                                {msg && (
                                    <div className={`alert alert-${msgType} mt-3`}>
                                        <i className={`fas ${msgType === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} me-2`}></i>
                                        {msg}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTicket;
