import React from "react";
import { useCategorize } from "../hooks/useCategorize";

export const CompetidorCard = ({competidor, categoria}) => {

  const { id, nombre, foto } = competidor;

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
        </div>
      </div>
    </>
  );
};
