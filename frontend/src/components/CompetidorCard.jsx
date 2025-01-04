import React from "react";
import { useNavigate } from "react-router-dom";

export const CompetidorCard = ({competidor, categoria}) => {
  const navigate = useNavigate();
  const { id, nombre, foto } = competidor;

  const handleVerDetalles = () => {
    navigate(`/DetallesCompetidor/${id}`, { 
      state: { competidor: {...competidor, categoria} }
    });
  };

  return (
    <>
      <div
        key={id}
        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
      >
        <img
          src={foto}
          alt={nombre}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-neutral-dark">
            {nombre}
          </h3>
          <span className="inline-block px-3 py-1 mt-2 text-sm rounded-full bg-primary/10 text-primary">
            Categoría {categoria}
          </span>
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleVerDetalles}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Ver Detalles
            </button>
          </div>
        </div>
      </div>
    </>
  );
};