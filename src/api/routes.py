"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from src.api.models import db, User, Ticket
from src.api.utils import generate_sitemap, APIException
from flask_cors import CORS
import io
import pandas as pd
from flask import send_file

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


# Registro de usuario
@api.route('/register', methods=['POST'])
def register():
    data = request.json
    if not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({"msg": "Faltan datos (username, email, password)"}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"msg": "El email ya existe"}), 400
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"msg": "El nombre de usuario ya existe"}), 400
    user = User(username=data['username'], email=data['email'], password=data['password'],
                is_active=True, role=data.get('role', 'user'))
    db.session.add(user)
    db.session.commit()
    return jsonify(user.serialize()), 201

# Login de usuario con username


@api.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Buscar por nombre de usuario
    user = User.query.filter_by(username=username, password=password).first()

    if not user:
        return jsonify({"msg": "Credenciales incorrectas"}), 401
    return jsonify(user.serialize()), 200

# Crear ticket


@api.route('/ticket', methods=['POST'])
def create_ticket():
    data = request.json
    user_id = data.get('user_id')
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    
    from datetime import datetime
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    ticket = Ticket(
        title=data['title'],
        description=data['description'],
        status=data.get('status', 'open'),
        priority=data.get('priority', 'medium'),
        category=data.get('category', 'general'),
        created_at=current_time,
        updated_at=current_time,
        user_id=user_id
    )
    db.session.add(ticket)
    db.session.commit()
    return jsonify(ticket.serialize()), 201

# Editar ticket (admin puede cambiar estado, usuario solo titulo/descripcion)
@api.route('/ticket/<int:ticket_id>', methods=['PUT'])
def edit_ticket(ticket_id):
    data = request.json
    user_id = data.get('user_id')
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    
    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify({"msg": "Ticket no encontrado"}), 404
    
    # Solo el creador del ticket o admin puede editarlo
    if ticket.user_id != user_id and user.role != 'admin':
        return jsonify({"msg": "No tienes permisos para editar este ticket"}), 403
    
    from datetime import datetime
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    # Usuarios normales solo pueden editar titulo y descripcion
    if user.role != 'admin':
        ticket.title = data.get('title', ticket.title)
        ticket.description = data.get('description', ticket.description)
    else:
        # Admin puede editar todo
        ticket.title = data.get('title', ticket.title)
        ticket.description = data.get('description', ticket.description)
        ticket.status = data.get('status', ticket.status)
        ticket.priority = data.get('priority', ticket.priority)
        ticket.category = data.get('category', ticket.category)
    
    ticket.updated_at = current_time
    db.session.commit()
    return jsonify(ticket.serialize()), 200

# Eliminar ticket (solo admin o creador)
@api.route('/ticket/<int:ticket_id>', methods=['DELETE'])
def delete_ticket(ticket_id):
    user_id = request.args.get('user_id')
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    
    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify({"msg": "Ticket no encontrado"}), 404
    
    # Solo el creador del ticket o admin puede eliminarlo
    if ticket.user_id != int(user_id) and user.role != 'admin':
        return jsonify({"msg": "No tienes permisos para eliminar este ticket"}), 403
    
    db.session.delete(ticket)
    db.session.commit()
    return jsonify({"msg": "Ticket eliminado exitosamente"}), 200

# Obtener un ticket específico
@api.route('/ticket/<int:ticket_id>', methods=['GET'])
def get_ticket(ticket_id):
    user_id = request.args.get('user_id')
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    
    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify({"msg": "Ticket no encontrado"}), 404
    
    # Solo el creador del ticket o admin puede verlo
    if ticket.user_id != int(user_id) and user.role != 'admin':
        return jsonify({"msg": "No tienes permisos para ver este ticket"}), 403
    
    return jsonify(ticket.serialize()), 200

# Cambiar estado de ticket (solo admin)
@api.route('/ticket/<int:ticket_id>/status', methods=['PUT'])
def change_ticket_status(ticket_id):
    data = request.json
    admin_id = data.get('admin_id')
    admin = User.query.get(admin_id)
    if not admin or admin.role != 'admin':
        return jsonify({"msg": "Solo el admin puede cambiar el estado"}), 403
    
    ticket = Ticket.query.get(ticket_id)
    if not ticket:
        return jsonify({"msg": "Ticket no encontrado"}), 404
    
    from datetime import datetime
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    ticket.status = data.get('status', ticket.status)
    ticket.updated_at = current_time
    db.session.commit()
    return jsonify(ticket.serialize()), 200

# Listar tickets (admin ve todos, usuario solo los suyos)


