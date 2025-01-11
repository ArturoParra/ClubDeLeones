import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { CompetidorCard } from "../components/CompetidorCard";

export const IndexEntrenador = () => {
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

  // Pagination logic
  const indexOfLastCompetidor = currentPage * competidoresPerPage;
  const indexOfFirstCompetidor = indexOfLastCompetidor - competidoresPerPage;
  const currentCompetidores = filteredCompetidores.slice(
    indexOfFirstCompetidor,
    indexOfLastCompetidor
  );
  const totalPages = Math.ceil(
    filteredCompetidores.length / competidoresPerPage
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
      setCurrentPage(1);
    }, [searchTerm, selectedCategories]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-neutral-light to-white p-6">
        {/* Filtros y búsqueda */}
        <div className="max-w-7xl mx-auto space-y-6">
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

          {/* Grid de competidores */}
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
            </div>
          ) : competidores.length === 0 ? (
            <div className="w-full text-center">
              <p className="font-bold text-4xl text-neutral-dark">
                No se pudieron cargar los competidores :{`\(`}
              </p>
            </div>
          ) : currentCompetidores.length === 0 ? (
            <div className="w-full text-center">
              <p className="font-bold text-4xl text-neutral-dark">
                No se encontraron coincidencias :{`\(`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
              {currentCompetidores.map((competidor) => (
                <CompetidorCard
                  key={competidor.id}
                  competidor={competidor}
                  categoria={calcularCategoria(competidor.fecha_nacimiento)}
                />
              ))}
            </div>
          )}

          {/* Paginación */}
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-50 font-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div className="flex space-x-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 rounded-lg ${
                    currentPage === index + 1
                      ? "bg-primary text-white"
                      : "bg-white border border-primary text-primary"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-50 font-black"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
