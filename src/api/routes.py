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
    if not data.get('email') or not data.get('password'):
        return jsonify({"msg": "Faltan datos"}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"msg": "Usuario ya existe"}), 400
    user = User(email=data['email'], password=data['password'],
                is_active=True, role=data.get('role', 'user'))
    db.session.add(user)
    db.session.commit()
    return jsonify(user.serialize()), 201

# Login de usuario (simple, sin JWT por ahora)


@api.route('/login', methods=['POST'])
def login():
    data = request.json
    email_or_username = data.get('email')
    password = data.get('password')

    # Buscar por email o por nombre de usuario (si no contiene @)
    if '@' in email_or_username:
        user = User.query.filter_by(
            email=email_or_username, password=password).first()
    else:
        # Si no contiene @, buscar por email usando el valor como nombre de usuario
        user = User.query.filter_by(
            email=email_or_username, password=password).first()

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
    if not data.get('email') or not data.get('password'):
        return jsonify({"msg": "Faltan datos"}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"msg": "Usuario ya existe"}), 400
    user = User(email=data['email'], password=data['password'],
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
