import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { Header } from "../components/Header";
import { useEventoEstado } from "../hooks/useEventoEstado";

export const DetallesEvento = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [evento, setEvento] = useState(location.state.evento);
  const [competidores, setCompetidores] = useState([]);
  const [fechaInicio, setfechaInicio] = useState(
    location.state.evento.fecha_inicio
  );
  const [fechaFin, setfechaFin] = useState(location.state.evento.fecha_fin);

  const { estado, colorClase, fechaInicioFormateada, fechaFinFormateada } =
    useEventoEstado(fechaInicio, fechaFin);

  useEffect(() => {
    evento.fecha_inicio
      ? setfechaInicio(
          parseISO(evento.fecha_inicio).toISOString().split("T")[0]
        )
      : null;
    evento.fecha_fin
      ? setfechaFin(parseISO(evento.fecha_fin).toISOString().split("T")[0])
      : null;
  }, [evento]);

  const InscribirCompetidores = () => {
    navigate(`/InscribirCompetidores/${evento.id}`, { state: { evento } });
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-neutral-light to-white p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Event Details Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h1 className="text-3xl font-bold text-neutral-dark mb-4">
                  {evento?.nombre}
                </h1>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral">Fecha:</h3>
                    <p className="text-lg text-neutral-dark">
                      {fechaFin
                        ? `${fechaInicioFormateada} - ${fechaFinFormateada}`
                        : fechaInicio
                        ? `${fechaInicioFormateada}`
                        : "Cargando..."}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral">
                      Disciplina:
                    </h3>
                    <p className="text-lg text-neutral-dark">
                      {evento?.disciplina}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-neutral">
                      Categorías:
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {evento?.categorias.map((cat, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className={`text-neutral-dark ${colorClase}`}>
                      {estado}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between">
                {evento?.archivo_url && (
                  <a
                    href={evento.archivo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:text-primary/80"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                      />
                    </svg>
                    Ver documento
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 bg-white">
            <button
              className="col-span-1 mt-4 bg-accent text-white py-3 px-6 rounded-lg hover:bg-accent/90 transition-colors self-end"
              onClick={InscribirCompetidores}
            >
              Inscribir Competidor
            </button>
            <button
              className="col-span-1 mt-4 mx-3 bg-accent text-white py-3 px-6 rounded-lg hover:bg-accent/90 transition-colors self-end"
              onClick={() => {
                /* Handle inscription */
              }}
            >
              Generar Reporte de Resultados
            </button>
          </div>

          {/* Competitors Table */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-neutral-dark mb-4">
              Competidores Inscritos
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral/10">
                <thead>
                  <tr className="bg-neutral/5">
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">
                      Entrenador
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral/10">
                  {competidores.map((competidor) => (
                    <tr key={competidor.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                        {competidor.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                        {competidor.categoria}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                        {competidor.entrenador}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {competidores.length === 0 && (
                <p className="text-center py-4 text-neutral">
                  No hay competidores inscritos
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