@api.route('/tickets', methods=['GET'])
def get_tickets():
    user_id = request.args.get('user_id')
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    if user.role == 'admin':
        tickets = Ticket.query.all()
    else:
        tickets = Ticket.query.filter_by(user_id=user_id).all()
    return jsonify([t.serialize() for t in tickets]), 200

# Crear usuario (solo admin)


@api.route('/admin/create_user', methods=['POST'])
def admin_create_user():
    data = request.json
    admin_id = data.get('admin_id')
    admin = User.query.get(admin_id)
    if not admin or admin.role != 'admin':
        return jsonify({"msg": "Solo el admin puede crear usuarios"}), 403
    if not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({"msg": "Faltan datos (username, email, password)"}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"msg": "El email ya existe"}), 400
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"msg": "El nombre de usuario ya existe"}), 400
    user = User(username=data['username'], email=data['email'], password=data['password'],
                is_active=True, role=data.get('role', 'user'))
    db.session.add(user)
    db.session.commit()
    return jsonify(user.serialize()), 201

# Exportar tickets a Excel (solo admin)


@api.route('/admin/export_tickets', methods=['GET'])
def export_tickets():
    admin_id = request.args.get('admin_id')
    admin = User.query.get(admin_id)
    if not admin or admin.role != 'admin':
        return jsonify({"msg": "Solo el admin puede exportar"}), 403
    tickets = Ticket.query.all()
    df = pd.DataFrame([t.serialize() for t in tickets])
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        df.to_excel(writer, index=False, sheet_name='Tickets')
    output.seek(0)
    return send_file(output, download_name='tickets.xlsx', as_attachment=True)


@api.route('/admin/edit_user/<int:user_id>', methods=['PUT'])
def admin_edit_user(user_id):
    data = request.json
    admin_id = data.get('admin_id')
    admin = User.query.get(admin_id)
    if not admin or admin.role != 'admin':
        return jsonify({"msg": "Solo el admin puede editar usuarios"}), 403
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    user.email = data.get('email', user.email)
    user.password = data.get('password', user.password)
    user.role = data.get('role', user.role)
    db.session.commit()
    return jsonify(user.serialize()), 200


@api.route('/admin/delete_user/<int:user_id>', methods=['DELETE'])
def admin_delete_user(user_id):
    admin_id = request.args.get('admin_id')
    admin = User.query.get(admin_id)
    if not admin or admin.role != 'admin':
        return jsonify({"msg": "Solo el admin puede eliminar usuarios"}), 403
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "Usuario eliminado"}), 200


@api.route('/admin/users', methods=['GET'])
def admin_list_users():
    admin_id = request.args.get('admin_id')
    admin = User.query.get(admin_id)
    if not admin or admin.role != 'admin':
        return jsonify({"msg": "Solo el admin puede ver usuarios"}), 403
    users = User.query.all()
    return jsonify([u.serialize() for u in users]), 200

# Ruta para inicializar la base de datos (temporal para resolver el problema)
@api.route('/init-database', methods=['POST'])
def init_database():
    try:
        # Eliminar todas las tablas existentes para evitar conflictos de esquema
        db.drop_all()
        
        # Crear todas las tablas con el nuevo esquema
        db.create_all()
        
        # NO crear usuarios por defecto por seguridad
        # Los usuarios deben ser creados manualmente después de la inicialización
        
        # Commit para confirmar la creación de tablas
        db.session.commit()
        
        return jsonify({
            "msg": "Base de datos inicializada correctamente",
            "tables_dropped_and_recreated": True,
            "note": "No se han creado usuarios por defecto. Use el endpoint /create-admin para crear el primer administrador."
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error inicializando base de datos: {str(e)}"}), 500

# Ruta para crear el primer usuario administrador (solo funciona si no hay usuarios)
@api.route('/create-admin', methods=['POST'])
def create_admin():
    try:
        # Verificar que no existan usuarios en la base de datos
        if User.query.count() > 0:
            return jsonify({"msg": "Ya existen usuarios en el sistema. No se puede crear un nuevo administrador."}), 400
        
        data = request.json
        if not data.get('username') or not data.get('password'):
            return jsonify({"msg": "Se requieren username y password"}), 400
        
        # Crear el usuario administrador
        admin_user = User(
            username=data['username'],
            email=data.get('email', f"{data['username']}@admin.com"),
            password=data['password'],
            is_active=True,
            role='admin'
        )
        db.session.add(admin_user)
        db.session.commit()
        
        return jsonify({
            "msg": "Usuario administrador creado exitosamente",
            "user": admin_user.serialize()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error creando administrador: {str(e)}"}), 500
