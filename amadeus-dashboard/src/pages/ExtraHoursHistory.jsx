import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; // Importar el contexto de tema

const ExtraHoursHistory = () => {
  const navigate = useNavigate();
  const { isLightTheme } = useTheme(); // Obtener el estado del tema
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const month = months[date.getMonth()];
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  useEffect(() => {
    // Cargar horas desde localStorage
    const savedHours = localStorage.getItem("pendingHours");
    const mockData = [
      {
        id: 1,
        date: '2025-03-28',
        startTime: '18:00',
        endTime: '20:00',
        duration: 2,
        project: 'Sistema de Reservas de Vuelos',
        description: 'Corrección urgente de error en procesamiento de pagos',
        status: 'Aprobado',
        approvedBy: 'Juan Gerente',
        approvedDate: '2025-03-30'
      },
      {
        id: 2,
        date: '2025-03-25',
        startTime: '17:30',
        endTime: '19:30',
        duration: 2,
        project: 'Portal de Atención al Cliente',
        description: 'Soporte para migración de servidores',
        status: 'Pendiente',
        approvedBy: null,
        approvedDate: null
      },
      {
        id: 3,
        date: '2025-03-20',
        startTime: '18:30',
        endTime: '21:30',
        duration: 3,
        project: 'Sistema de Reservas de Vuelos',
        description: 'Despliegue a producción',
        status: 'Aprobado',
        approvedBy: 'María Directora',
        approvedDate: '2025-03-22'
      },
      {
        id: 4,
        date: '2025-03-15',
        startTime: '08:00',
        endTime: '12:00',
        duration: 4,
        project: 'Integración con Aerolíneas',
        description: 'Pruebas de fin de semana con aerolínea asociada',
        status: 'Rechazado',
        approvedBy: 'Juan Gerente',
        approvedDate: '2025-03-16',
        reason: 'Detalles insuficientes proporcionados'
      },
      {
        id: 5,
        date: '2025-03-10',
        startTime: '17:00',
        endTime: '20:00',
        duration: 3,
        project: 'Sistema de Gestión de Reservas',
        description: 'Implementación de corrección crítica',
        status: 'Aprobado',
        approvedBy: 'Juan Gerente',
        approvedDate: '2025-03-12'
      }
    ];

    // Combinar datos de mockData y horas guardadas en localStorage
    const combinedData = savedHours ? JSON.parse(savedHours).map((entry, index) => ({
      id: mockData.length + index + 1, // Asignar un ID único
      date: entry.date,
      startTime: entry.startTime,
      endTime: entry.endTime,
      duration: (new Date(`2024-01-01T${entry.endTime}`) - new Date(`2024-01-01T${entry.startTime}`)) / (1000 * 60 *  60), // Calcular duración
      project: entry.project || 'Proyecto no especificado', // Asignar un proyecto si está disponible
      description: entry.description || 'Descripción no especificada', // Asignar una descripción si está disponible
      status: entry.status || 'Pendiente', // Asignar un estado si está disponible
      approvedBy: null,
      approvedDate: null
    })) : [];

    // Establecer los datos de historial y ordenarlos por fecha de forma descendente
    const allData = [...mockData, ...combinedData].sort((a, b) => new Date(b.date) - new Date(a.date));
    setHistoryData(allData);
    setIsLoading(false);
  }, []);

  const filteredData = historyData.filter(item => {
    const matchesSearch = 
      item.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = filterDate ? item.date === filterDate : true;
    const matchesStatus = filterStatus ? item.status === filterStatus : true;
    
    return matchesSearch && matchesDate && matchesStatus;
  });

  const totalApprovedHours = historyData
    .filter(item => item.status === 'Aprobado')
    .reduce((sum, item) => sum + item.duration, 0);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Aprobado': return 'bg-green-100 text-green-800';
      case 'Pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'Rechazado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  const handleCancelRequest = (id) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta solicitud?')) {
      setHistoryData(prevData => 
        prevData.map(item => 
          item.id === id 
            ? {...item, status: 'Cancelado'} 
            : item
        )
      );
    }
  };

  return (
    <div className={`${isLightTheme ? 'bg-gray-50' : 'bg-gray-900'} min-h-screen p-6`}>
      <div className="max-w-7xl mx-auto">
        <div className={`${isLightTheme ? 'bg-white' : 'bg-gray-800'} shadow rounded-lg p-6 mb-6 flex items-center justify-between`}>
          <div>
            <h1 className={`${isLightTheme ? 'text-gray-800' : 'text-white'} text-2xl font-bold`}>Historial de Horas Extra</h1>
            <p className={`${isLightTheme ? 'text-gray-600' : 'text-gray-400'}`}>Ver y gestionar tus registros de horas extra</p>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className={`${isLightTheme ? 'bg-gray-200' : 'bg-gray-700'} flex items-center p-2 text-blue rounded-md hover:bg-gray-900`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24  24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H3m0 0 l6-6m-6 6l6 6"></path>
            </svg>
          </button>
        </div>
        
        <div className={`${isLightTheme ? 'bg-white' : 'bg-gray-800'} shadow rounded-lg p-6 mb-6`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className={`${isLightTheme ? 'text-gray-900' : 'text-white'} block text-sm font-medium mb-1`}>Buscar</label>
              <input
                className={`${isLightTheme ? 'border-gray-300' : 'border-gray-600'} w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                placeholder="Buscar por proyecto o descripción"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className={`${isLightTheme ? 'text-gray-900' : 'text-white'} block text-sm font-medium mb-1`}>Fecha</label>
              <input
                className={`${isLightTheme ? 'border-gray -300' : 'border-gray-600'} w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>
            <div>
              <label className={`${isLightTheme ? 'text-gray-900' : 'text-white'} block text-sm font-medium mb-1`}>Estado</label>
              <select
                className={`${isLightTheme ? 'border-gray-300' : 'border-gray-600'} w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Rechazado">Rechazado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className={`${isLightTheme ? 'bg-white' : 'bg-gray-800'} shadow rounded-lg overflow-hidden`}>
          {isLoading ? (
            <div className="p-6 text-center">
              <p className={`${isLightTheme ? 'text-gray-500' : 'text-gray-400'}`}>Cargando datos del historial...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="p-6 text-center">
              <p className={`${isLightTheme ? 'text-gray-500' : 'text-gray-400'}`}>No se encontraron registros</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className={`${isLightTheme ? 'bg-gray-50' : 'bg-gray-700'}`}>
                  <tr>
                    <th className={`${isLightTheme ? 'text-gray-500' : 'text-gray-300'} px-6 py-3 text-left text-xs font-medium uppercase tracking-wider`}>Fecha</th>
                    <th className={`${isLightTheme ? 'text-gray-500' : 'text-gray-300'} px-6 py-3 text-left text-xs font-medium uppercase tracking-wider`}>Horario</th>
                    <th className={`${isLightTheme ? 'text-gray-500' : 'text-gray-300'} px-6 py-3 text-left text-xs font-medium uppercase tracking-wider`}>Duración</th>
                    <th className={`${isLightTheme ? 'text-gray-500' : 'text-gray-300'} px-6 py-3 text-left text-xs font-medium uppercase tracking-wider`}>Proyecto</th>
                    <th className={`${isLightTheme ? 'text-gray-500' : 'text-gray-300'} px-6 py-3 text-left text-xs font-medium uppercase tracking-wider`}>Descripción</th>
                    <th className={`${isLightTheme ? 'text-gray-500' : 'text-gray-300'} px-6 py-3 text-left text-xs font-medium uppercase tracking-wider`}>Estado</th>
                    <th className={`${isLightTheme ? 'text-gray-500' : 'text-gray-300'} px-6 py-3 text-left text-xs font-medium uppercase tracking-wider`}>Acciones</th>
                  </tr>
                </thead>
                <tbody className={`${isLightTheme ? 'bg-white' : 'bg-gray-800'} divide-y divide-gray-200`}>
                  {filteredData.map(record => (
                    <tr key={record.id} className="hover:bg-gray-200">
                      <td className={`${isLightTheme ? 'text-gray-900' : 'text-gray-200'} px-6 py-4 whitespace-nowrap text-sm`}>
                        {formatDate(record.date)}
                      </td>
                      <td className={`${isLightTheme ? 'text-gray-900' : 'text-gray-200'} px-6 py-4 whitespace-nowrap text-sm`}>
                        {record.startTime} - {record.endTime}
                      </td>
                      <td className={`${isLightTheme ? 'text-gray-900' : 'text-gray-200'} px-6 py-4 whitespace-nowrap text-sm`}>
                        {record.duration}h
                      </td>
                      <td className={`${isLightTheme ? 'text-gray-900' : 'text-gray-200'} px-6 py-4 whitespace-nowrap text-sm`}>
                        {record.project}
                      </td>
                      <td className={`${isLightTheme ? 'text-gray-900' : 'text-gray-200'} px-6 py-4 text-sm max-w-xs truncate`}>
                        {record.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          className={`${isLightTheme ? 'text-blue-600 hover:text-blue-900' : 'text-blue-400 hover:text-blue-600'} mr-3`}
                          onClick={() => handleViewDetails(record)}
                        >
                          Ver
                        </button>
                        {record.status === 'Pendiente' && (
                          <button 
                            className={`${isLightTheme ? 'text-red-600 hover:text-red-900' : 'text-red-400 hover:text-red-600'}`}
                            onClick={() => handleCancelRequest(record.id)}
                          >
                            Cancelar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && selectedRecord && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${isLightTheme ? 'bg-white' : 'bg-gray-800'} rounded-lg shadow-xl max-w-md w-full p-6`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`${isLightTheme ? 'text-gray-900' : 'text-white'} text-lg font-semibold`}>Detalles de Horas Extra</h3>
              <button 
                className={`${isLightTheme ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-gray-200'}`}
                onClick={() => setShowModal(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className={`${isLightTheme ? 'text-gray-500' : 'text-gray-300'} text-sm font-medium`}>Proyecto</p>
                <p className={`${isLightTheme ? 'text-gray-900' : 'text-gray-200'} text-base`}>{selectedRecord.project}</p>
              </div>
              <div>
                <p className={`${isLightTheme ? 'text-gray-500' : 'text-gray-300'} text-sm font-medium`}>Fecha</p>
                <p className={`${isLightTheme ? 'text-gray-900' : 'text-gray-200'} text-base`}>{formatDate(selectedRecord.date)}</p>
              </div>
              <div>
                <p className={`${isLightTheme ? 'text-gray-500' : 'text-gray-300'} text-sm font-medium `}>Horario</p>
                <p className={`${isLightTheme ? 'text-gray-900' : 'text-gray-200'} text-base`}>{selectedRecord.startTime} - {selectedRecord.endTime} ({selectedRecord.duration} horas)</p>
              </div>
              <div>
                <p className={`${isLightTheme ? 'text-gray-500' : 'text-gray-300'} text-sm font-medium`}>Descripción</p>
                <p className={`${isLightTheme ? 'text-gray-900' : 'text-gray-200'} text-base`}>{selectedRecord.description}</p>
              </div>
              <div>
                <p className={`${isLightTheme ? 'text-gray-500' : 'text-gray-300'} text-sm font-medium`}>Estado</p>
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedRecord.status)}`}>
                  {selectedRecord.status}
                </span>
              </div>

              {selectedRecord.approvedBy && (
                <div>
                  <p className={`${isLightTheme ? 'text-gray-500' : 'text-gray-300'} text-sm font-medium`}>Aprobado por</p>
                  <p className={`${isLightTheme ? 'text-gray-900' : 'text-gray-200'} text-base`}>{selectedRecord.approvedBy } el {formatDate(selectedRecord.approvedDate)}</p>
                </div>
              )}
              
              {selectedRecord.reason && (
                <div>
                  <p className={`${isLightTheme ? 'text-gray-500' : 'text-gray-300'} text-sm font-medium`}>Motivo de rechazo</p>
                  <p className={`${isLightTheme ? 'text-gray-900' : 'text-gray-200'} text-base`}>{selectedRecord.reason}</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                className={`${isLightTheme ? 'bg-blue-600 text-white' : 'bg-blue-500 text-gray-200'} px-4 py-2 rounded-md hover:bg-blue-700`}
                onClick={() => setShowModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtraHoursHistory;