# Módulo de Pensiones - Padres

Este módulo permite a los padres de familia visualizar y gestionar las pensiones de sus hijos en el sistema EDA.

## 📁 Estructura del Módulo

```
src/pages/parent/pensiones/
├── Pensiones.jsx              # Componente principal
├── index.js                   # Export principal
├── modales/
│   └── PensionesModal.jsx     # Componente base para modales
└── tablas/
    └── PensionesTable.jsx     # Tabla de pensiones
```

## 🔧 Funcionalidades

### ✅ Implementadas
- **Visualización de pensiones**: Lista todas las pensiones de los hijos del apoderado
- **Estadísticas**: Muestra resumen de pensiones pagadas, pendientes y vencidas
- **Información del apoderado**: Datos básicos del padre/madre
- **Resumen financiero**: Totales de montos y moras
- **Interfaz responsive**: Adaptable a diferentes tamaños de pantalla

### 🔄 Futuras Implementaciones
- Pago en línea de pensiones
- Visualización de comprobantes de pago
- Solicitud de prórrogas
- Historial de pagos detallado

## 🚀 APIs Utilizadas

### 1. Obtener Apoderado con Estudiantes
```http
GET /api/v1/apoderado/estudiantes
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Apoderado con Estudiantes Obtenido Correctamente",
  "info": {
    "data": [
      {
        "idApoderado": "uuid",
        "nombre": "Juan Luis",
        "apellido": "Torres Garcia",
        "matriculas": [
          {
            "idEstudiante": {
              "nombre": "Pepito Lui",
              "apellido": "Torres Armando"
            }
          }
        ]
      }
    ]
  }
}
```

### 2. Obtener Pensiones del Apoderado
```http
GET /api/v1/pension-estudiante/apoderado/{apoderadoId}
```

**Parámetros opcionales:**
- `idEstudiante`: Filtrar por estudiante específico
- `estadoPension`: PENDIENTE, PAGADO, VENCIDO, CONDONADO
- `anio`: Filtrar por año
- `mes`: Filtrar por mes

**Respuesta:**
```json
[
  {
    "idPensionEstudiante": "uuid",
    "idEstudiante": "uuid",
    "mes": 3,
    "anio": 2025,
    "montoPension": "450.00",
    "fechaVencimiento": "2025-03-15",
    "estadoPension": "PENDIENTE",
    "montoMora": "0.00",
    "estudiante": {
      "nombre": "Tit",
      "apellido": "Perez"
    }
  }
]
```

## 🎯 Lógica de Negocio

1. **Identificación del Apoderado**: Se compara el nombre del usuario actual con los estudiantes de cada apoderado para encontrar el `idApoderado` correspondiente.

2. **Obtención de Pensiones**: Una vez identificado el apoderado, se obtienen todas las pensiones de sus hijos.

3. **Estados de Pensiones**:
   - `PAGADO`: Pensión completamente pagada
   - `PENDIENTE`: Pendiente de pago dentro del plazo
   - `VENCIDO`: Fuera del plazo de pago (con mora)
   - `CONDONADO`: Exonerado del pago

## 🎨 Componentes

### PensionesTable
- Tabla responsive con información completa de pensiones
- Estados visuales con colores e iconos
- Información del estudiante, fechas, montos y estado

### Estadísticas
- Total de pensiones
- Pensiones pagadas, pendientes y vencidas
- Resumen financiero con montos totales

## 🔧 Hooks Personalizados

### usePensionesPadre
Hook que maneja:
- Obtención del apoderado correspondiente al usuario
- Consulta de pensiones del apoderado
- Estados de carga y error
- Refresco de datos

## 📱 Navegación

El módulo está integrado en el menú lateral del dashboard de padres bajo la categoría "Gestión Financiera" con el icono de dólar.

## 🎨 Diseño

- **Colores**: Verde para elementos positivos, amarillo para pendientes, rojo para vencidos
- **Iconos**: Lucide React para consistencia visual
- **Responsive**: Adaptable a móviles y tablets
- **Accesibilidad**: Labels apropiados y navegación por teclado