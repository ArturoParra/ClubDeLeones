import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export const EditarCompetidor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    nombre: "",
    fechaNacimiento: "",
    foto: null,
    entrenadorId: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [entrenadores, setEntrenadores] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompetidor = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/competidores/${id}`
        );
        if (!response.ok) throw new Error("Error al cargar competidor");
        const data = await response.json();
        setFormData({
          nombre: data.nombre,
          fechaNacimiento: data.fecha_nacimiento.split("T")[0], // Asegúrate de que la fecha esté en el formato correcto
          foto: null,
          entrenadorId: data.entrenador_id,
        });
        const defaultAvatar =
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cccccc'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

        const imageUrl = data.foto_url
          ? `http://localhost:5000/${data.foto_url}`
          : defaultAvatar;
        setPreviewUrl(imageUrl);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const fetchEntrenadores = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/entrenadores");
        if (!response.ok) throw new Error("Error al cargar entrenadores");
        const data = await response.json();
        setEntrenadores(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchCompetidor();
    fetchEntrenadores();
  }, [id]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, foto: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const filteredEntrenadores = entrenadores.filter((entrenador) =>
    entrenador.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 4,
    today.getMonth(),
    today.getDate()
  );
  const maxDateStr = maxDate.toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.entrenadorId) {
      setError("Debes seleccionar un entrenador");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nombre", formData.nombre);
      formDataToSend.append("fechaNacimiento", formData.fechaNacimiento);
      formDataToSend.append("entrenadorId", formData.entrenadorId);
      if (formData.foto) {
        formDataToSend.append("foto", formData.foto);
      }

      const response = await fetch(
        `http://localhost:5000/api/competidores/${id}`,
        {
          method: "PUT",
          body: formDataToSend,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar competidor");
      }

      Swal.fire({
        title: "Éxito",
        text: "Competidor actualizado exitosamente",
        icon: "success",
        confirmButtonText: "Aceptar",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600",
        },
      });
      navigate(-1);
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-b from-neutral-light to-white p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 px-4 py-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Volver
          </button>
          <h2 className="text-2xl font-bold text-neutral-dark mb-6">
            Editar Competidor
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Upload Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-neutral-100 relative">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="cursor-pointer bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
              >
                Subir Foto
              </label>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">
                  Nombre Completo
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

              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  required
                  max={maxDateStr}
                  className="w-full px-3 py-2 border border-neutral/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formData.fechaNacimiento}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fechaNacimiento: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-neutral-dark">
                Asignar Entrenador
              </h3>

              <input
                type="text"
                placeholder="Buscar entrenador..."
                className="w-full px-3 py-2 border border-neutral/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <div className="h-48 overflow-y-auto border rounded-lg">
                <div className="grid grid-cols-1 gap-2 p-2">
                  {filteredEntrenadores.map((entrenador) => (
                    <div
                      key={entrenador.id}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          entrenadorId: entrenador.id,
                        })
                      }
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        formData.entrenadorId === entrenador.id
                          ? "bg-primary/10 border-primary"
                          : "bg-white hover:bg-neutral/5"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                          {entrenador.nombre.charAt(0)}
                        </div>
                        <span className="font-medium">{entrenador.nombre}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Actualizar Competidor
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
