import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { Header } from "../components/Header";
import { useEventoEstado } from "../hooks/useEventoEstado";
import Swal from "sweetalert2";

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

  const handleEditStart = (item) => {
    setEditingId(item.competidor.id);
    if (evento.disciplina === "Triatlón") {
      // Triatlón
      setEditValues({
        natacion:
          item.tiempos.natacion !== null
            ? item.tiempos.natacion
            : "00:00:00.000",
        ciclismo:
          item.tiempos.ciclismo !== null
            ? item.tiempos.ciclismo
            : "00:00:00.000",
        carrera:
          item.tiempos.carrera !== null ? item.tiempos.carrera : "00:00:00.000",
      });
    } else {
      // Otros eventos
      setEditValues({
        tiempo: item.tiempo !== null ? item.tiempo : "00:00:00.000",
      });
    }
  };

  const handleTimeChange = (field, value) => {
    // Permitir ingreso parcial
    const partialRegex = /^(\d{0,2})(:\d{0,2}){0,2}(\.\d{0,3})?$/;
    if (value === "" || partialRegex.test(value)) {
      setEditValues((prev) => ({
        ...prev,
        [field]: value,
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
    // Validate all time inputs before saving
    if (evento.disciplina === "Triatlón") {
      // Triatlón
      if (
        !validateTimeFormat(editValues.natacion) ||
        !validateTimeFormat(editValues.ciclismo) ||
        !validateTimeFormat(editValues.carrera)
      ) {
        Swal.fire({
          title: "Formato inválido",
          text: "Por favor, ingrese tiempos en formato válido (HH:MM:SS.mmm)",
          icon: "warning",
          confirmButtonText: "Aceptar",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600",
          },
        });
        return;
      }
    } else {
      // Otros eventos
      if (!validateTimeFormat(editValues.tiempo)) {
        Swal.fire({
          title: "Formato inválido",
          text: "Por favor, ingrese tiempo en formato válido (HH:MM:SS.mmm)",
          icon: "warning",
          confirmButtonText: "Aceptar",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600",
          },
        });
        return;
      }
    }

    try {
      const timeValues =
        evento.disciplina === "Triatlón"
          ? {
              natacion: editValues.natacion ? editValues.natacion : null,
              ciclismo: editValues.ciclismo ? editValues.ciclismo : null,
              carrera: editValues.carrera ? editValues.carrera : null,
            }
          : {
              tiempo: editValues.tiempo ? editValues.tiempo : null,
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
      value={value || ""}
      onChange={(e) => handleTimeChange(field, e.target.value)}
      onBlur={(e) => {
        if (!e.target.value) {
          handleTimeChange(field, "00:00:00.000");
        }
      }}
      placeholder="HH:MM:SS.mmm"
      className="w-32 p-1 border rounded"
    />
  );

  const renderTimeDisplay = (value) => <span>{value}</span>;

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
      // Triatlón
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
              {estado !== "En Curso" && (
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
                    {estado !== "En Curso" && (
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

    // Tabla para otros eventos
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
            {estado !== "En Curso" && (
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
                    {renderTimeInput("tiempo", editValues.tiempo)}
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
                    {renderTimeDisplay(item.tiempo)}
                  </td>
                  {estado !== "En Curso" && (
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

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Una vez borrado, no podrás recuperar este evento.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "No, cancelar",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mx-2",
        cancelButton:
          "bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600",
      },
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/eventos/${evento.id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) throw new Error("Error al borrar el evento");
        Swal.fire({
          title: "¡Evento borrado exitosamente!",
          icon: "success",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600",
          },
        });
        navigate("/IndexAdmin");
      } catch (err) {
        console.error("Error:", err);
        Swal.fire({
          title: "Error",
          text: "Error al borrar el evento",
          icon: "error",
          confirmButtonText: "Aceptar",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600",
          },
        });
      }
    } else {
      Swal.fire("El evento no fue borrado");
    }
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
            </div>
          </div>

          <div className="grid grid-cols-1 bg-white">
            <button
              disabled={estado !== "Próximo"}
              className="col-span-1 mt-4 bg-accent text-white py-3 px-6 rounded-lg hover:bg-accent/90 transition-colors self-end disabled:opacity-50"
              onClick={InscribirCompetidores}
            >
              Inscribir Competidor
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
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Borrar Evento
        </button>
        </div>
      </div>
    </>
  );
};
