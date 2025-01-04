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
    nombre = db.Column(db.String(100), nullable=False)
    fecha_nacimiento = db.Column(db.Date, nullable=False)
    foto_url = db.Column(db.String(200))

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
    
class TiemposGenerales(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_evento = db.Column(db.Integer, db.ForeignKey('evento.id'), nullable=False)
    id_competidor = db.Column(db.Integer, db.ForeignKey('competidor.id'), nullable=False)
    tiempo = db.Column(db.Float, nullable=False)

    evento = db.relationship('Evento', backref='tiempos')
    competidor = db.relationship('Competidor', backref='tiempos')

    def __repr__(self):
        return f'<TiempoGeneral {self.tiempo}>'
    
class TiemposTriatlon(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_evento = db.Column(db.Integer, db.ForeignKey('evento.id'), nullable=False)
    id_competidor = db.Column(db.Integer, db.ForeignKey('competidor.id'), nullable=False)
    tiempo_natacion = db.Column(db.Float, nullable=False)
    tiempo_ciclismo = db.Column(db.Float, nullable=False)
    tiempo_carrera = db.Column(db.Float, nullable=False)

    evento = db.relationship('Evento', backref='tiempos_triatlon')
    competidor = db.relationship('Competidor', backref='tiempos_triatlon')

    def __repr__(self):
        return f'<TiempoTriatlon {self.tiempo_natacion}, {self.tiempo_ciclismo}, {self.tiempo_carrera}>'

# Crear todas las tablas
with app.app_context():
    db.create_all()
    inspector = inspect(db.engine)

#? Rutas de la API

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
        
        email = data.get('email')
        password = data.get('password')

        entrenador = Entrenador.query.filter_by(email=email).first()

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
    
@app.route('/api/consultareventos', methods=['GET'])
def consultar_eventos():
    try:
        eventos = Evento.query.all()
        return jsonify([{
            'id': e.id,
            'nombre': e.nombre,
            'fecha_inicio': e.fecha_inicio.strftime('%Y-%m-%d'),
            'fecha_fin': e.fecha_fin.strftime('%Y-%m-%d') if e.fecha_fin else None,
            'disciplina': e.disciplina.nombre,
            'categorias': e.categorias.split(','),
            'archivo_url': e.archivo_url
        } for e in eventos]), 200
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

@app.route('/api/competidores', methods=['POST'])
def crear_competidor():
    try:
        nombre = request.form.get('nombre')
        fecha_nacimiento = request.form.get('fechaNacimiento')
        entrenador_id = request.form.get('entrenadorId')
        foto = request.files.get('foto')
        
        if not all([nombre, fecha_nacimiento, entrenador_id]):
            return jsonify({"error": "Todos los campos son requeridos"}), 400
        
        # Handle photo upload
        foto_url = None
        if foto:
            filename = secure_filename(foto.filename)
            foto.save(os.path.join('uploads', filename))
            foto_url = f'/uploads/{filename}'
        
        # Create new competitor
        nuevo_competidor = Competidor(
            nombre=nombre,
            fecha_nacimiento=datetime.strptime(fecha_nacimiento, '%Y-%m-%d'),
            foto_url=foto_url
        )
        
        db.session.add(nuevo_competidor)
        db.session.flush()  # Get ID before commit
        
        # Create relationship
        entrenador_competidor = EntrenadorCompetidor(
            id_competidor=nuevo_competidor.id,
            id_entrenador=entrenador_id
        )
        
        db.session.add(entrenador_competidor)
        db.session.commit()
        
        return jsonify({
            "message": "Competidor registrado exitosamente",
            "id": nuevo_competidor.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error: {str(e)}")  # Debug print
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/entrenadores', methods=['GET'])
def get_entrenadores():
    try:
        entrenadores = Entrenador.query.all()
        return jsonify([{
            'id': e.id,
            'nombre': e.nombre,
        } for e in entrenadores]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/competidores', methods=['GET'])
def get_competidores():
    try:
        competidores = Competidor.query.all()
        return jsonify([{
            'id': c.id,
            'nombre': c.nombre,
            'fecha_nacimiento': c.fecha_nacimiento.strftime('%Y-%m-%d'),
            'foto_url': c.foto_url
        } for c in competidores]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/api/eventos/inscribir', methods=['POST'])
def inscribir_competidores():
    try:
        data = request.json
        evento_id = data['eventoId']
        competidores = data['competidores']
        evento = Evento.query.get(evento_id)
        
        if not evento:
            return jsonify({'error': 'Evento no encontrado'}), 404

        for competidor_id in competidores:
                        
            # Create time record based on event type
            if evento.disciplina_id == 2:
                tiempo_triatlon = TiemposTriatlon(
                    id_evento=evento_id,
                    id_competidor=competidor_id,
                    tiempo_natacion=0,
                    tiempo_ciclismo=0,
                    tiempo_carrera=0
                )
                db.session.add(tiempo_triatlon)
            else:
                tiempo_general = TiemposGenerales(
                    id_evento=evento_id,
                    id_competidor=competidor_id,
                    tiempo=0
                )
                db.session.add(tiempo_general)
                
        db.session.commit()
        return jsonify({'message': 'Competidores inscritos exitosamente'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/competidores/<int:competidor_id>/entrenador', methods=['GET'])
def get_entrenador_by_competidor(competidor_id):
    try:
        # Get the EntrenadorCompetidor relationship
        relacion = EntrenadorCompetidor.query.filter_by(id_competidor=competidor_id).first()
        
        if not relacion:
            return jsonify({
                'id': None,
                'nombre': 'No asignado'
            }), 200

        # Get the entrenador details
        entrenador = Entrenador.query.get(relacion.id_entrenador)
        
        if not entrenador:
            return jsonify({
                'id': None,
                'nombre': 'No asignado'
            }), 200
        
        return jsonify({
            'id': entrenador.id,
            'nombre': entrenador.nombre
        }), 200
        
    except Exception as e:
        return jsonify({
            'id': None,
            'nombre': 'No asignado'
        }), 200
    
@app.route('/api/competidores/<int:competidor_id>/eventos', methods=['GET'])
def get_eventos_competidor(competidor_id):
    try:
        # Get events from TiemposGenerales
        tiempos_generales = TiemposGenerales.query.filter_by(id_competidor=competidor_id).all()
        eventos_generales = []
        for tiempo in tiempos_generales:
            evento = Evento.query.get(tiempo.id_evento)
            eventos_generales.append({
                'id': evento.id,
                'nombre': evento.nombre,
                'fecha_inicio': evento.fecha_inicio.strftime('%Y-%m-%d'),
                'fecha_fin': evento.fecha_fin.strftime('%Y-%m-%d') if evento.fecha_fin else None,
                'disciplina': evento.disciplina.nombre,
                'tiempo': tiempo.tiempo,
                'tipo': 'general'
            })

        # Get events from TiemposTriatlon
        tiempos_triatlon = TiemposTriatlon.query.filter_by(id_competidor=competidor_id).all()
        eventos_triatlon = []
        for tiempo in tiempos_triatlon:
            evento = Evento.query.get(tiempo.id_evento)
            eventos_triatlon.append({
                'id': evento.id,
                'nombre': evento.nombre,
                'fecha_inicio': evento.fecha_inicio.strftime('%Y-%m-%d'),
                'fecha_fin': evento.fecha_fin.strftime('%Y-%m-%d') if evento.fecha_fin else None,
                'disciplina': evento.disciplina.nombre,
                'tiempo_natacion': tiempo.tiempo_natacion,
                'tiempo_ciclismo': tiempo.tiempo_ciclismo,
                'tiempo_carrera': tiempo.tiempo_carrera,
                'tipo': 'triatlon'
            })

        return jsonify({
            'eventos_generales': eventos_generales,
            'eventos_triatlon': eventos_triatlon
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

#! No borrar esto
if __name__ == '__main__':
    app.run(debug=True)