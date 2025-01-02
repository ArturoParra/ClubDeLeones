from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect
from datetime import datetime, timedelta, timezone
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
from werkzeug.utils import secure_filename
import os
import jwt

app = Flask(__name__)
CORS(app)

# Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:acuario16@localhost/clubdeleones'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = '1234'

db = SQLAlchemy(app)

#? Creación de la base de datos

class Entrenador(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f'<Entrenador {self.nombre}>'

class Competidor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(80), nullable=False)
    fecha_nacimiento = db.Column(db.Date, nullable=False)
    categoria = db.Column(db.String(1), nullable=False)
    foto = db.Column(db.LargeBinary)

    def __repr__(self):
        return f'<Competidor {self.nombre}>'

class EntrenadorCompetidor(db.Model):
    __tablename__ = 'entrenador_competidor'
    id_competidor = db.Column(db.Integer, db.ForeignKey('competidor.id'), primary_key=True)
    id_entrenador = db.Column(db.Integer, db.ForeignKey('entrenador.id'), primary_key=True)
    competidor = db.relationship('Competidor', backref='entrenadores')
    entrenador = db.relationship('Entrenador', backref='competidores')

class Disciplina(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return f'<Disciplina {self.nombre}>'
    
class Evento(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    fecha_inicio = db.Column(db.Date, nullable=False)
    fecha_fin = db.Column(db.Date)
    disciplina_id = db.Column(db.Integer, db.ForeignKey('disciplina.id'), nullable=False)
    categorias = db.Column(db.String(100), nullable=False)
    archivo_url = db.Column(db.String(200))
    
    disciplina = db.relationship('Disciplina', backref='eventos')

    def __repr__(self):
        return f'<Evento {self.nombre}>'

# Crear todas las tablas
with app.app_context():
    db.create_all()
    inspector = inspect(db.engine)


@app.route('/api', methods=['GET'])
def home():
    return jsonify({"message": "Hello from Flask!"})

@app.route('/api/signup/entrenador', methods=['POST'])
def signup_entrenador():
    data = request.get_json()
    nombre = data.get('nombre')
    email = data.get('email')
    password = data.get('password')
    
    if not all([nombre, email, password]):
        return jsonify({
            "message": "Todos los campos son requeridos"
        }), 400
    
    if Entrenador.query.filter_by(email=email).first():
        return jsonify({
            "message": "El correo electrónico ya está registrado"
        }), 409

    hashed_password = generate_password_hash(password)
    
    nuevo_entrenador = Entrenador(
        nombre=nombre,
        email=email,
        password=hashed_password
    )

    try:
        db.session.add(nuevo_entrenador)
        db.session.commit()
        return jsonify({
            "message": "Registro exitoso"
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "message": f"Error en la base de datos: {str(e)}"
        }), 500

@app.route('/api/login/entrenador', methods=['POST'])
def login_entrenador():
    try:
        data = request.get_json()
        print("Datos recibidos:", data)  # Debug print 1
        
        email = data.get('email')
        password = data.get('password')

        entrenador = Entrenador.query.filter_by(email=email).first()
        print("Entrenador encontrado:", entrenador)  # Debug print 2

        if entrenador and check_password_hash(entrenador.password, password):
            
            exp_time = datetime.now(timezone.utc) + timedelta(hours=24)

            token_payload = {
                'id': entrenador.id,
                'email': entrenador.email,
                'exp': exp_time.timestamp()
            }

            token = jwt.encode(
                token_payload,
                app.config['SECRET_KEY'],
                algorithm='HS256'
            )

            return jsonify({
                "message": "Login exitoso",
                "token": token,
                "nombre": entrenador.nombre
            }), 200

        
        return jsonify({"message": "Correo o contraseña incorrectos"}), 401

    except Exception as e:
        return jsonify({"message": f"Error en el servidor: {str(e)}"}), 500

@app.route('/api/login/admin', methods=['POST'])
def login_admin():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # Hardcoded admin credentials for demo
        if email == "admin@leones.com" and password == "admin123":
            token_payload = {
                'role': 'admin',
                'email': email,
                'exp': datetime.now(timezone.utc) + timedelta(hours=24)
            }
            
            token = jwt.encode(
                token_payload,
                app.config['SECRET_KEY'],
                algorithm='HS256'
            )

            return jsonify({
                "status": "success",
                "message": "Login exitoso",
                "token": token,
                "nombre": "Administrador"
            }), 200
            
        return jsonify({
            "status": "error",
            "message": "Credenciales inválidas"
        }), 401
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": "Error en el servidor"
        }), 500

@app.route('/api/disciplinas', methods=['GET'])
def get_disciplinas():
    try:
        disciplinas = Disciplina.query.all()
        return jsonify([{
            'id': d.id,
            'nombre': d.nombre
        } for d in disciplinas]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/eventos', methods=['POST'])
def crear_evento():
    try:
        # Get JSON data for regular fields
        data = request.form
        archivo = request.files.get('archivo')
        
        # Handle file upload
        archivo_url = None
        if archivo:
            filename = secure_filename(archivo.filename)
            archivo.save(os.path.join('uploads', filename))
            archivo_url = f'/uploads/{filename}'
        
        # Get categories as list from form
        categorias = request.form.getlist('categorias[]')
        
        nuevo_evento = Evento(
            nombre=data['nombre'],
            fecha_inicio=datetime.strptime(data['fechaInicio'], '%Y-%m-%d'),
            fecha_fin=datetime.strptime(data['fechaFin'], '%Y-%m-%d') if data.get('fechaFin') else None,
            disciplina_id=int(data['disciplina_id']),
            categorias=','.join(categorias) if categorias else '',
            archivo_url=archivo_url
        )
        
        db.session.add(nuevo_evento)
        db.session.commit()
        
        return jsonify({"message": "Evento creado exitosamente"}), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error: {str(e)}")  # Debug print
        return jsonify({"error": str(e)}), 500

#! No borrar esto
if __name__ == '__main__':
    app.run(debug=True)