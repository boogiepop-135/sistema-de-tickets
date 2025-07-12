import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Navbar = () => {
	const { user, logout } = useAuth();

	return (
		<nav className="navbar navbar-expand-lg navbar-dark" style={{
			background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
			boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
		}}>
			<div className="container">
				<Link to="/" className="navbar-brand d-flex align-items-center">
					<i className="fas fa-ticket-alt me-2" style={{ fontSize: '1.5rem' }}></i>
					<span className="fw-bold">TicketSystem</span>
				</Link>

				<div className="navbar-nav ms-auto d-flex flex-row align-items-center">
					{user ? (
						<>
							<span className="navbar-text me-3 text-light">
								Bienvenido, <strong>{user.email}</strong>
								<span className="badge bg-warning text-dark ms-2">{user.role}</span>
							</span>
							<Link to="/create-ticket" className="btn btn-success me-2">
								<i className="fas fa-plus me-1"></i>Crear Ticket
							</Link>
							{user.role === 'admin' && (
								<Link to="/admin-tickets" className="btn btn-info me-2">
									<i className="fas fa-tasks me-1"></i>Admin Panel
								</Link>
							)}
							<button onClick={logout} className="btn btn-outline-light">
								<i className="fas fa-sign-out-alt me-1"></i>Salir
							</button>
						</>
					) : (
						<Link to="/login" className="btn btn-outline-light">
							<i className="fas fa-sign-in-alt me-1"></i>Iniciar Sesión
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
};