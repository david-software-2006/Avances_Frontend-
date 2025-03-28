import React, { useState } from 'react';
import { Calendar, Clock, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';


// Componente principal
const TimeTrackingApp = ({ onProfileClick }) => {
  const [user, setUser] = useState({
    id: 1,
    name: 'María García',
    email: 'maria.garcia@empresa.com',
    position: 'Desarrolladora Senior',
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
      {/* Header */}
      <UserHeader user={user} onProfileClick={onProfileClick} />
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <StatCard 
          icon={<Calendar className="text-blue-500" />} 
          title="Total Horas" 
          value={totalHours} 
        />
        <StatCard 
          icon={<Clock className="text-green-500" />} 
          title="Horas Aprobadas" 
          value={approvedHours} 
        />
        <StatCard 
          icon={<Clock className="text-yellow-500" />} 
          title="Horas Pendientes" 
          value={pendingHours} 
        />
      </div>
       {/* New Entry Form */}
     <div className="mt-6 p-4 bg-white rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Registrar Nuevas Horas</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
           <input
            type="date"
            name="date"
            value={newEntry.date}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          
          <select
            name="projectId"
            value={newEntry.projectId}
            onChange={handleInputChange}
            className="p-2 border rounded"
          >
            <option value="">Seleccionar Proyecto</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          
          <select
            name="type"
            value={newEntry.type}
            onChange={handleInputChange}
            className="p-2 border rounded"
          >
            <option value="">Tipo de Hora</option>
            {hourTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
          
          <input
            type="number"
            name="hours"
            placeholder="Horas"
            value={newEntry.hours}
            onChange={handleInputChange}
            className="p-2 border rounded"
            min="1"
          />
          
          <select
            name="status"
            value={newEntry.status}
            onChange={handleInputChange}
            className="p-2 border rounded"
          >
            <option value="">Estado</option>
            {statuses.map((status, index) => (
              <option key={index} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-left">Proyecto</th>
              <th className="p-3 text-left">Tipo de Hora</th>
              <th className="p-3 text-center">Horas</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {timeEntries.map((entry) => (
              <tr key={entry.id} className="border-b">
                <td className="p-3 text-gray-600">{entry.date}</td>
                <td className="p-3">{getProjectName(entry.projectId)}</td>
                <td className="p-3">{entry.type}</td>
                <td className="p-3 text-center">{entry.hours}</td>
                <td className="p-3">
                  <StatusBadge status={entry.status} />
                </td>
                <td className="p-3 flex justify-center space-x-2">
                  <button 
                    className="text-blue-500"
                    title="Editar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button 
                    className="text-red-500"
                    title="Eliminar"
                    onClick={() => handleDelete(entry.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
     
        
        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Registrar Horas
        </button>
      </div>

  );
};

// Componente para la cabecera de usuario
const UserHeader = ({ user }) => {
  return (
    <div className="flex items-center">
  <Link to="/UserProfile" className="relative flex items-center">
    <div 
      className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 cursor-pointer hover:bg-blue-200 transition-colors"
      title="Ver perfil de usuario"
    >
      {user.name.charAt(0)}
    </div>
    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
  </Link>
  <div className="ml-4">
    <h1 className="text-2xl font-bold">{user.name}</h1>
    <div className="flex flex-col md:flex-row md:space-x-4">
      <p className="text-gray-600">
        <span className="mr-1">✉️</span> {user.email}
      </p>
      <p className="text-gray-600">
        <span className="mr-1">📁</span> {user.department}
      </p>
    </div>
    <div className="mt-1 inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
      {user.position}
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

// Componente para mostrar el estado
const StatusBadge = ({ status }) => {
  if (status === "Aprobado") {
    return (
      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <span className="mr-1 text-green-500">✓</span>
        {status}
      </div>
    );
  } else if (status === "Pendiente") {
    return (
      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <span className="mr-1 text-yellow-500">⏱</span>
        {status}
      </div>
    );
  } else if (status === "Rechazado") {
    return (
      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <span className="mr-1 text-red-500">✕</span>
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