import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { gradoService } from '../services/gradoService';
import gradosService from '../services/gradosService';

// Query keys para los grados
export const GRADOS_QUERY_KEYS = {
  all: ['grados'],
  lists: () => [...GRADOS_QUERY_KEYS.all, 'list'],
  list: (filters) => [...GRADOS_QUERY_KEYS.lists(), { filters }],
  details: () => [...GRADOS_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...GRADOS_QUERY_KEYS.details(), id],
};

/**
 * Hook para gestionar grados
 */
export const useGrados = () => {
  const queryClient = useQueryClient();

  // Query para obtener todos los grados
  const gradosQuery = useQuery({
    queryKey: GRADOS_QUERY_KEYS.lists(),
    queryFn: () => gradoService.getAllGrados(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error) => {
      console.error('❌ Error al cargar grados:', error);
      toast.error('Error al cargar los grados disponibles');
    }
  });

  // Mutation para crear grado
  const createGradoMutation = useMutation({
    mutationFn: (gradoData) => gradoService.createGrado(gradoData),
    onSuccess: (data) => {
      // Invalidar caché para refrescar la lista
      queryClient.invalidateQueries(GRADOS_QUERY_KEYS.lists());
    },
    onError: (error) => {
      console.error('❌ Error al crear grado:', error);
    }
  });

  // Mutation para actualizar grado
  const updateGradoMutation = useMutation({
    mutationFn: ({ id, data }) => gradoService.updateGrado(id, data),
    onSuccess: (data, variables) => {
      // Invalidar caché específico del grado y lista general
      queryClient.invalidateQueries(GRADOS_QUERY_KEYS.detail(variables.id));
      queryClient.invalidateQueries(GRADOS_QUERY_KEYS.lists());
    },
    onError: (error) => {
      console.error('❌ Error al actualizar grado:', error);
    }
  });

  // Mutation para eliminar grado
  const deleteGradoMutation = useMutation({
    mutationFn: (id) => gradoService.deleteGrado(id),
    onSuccess: (data, id) => {
      // Remover del caché y refrescar lista
      queryClient.removeQueries(GRADOS_QUERY_KEYS.detail(id));
      queryClient.invalidateQueries(GRADOS_QUERY_KEYS.lists());
    },
    onError: (error) => {
      console.error('❌ Error al eliminar grado:', error);
    }
  });

  // Funciones de utilidad
  const refetchGrados = () => {
    return queryClient.invalidateQueries(GRADOS_QUERY_KEYS.lists());
  };

  const prefetchGrado = (id) => {
    return queryClient.prefetchQuery({
      queryKey: GRADOS_QUERY_KEYS.detail(id),
      queryFn: () => gradoService.getGradoById(id),
      staleTime: 5 * 60 * 1000,
    });
  };

  // Helpers para buscar grados
  const findGradoById = (id) => {
    const grados = gradosQuery.data || [];
    return grados.find(grado => grado.idGrado === id || grado.id === id);
  };

  const findGradoByNombre = (nombre) => {
    const grados = gradosQuery.data || [];
    return grados.find(grado => 
      grado.nombre?.toLowerCase() === nombre?.toLowerCase()
    );
  };

  const getGradosOptions = () => {
    const grados = gradosQuery.data || [];
    return grados.map(grado => ({
      value: grado.idGrado || grado.id,
      label: grado.nombre,
      data: grado
    }));
  };

  return {
    // Datos de los grados
    grados: gradosQuery.data || [],
    isLoading: gradosQuery.isLoading,
    isError: gradosQuery.isError,
    error: gradosQuery.error,
    isSuccess: gradosQuery.isSuccess,
    
    // Mutations
    createGrado: createGradoMutation.mutate,
    updateGrado: updateGradoMutation.mutate,
    deleteGrado: deleteGradoMutation.mutate,
    
    // Estados de las mutations
    isCreating: createGradoMutation.isLoading,
    isUpdating: updateGradoMutation.isLoading,
    isDeleting: deleteGradoMutation.isLoading,
    
    // Errores de las mutations
    createError: createGradoMutation.error,
    updateError: updateGradoMutation.error,
    deleteError: deleteGradoMutation.error,
    
    // Funciones de utilidad
    refetchGrados,
    prefetchGrado,
    findGradoById,
    findGradoByNombre,
    getGradosOptions,
    
    // Query object para casos avanzados
    gradosQuery,
    
    // Para mantener compatibilidad con la versión anterior
    loadingGrados: gradosQuery.isLoading,
    errorGrados: gradosQuery.error,
  };
};

/**
 * Hook para obtener un grado específico por ID
 * @param {string} id - ID del grado
 * @param {Object} options - Opciones adicionales para la query
 */
export const useGrado = (id, options = {}) => {
  return useQuery({
    queryKey: GRADOS_QUERY_KEYS.detail(id),
    queryFn: () => gradoService.getGradoById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook para obtener opciones de grados formateadas para selects
 */
export const useGradosOptions = () => {
  const { grados, isLoading, isError } = useGrados();
  
  const options = grados.map(grado => ({
    value: grado.idGrado || grado.id,
    label: grado.grado || grado.nombre,
    grado: grado
  }));

  return {
    options,
    isLoading,
    isError,
    hasGrados: grados.length > 0
  };
};

// Hook simple para crear grado (para modales rápidos)
const useGradosSimple = () => {
  const queryClient = useQueryClient();
  
  const crearGrado = async (data) => {
    try {
      const result = await gradoService.createGrado(data);
      
      // Invalidar el caché de la tabla de grados para que se actualice inmediatamente
      queryClient.invalidateQueries(GRADOS_QUERY_KEYS.lists());
      
      return result;
    } catch (error) {
      throw error;
    }
  };
  
  const editarGrado = async (id, data) => {
    try {
      const result = await gradoService.updateGrado(id, data);
      queryClient.invalidateQueries(GRADOS_QUERY_KEYS.lists());
      return result;
    } catch (error) {
      throw error;
    }
  };

  return { crearGrado, editarGrado };
};

export default useGradosSimple;

/**
 * Hook para obtener todos los grados para la tabla
 */
export const useGradosTabla = () => {
  return useQuery({
    queryKey: GRADOS_QUERY_KEYS.lists(),
    queryFn: gradoService.getAllGrados,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    retry: 3,
    onError: (error) => {
      console.error('❌ Error al cargar grados en tabla:', error);
      toast.error('Error al cargar los grados');
    },
    // Asegurar que siempre retorne un array y extraer correctamente los datos
    select: (data) => {
      // Si ya es un array, devolverlo
      if (Array.isArray(data)) {
        return data;
      }
      
      // Si tiene la estructura response.info.data
      if (data?.info?.data && Array.isArray(data.info.data)) {
        return data.info.data;
      }
      
      // Si tiene la estructura response.grados
      if (data?.grados && Array.isArray(data.grados)) {
        return data.grados;
      }
      
      // Si tiene la estructura response.data
      if (data?.data && Array.isArray(data.data)) {
        return data.data;
      }
      
      // Fallback: array vacío
      return [];
    }
  });
};
