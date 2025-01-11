import React from "react";
import { useNavigate } from "react-router-dom";

export const CompetidorCard = ({competidor, categoria}) => {
  const navigate = useNavigate();
  const { id, nombre, foto_url } = competidor;

  const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cccccc'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

  const imageUrl = foto_url ? `http://localhost:5000/${foto_url}` : defaultAvatar;

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
          src={imageUrl}
          alt={nombre}
          className="w-full h-48 object-contain"
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