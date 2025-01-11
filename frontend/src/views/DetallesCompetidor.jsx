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

  const { foto_url } = competidor;

  const defaultAvatar =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cccccc'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

  const imageUrl = foto_url
    ? `http://localhost:5000${foto_url}`
    : defaultAvatar;

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/competidores/${competidor.id}/eventos`
        );
        if (!response.ok) throw new Error("Error al cargar eventos");
        const data = await response.json();
        setEventosGenerales(data.eventos_generales);
        setEventosTriatlon(data.eventos_triatlon);
      } catch (err) {
        setError(err.message);
        console.error("Error:", err);
      }
    };

    fetchEventos();
  }, [competidor.id]);

  useEffect(() => {
    const fetchEntrenador = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/competidores/${competidor.id}/entrenador`
        );
        if (!response.ok) throw new Error("Error al cargar el entrenador");
        const data = await response.json();
        setEntrenador(data);
      } catch (err) {
        setError(err.message);
        console.error("Error:", err);
      }
    };

    fetchEntrenador();
  }, [competidor.id]);

  // ...existing code...
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-neutral-light to-white p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3">
                <img
                  src={imageUrl}
                  alt={competidor.nombre}
                  className="w-full h-64 object-contain rounded-lg"
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
                      {new Date(
                        competidor.fecha_nacimiento
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Categoría:</p>
                    <p className="font-semibold">{competidor.categoria}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Entrenador:</p>
                    <p className="font-semibold">
                      {entrenador ? entrenador.nombre : "Cargando..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-3xl font-bold mb-2 col-span-1">
            Eventos Generales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eventosGenerales.length === 0 ? (
              <p className="text-gray-600 text-center col-span-full">
                Este competidor no ha participado en eventos generales
              </p>
            ) : (
              eventosGenerales.map((evento) => (
                <div
                  key={`general-${evento.id}`}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-xl font-bold mb-2 bg-accent p-3 rounded-md">
                    {evento.nombre}
                  </h3>
                  <p className="text-gray-600">
                    Disciplina: {evento.disciplina}
                  </p>
                  <p className="text-gray-600">
                    Fecha: {new Date(evento.fecha_inicio).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    Tiempo: {evento.tiempo || "No registrado"}
                  </p>
                </div>
              ))
            )}
          </div>
          <h3 className="text-3xl font-bold mb-2">Triatlones</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eventosTriatlon.length === 0 ? (
              <p className="text-gray-600 col-span-full text-center">
                Este competidor no ha participado en triatlones
              </p>
            ) : (
              eventosTriatlon.map((evento) => (
                <div
                  key={`triatlon-${evento.id}`}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <h3 className="text-xl font-bold mb-2 bg-accent p-3 rounded-md">
                    {evento.nombre}
                  </h3>
                  <p className="text-gray-600">
                    Disciplina: {evento.disciplina}
                  </p>
                  <p className="text-gray-600">
                    Fecha: {new Date(evento.fecha_inicio).toLocaleDateString()}
                  </p>
                  <div className="mt-2">
                    <p className="text-gray-600">
                      Natación: {evento.tiempo_natacion || "No registrado"}
                    </p>
                    <p className="text-gray-600">
                      Ciclismo: {evento.tiempo_ciclismo || "No registrado"}
                    </p>
                    <p className="text-gray-600">
                      Carrera: {evento.tiempo_carrera || "No registrado"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
  // ...existing code...
};

export default DetallesCompetidor;
