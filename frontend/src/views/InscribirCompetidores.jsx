import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { useLocation, useNavigate } from "react-router-dom";

export const InscribirCompetidores = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const evento = location.state.evento;
    const [searchTerm, setSearchTerm] = useState("");
    const [competidores, setCompetidores] = useState([]);
    const [selectedCompetidores, setSelectedCompetidores] = useState([]);

    const [selectedCategories, setSelectedCategories] = useState(evento.categorias);

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
        };
        fetchCompetidores();
      }, []);

    const handleSelect = (competidor) => {
        if (!selectedCompetidores.find(c => c.id === competidor.id)) {
            setSelectedCompetidores([...selectedCompetidores, competidor]);
        }
    };

    const handleRemove = (id) => {
        setSelectedCompetidores(selectedCompetidores.filter(c => c.id !== id));
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

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-b from-neutral-light to-white p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-neutral-dark">
                            Inscribir Competidores - {evento.nombre}
                        </h1>
                        <button
                            onClick={() => navigate('/RegistroCompetidor')}
                            className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90"
                        >
                            Registrar Nuevo Competidor
                        </button>
                    </div>

                    <div className=" grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left Column - Competitor Search and Grid */}
                        <div className=" md:col-span-2 bg-white rounded-xl shadow-lg p-6">
                            <input
                                type="text"
                                placeholder="Buscar competidor..."
                                className="w-full px-4 py-2 mb-4 border border-neutral/30 rounded-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            
                            <div className="overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {filteredCompetidores.map(competidor => (
                                    <div
                                    key={competidor.id}
                                    className="p-4 border rounded-lg hover:shadow-md hover:bg-green-300/70 transition-colors duration-500 cursor-pointer"
                                    onClick={() => handleSelect(competidor)}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-100 flex-shrink-0">
                                            <img
                                                src={competidor.foto || "/placeholder-user.png"}
                                                alt={competidor.nombre}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{competidor.nombre}</h3>
                                            <p className="text-sm text-neutral">{competidor.categoria}</p>
                                        </div>
                                    </div>
                                </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column - Selected Competitors */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Competidores Seleccionados ({selectedCompetidores.length})
                            </h2>
                            <div className="space-y-3">
                                {selectedCompetidores.map(competidor => (
                                    <div
                                        key={competidor.id}
                                        className="flex justify-between items-center p-3 bg-neutral/5 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium">{competidor.nombre}</p>
                                            <p className="text-sm text-neutral">{competidor.categoria}</p>
                                        </div>
                                        <button
                                            onClick={() => handleRemove(competidor.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                className="w-full mt-6 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
                                disabled={selectedCompetidores.length === 0}
                            >
                                Guardar Inscripciones
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};