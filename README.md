# EDA-Frontend

## 🎓 Sistema de Gestión Educativa - Frontend

**EDA** es un sistema completo de gestión educativa desarrollado con React + Vite, diseñado para facilitar la administración de centros educativos mediante interfaces específicas para cada rol.

## ✨ Características Principales

### 🎨 **Diseño Elegante y Moderno**

- Interfaz minimalista con paleta de colores profesional
- Tipografía Inter de Google Fonts
- Componentes reutilizables y responsive
- Animaciones suaves y efectos glass-morphism

### 👥 **Sistema de Roles Multifuncional**

- **Administradores**: Gestión completa de usuarios y sistema
- **Docentes**: Administración de clases y estudiantes
- **Padres**: Seguimiento académico de sus hijos
- **Especialistas**: Evaluaciones psicopedagógicas

### 🏗️ **Arquitectura Escalable**

- Estructura organizada por roles y funcionalidades
- Componentes modulares y reutilizables
- Hooks personalizados para lógica de negocio
- Servicios centralizados para autenticación

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Hannalab-pe/EDA-Frontend.git

# Navegar al directorio
cd EDA-Frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El proyecto estará disponible en: `http://localhost:5173/`

## 📁 Estructura del Proyecto

```
src/
├── assets/
│   └── images/
│       └── logo.svg                 # Logo personalizado
├── components/
│   ├── common/
│   │   ├── Button.jsx + .css        # Botones reutilizables
│   │   └── Input.jsx + .css         # Inputs con validación
│   └── layout/
│       └── AuthLayout.jsx + .css    # Layout de autenticación
├── data/
│   └── users.json                   # Datos de usuarios de prueba
├── hooks/
│   └── useAuth.js                   # Hook de autenticación
├── pages/
│   ├── admin/                       # Páginas de administración
│   │   ├── AdminDashboard.jsx
│   │   └── Users.jsx
│   ├── teacher/                     # Páginas de docentes
│   │   ├── TeacherDashboard.jsx
│   │   └── Classes.jsx
│   ├── parent/                      # Páginas de padres
│   │   ├── ParentDashboard.jsx
│   │   └── Children.jsx
│   ├── specialist/                  # Páginas de especialistas
│   │   ├── SpecialistDashboard.jsx
│   │   └── Evaluations.jsx
│   ├── Dashboard.jsx                # Router principal
│   └── Login.jsx                    # Página de login
├── services/
│   └── authService.js               # Servicio de autenticación
├── styles/
│   └── globals.css                  # Estilos globales
└── utils/
    └── index.js                     # Utilidades generales
```

## 👤 Usuarios de Prueba

| Rol | Email | Contraseña | Descripción |
|-----|-------|------------|-------------|
| **Director** | <director@nidopro.edu> | director123 | Administración completa |
| **Docente** | <docente1@nidopro.edu> | docente123 | Gestión de clases |
| **Padre** | <padre1@gmail.com> | padre123 | Seguimiento de hijos |
| **Especialista** | <psicologa@nidopro.edu> | especialista123 | Evaluaciones |

## 🎯 Funcionalidades por Rol

### 👩‍💼 **Administradores**

- Dashboard con estadísticas generales
- Gestión completa de usuarios
- Control de permisos y accesos
- Reportes del sistema

### 👨‍🏫 **Docentes**

- Dashboard con resumen de clases
- Gestión de estudiantes por clase
- Sistema de calificaciones
- Comunicación con padres

### 👪 **Padres de Familia**

- Seguimiento académico por hijo
- Visualización de calificaciones y asistencia
- Comunicación con docentes
- Notificaciones del centro educativo

### 👩‍⚕️ **Especialistas**

- Gestión de evaluaciones psicopedagógicas
- Seguimiento de casos especiales
- Programación de citas
- Reportes especializados

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19.1.1 + Vite 7.1.2
- **Routing**: React Router DOM 6.26.1
- **Estilos**: CSS3 con variables personalizadas
- **Tipografía**: Google Fonts (Inter)
- **Iconografía**: Emojis y símbolos Unicode
- **Autenticación**: Local Storage + JSON

## 🎨 Sistema de Diseño

### Paleta de Colores

```css
/* Colores Principales */
--primary-color: #64748b      /* Slate 500 */
--primary-dark: #475569       /* Slate 600 */

/* Colores Neutros */
--secondary-color: #f8fafc    /* Slate 50 */
--border-color: #e2e8f0       /* Slate 200 */
--text-primary: #1e293b       /* Slate 800 */
--text-secondary: #64748b     /* Slate 500 */

/* Estados */
--success-color: #059669      /* Emerald 600 */
--error-color: #dc2626        /* Red 600 */
--warning-color: #d97706      /* Amber 600 */
```

### Componentes

- **Buttons**: 3 variantes (primary, secondary, outline)
- **Inputs**: Con validación y estados de error
- **Cards**: Con hover effects y sombras
- **Navigation**: Sidebar con estados activos

## 📋 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo

# Construcción
npm run build        # Build para producción
npm run preview      # Preview del build

# Calidad de código
npm run lint         # Ejecutar ESLint
```

## 🔄 Roadmap Futuro

- [ ] Integración con backend NestJS
- [ ] Sistema de notificaciones en tiempo real
- [ ] Modo oscuro/claro
- [ ] PWA (Progressive Web App)
- [ ] Internacionalización (i18n)
- [ ] Dashboard analytics avanzado
- [ ] Sistema de chat integrado
- [ ] Exportación de reportes PDF

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Hannalab-pe**

- GitHub: [@Hannalab-pe](https://github.com/Hannalab-pe)

## 🆘 Soporte

Si tienes preguntas o necesitas ayuda, por favor:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue si no encuentras la solución

---

⭐ **¡No olvides darle una estrella si te gusta el proyecto!** ⭐
