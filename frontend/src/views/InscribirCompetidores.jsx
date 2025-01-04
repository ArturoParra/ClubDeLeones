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

    // Mock data - replace with API call
    useEffect(() => {
        setCompetidores([
            { id: 1, nombre: "Juan Pérez", categoria: "A" },
            { id: 2, nombre: "Ana López", categoria: "B" },
            { id: 3, nombre: "Luis García", categoria: "C" },
            { id: 4, nombre: "María Fernández", categoria: "D" },
            { id: 5, nombre: "Pedro Martínez", categoria: "E" },
            { id: 6, nombre: "Laura Sánchez", categoria: "A" },
            { id: 7, nombre: "Carlos Gómez", categoria: "B" },
            { id: 8, nombre: "Lucía Herrera", categoria: "C" },
            { id: 9, nombre: "Jorge Ramírez", categoria: "D" },
            { id: 10, nombre: "Elena Jiménez", categoria: "E" },
            { id: 11, nombre: "Andrés Torres", categoria: "A" },
            { id: 12, nombre: "Gabriela Morales", categoria: "B" },
            { id: 13, nombre: "Ricardo Castillo", categoria: "C" },
            { id: 14, nombre: "Isabel Vargas", categoria: "D" },
            { id: 15, nombre: "Diego Ortiz", categoria: "E" },
            { id: 16, nombre: "Paula Cruz", categoria: "A" },
            { id: 17, nombre: "Sergio Ríos", categoria: "B" },
            { id: 18, nombre: "Mónica López", categoria: "C" },
            { id: 19, nombre: "Tomás Navarro", categoria: "D" },
            { id: 20, nombre: "Adriana Flores", categoria: "E" }
        ]);
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
                                        <h3 className="font-semibold">{competidor.nombre}</h3>
                                        <p className="text-sm text-neutral">{competidor.categoria}</p>
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