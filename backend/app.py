from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect

app = Flask(__name__)
CORS(app)

# Configuración de la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:acuario16@localhost/clubdeleones'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

db = SQLAlchemy(app)

#? Creación de la base de datos
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

# Crear todas las tablas
with app.app_context():
    db.create_all()
    print("Tablas creadas correctamente")
    inspector = inspect(db.engine)
    print("Tablas existentes en la base de datos:", inspector.get_table_names())
    print("Tablas detectadas por SQLAlchemy:", db.metadata.tables.keys())







@app.route('/api', methods=['GET'])
def home():
    return jsonify({"message": "Hello from Flask!"})

if __name__ == '__main__':
    app.run(debug=True)
