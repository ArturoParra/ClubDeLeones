import React, { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { CompetidorCard } from "../components/CompetidorCard";

export const IndexEntrenador = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [competidores, setCompetidores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const competidoresPerPage = 12;

  useEffect(() => {
    const fetchCompetidores = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/competidores");
        if (!response.ok) throw new Error("Error al cargar competidores");
        const data = await response.json();
        setCompetidores(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchCompetidores();
  }, []);

  const categorias = ["A", "B", "C", "D", "E"];

  const handleCategoryChange = (categoria) => {
    setSelectedCategories((prev) =>
      prev.includes(categoria)
        ? prev.filter((cat) => cat !== categoria)
        : [...prev, categoria]
    );
  };

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

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
            <div className="flex flex-wrap gap-4">
              {categorias.map((categoria) => (
                <label key={categoria} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(categoria)}
                    onChange={() => handleCategoryChange(categoria)}
                    className="form-checkbox text-primary rounded"
                  />
                  <span>{categoria}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Grid de competidores */}
          {competidores.length === 0 ? (
            <p className="text-center font-bold text-4xl text-neutral-dark">
              No se pudieron cargar los competidores :{`\(`}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentCompetidores.map((competidor) => (
                <CompetidorCard key={competidor.id} competidor={competidor} />
              ))}
            </div>
          )}

          {/* Paginación */}
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-50"
            >
              Anterior
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
              className="px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
