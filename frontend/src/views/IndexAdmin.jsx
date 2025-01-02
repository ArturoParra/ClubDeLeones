import React, { useState } from "react";
import { Header } from "../components/Header";
import { EventoCard } from "../components/EventoCard";
import { Link } from "react-router-dom";

export const IndexAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const eventosPerPage = 12;

  const eventos = [
    {
      id: 1,
      nombre: "Torneo Regional 2024",
      fecha: "2024-03-15",
      tipo: "Torneo",
      categorias: ["Junior", "Senior", "Master"],
    },
    {
      id: 2,
      nombre: "Conferencia de Liderazgo",
      fecha: "2024-04-20",
      tipo: "Conferencia",
      categorias: ["General"],
    },
    {
      id: 3,
      nombre: "Campeonato Estatal",
      fecha: "2024-05-10",
      tipo: "Torneo",
      categorias: ["Juvenil", "Adulto"],
    },
    {
      id: 4,
      nombre: "Exposición de Arte Juvenil",
      fecha: "2024-06-05",
      tipo: "Exposición",
      categorias: ["Arte", "Juvenil"],
    },
    {
      id: 5,
      nombre: "Festival de Música 2024",
      fecha: "2024-07-15",
      tipo: "Festival",
      categorias: ["Coral", "Orquesta"],
    },
    {
      id: 6,
      nombre: "Torneo Nacional de Verano",
      fecha: "2024-08-01",
      tipo: "Torneo",
      categorias: ["Juvenil", "Master"],
    },
    {
      id: 7,
      nombre: "Concurso de Fotografía",
      fecha: "2024-09-10",
      tipo: "Concurso",
      categorias: ["Junior", "Senior"],
    },
    {
      id: 8,
      nombre: "Seminario de Innovación",
      fecha: "2024-10-05",
      tipo: "Seminario",
      categorias: ["General"],
    },
    {
      id: 9,
      nombre: "Carrera Atlética Anual",
      fecha: "2024-11-12",
      tipo: "Competencia",
      categorias: ["5K", "10K"],
    },
    {
      id: 10,
      nombre: "Feria Tecnológica",
      fecha: "2024-12-01",
      tipo: "Feria",
      categorias: ["General"],
    },
    {
      id: 11,
      nombre: "Encuentro de Voluntarios",
      fecha: "2025-01-20",
      tipo: "Encuentro",
      categorias: ["General"],
    },
    {
      id: 12,
      nombre: "Campeonato de Invierno",
      fecha: "2025-02-10",
      tipo: "Torneo",
      categorias: ["Senior", "Master"],
    },
    {
      id: 13,
      nombre: "Taller de Desarrollo Personal",
      fecha: "2025-03-05",
      tipo: "Taller",
      categorias: ["General"],
    },
    {
      id: 14,
      nombre: "Feria de Ciencias",
      fecha: "2025-04-15",
      tipo: "Feria",
      categorias: ["Junior", "Senior"],
    },
    {
      id: 15,
      nombre: "Competencia de Robótica",
      fecha: "2025-05-20",
      tipo: "Competencia",
      categorias: ["Juvenil", "Adulto"],
    },
    {
      id: 16,
      nombre: "Cumbre Anual de Líderes",
      fecha: "2025-06-10",
      tipo: "Cumbre",
      categorias: ["General"],
    },
    {
      id: 17,
      nombre: "Exposición Fotográfica",
      fecha: "2025-07-05",
      tipo: "Exposición",
      categorias: ["Arte", "Juvenil"],
    },
    {
      id: 18,
      nombre: "Maratón Internacional",
      fecha: "2025-08-15",
      tipo: "Competencia",
      categorias: ["10K", "21K", "42K"],
    },
    {
      id: 19,
      nombre: "Festival de Gastronomía",
      fecha: "2025-09-25",
      tipo: "Festival",
      categorias: ["General"],
    },
    {
      id: 20,
      nombre: "Encuentro de Arte y Cultura",
      fecha: "2025-10-30",
      tipo: "Encuentro",
      categorias: ["Arte", "Cultura"],
    },
  ];

  const categorias = ["Junior", "Senior", "Master"];

  const handleCategoryChange = (categoria) => {
    setSelectedCategories((prev) =>
      prev.includes(categoria)
        ? prev.filter((cat) => cat !== categoria)
        : [...prev, categoria]
    );
  };

  const filteredEventos = eventos.filter((comp) => {
    const matchesSearch = comp.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.some((cat) => comp.categorias.includes(cat));
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const indexOfLastEvent = currentPage * eventosPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventosPerPage;
  const currentEventos = filteredEventos.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );
  const totalPages = Math.ceil(filteredEventos.length / eventosPerPage);

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
                placeholder="Buscar evento..."
                className="w-full px-4 py-2 rounded-lg border border-neutral/30 focus:outline-none focus:ring-2 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Link to="/FormEvento" className="w-full md:w-96">
              <button className="bg-green-700 p-2 px-5 rounded-md hover:bg-green-700/90 hover: text-white">
                Crear nuevo evento
              </button>
            </Link>

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

          {/* Grid de eventos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentEventos.map((event) => (
              <EventoCard key={event.id} event={event} />
            ))}
          </div>

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
