import React from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

export const Home = () => {
	const { user } = useAuth();

	return (
		<div style={{ minHeight: '80vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
			<div className="container py-5">
				{/* Hero Section */}
				<div className="row align-items-center mb-5">
					<div className="col-lg-6">
						<h1 className="display-4 fw-bold text-primary mb-4">
							<i className="fas fa-ticket-alt me-3"></i>
							Sistema de Tickets
						</h1>
						<p className="lead mb-4">
							Gestiona y resuelve tickets de soporte de manera eficiente.
							Plataforma completa para atención al cliente y soporte técnico.
						</p>
						{!user ? (
							<div className="d-flex gap-3">
								<Link to="/login" className="btn btn-primary btn-lg">
									<i className="fas fa-sign-in-alt me-2"></i>
									Iniciar Sesión
								</Link>
								<Link to="/register" className="btn btn-outline-primary btn-lg">
									<i className="fas fa-user-plus me-2"></i>
									Registrarse
								</Link>
							</div>
						) : (
							<div className="d-flex gap-3">
								<Link to="/create-ticket" className="btn btn-success btn-lg">
									<i className="fas fa-plus me-2"></i>
									Crear Ticket
								</Link>
								{user.role === 'admin' && (
									<Link to="/admin-tickets" className="btn btn-info btn-lg">
										<i className="fas fa-tasks me-2"></i>
										Ver Tickets
									</Link>
								)}
							</div>
						)}
					</div>
					<div className="col-lg-6 text-center">
						<div className="p-4">
							<i className="fas fa-headset" style={{ fontSize: '8rem', color: '#667eea' }}></i>
						</div>
					</div>
				</div>

				{/* Features Section */}
				<div className="row mb-5">
					<div className="col-md-4 mb-4">
						<div className="card h-100 shadow-sm border-0">
							<div className="card-body text-center p-4">
								<i className="fas fa-rocket text-primary mb-3" style={{ fontSize: '3rem' }}></i>
								<h5 className="card-title">Rápido y Eficiente</h5>
								<p className="card-text">
									Crea y gestiona tickets de soporte de manera rápida y sencilla.
								</p>
							</div>
						</div>
					</div>
					<div className="col-md-4 mb-4">
						<div className="card h-100 shadow-sm border-0">
							<div className="card-body text-center p-4">
								<i className="fas fa-shield-alt text-success mb-3" style={{ fontSize: '3rem' }}></i>
								<h5 className="card-title">Seguro y Confiable</h5>
								<p className="card-text">
									Tus datos están protegidos con los más altos estándares de seguridad.
								</p>
							</div>
						</div>
					</div>
					<div className="col-md-4 mb-4">
						<div className="card h-100 shadow-sm border-0">
							<div className="card-body text-center p-4">
								<i className="fas fa-users text-info mb-3" style={{ fontSize: '3rem' }}></i>
								<h5 className="card-title">Colaborativo</h5>
								<p className="card-text">
									Permite la colaboración entre equipos para resolver problemas eficientemente.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}; 