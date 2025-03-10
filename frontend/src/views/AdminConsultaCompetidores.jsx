import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { CompetidorCardAdmin } from "../components/CompetidorCardAdmin";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export const AdminConsultaCompetidores = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [competidores, setCompetidores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const competidoresPerPage = 12;

  const categorias = ["A", "B", "C", "D", "E"];

  const handleCategoryChange = (categoria) => {
    setSelectedCategories((prev) =>
      prev.includes(categoria)
        ? prev.filter((cat) => cat !== categoria)
        : [...prev, categoria]
    );
  };

  const calcularCategoria = (fechaNacimiento) => {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    const edad = hoy.getFullYear() - fechaNac.getFullYear();

    if (edad >= 4 && edad <= 10) return "A";
    if (edad >= 11 && edad <= 16) return "B";
    if (edad >= 17 && edad <= 23) return "C";
    if (edad >= 24 && edad <= 35) return "D";
    if (edad >= 36) return "E";
    return "N"; // Para edades menores a 4 años
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Una vez borrado, no podrás recuperar este competidor.",
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
          `http://localhost:5000/api/competidores/${id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) throw new Error("Error al borrar el competidor");
        setCompetidores(
          competidores.filter((competidor) => competidor.id !== id)
        );
        Swal.fire("¡Competidor borrado exitosamente!", {
          icon: "success",
          buttonsStyling: false,
          customClass: {
            confirmButton: 'bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'
          }
        });
      } catch (err) {
        console.error("Error:", err);
        Swal.fire("Error al borrar el competidor", {
          icon: "error",
        });
      }
    } else {
      Swal.fire("El competidor no fue borrado");
    }
  };

  useEffect(() => {
    const fetchCompetidores = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/competidores");
        if (!response.ok) throw new Error("Error al cargar competidores");
        const data = await response.json();
        // Add categoria to each competitor
        const competidoresConCategoria = data.map((comp) => ({
          ...comp,
          categoria: calcularCategoria(comp.fecha_nacimiento),
        }));
        setCompetidores(competidoresConCategoria);
      } catch (error) {
        console.error("Error:", error);
      }
      setIsLoading(false);
    };
    fetchCompetidores();
  }, []);

  const filteredCompetidores = competidores.filter((comp) => {
    const matchesSearch = comp.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(comp.categoria);
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-neutral-light to-white p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="w-full md:w-96">
              <input
                type="text"
                placeholder="Buscar competidor..."
                className="w-full px-4 py-2 rounded-lg border border-neutral/30 focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => navigate("/RegistroCompetidor")}
              className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90"
            >
              Registrar Nuevo Competidor
            </button>
            {/* Category Filters */}
            <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg shadow">
              <div className="w-full md:w-auto">
                <h2 className="text-md font-bold text-gray-800 mb-4 md:mb-0">
                  Filtros por Categorías:
                </h2>
              </div>
              <div className="flex flex-wrap gap-4">
                {categorias.map((categoria) => (
                  <label
                    key={categoria}
                    className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer min-w-[120px]"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(categoria)}
                      onChange={() => handleCategoryChange(categoria)}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700 select-none">
                      {categoria}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Consultar Competidores
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                <p className="text-gray-600">Cargando...</p>
              ) : competidores.length === 0 ? (
                <p className="text-gray-600">
                  No se han registrado competidores
                </p>
              ) : (
                filteredCompetidores.map((competidor) => (
                  <CompetidorCardAdmin
                    key={competidor.id}
                    competidor={competidor}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
