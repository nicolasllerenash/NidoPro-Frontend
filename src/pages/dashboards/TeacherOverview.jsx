import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store";
import { useTeacherDashboard } from "../../hooks/useTeacherDashboard";
import {
  StudentsByClassroomChart,
  GradesDistributionChart,
} from "../../components/charts/TeacherCharts";
import SplitText from "../../components/common/SplitText";
import {
  BarChart3,
  Users,
  School,
  GraduationCap,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  Bot,
} from "lucide-react";

const TeacherOverview = () => {
  const { user } = useAuthStore();
  const { chartData, dashboardData, loading, error, refreshData } =
    useTeacherDashboard();

  // Calcular estadísticas dinámicas basadas en datos reales
  const dynamicStats = useMemo(() => {
    const estudiantesData = dashboardData?.estudiantes?.porAula || {};
    const aulasData = dashboardData?.aulas?.data || [];

    const totalEstudiantes = Object.values(estudiantesData).reduce(
      (total, estudiantes) => {
        return total + (Array.isArray(estudiantes) ? estudiantes.length : 0);
      },
      0
    );
    const totalAulas = aulasData.length;

    return [
      {
        title: "Mis Estudiantes",
        value: totalEstudiantes.toString(),
        change: `${totalAulas} aulas`,
        icon: Users,
        color: "#3B82F6",
      },
      {
        title: "Mis Aulas",
        value: totalAulas.toString(),
        change: "Asignadas",
        icon: School,
        color: "#10B981",
      },
      {
        title: "Promedio por Aula",
        value:
          totalAulas > 0
            ? Math.round(totalEstudiantes / totalAulas).toString()
            : "0",
        change: "estudiantes",
        icon: GraduationCap,
        color: "#F59E0B",
      },
      {
        title: "Total de Datos",
        value: (totalEstudiantes + totalAulas).toString(),
        change: "activos",
        icon: BarChart3,
        color: "#8B5CF6",
      },
    ];
  }, [dashboardData]);

  return (
    <div className="space-y-6 lg:space-y-8">
      <SplitText
        text={`Bienvenido,\n${user?.nombre || ""}`}
        className="text-6xl font-bold mb-6 text-gray-700 whitespace-pre-line"
        delay={50}
        duration={0.6}
        ease="power3.out"
        splitType="chars"
        from={{ opacity: 0, y: 40 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.1}
        rootMargin="-100px"
        textAlign="left"
        tag="p"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {dynamicStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={index}
              className="bg-white p-4 lg:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{
                    backgroundColor: `${stat.color}15`,
                    color: stat.color,
                  }}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Asistente IA Quick Access */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-xl shadow-sm p-4 lg:p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-700 bg-opacity-20 rounded-lg">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Asistente IA Educativo</h3>
              <p className="text-green-100">
                ¿Necesitas ideas para tu próxima clase?
              </p>
            </div>
          </div>
          <Link
            to="/teacher/ai-chat"
            className="bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg transition-all duration-200 font-medium"
          >
            DIsponible pronto...
          </Link>
        </div>
      </div>

      {/* Gráficos de Datos del Profesor */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-100">
          <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            <span>Estadísticas de Mis Aulas</span>
          </h3>
          <button
            onClick={refreshData}
            disabled={loading}
            className="flex items-center space-x-2 text-sm text-green-600 hover:text-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Actualizar</span>
          </button>
        </div>
        <div className="p-4 lg:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin text-green-600" />
              <span className="ml-2 text-gray-600">Cargando datos...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8">
              <AlertCircle className="w-8 h-8 text-red-600" />
              <span className="ml-2 text-red-600">
                Error al cargar datos: {error}
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StudentsByClassroomChart data={chartData} />
              <GradesDistributionChart data={chartData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherOverview;
