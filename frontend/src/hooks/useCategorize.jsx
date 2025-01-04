import { useMemo } from "react";

/**
 * Custom Hook para categorizar un arreglo de objetos basado en rangos de edad.
 * @param {Array} items - Arreglo de objetos con los atributos id, nombre, fecha (como string ISO) y foto.
 * @returns {Array} - Nuevo arreglo con los mismos objetos pero con el atributo "categoria" agregado.
 */
export const useCategorize = (item) => {
  const competidorCategorizado = useMemo(() => {
    const calculateAge = (birthDate) => {
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    };

    const categorizeAge = (age) => {
      if (age >= 4 && age <= 10) return "Categoría A";
      if (age >= 11 && age <= 16) return "Categoría B";
      if (age >= 17 && age <= 23) return "Categoría C";
      if (age >= 24 && age <= 35) return "Categoría D";
      if (age >= 36) return "Categoría E";
      return "Sin Categoría"; // Para edades menores a 4 años
    };

    const age = calculateAge(item.fecha_nacimiento);
    return {
      ...item,
      categoria: categorizeAge(age),
    };
  }, [item]);

  return competidorCategorizado;
};