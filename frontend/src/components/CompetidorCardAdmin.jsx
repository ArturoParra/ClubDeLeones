import { format, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const CompetidorCardAdmin = ({ competidor, onDelete }) => {
  const navigate = useNavigate();
  const [Fecha_nacComp, setFecha_nacComp] = useState('');

  const { fecha_nacimiento } = competidor;

  useEffect(() => {
      const fechaStr = fecha_nacimiento
      ? parseISO(fecha_nacimiento).toISOString().split("T")[0]
      : null;
      setFecha_nacComp(format(parseISO(fechaStr), "dd/MM/yyyy"))
    }, [fecha_nacimiento])

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
      <h3 className="text-xl font-bold mb-2">{competidor.nombre}</h3>
      <p className="text-gray-600">Categoría: {competidor.categoria}</p>
      <p className="text-gray-600">Fecha de Nacimiento: {Fecha_nacComp}</p>
      <div className="flex justify-end space-x-4 mt-4">
        <button
          onClick={() => navigate(`/EditarCompetidor/${competidor.id}`)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(competidor.id)}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Borrar
        </button>
      </div>
    </div>
  );
};