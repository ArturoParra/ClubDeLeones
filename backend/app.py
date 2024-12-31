from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect
from datetime import datetime, timedelta, timezone
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
import jwt

app = Flask(__name__)
CORS(app)

# Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:acuario16@localhost/clubdeleones'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = 'tu_clave_secreta_aqui'

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


# Crear todas las tablas
with app.app_context():
    db.create_all()
    #print("Tablas creadas correctamente")
    inspector = inspect(db.engine)
    #print("Tablas existentes en la base de datos:", inspector.get_table_names())
    #print("Tablas detectadas por SQLAlchemy:", db.metadata.tables.keys())


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
            print("Token payload:", token_payload)  # Debug print 3
            
            token = jwt.encode(
                token_payload,
                app.config['SECRET_KEY'],
                algorithm='HS256'
            )
            print("Token generado:", token)  # Debug print 4
            print("Tipo del token:", type(token))

            return jsonify({
                "message": "Login exitoso",
                "token": token,
                "nombre": entrenador.nombre
            }), 200

        
        return jsonify({"message": "Correo o contraseña incorrectos"}), 401

    except Exception as e:
        return jsonify({"message": f"Error en el servidor: {str(e)}"}), 500

#! No borrar esto
if __name__ == '__main__':
    app.run(debug=True)