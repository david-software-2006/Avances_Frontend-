import React, { useState, useEffect, useRef } from "react";
import {
    Calendar,
    Clock,
    Download,
    ArrowLeft,
    ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from '../context/ThemeContext';

const OvertimeDashboard = () => {
    const { isLightTheme } = useTheme(); // Cambiado a isLightTheme
    const [selectedMonth, setSelectedMonth] = useState("Abril 2025");
    const [selectedView, setSelectedView] = useState("tabla");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [chartType, setChartType] = useState("proyecto");
    const [overtimeData, setOvertimeData] = useState([]); // Estado para las horas extras

    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    useEffect(() => {
        // Cargar horas desde localStorage
        const savedHours = localStorage.getItem("pendingHours");
        const mockData = [
            {
                id: 1,
                fecha: "01/04/2025",
                horasRegistradas: 2.5,
                proyecto: "Migración CRS",
                estado: "Aprobado",
            },
            {
                id: 2,
                fecha: "05/04/2025",
                horasRegistradas: 1.5,
                proyecto: "Soporte ALTEA",
                estado: "Pendiente",
            },
            {
                id: 3,
                fecha: "12/04/2025",
                horasRegistradas: 3.0,
                proyecto: "Integración NDC",
                estado: "Aprobado",
            },
            {
                id: 4,
                fecha: "15/04/2025",
                horasRegistradas: 4.0,
                proyecto: "Desarrollo API",
                estado: "Rechazado",
            },
            {
                id: 5,
                fecha: "22/04/2025",
                horasRegistradas: 2.0,
                proyecto: "Migración CRS",
                estado: "Pendiente",
            },
        ];

        // Combinar datos de mockData y horas guardadas en localStorage
        const combinedData = savedHours ? JSON.parse(savedHours).map((entry, index) => ({
            id: mockData.length + index + 1, // Asignar un ID único
            fecha: entry.date,
            horasRegistradas: (new Date(`2024-01-01T${entry.endTime}`) - new Date(`2024-01-01T${entry.startTime}`)) / (1000 * 60 * 60), // Calcular duración
            proyecto: entry.project || 'Proyecto no especificado', // Asignar un proyecto si está disponible
            estado: entry.status || 'Pendiente', // Asignar un estado si está disponible
        })) : [];

        // Establecer los datos de horas extras
        setOvertimeData([...mockData, ...combinedData]);
    }, []);

    // Datos para el gráfico agrupados por proyecto
    const chartDataByProject = Object.entries(
        overtimeData.reduce((acc, item) => {
            if (!acc[item.proyecto]) {
                acc[item.proyecto] = { name: item.proyecto, horas: 0 };
            }
            acc[item.proyecto].horas += item.horasRegistradas;
            return acc;
        }, {})
    ).map(([_, value]) => value);

    // Datos para el gráfico agrupados por estado
    const chartDataByStatus = Object.entries(
        overtimeData.reduce((acc, item) => {
            if (!acc[item.estado]) {
                acc[item.estado] = { name: item.estado, horas: 0 };
            }
 acc[item.estado].horas += item.horasRegistradas;
            return acc;
        }, {})
    ).map(([_, value]) => value);

    // Cálculo de horas totales y estadísticas
    const totalHoras = overtimeData.reduce(
        (sum, item) => sum + item.horasRegistradas,
        0
    );
    const horasAprobadas = overtimeData
        .filter((item) => item.estado === "Aprobado")
        .reduce((sum, item) => sum + item.horasRegistradas, 0);

    const horasPendientes = overtimeData
        .filter((item) => item.estado === "Pendiente")
        .reduce((sum, item) => sum + item.horasRegistradas, 0);

    const horasRechazadas = overtimeData
        .filter((item) => item.estado === "Rechazado")
        .reduce((sum, item) => sum + item.horasRegistradas, 0);

    // Función para navegar al dashboard
    const navigateToDashboard = () => {
        navigate("/dashboard");
    };

    // Función para exportar datos
    const exportData = () => {
        const csvRows = [];
        // Encabezados
        csvRows.push(
            ["Fecha", "Horas Registradas", "Proyecto", "Estado"].join(",")
        );

        // Filas de datos
        for (const item of overtimeData) {
            csvRows.push(
                [item.fecha, item.horasRegistradas, item.proyecto, item.estado].join(
                    ","
                )
            );
        }

        // Crear un blob y un enlace para descargar
        const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("href", url);
        a.setAttribute("download", "horas_extras.csv");
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Colores para los estados
    const getStatusColor = (status) => {
        if (isLightTheme) {
            switch (status) {
                case "Aprobado":
                    return { bg: "bg-green-100", text: "text-green-800", color: "#22c55e" };
                case "Pendiente":
                    return { bg: "bg-yellow-100", text: "text-yellow-800", color: "#eab308" };
                case "Rechazado":
                    return { bg: "bg-red-100", text: "text-red-800", color: "#ef4444" };
                default:
                    return { bg: "bg-gray-100", text: "text-gray-800", color: "#6b7280" };
            }
        } else {
            switch (status) {
                case "Aprobado":
                    return { bg: "bg-green-900", text: "text-green-300", color: "#10b981" };
                case "Pendiente":
                    return { bg: "bg-yellow-900", text: "text-yellow-300", color: "#d97706" };
                case "Rechazado":
                    return { bg: "bg-red-900", text: "text-red-300", color: "#dc2626" };
                default:
                    return { bg: "bg-gray-800", text: "text-gray-300", color: "#6b7280" };
            }
        }
    };

    // Función para ver detalles de un registro
    const viewDetails = (id) => {
        alert(`Viendo detalles del registro #${id}`);
    };

    // Componente de gráfico de barras simple
    const SimpleBarChart = ({ data }) => {
        const maxValue = Math.max(...data.map((item) => item.horas));
        const barMaxHeight = 150; // altura máxima de barra en píxeles

        return (
            <div className="flex flex-col h-64">
                <div className="flex-1 flex items-end justify-around">
                    {data.map((item, index) => {
                        const barHeight = (item.horas / maxValue) * barMaxHeight;
                        const barColor =
                            chartType === "estado"
                                ? getStatusColor(item.name).color
                                : ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][
                                index % 5
                                ];

                        return (
                            <div
                                key={item.name}
                                className="flex flex-col items-center mx-2 mb-2"
                            >
                                <div
                                    style={{
                                        height: `${barHeight}px`,
                                        backgroundColor: barColor,
                                        width: " 40px",
                                        minHeight: "20px",
                                    }}
                                    className="rounded-t"
                                    title={`${item.name}: ${item.horas} horas`}
                                ></div>
                                <div
                                    className={`text-xs mt-1 text-center font-medium ${isLightTheme ? 'text-gray-800' : 'text-gray-300'}`}
                                    style={{ maxWidth: "80px", overflowWrap: "break-word" }}
                                >
                                    {item.name}
                                </div>
                                <div className={`text-xs font-bold ${isLightTheme ? 'text-gray-800' : 'text-gray-300'}`}>{item.horas}h</div>
                            </div>
                        );
                    })}
                </div>
                <div className={`h-8 border-t mt-2 pt-1 text-center text-sm ${isLightTheme ? 'border-gray-200 text-gray-500' : 'border-gray-700 text-gray-400'}`}>
                    {chartType === "proyecto" ? "Horas por Proyecto" : "Horas por Estado"}
                </div>
            </div>
        );
    };

    return (
        <div className={`flex flex-col min-h-screen ${isLightTheme ? 'bg-gray-100 text-gray-800' : 'bg-gray-900 text-gray-100'}`}>
            <main className={`container mx-auto p-4 flex-grow`}>
                <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center">
                        <button
                            onClick={navigateToDashboard}
                            className={`mr-3 p-2 rounded-full ${isLightTheme ? 'hover:bg-gray-200' : 'hover:bg-gray-700'} transition-colors`}
                            aria-label="Volver al dashboard"
                        >
                            <div
                                className={`flex items-center justify-center ${isLightTheme ? 'bg-white' : 'bg-gray-700'} w-10 h-10 cursor-pointer rounded-full`}
                                onClick={() => navigate("/dashboard")}
                            >
                                <ArrowLeft size={20} className={isLightTheme ? "text-gray-800" : "text-gray-300"} />
                            </div>
                        </button>
                        <h2 className="text-xl font-bold">
                            Resumen de Horas Extras
                        </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative" ref={dropdownRef}>
                            <div
                                className={`flex items-center gap-1 ${isLightTheme ? 'bg-white text-gray-800 border-gray-200' : 'bg-gray-800 text-white border-gray-700'} border rounded px-3 py-1 cursor-pointer`}
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <Calendar size={16} className={isLightTheme ? "text-gray-800" : "text-gray-300"} />
                                <span>{selectedMonth}</span>
                                <ChevronDown size={16} className={isLightTheme ? "text-gray-800" : "text-gray-300"} />
                            </div>

                            {dropdownOpen && (
                                <div className={`absolute right-0 mt-1 ${isLightTheme ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'} border rounded shadow-lg z-10`}>
                                    <ul>
                                        {["Abril 2025", "Marzo 2025", "Febrero 2025"].map(
                                            (month) => (
                                                <li
                                                    key={month}
                                                    className={`px-4 py-2 cursor-pointer ${isLightTheme ? 'hover:bg-gray-100 text-gray-800' : 'hover:bg-gray-700 text-gray-300'}`}
                                                    onClick={() => {
                                                        setSelectedMonth(month);
                                                        setDropdownOpen(false);
                                                    }}
                                                >
                                                    {month}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <button
                            className={`flex items-center gap-1 ${isLightTheme ? 'bg-blue-800 hover:bg-blue-900' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded px-3 py-1 transition-colors`}
                            onClick={exportData}
                        >
                            <Download size={16} />
                            <span>Exportar</span>
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className={`p-4 rounded shadow ${isLightTheme ? 'bg-white' : 'bg-gray-800'}`}>
                        <h3 className={`mb-1 ${isLightTheme ? ' text-gray-500' : 'text-gray-300'}`}>Horas Totales</h3>
                        <div className="flex items-center">
                            <Clock size={20} className={`mr-2 ${isLightTheme ? 'text-blue-800' : 'text-blue-400'}`} />
                            <span className="text-2xl font-bold">{totalHoras}</span>
                        </div>
                    </div>
                    <div className={`p-4 rounded shadow ${isLightTheme ? 'bg-white' : 'bg-gray-800'}`}>
                        <h3 className={`mb-1 ${isLightTheme ? 'text-gray-500' : 'text-gray-300'}`}>Horas Aprobadas</h3>
                        <div className="flex items-center">
                            <Clock size={20} className={`mr-2 ${isLightTheme ? 'text-green-600' : 'text-green-400'}`} />
                            <span className="text-2xl font-bold">{horasAprobadas}</span>
                        </div>
                    </div>
                    <div className={`p-4 rounded shadow ${isLightTheme ? 'bg-white' : 'bg-gray-800'}`}>
                        <h3 className={`mb-1 ${isLightTheme ? 'text-gray-500' : 'text-gray-300'}`}>Horas Pendientes</h3>
                        <div className="flex items-center">
                            <Clock size={20} className={`mr-2 ${isLightTheme ? 'text-yellow-600' : 'text-yellow-400'}`} />
                            <span className="text-2xl font-bold">{horasPendientes}</span>
                        </div>
                    </div>
                    <div className={`p-4 rounded shadow ${isLightTheme ? 'bg-white' : 'bg-gray-800'}`}>
                        <h3 className={`mb-1 ${isLightTheme ? 'text-gray-500' : 'text-gray-300'}`}>Horas Rechazadas</h3>
                        <div className="flex items-center">
                            <Clock size={20} className={`mr-2 ${isLightTheme ? 'text-red-600' : 'text-red-400'}`} />
                            <span className="text-2xl font-bold">{horasRechazadas}</span>
                        </div>
                    </div>
                </div>

                {/* Toggle View */}
                <div className="flex mb-4">
                    <button
                        className={`px-4 py-2 rounded-l ${selectedView === "tabla"
                            ? "bg-blue-800 text-white"
                            : isLightTheme ? "bg-gray-200 text-gray-800" : "bg-gray-700 text-gray-300"}`}
                        onClick={() => setSelectedView("tabla")}
                    >
                        Vista de Tabla
                    </button>
                    <button
                        className={`px-4 py-2 rounded-r ${selectedView === "grafico"
                            ? "bg-blue-800 text-white"
                            : isLightTheme ? "bg-gray-200 text-gray-800" : "bg-gray-700 text-gray-300"}`}
                        onClick={() => setSelectedView("grafico")}
                    >
                        Vista de Gráfico
                    </button>
                </div>

                {/* Table View */}
                {selectedView === "tabla" && (
                    <div className={`rounded shadow overflow-x-auto ${isLightTheme ? 'bg-white' : 'bg-gray-800'}`}>
                        <table className="w-full table-auto">
                            <thead className={`${isLightTheme ? 'bg-gray-100 text-gray-800' : 'bg-gray-700 text-gray-300'}`}>
                                <tr>
                                    <th className="p-3 text-left">Fecha</th>
                                    <th className="p-3 text-left">Horas</th>
                                    <th className="p-3 text-left">Proyecto</th>
                                    <th className="p-3 text-left">Estado</th>
                                    <th className="p-3 text-left">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {overtimeData.map((item) => (
                                    <tr key={item.id} className={`border-t ${isLightTheme ? 'border-gray-200' : 'border-gray-700'}`}>
                                        <td className="p-3">{item.fecha}</td>
                                        <td className="p-3">{item.horasRegistradas}</td>
                                        <td className="p-3">{item.proyecto}</td>
                                        <td className="p-3">
                                            <span
                                                className={`px-2 py-1 rounded text-xs ${getStatusColor(item.estado).bg} ${getStatusColor(item.estado).text}`}
                                            >
                                                {item.estado}
 </span>
                                        </td>
                                        <td className="p-3">
                                            <button
                                                className={`${isLightTheme ? 'text-blue-600 hover:text-blue-500' : 'text-blue-400 hover:text-blue-300'} hover:underline`}
                                                onClick={() => viewDetails(item.id)}
                                            >
                                                Ver detalles
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Graph View */}
                {selectedView === "grafico" && (
                    <div className={`p-6 rounded shadow ${isLightTheme ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'}`}>
                        <div className="flex justify-center mb-4">
                            <div className="flex">
                                <button
                                    className={`px-4 py-2 rounded-l ${chartType === "proyecto"
                                        ? "bg-blue-800 text-white"
                                        : isLightTheme ? "bg-gray-200 text-gray-800" : "bg-gray-700 text-gray-300"}`}
                                    onClick={() => setChartType("proyecto")}
                                >
                                    Por Proyecto
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-r ${chartType === "estado"
                                        ? "bg-blue-800 text-white"
                                        : isLightTheme ? "bg-gray-200 text-gray-800" : "bg-gray-700 text-gray-300"}`}
                                    onClick={() => setChartType("estado")}
                                >
                                    Por Estado
                                </button>
                            </div>
                        </div>

                        <SimpleBarChart
                            data={
                                chartType === "proyecto"
                                    ? chartDataByProject
                                    : chartDataByStatus
                            }
                        />
                    </div>
                )}
            </main>
        </div>
    );
};

export default OvertimeDashboard;