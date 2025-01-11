import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export const FormEvento = () => {
  const navigate = useNavigate();
  const [disciplinas, setDisciplinas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    isSingleDay: true,
    fechaInicio: "",
    fechaFin: "",
    disciplina: "",
    categorias: [],
  });

  const today = new Date().toISOString().split("T")[0];

  const handleFechaInicioChange = (e) => {
    const newFechaInicio = e.target.value;
    setFormData((prev) => ({
      ...prev,
      fechaInicio: newFechaInicio,
      // Reset fechaFin if it's before new fechaInicio
      fechaFin: prev.fechaFin < newFechaInicio ? "" : prev.fechaFin,
    }));
  };

  useEffect(() => {
    const fetchDisciplinas = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/disciplinas");
        if (!response.ok) throw new Error("Error al cargar disciplinas");
        const data = await response.json();
        setDisciplinas(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDisciplinas();
  }, []);

  const categorias = ["A", "B", "C", "D", "E"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nombre", formData.nombre);
      formDataToSend.append("fechaInicio", formData.fechaInicio);
      formDataToSend.append("disciplina_id", formData.disciplina);

      if (!formData.isSingleDay) {
        formDataToSend.append("fechaFin", formData.fechaFin);
      }

      // Append categories as a comma-separated string
      formDataToSend.append("categorias", formData.categorias.join(","));

      const response = await fetch("http://localhost:5000/api/eventos", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Error al crear el evento");

      Swal.fire({
        title: "Éxito",
        text: data.message,
        icon: "success",
        confirmButtonText: "Aceptar",
        buttonsStyling: false,
        customClass: {
          confirmButton: 'bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'
        }
      });

      setTimeout(() => {
        navigate("/IndexAdmin");
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
        confirmButtonText: "Aceptar",
        buttonsStyling: false,
        customClass: {
          confirmButton: 'bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600'
        }
      });
    }
  };

  const handleCategoriaChange = (categoria) => {
    setFormData((prev) => ({
      ...prev,
      categorias: prev.categorias.includes(categoria)
        ? prev.categorias.filter((cat) => cat !== categoria)
        : [...prev.categorias, categoria],
    }));
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-neutral-light to-white p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-neutral-dark mb-6">
            Crear Nuevo Evento
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">
                Nombre del Evento
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-neutral/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
              />
            </div>

            {/* Fecha */}
            <div>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="isSingleDay"
                  checked={formData.isSingleDay}
                  onChange={(e) =>
                    setFormData({ ...formData, isSingleDay: e.target.checked })
                  }
                  className="mr-2"
                />
                <label htmlFor="isSingleDay">Evento de un día</label>
              </div>
              {formData.isSingleDay ? (
                <input
                  type="date"
                  required
                  min={today}
                  className="w-full px-3 py-2 border border-neutral/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.fechaInicio}
                  onChange={handleFechaInicioChange}
                />
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Fecha Inicio</label>
                    <input
                      type="date"
                      required
                      min={today}
                      className="w-full px-3 py-2 border border-neutral/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.fechaInicio}
                      onChange={handleFechaInicioChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Fecha Fin</label>
                    <input
                      type="date"
                      required
                      min={formData.fechaInicio || today}
                      className="w-full px-3 py-2 border border-neutral/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      value={formData.fechaFin}
                      onChange={(e) =>
                        setFormData({ ...formData, fechaFin: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Disciplina */}
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">
                Tipo de Evento
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-neutral/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={formData.disciplina}
                onChange={(e) => {
                  setFormData({ ...formData, disciplina: e.target.value });
                }}
              >
                <option value="">Selecciona un tipo</option>
                {disciplinas.map(({ id, nombre }) => (
                  <option key={id} value={id}>
                    {nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Categorías */}
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-2">
                Categorías
              </label>
              <div className="grid grid-cols-3 gap-4">
                {categorias.map((categoria) => (
                  <label
                    key={categoria}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      checked={formData.categorias.includes(categoria)}
                      onChange={() => handleCategoriaChange(categoria)}
                      className="form-checkbox text-primary rounded"
                    />
                    <span>{categoria}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Crear Evento
            </button>
          </form>
        </div>
      </div>
    </>
  );
};