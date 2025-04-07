import React, { useState, useEffect } from "react";
import {
  Clock,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  ClockIcon,
  Mail,
  Briefcase,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// Mock data structure
const mockExtraHours = [
  {
    id: 1,
    date: "2024-03-25",
    startTime: "18:00",
    endTime: "20:00",
    typeOfHour: "DIURNA_ORDINARIA",
    status: "Aprobado",
    totalHours: 2,
    extraHours: 2,
    project: "Sistema de Gestión RH",
    description: "Desarrollo de módulo de horas extras",
  },
  {
    id: 2,
    date: "2024-03-26",
    startTime: "19:00",
    endTime: "22:00",
    typeOfHour: "NOCTURNA_ORDINARIA",
    status: "Pendiente",
    totalHours: 3,
    extraHours: 3,
    project: "Migración de Base de Datos",
    description: "Trabajo de migración fuera de horario",
  },
];

const App = () => {
  const { isLightTheme } = useTheme();

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("userData");
    return savedUser
      ? JSON.parse(savedUser)
      : {
          name: "María García",
          email: "maria.garcia@empresa.com",
          role: "Desarrolladora",
          department: "Desarrollo de Software",
          position: "Desarrolladora web",
          avatar: "/api/placeholder/100/100",
          profilePicture: null,
        };
  });

  const [extraHours, setExtraHours] = useState(mockExtraHours);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    typeOfHour: "",
    dateFrom: "",
    dateTo: "",
  });
  const [formData, setFormData] = useState({
    date: "",
    startTime: "",
    endTime: "",
    typeOfHour: "",
    project: "",
    description: "",
  });
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Function to handle navigating back to dashboard
  const handleGoBack = () => {
    window.location.href = "/dashboard";
  };

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(user));
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Aprobado":
        return <CheckCircle2 className="text-green-500" />;
      case "Rechazado":
        return <XCircle className="text-red-500" />;
      case "Pendiente":
        return <AlertCircle className="text-yellow-500" />;
      default:
        return <Clock />;
    }
  };

  const filteredExtraHours = extraHours.filter((entry) => {
    const matchStatus = !filters.status || entry.status === filters.status;
    const matchType =
      !filters.typeOfHour || entry.typeOfHour === filters.typeOfHour;
    const matchDateFrom = !filters.dateFrom || entry.date >= filters.dateFrom;
    const matchDateTo = !filters.dateTo || entry.date <= filters.dateTo;

    return matchStatus && matchType && matchDateFrom && matchDateTo;
  });

  const handleAddEdit = (entry = null) => {
    if (entry) {
      setCurrentEntry(entry);
      setFormData({
        date: entry.date,
        startTime: entry.startTime,
        endTime: entry.endTime,
        typeOfHour: entry.typeOfHour,
        project: entry.project,
        description: entry.description,
      });
    } else {
      setCurrentEntry(null);
      setFormData({
        date: "",
        startTime: "",
        endTime: "",
        typeOfHour: "",
        project: "",
        description: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = (id) => {
    if (
      window.confirm("¿Estás seguro de eliminar este registro de horas extras?")
    ) {
      setExtraHours(extraHours.filter((entry) => entry.id !== id));
    }
  };

  const handleSave = () => {
    if (
      !formData.date ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.project ||
      !formData.typeOfHour
    ) {
      alert("Por favor complete todos los campos obligatorios");
      return;
    }

    const startTime = new Date(`2024-01-01T${formData.startTime}`);
    const endTime = new Date(`2024-01-01T${formData.endTime}`);

    // Verificar que la hora de inicio sea anterior a la hora de fin
    if (startTime >= endTime) {
      alert("La hora de inicio debe ser anterior a la hora de fin");
      return;
    }

    // Definir el horario laboral
    const workStartTime = new Date(`2024-01-01T06:00`); // 6 AM
    const workEndTime = new Date(`2024-01-01T18:00`); // 6 PM

    // Calcular horas totales
    const totalHours = (endTime - startTime) / (1000 * 60 * 60);

    // Calcular horas extras (solo las horas después de las 6 PM o antes de las 6 AM)
    let extraHoursCount = 0;

    // Si las horas están completamente dentro del horario laboral, no permitir el registro
    if (startTime >= workStartTime && endTime <= workEndTime) {
      alert(
        "No se pueden registrar horas extras dentro del horario laboral (6:00 AM - 6:00 PM)"
      );
      return;
    }

    // Calcular horas extras (solo las que están fuera del horario laboral)
    if (endTime > workEndTime) {
      // Si la hora de inicio es después de las 6 PM, todas las horas son extras
      if (startTime >= workEndTime) {
        extraHoursCount = totalHours;
      } else {
        // Solo contar las horas después de las 6 PM
        extraHoursCount = (endTime - workEndTime) / (1000 * 60 * 60);
      }
    }

    // Si empiezan antes del horario laboral
    if (startTime < workStartTime) {
      // Si terminan antes de las 6 AM, todas son extras
      if (endTime <= workStartTime) {
        extraHoursCount = totalHours;
      } else {
        // Solo contar las horas antes de las 6 AM
        extraHoursCount = (workStartTime - startTime) / (1000 * 60 * 60);
      }
    }

    // Verificar que haya al menos algunas horas extras
    if (extraHoursCount <= 0) {
      alert("No hay horas extras válidas en el rango seleccionado");
      return;
    }

    if (currentEntry) {
      setExtraHours(
        extraHours.map((e) =>
          e.id === currentEntry.id
            ? {
                ...e,
                ...formData,
                totalHours,
                extraHours: extraHoursCount,
                status: "Pendiente",
              }
            : e
        )
      );
    } else {
      const newEntry = {
        id: extraHours.length + 1,
        ...formData,
        totalHours,
        extraHours: extraHoursCount,
        status: "Pendiente",
      };
      setExtraHours([...extraHours, newEntry]);
    }
    setIsModalOpen(false);
  };

  const handleSendHours = () => {
    const hoursToSend = extraHours.filter(entry => entry.status === 'Pendiente');
  
    if (hoursToSend.length === 0) {
      alert('No hay horas pendientes para enviar.');
      return;
    }
  
    // Guardar las horas pendientes en localStorage
    localStorage.setItem('pendingHours', JSON.stringify(hoursToSend));
  
    // Eliminar las horas enviadas de la lista de horas del usuario
    const updatedExtraHours = extraHours.filter(entry => entry.status !== 'Pendiente');
    setExtraHours(updatedExtraHours);
  
    // Aquí puedes agregar la lógica para enviar las horas al administrador.
    console.log('Enviando horas al administrador:', hoursToSend);
    alert('Horas enviadas al administrador para su validación.');
  };

  const renderModal = () => {
    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div
          className={`rounded-lg p-4 sm:p-6 w-full max-w-md shadow-xl ${
            isLightTheme ? "bg-white" : "bg-gray-800"
          }`}
        >
          <h2
            className={`text-xl sm:text-2xl font-bold mb-4 ${
              isLightTheme ? "text-gray-800" : "text-white"
            }`}
          >
            {currentEntry ? "Editar" : "Registrar"} Horas Extras
          </h2>
          <div className="space-y-4">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                isLightTheme
                  ? "border-gray-300"
                  : "border-gray-600 bg-gray-700 text-white"
              }`}
              required
            />
            <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-4 sm:space-y-0">
              <div className="w-full sm:w-1/2">
                <div className="flex items-center mb-2">
                  <Clock className="mr-2 text-green-600" />
                  <h3
                    className={`font-semibold ${
                      isLightTheme ? "text-green-700" : "text-green-300"
                    }`}
                  >
                    Hora de Inicio
                  </h3>
                </div>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isLightTheme ? "bg-gray-200" : "bg-gray-600 text-white"
                  }`}
                  required
                />
              </div>

              <div className="w-full sm:w-1/2">
                <div className="flex items-center mb-2">
                  <Clock className="mr-2 text-red-600" />
                  <h3
                    className={`font-semibold ${
                      isLightTheme ? "text-red-700" : "text-red-300"
                    }`}
                  >
                    Hora Final
                  </h3>
                </div>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    isLightTheme ? "bg-gray-200" : "bg-gray-600 text-white"
                  }`}
                  required
                />
              </div>
            </div>

            <select
              name="typeOfHour"
              value={formData.typeOfHour}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                isLightTheme
                  ? "border-gray-300"
                  : "border-gray-600 bg-gray-700 text-white"
              }`}
              required
            >
              <option value="">Seleccionar Tipo de Hora</option>
              <option value="DIURNA_ORDINARIA">Hora Diurna Ordinaria</option>
              <option value="NOCTURNA_ORDINARIA">
                Hora Nocturna Ordinaria
              </option>
            </select>
            <input
              type="text"
              name="project"
              value={formData.project}
              onChange={handleInputChange}
              placeholder="Proyecto"
              className={`w-full px-3 py-2 border rounded-md ${
                isLightTheme
                  ? "border-gray-300"
                  : "border-gray-600 bg-gray-700 text-white"
              }`}
              required
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descripción"
              className={`w-full px-3 py-2 border rounded-md ${
                isLightTheme
                  ? "border-gray-300"
                  : "border-gray-600 bg-gray-700 text-white"
              }`}
              rows="3"
            />
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className={`px-4 py-2 rounded-md ${
                isLightTheme
                  ? "bg-gray-300 text-gray-800"
                  : "bg-gray-600 text-white"
              }`}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderExtraHoursTable = () => {
    return (
      <div
        className={`rounded-lg shadow-md overflow-hidden ${
          isLightTheme ? "bg-white" : "bg-gray-800"
        }`}
      >
        {/* Filters section - Desktop */}
        <div className="hidden md:flex p-4 space-x-4 flex-wrap md:flex-nowrap gap-2 md:gap-4 bg-opacity-90 sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className={`flex-1 px-3 py-2 border rounded-md ${
              isLightTheme
                ? "border-gray-300"
                : "border-gray-600 bg-gray-800 text-white"
            }`}
          >
            <option value="">Estado</option>
            <option value="Aprobado">Aprobado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Rechazado">Rechazado</option>
          </select>
          <select
            name="typeOfHour"
            value={filters.typeOfHour}
            onChange={handleFilterChange}
            className={`flex-1 px-3 py-2 border rounded-md ${
              isLightTheme
                ? "border-gray-300"
                : "border-gray-600 bg-gray-800 text-white"
            }`}
          >
            <option value="">Tipo de Hora</option>
            <option value="DIURNA_ORDINARIA">Hora Diurna Ordinaria</option>
            <option value="NOCTURNA_ORDINARIA">Hora Nocturna Ordinaria</option>
          </select>
          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
            placeholder="Desde"
            className={`flex-1 px-3 py-2 border rounded-md ${
              isLightTheme
                ? "border-gray-300"
                : "border-gray-600 bg-gray-800 text-white"
            }`}
          />
          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
            placeholder="Hasta"
            className={`flex-1 px-3 py-2 border rounded-md ${
              isLightTheme
                ? "border-gray-300"
                : "border-gray-600 bg-gray-800 text-white"
            }`}
          />
        </div>

        {/* Filters button for mobile */}
        <div className="md:hidden p-4 flex justify-between items-center">
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className={`px-4 py-2 rounded-md ${
              isLightTheme
                ? "bg-gray-200 text-gray-800"
                : "bg-gray-700 text-white"
            } flex items-center`}
          >
            <Menu className="w-4 h-4 mr-2" />
            Filtros
          </button>

          {/* Current filters info */}
          <div className="text-sm text-gray-500">
            {filters.status ||
            filters.typeOfHour ||
            filters.dateFrom ||
            filters.dateTo
              ? "Filtros activos"
              : "Sin filtros"}
          </div>
        </div>

        {/* Mobile Filters Panel */}
        {isMobileFiltersOpen && (
          <div
            className={`md:hidden p-4 space-y-3 ${
              isLightTheme ? "bg-gray-100" : "bg-gray-700"
            } border-b border-gray-200 dark:border-gray-600`}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Filtros</h3>
              <button onClick={() => setIsMobileFiltersOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className={`w-full px-3 py-2 border rounded-md ${
                isLightTheme
                  ? "border-gray-300"
                  : "border-gray-600 bg-gray-800 text-white"
              }`}
            >
              <option value="">Estado</option>
              <option value="Aprobado">Aprobado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Rechazado">Rechazado</option>
            </select>
            <select
              name="typeOfHour"
              value={filters.typeOfHour}
              onChange={handleFilterChange}
              className={`w-full px-3 py-2 border rounded-md ${
                isLightTheme
                  ? "border-gray-300"
                  : "border-gray-600 bg-gray-800 text-white"
              }`}
            >
              <option value="">Tipo de Hora</option>
              <option value="DIURNA_ORDINARIA">Hora Diurna Ordinaria</option>
              <option value="NOCTURNA_ORDINARIA">
                Hora Nocturna Ordinaria
              </option>
            </select>
            <div className="flex flex-col space-y-2">
              <label
                className={`text-sm ${
                  isLightTheme ? "text-gray-600" : "text-gray-300"
                }`}
              >
                Desde:
              </label>
              <input
                type="date"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  isLightTheme
                    ? "border-gray-300"
                    : "border-gray-600 bg-gray-800 text-white"
                }`}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <label
                className={`text-sm ${
                  isLightTheme ? "text-gray-600" : "text-gray-300"
                }`}
              >
                Hasta:
              </label>
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  isLightTheme
                    ? "border-gray-300"
                    : "border-gray-600 bg-gray-800 text-white"
                }`}
              />
            </div>
          </div>
        )}

        {/* Responsive table with horizontal scroll for small screens */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className={isLightTheme ? "bg-gray-100" : "bg-gray-700"}>
              <tr>
                <th className="p-3 text-left">Fecha</th>
                <th className="p-3 text-left">Proyecto</th>
                <th className="p-3 text-left">Tipo de Hora</th>
                <th className="p-3 text-left">Total Horas</th>
                <th className="p-3 text-left">Horas Extra</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredExtraHours.length > 0 ? (
                filteredExtraHours.map((entry) => (
                  <tr
                    key={entry.id}
                    className={`border-b hover:bg-gray-50 transition ${
                      isLightTheme ? "hover:bg-gray-200" : "hover:bg-gray-600"
                    }`}
                  >
                    <td className="p-3">{entry.date}</td>
                    <td className="p-3">{entry.project}</td>
                    <td className="p-3">
                      <div title="Descripción del tipo de hora">
                        {entry.typeOfHour === "DIURNA_ORDINARIA"
                          ? "Hora Diurna Ordinaria"
                          : "Hora Nocturna Ordinaria"}
                      </div>
                    </td>
                    <td className="p-3">{entry.totalHours.toFixed(1)}</td>
                    <td className="p-3">{entry.extraHours.toFixed(1)}</td>
                    <td className="p-3">
                      <div className="flex items-center">
                        {getStatusIcon(entry.status)}
                        <span className="ml-2">{entry.status}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAddEdit(entry)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Edit />
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    No se encontraron registros
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <br />
          <div className="flex justify-start mb-4">
            <button
              onClick={handleSendHours}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 mx-4" // Agrega margen horizontal
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 ${
        isLightTheme ? "bg-gray-50" : "bg-gray-900"
      }`}
    >
      <div className="container mx-auto max-w-7xl">
        {/* Back button */}
        <button
          onClick={handleGoBack}
          className={`mb-4 sm:mb-6 flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors ${
            isLightTheme
              ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
              : "bg-gray-800 hover:bg-gray-700 text-white"
          }`}
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Header with user info - Responsive */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-6 w-full sm:w-auto">
            <div className="relative mb-4 sm:mb-0">
              <a href="/profile">
                <img
                  src={user.profilePicture || user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-full border-4 border-blue-500 object-cover"
                />
              </a>
              <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
            </div>

            <div>
              <h1
                className={`text-2xl sm:text-3xl font-bold ${
                  isLightTheme ? "text-gray-800" : "text-white"
                }`}
              >
                {user.name}
              </h1>
              <div className="mt-1 mb-2 bg-blue-100 px-3 py-1.5 rounded-full text-sm font-medium text-blue-700 inline-block">
                {user.position}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-gray-600">
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm">{user.department}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Register Hours Button - Fixed at bottom for mobile, normal position for desktop */}
          <button
            onClick={() => handleAddEdit()}
            className="sm:hidden fixed bottom-4 right-4 z-20 flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 ease-in-out"
          >
            <Plus className="mr-1" /> Registrar
          </button>

          <button
            onClick={() => handleAddEdit()}
            className="hidden sm:flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            <Plus className="mr-2" /> Registrar Horas
          </button>
        </div>

        {/* Stats cards - Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {[
            {
              icon: (
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              ),
              title: "Total Horas",
              value: filteredExtraHours
                .reduce((sum, entry) => sum + entry.totalHours, 0)
                .toFixed(1),
            },
            {
              icon: (
                <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              ),
              title: "Horas Aprobadas",
              value: filteredExtraHours
                .filter((e) => e.status === "Aprobado")
                .reduce((sum, entry) => sum + entry.extraHours, 0)
                .toFixed(1),
            },
            {
              icon: (
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
              ),
              title: "Horas Pendientes",
              value: filteredExtraHours
                .filter((e) => e.status === "Pendiente")
                .reduce((sum, entry) => sum + entry.extraHours, 0)
                .toFixed(1),
            },
          ].map((card, index) => (
            <div
              key={index}
              className={`rounded-xl shadow-md p-4 sm:p-5 hover:shadow-lg transition-shadow duration-300 flex items-center space-x-4 ${
                isLightTheme ? "bg-white" : "bg-gray-800"
              }`}
            >
              <div
                className={`bg-gray-100 p-2 sm:p-3 rounded-full ${
                  isLightTheme ? "bg-gray-200" : "bg-gray-700"
                }`}
              >
                {card.icon}
              </div>
              <div>
                <p
                  className={`text-gray-500 text-sm ${
                    isLightTheme ? "text-gray-600" : "text-gray-300"
                  }`}
                >
                  {card.title}
                </p>
                <p
                  className={`text-xl sm:text-2xl font-bold ${
                    isLightTheme ? "text-gray-800" : "text-gray-200"
                  }`}
                >
                  {card.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {renderExtraHoursTable()}
        {renderModal()}
      </div>
    </div>
  );
};

export default App;
