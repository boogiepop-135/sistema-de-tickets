import React from "react";

export const Footer = () => (
	<footer className="mt-auto py-4" style={{
		background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
		color: 'white'
	}}>
		<div className="container">
			<div className="row">
				<div className="col-md-6">
					<h5 className="mb-3">
						<i className="fas fa-ticket-alt me-2"></i>
						TicketSystem
					</h5>
					<p className="mb-0">
						Sistema de gestión de tickets para soporte técnico y atención al cliente.
					</p>
				</div>
				<div className="col-md-3">
					<h6 className="mb-3">Enlaces</h6>
					<ul className="list-unstyled">
						<li><a href="#" className="text-light text-decoration-none">Soporte</a></li>
						<li><a href="#" className="text-light text-decoration-none">Documentación</a></li>
						<li><a href="#" className="text-light text-decoration-none">Contacto</a></li>
					</ul>
				</div>
				<div className="col-md-3">
					<h6 className="mb-3">Síguenos</h6>
					<div>
						<a href="#" className="text-light me-3"><i className="fab fa-twitter fa-lg"></i></a>
						<a href="#" className="text-light me-3"><i className="fab fa-github fa-lg"></i></a>
						<a href="#" className="text-light"><i className="fab fa-linkedin fa-lg"></i></a>
					</div>
				</div>
			</div>
			<hr className="my-4" style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
			<div className="row align-items-center">
				<div className="col-md-6">
					<p className="mb-0">&copy; 2025 TicketSystem. Todos los derechos reservados.</p>
				</div>
				<div className="col-md-6 text-md-end">
					<p className="mb-0">
						Hecho con <i className="fas fa-heart text-danger"></i> por
						<span className="text-light fw-bold ms-1">Boogiepop135</span>
					</p>
				</div>
			</div>
		</div>
	</footer>
);
