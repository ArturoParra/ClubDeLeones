import React from "react";
import { format } from "date-fns";

export const EventoCard = ({ evento }) => {
  const fechaInicio = evento.fecha_inicio ? new Date(evento.fecha_inicio) : null;
  const fechaFin = evento.fecha_fin ? new Date(evento.fecha_fin) : null;

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        {/* Event Header */}
        <div className="bg-primary p-4">
          <h3 className="text-xl font-bold text-white">{evento.nombre}</h3>
        </div>

        {/* Event Content */}
        <div className="p-4 space-y-4">
          {/* Date and Type */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {fechaFin ? (
                <span className="text-neutral-dark">
                  {format(new Date(fechaInicio), "dd/MM/yyyy")} -{" "}
                  {format(new Date(fechaFin), "dd/MM/yyyy")}
                </span>
              ) : (
                <span className="text-neutral-dark">
                  {format(new Date(fechaInicio), "dd/MM/yyyy")}
                </span>
              )}
            </div>
            <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
              {evento.tipo}
            </span>
          </div>
          {/* Categories */}
          <div>
            <h4 className="text-sm font-medium text-neutral-dark mb-2">
              Categorías:
            </h4>
            <div className="flex flex-wrap gap-2">
              {evento.categorias.map((categoria, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full"
                >
                  {categoria}
                </span>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full mt-4 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors">
            Ver detalles
          </button>
        </div>
      </div>
    </>
  );
};
