import React from "react";

export const CompetidorCard = ({competidor}) => {
  return (
    <>
      <div
        key={competidor.id}
        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
      >
        <img
          src={competidor.foto}
          alt={competidor.nombre}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-neutral-dark">
            {competidor.nombre}
          </h3>
          <span className="inline-block px-3 py-1 mt-2 text-sm rounded-full bg-primary/10 text-primary">
            {competidor.categoria}
          </span>
        </div>
      </div>
    </>
  );
};
