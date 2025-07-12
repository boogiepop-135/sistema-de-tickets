import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                login(data);
                navigate("/");
            } else {
                setError(data.msg || "Error de autenticación");
            }
        } catch (err) {
            setError("Error de red");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '80vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            display: 'flex',
            alignItems: 'center'
        }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="card shadow-lg border-0">
                            <div className="card-body p-5">
                                <div className="text-center mb-4">
                                    <i className="fas fa-user-circle text-primary mb-3" style={{ fontSize: '4rem' }}></i>
                                    <h2 className="card-title">Iniciar Sesión</h2>
                                    <p className="text-muted">Accede a tu cuenta del sistema de tickets</p>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">
                                            <i className="fas fa-user me-2"></i>
                                            Usuario o Email
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            id="email"
                                            placeholder="Boogiepop135 o tu@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label">
                                            <i className="fas fa-lock me-2"></i>
                                            Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control form-control-lg"
                                            id="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg w-100 mb-3"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin me-2"></i>
                                                Iniciando sesión...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-sign-in-alt me-2"></i>
                                                Entrar
                                            </>
                                        )}
                                    </button>
                                </form>

                                {error && (
                                    <div className="alert alert-danger">
                                        <i className="fas fa-exclamation-triangle me-2"></i>
                                        {error}
                                    </div>
                                )}

                                <div className="text-center mt-4">
                                    <p className="text-muted">Usuarios de prueba:</p>
                                    <small className="text-info">
                                        Admin: admin@test.com / admin123<br />
                                        Usuario: user@test.com / user123
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
