import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      token: null,
      role: null,
      permissions: [],
      isAuthenticated: false,
      loading: false,
      error: null,
      initialized: false,

      // Acciones de autenticación
      login: (userData) => {
        set({
          user: userData.user,
          token: userData.token,
          role: userData.role,
          permissions: userData.permissions || [],
          isAuthenticated: true,
          error: null,
        });
      },

      logout: async () => {
        try {
          // Llamar al servicio de logout para limpiar en el backend
          const { authService } = await import("../services/authService");
          await authService.logout();
        } catch (error) {
          // Error al cerrar sesión en backend (se ignora en cliente)
        }

        // Limpiar estado de Zustand
        set({
          user: null,
          token: null,
          role: null,
          permissions: [],
          isAuthenticated: false,
          loading: false,
          error: null,
          initialized: false,
        });

        // Limpiar localStorage completamente
        localStorage.removeItem("token");
        localStorage.removeItem("auth-storage");

        // Redirigir al login
        window.location.href = "/login";
      },

      setLoading: (loading) => {
        set({ loading });
      },

      setError: (error) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      // Actualizar perfil de usuario
      updateProfile: (profileData) => {
        set((state) => ({
          user: { ...state.user, ...profileData },
        }));
      },

      // Actualizar usuario completo
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },

      // Verificar si el usuario tiene un permiso específico
      hasPermission: (permission) => {
        const { permissions } = get();
        return permissions.includes(permission);
      },

      // Verificar si el usuario tiene un rol específico
      hasRole: (roleName) => {
        const { role } = get();
        return role?.nombre === roleName;
      },

      // Verificar si es admin
      isAdmin: () => {
        const { role } = get();
        return (
          role?.nombre === "admin" ||
          role?.nombre === "administrador" ||
          role?.nombre === "ADMINISTRADOR"
        );
      },

      // Verificar si es profesor/trabajador
      isTrabajador: () => {
        const { role } = get();
        return role?.nombre === "profesor" || role?.nombre === "trabajador";
      },

      // Verificar si es padre
      isPadre: () => {
        const { role } = get();
        return role?.nombre === "padre" || role?.nombre === "parent";
      },

      // Verificar si es especialista
      isEspecialista: () => {
        const { role } = get();
        return role?.nombre === "especialista" || role?.nombre === "specialist";
      },

      // Obtener el ID del rol para APIs
      getRoleId: () => {
        const { role } = get();
        return role?.id || null;
      },

      // Inicializar desde token existente
      initializeAuth: async () => {
        const { initialized } = get();
        if (initialized) return; // Evitar múltiples inicializaciones

        set({ loading: true, initialized: true });

        const token = localStorage.getItem("token");
        if (token) {
          // Para modo desarrollo, validar directamente sin backend
          if (token.startsWith("dev-token-")) {
            const userId = token.replace("dev-token-", "");
            const testUsers = {
              1: {
                id: "1",
                email: "admin@nidopro.com",
                nombre: "Administrador",
                apellido: "Sistema",
                role: { id: "1", nombre: "admin" },
                permissions: ["all"],
              },
              2: {
                id: "2",
                email: "trabajador@nidopro.com",
                nombre: "Juan",
                apellido: "Pérez",
                role: { id: "2", nombre: "trabajador" },
                permissions: ["read_students", "write_students"],
              },
            };

            const user = testUsers[userId];
            if (user) {
              set({
                user,
                token,
                isAuthenticated: true,
                role: user.role,
                permissions: user.permissions,
                loading: false,
              });
              return;
            }
          }

          // Para tokens reales, verificar si es un token válido localmente sin llamar al backend
          // (Comentado para evitar error 404 ya que no existe /auth/validate en el backend)
          /*
          try {
            const { authService } = await import('../services/authService');
            const validation = await authService.validateToken(token);
            
            if (validation.valid) {
              set({ 
                user: validation.user,
                token, 
                isAuthenticated: true, 
                role: validation.role,
                permissions: validation.permissions || [],
                loading: false 
              });
            } else {
              throw new Error('Token inválido');
            }
          } catch (error) {
            // Si falla la validación del backend, mantener el estado persistido
            console.log('Backend no disponible, manteniendo sesión persistida');
          }
          */

          // Si hay un token guardado, mantener el estado persistido

          // Obtener el estado persistido del localStorage
          const persistedState = JSON.parse(
            localStorage.getItem("auth-storage") || "{}"
          );

          if (
            persistedState.state &&
            persistedState.state.user &&
            persistedState.state.role
          ) {
            // Restaurar el estado persistido completo
            set({
              user: persistedState.state.user,
              token,
              isAuthenticated: true,
              role: persistedState.state.role,
              permissions: persistedState.state.permissions || [],
              loading: false,
              error: null,
            });
          } else {
            // Si no hay estado persistido, limpiar todo
            localStorage.removeItem("token");
            localStorage.removeItem("auth-storage");
            set({
              user: null,
              token: null,
              role: null,
              permissions: [],
              isAuthenticated: false,
              loading: false,
              error: null,
            });
          }
        } else {
          // Si no hay token, establecer loading como false
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage", // Nombre para localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        role: state.role,
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export { useAuthStore };
