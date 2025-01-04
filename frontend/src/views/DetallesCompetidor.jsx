import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "../components/Header";

const DetallesCompetidor = () => {
  const location = useLocation();
  const { competidor } = location.state;
  const [error, setError] = useState(null);
  const [entrenador, setEntrenador] = useState(null);
  const [eventosGenerales, setEventosGenerales] = useState([]);
  const [eventosTriatlon, setEventosTriatlon] = useState([]);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/competidores/${competidor.id}/eventos`);
        if (!response.ok) throw new Error('Error al cargar eventos');
        const data = await response.json();
        setEventosGenerales(data.eventos_generales);
        setEventosTriatlon(data.eventos_triatlon);
      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      }
    };

    fetchEventos();
  }, [competidor.id]);

  useEffect(() => {
    const fetchEntrenador = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/competidores/${competidor.id}/entrenador`);
        if (!response.ok) throw new Error('Error al cargar el entrenador');
        const data = await response.json();
        setEntrenador(data);
      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      }
    };

    fetchEntrenador();
  }, [competidor.id]);

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <img
                src={competidor.foto}
                alt={competidor.nombre}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="w-full md:w-2/3">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {competidor.nombre}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Fecha de Nacimiento:</p>
                  <p className="font-semibold">
                    {new Date(competidor.fecha_nacimiento).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Categoría:</p>
                  <p className="font-semibold">
                    {competidor.categoria}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Entrenador:</p>
                  <p className="font-semibold">
                    {entrenador ? entrenador.nombre : 'Cargando...'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Eventos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {eventosGenerales.map(evento => (
            <div key={`general-${evento.id}`} className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-2">{evento.nombre}</h3>
              <p className="text-gray-600">Disciplina: {evento.disciplina}</p>
              <p className="text-gray-600">Fecha: {new Date(evento.fecha_inicio).toLocaleDateString()}</p>
              <p className="text-gray-600">Tiempo: {evento.tiempo || 'No registrado'}</p>
            </div>
          ))}
          
          {eventosTriatlon.map(evento => (
            <div key={`triatlon-${evento.id}`} className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-2">{evento.nombre}</h3>
              <p className="text-gray-600">Disciplina: {evento.disciplina}</p>
              <p className="text-gray-600">Fecha: {new Date(evento.fecha_inicio).toLocaleDateString()}</p>
              <div className="mt-2">
                <p className="text-gray-600">Natación: {evento.tiempo_natacion || 'No registrado'}</p>
                <p className="text-gray-600">Ciclismo: {evento.tiempo_ciclismo || 'No registrado'}</p>
                <p className="text-gray-600">Carrera: {evento.tiempo_carrera || 'No registrado'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DetallesCompetidor;