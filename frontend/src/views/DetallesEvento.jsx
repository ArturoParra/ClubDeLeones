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
  const [isLoading, setIsLoading] = useState(true);
  const [fechaInicio, setfechaInicio] = useState(
    location.state.evento.fecha_inicio
  );
  const [fechaFin, setfechaFin] = useState(location.state.evento.fecha_fin);

  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const { estado, colorClase, fechaInicioFormateada, fechaFinFormateada } =
    useEventoEstado(fechaInicio, fechaFin);

    const timeToFloat = (timeString) => {
      if (!timeString) return 0;
      const [time, ms] = timeString.split(".");
      const [hours, minutes, seconds] = time.split(":").map(Number);
      const milliseconds = ms ? Number(ms.padEnd(3, '0').slice(0, 3)) / 1000 : 0;
      return Number((hours * 3600 + minutes * 60 + seconds + milliseconds).toFixed(3));
    };
    
    const floatToTime = (floatTime) => {
      if (!floatTime) return "00:00:00.000";
      const roundedTime = Number(floatTime.toFixed(3));
      const hours = Math.floor(roundedTime / 3600);
      const minutes = Math.floor((roundedTime % 3600) / 60);
      const seconds = Math.floor(roundedTime % 60);
      const ms = Math.round((roundedTime % 1) * 1000);
    
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
    };


  const handleEditStart = (item) => {
    setEditingId(item.competidor.id);
    if (evento.disciplina === 'Triatlón') {
      setEditValues({
        natacion: item.tiempos.natacion ? floatToTime(item.tiempos.natacion) : "00:00:00.000",
        ciclismo: item.tiempos.ciclismo ? floatToTime(item.tiempos.ciclismo) : "00:00:00.000",
        carrera: item.tiempos.carrera ? floatToTime(item.tiempos.carrera) : "00:00:00.000"
      });
    } else {
      setEditValues({
        tiempo: item.tiempo ? floatToTime(item.tiempo) : "00:00:00.000"
      });
    }
  };
  
  const handleTimeChange = (field, value) => {
    const timeRegex = /^([0-9]{0,2}:)?([0-9]{0,2}:)?[0-9]{0,2}(\.[0-9]{0,3})?$/;
    if (timeRegex.test(value)) {
      setEditValues(prev => ({
        ...prev,  // Preserve other fields
        [field]: value
      }));
    }
  };

  const fetchCompetidores = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/eventos/${evento.id}/competidores`
      );
      if (!response.ok) throw new Error("Error al cargar competidores");
      const data = await response.json();
      setCompetidores(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const validateTimeFormat = (value) => {
    const timeRegex = /^([0-9]{2}):([0-9]{2}):([0-9]{2})(\.[0-9]{3})?$/;
    return timeRegex.test(value);
  };


  const handleSave = async (competidorId) => {
    if (evento.disciplina === 'Triatlón') {
      if (
        !validateTimeFormat(editValues.natacion) ||
        !validateTimeFormat(editValues.ciclismo) ||
        !validateTimeFormat(editValues.carrera)
      ) {
        alert("Por favor, ingrese tiempos en formato válido (HH:MM:SS.mmm)");
        return;
      }
    } else {
      if (!validateTimeFormat(editValues.tiempo)) {
        alert("Por favor, ingrese tiempo en formato válido (HH:MM:SS.mmm)");
        return;
      }
    }

    try {
      const timeValues =
        evento.disciplina === "Triatlón"
          ? {
              natacion: timeToFloat(editValues.natacion),
              ciclismo: timeToFloat(editValues.ciclismo),
              carrera: timeToFloat(editValues.carrera),
            }
          : {
              tiempo: timeToFloat(editValues.tiempo),
            };

      const response = await fetch(
        `http://localhost:5000/api/eventos/${evento.id}/tiempos/${competidorId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(timeValues),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar tiempos");
      setEditingId(null);
      fetchCompetidores();
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const renderTimeInput = (field, value) => (
    <input
      type="text"
      value={editValues[field] || ""}
      onChange={(e) => handleTimeChange(field, e.target.value)}
      onBlur={(e) => {
        if (!e.target.value) {
          handleTimeChange(field, "00:00:00.000");
        }
      }}
      placeholder="00:00:00.000"
      className="w-32 p-1 border rounded"
    />
  );

  const renderTimeDisplay = (value) => <span>{floatToTime(value)}</span>;

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

  useEffect(() => {
    fetchCompetidores();
  }, [evento.id]);

  const InscribirCompetidores = () => {
    navigate(`/InscribirCompetidores/${evento.id}`, { state: { evento } });
  };

  const renderTablaCompetidores = () => {
    if (evento.disciplina === "Triatlón") {
      return (
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Competidor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entrenador
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                T. Natación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                T. Ciclismo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                T. Carrera
              </th>
              {estado === "En Curso" && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {competidores.map((item) => (
              <tr key={item.competidor.id}>
                <td className="px-6 py-4">{item.competidor.nombre}</td>
                <td className="px-6 py-4">{item.categoria}</td>
                <td className="px-6 py-4">{item.entrenador}</td>
                {editingId === item.competidor.id ? (
                  <>
                    <td className="px-6 py-4">
                      {renderTimeInput("natacion", editValues.natacion)}
                    </td>
                    <td className="px-6 py-4">
                      {renderTimeInput("ciclismo", editValues.ciclismo)}
                    </td>
                    <td className="px-6 py-4">
                      {renderTimeInput("carrera", editValues.carrera)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleSave(item.competidor.id)}
                        className="text-green-600 hover:text-green-900 mr-2"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4">
                      {renderTimeDisplay(item.tiempos.natacion)}
                    </td>
                    <td className="px-6 py-4">
                      {renderTimeDisplay(item.tiempos.ciclismo)}
                    </td>
                    <td className="px-6 py-4">
                      {renderTimeDisplay(item.tiempos.carrera)}
                    </td>
                    {estado === "En Curso" && (
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEditStart(item)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Editar
                        </button>
                      </td>
                    )}
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    // Regular events table
    return (
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Competidor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categoría
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Entrenador
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tiempo
            </th>
            {estado === "En Curso" && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {competidores.map((item) => (
            <tr key={item.competidor.id}>
              <td className="px-6 py-4">{item.competidor.nombre}</td>
              <td className="px-6 py-4">{item.categoria}</td>
              <td className="px-6 py-4">{item.entrenador}</td>
              {editingId === item.competidor.id ? (
                <>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      step="0.01"
                      value={editValues.tiempo ?? ""}
                      onChange={(e) =>
                        setEditValues({ tiempo: parseFloat(e.target.value) })
                      }
                      className="w-24 p-1 border rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleSave(item.competidor.id)}
                      className="text-green-600 hover:text-green-900 mr-2"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Cancelar
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-6 py-4">{item.tiempo || "---"}</td>
                  {estado === "En Curso" && (
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEditStart(item)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Editar
                      </button>
                    </td>
                  )}
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-neutral-light to-white p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Event Details Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <button
                  onClick={() => navigate("/IndexAdmin")}
                  className="flex items-center text-neutral-dark hover:text-primary transition-colors mb-6"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Volver
                </button>
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
              disabled={estado !== "Próximo"}
              className="col-span-1 mt-4 bg-accent text-white py-3 px-6 rounded-lg hover:bg-accent/90 transition-colors self-end disabled:opacity-50"
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
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Competidores Inscritos</h2>
            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : competidores.length === 0 ? (
              <p className="text-center text-gray-500">
                No hay competidores inscritos
              </p>
            ) : (
              <div className="overflow-x-auto">{renderTablaCompetidores()}</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
