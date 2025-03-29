import React, { useState } from 'react';
import { Calendar, Check, Clock as ClockIcon, X, Edit, Trash2 } from 'lucide-react';

// Componente principal
const TimeTrackingApp = ({ onProfileClick }) => {
  const [user, setUser] = useState({
    id: 1,
    name: 'María García',
    position: 'Desarrolladora Senior',  
    email: 'maria.garcia@empresa.com',
    department: 'Desarrollo de Software',
    departmentLeadId: 2
  });
  
  const [projects, setProjects] = useState([
    { id: 1, name: 'Sistema de Gestión RH' },
    { id: 2, name: 'Migración de Base de Datos' },
    { id: 3, name: 'Desarrollo Frontend' },
  ]);
  
  const [timeEntries, setTimeEntries] = useState([
    { 
      id: 1, 
      date: '2024-03-25', 
      projectId: 1, 
      hours: 2, 
      type: 'Hora Diurna Ordinaria', 
      status: 'Aprobado',
      userId: 1
    },
    { 
      id: 2, 
      date: '2024-03-26', 
      projectId: 2, 
      hours: 3, 
      type: 'Hora Nocturna Ordinaria', 
      status: 'Pendiente',
      userId: 1
    }
  ]);
  
  const [newEntry, setNewEntry] = useState({
    date: '',
    projectId: '',
    hours: '',
    type: '',
    status: 'Pendiente'
  });
  
  // Variables para filtros
  const [hoursFilter, setHoursFilter] = useState('');
  
  // Calcular las estadísticas
  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const approvedHours = timeEntries
    .filter(entry => entry.status === 'Aprobado')
    .reduce((sum, entry) => sum + entry.hours, 0);
  const pendingHours = timeEntries
    .filter(entry => entry.status === 'Pendiente')
    .reduce((sum, entry) => sum + entry.hours, 0);
  
  // Tipos de horas
  const hourTypes = [
    'Hora Diurna Ordinaria',
    'Hora Nocturna Ordinaria',
    'Hora Diurna Extra',
    'Hora Nocturna Extra'
  ];
  
  // Estados posibles
  const statuses = ['Pendiente', 'Aprobado', 'Rechazado'];
  
  // Manejadores de eventos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry({
      ...newEntry,
      [name]: value
    });
  };
  
  const handleHoursFilterChange = (e) => {
    setHoursFilter(e.target.value);
  };
  
  const handleSubmit = () => {
    // Validar que todos los campos estén completos
    if (!newEntry.date || !newEntry.projectId || !newEntry.hours || !newEntry.type) {
      alert('Por favor complete todos los campos');
      return;
    }
    
    // Crear nueva entrada con ID único
    const entry = {
      id: timeEntries.length + 1,
      ...newEntry,
      projectId: parseInt(newEntry.projectId),
      hours: parseInt(newEntry.hours),
      userId: user.id
    };
    
    // Actualizar el estado
    setTimeEntries([...timeEntries, entry]);
    
    // Limpiar el formulario
    setNewEntry({
      date: '',
      projectId: '',
      hours: '',
      type: '',
      status: 'Pendiente'
    });
  };
  
  const handleDelete = (id) => {
    setTimeEntries(timeEntries.filter(entry => entry.id !== id));
  };
  
  // Función para obtener el nombre del proyecto por ID
  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : '';
  };
  
  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-50 rounded-lg shadow">
      {/* Header con botón de registrar horas */}
      <div className="flex justify-between items-center mb-6">
        <UserHeader user={user} onProfileClick={onProfileClick} />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <span className="mr-2">+</span> Registrar Horas
        </button>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <StatCard 
          icon={<Calendar className="text-blue-500" />} 
          title="Total Horas" 
          value={totalHours} 
        />
        <StatCard 
          icon={<Check className="text-green-500" />} 
          title="Horas Aprobadas" 
          value={approvedHours} 
        />
        <StatCard 
          icon={<ClockIcon className="text-yellow-500" />} 
          title="Horas Pendientes" 
          value={pendingHours} 
        />
      </div>
      
      {/* Formulario para registrar horas */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Registrar Nuevas Horas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input 
              type="date" 
              name="date"
              value={newEntry.date}
              onChange={handleInputChange}
              className="p-2 border rounded w-full" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto</label>
            <select 
              name="projectId"
              value={newEntry.projectId}
              onChange={handleInputChange}
              className="p-2 border rounded w-full"
            >
              <option value="">Seleccionar Proyecto</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Hora</label>
            <select 
              name="type"
              value={newEntry.type}
              onChange={handleInputChange}
              className="p-2 border rounded w-full"
            >
              <option value="">Seleccionar Tipo</option>
              {hourTypes.map((type, idx) => (
                <option key={idx} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad de Horas</label>
            <input 
              type="number" 
              name="hours"
              value={newEntry.hours}
              onChange={handleInputChange}
              className="p-2 border rounded w-full" 
              min="1" 
              max="24"
            />
          </div>
        </div>
      </div>
     
      {/* Table with subtle gray borders */}
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left border-b border-r border-gray-300 text-gray-900">Fecha</th>
              <th className="p-3 text-left border-b border-r border-gray-300 text-gray-900">Proyecto</th>
              <th className="p-3 text-left border-b border-r border-gray-300 text-gray-900">Tipo de Hora</th>
              <th className="p-3 text-center border-b border-r border-gray-300 text-gray-900">Horas</th>
              <th className="p-3 text-left border-b border-r border-gray-300 text-gray-900">Estado</th>
              <th className="p-3 text-center border-b border-gray-300 text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {timeEntries.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50">
                <td className="p-3 text-gray-600 border-b border-r border-gray-200">{entry.date}</td>
                <td className="p-3 border-b border-r border-gray-200">{getProjectName(entry.projectId)}</td>
                <td className="p-3 border-b border-r border-gray-200">{entry.type}</td>
                <td className="p-3 text-center border-b border-r border-gray-200">{entry.hours}</td>
                <td className="p-3 border-b border-r border-gray-200">
                  <StatusBadge status={entry.status} />
                </td>
                <td className="p-3 flex justify-center space-x-2 border-b border-gray-200">
                  <button 
                    className="text-blue-500"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    className="text-red-500"
                    title="Eliminar"
                    onClick={() => handleDelete(entry.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Componente para la cabecera de usuario con posición encima del correo
// Componente para la cabecera de usuario con posición encima del correo
const UserHeader = ({ user, onProfileClick }) => {
  return (
    <div className="flex items-center">
      <a 
        href="/profile" 
        className="block relative cursor-pointer" 
        title="Ver perfil de usuario"
        onClick={onProfileClick}
      >
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-200 transition-colors">
          {user.name.charAt(0)}
        </div>
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
      </a>
      <div className="ml-4">
      <a 
  href="/profile" 
  className="text-2xl font-bold no-underline text-inherit block" 
  onClick={onProfileClick}
>
  {user.name}
</a>
<div className="mt-1 inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
  {user.position}
</div>

        <div className="flex flex-col md:flex-row md:space-x-4">
          <p className="text-gray-600">
            <span className="mr-1">✉️</span> {user.email}
          </p>
          <p className="text-gray-600">
            <span className="mr-1">📁</span> {user.department}
          </p>
        </div>
      </div>
    </div>
  );
};
// Componente para las tarjetas de estadísticas
const StatCard = ({ icon, title, value }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center">
      <div className="w-10 h-10 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-gray-500 text-sm mt-2">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};

// Componente para mostrar el estado con iconos actualizados
const StatusBadge = ({ status }) => {
  if (status === "Aprobado") {
    return (
      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <Check size={14} className="mr-1 text-green-500" />
        {status}
      </div>
    );
  } else if (status === "Pendiente") {
    return (
      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <ClockIcon size={14} className="mr-1 text-yellow-500" />
        {status}
      </div>
    );
  } else if (status === "Rechazado") {
    return (
      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <X size={14} className="mr-1 text-red-500" />
        {status}
      </div>
    );
  }
  
  return (
    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
      {status}
    </div>
  );
};

export default TimeTrackingApp;