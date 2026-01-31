// src/hooks/useCronograma.js
import { useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * Hook para obtener todos los cronogramas
 */
export const useCronograma = () => {
  return useQuery({
    queryKey: ['cronogramas'],
    queryFn: async () => {
      try {
        const response = await fetch('http://localhost:3002/api/v1/cronograma', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener cronogramas');
        }

        const data = await response.json();
        
        // El backend devuelve los datos en data.info.data
        return data.info.data || [];
      } catch (error) {
        console.error('Error al obtener cronogramas:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  });
};

/**
 * Hook personalizado para gestionar cronogramas
 */
export const useCronogramaHook = () => {
  const queryClient = useQueryClient();
  
  const { 
    data: cronogramas = [], 
    isLoading: loading, 
    error,
    refetch: fetchCronogramas 
  } = useCronograma();

  /**
   * Función para invalidar la caché y refrescar los datos
   */
  const refreshCronogramas = () => {
    queryClient.invalidateQueries({ queryKey: ['cronogramas'] });
  };

  return {
    cronogramas,
    loading,
    error,
    fetchCronogramas,
    refreshCronogramas
  };
};
