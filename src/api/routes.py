"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Ticket
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

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
