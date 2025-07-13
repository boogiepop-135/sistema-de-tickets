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
    ticket = Ticket(title=data['title'],
                    description=data['description'], user_id=user_id)
    db.session.add(ticket)
    db.session.commit()
    return jsonify(ticket.serialize()), 201

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

# Ruta para crear usuarios de prueba (temporal)
@api.route('/create-test-users', methods=['POST'])
def create_test_users():
    try:
        # Crear usuario admin de prueba
        admin_user = User.query.filter_by(username='admin').first()
        if not admin_user:
            admin_user = User(
                username='admin',
                email='admin@test.com',
                password='admin123',
                is_active=True,
                role='admin'
            )
            db.session.add(admin_user)
        
        # Crear usuario normal de prueba
        normal_user = User.query.filter_by(username='user').first()
        if not normal_user:
            normal_user = User(
                username='user',
                email='user@test.com',
                password='user123',
                is_active=True,
                role='user'
            )
            db.session.add(normal_user)
        
        # Crear tu usuario específico
        levi_user = User.query.filter_by(username='Levi').first()
        if not levi_user:
            levi_user = User(
                username='Levi',
                email='levi@test.com',
                password='Leaguejinx1310-',
                is_active=True,
                role='admin'
            )
            db.session.add(levi_user)
        
        db.session.commit()
        
        return jsonify({
            "msg": "Usuarios de prueba creados exitosamente",
            "users": [
                {"username": "admin", "password": "admin123", "role": "admin"},
                {"username": "user", "password": "user123", "role": "user"},
                {"username": "Levi", "password": "Leaguejinx1310-", "role": "admin"}
            ]
        }), 201
        
    except Exception as e:
        return jsonify({"msg": f"Error creando usuarios: {str(e)}"}), 500

# Ruta para inicializar la base de datos (temporal para resolver el problema)
@api.route('/init-database', methods=['POST'])
def init_database():
    try:
        # Forzar creación de todas las tablas
        db.create_all()
        
        # Crear usuario admin de prueba
        admin_user = User.query.filter_by(username='admin').first()
        if not admin_user:
            admin_user = User(
                username='admin',
                email='admin@test.com',
                password='admin123',
                is_active=True,
                role='admin'
            )
            db.session.add(admin_user)
        
        # Crear usuario normal de prueba
        normal_user = User.query.filter_by(username='user').first()
        if not normal_user:
            normal_user = User(
                username='user',
                email='user@test.com',
                password='user123',
                is_active=True,
                role='user'
            )
            db.session.add(normal_user)
        
        # Crear tu usuario específico
        levi_user = User.query.filter_by(username='Levi').first()
        if not levi_user:
            levi_user = User(
                username='Levi',
                email='levi@test.com',
                password='Leaguejinx1310-',
                is_active=True,
                role='admin'
            )
            db.session.add(levi_user)
        
        db.session.commit()
        
        return jsonify({
            "msg": "Base de datos inicializada correctamente",
            "tables_created": True,
            "users_created": [
                {"username": "admin", "password": "admin123", "role": "admin"},
                {"username": "user", "password": "user123", "role": "user"},
                {"username": "Levi", "password": "Leaguejinx1310-", "role": "admin"}
            ]
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error inicializando base de datos: {str(e)}"}), 500
