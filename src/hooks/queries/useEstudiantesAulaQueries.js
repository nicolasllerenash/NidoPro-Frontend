// src/hooks/queries/useEstudiantesAulaQueries.js
import { useQuery } from '@tanstack/react-query';
import { matriculaAulaService } from '../../services/matriculaAulaService';

/**
 * Hook para obtener estudiantes de un aula específica
 * @param {string} idAula - ID del aula
 * @param {Object} options - Opciones del query
 * @returns {Object} Query result con lista de estudiantes
 */
export const useEstudiantesAula = (idAula, options = {}) => {
  return useQuery({
    queryKey: ['estudiantes-aula', idAula],
    queryFn: () => matriculaAulaService.getEstudiantesAula(idAula),
    enabled: !!idAula && options.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    ...options,
  });
};
