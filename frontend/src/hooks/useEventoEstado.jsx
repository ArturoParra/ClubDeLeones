import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";

export const useEventoEstado = (fechaInicio, fechaFin) => {
  const [estado, setEstado] = useState("Sin estado");
  const today = new Date()
  const formattedToday = today.toLocaleDateString("en-CA");

  const [fechaInicioFormateada, setfechaInicioFormateada] = useState(
    fechaInicio ? format(parseISO(fechaInicio), "dd/MM/yyyy") : null
  );
  const [fechaFinFormateada, setfechaFinFormateada] = useState(
    fechaFin ? format(parseISO(fechaFin), "dd/MM/yyyy") : null
  );

  const fechaInicioStr = fechaInicio
    ? parseISO(fechaInicio).toISOString().split("T")[0]
    : null;
  const fechaFinStr = fechaFin
    ? parseISO(fechaFin).toISOString().split("T")[0]
    : null;

  useEffect(() => {
    if (fechaInicioStr) {
      if (fechaInicioStr < formattedToday) {
        
        if (fechaFinStr >= formattedToday) {
          setEstado("En Curso");
        } else {
          setEstado("Finalizado");
        }
      } else if (fechaInicioStr > formattedToday) {
        setEstado("Próximo");
      } else {
        setEstado("En Curso");
      }
    } else {
      setEstado("Sin estado"); // Manejo de fechas inválidas o nulas
    }
  }, [fechaInicioStr, fechaFinStr, formattedToday]);

  const colorClase =
    estado === "En Curso"
      ? "text-green-500 bg-green-100 p-1 rounded-lg"
      : estado === "Finalizado"
      ? "text-red-500 bg-red-100 p-1 rounded-lg"
      : "text-blue-500 bg-blue-100 p-1 rounded-lg"; // Para "Próximo"

  return { estado, colorClase, fechaInicioFormateada, fechaFinFormateada };
};
