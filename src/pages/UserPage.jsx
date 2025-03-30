import { useState } from 'react';
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
  CreditCard,
  Mail,
  Briefcase,
  Play,
  Square
} from 'lucide-react';

// Comprehensive list of legal hour types in Colombia
const HOUR_TYPES = {
  DIURNA_ORDINARIA: {
    id: 'DIURNA_ORDINARIA',
    name: 'Hora Diurna Ordinaria',
    description: 'Horas trabajadas entre las 6:00 am y las 10:00 pm'
  },
  NOCTURNA_ORDINARIA: {
    id: 'NOCTURNA_ORDINARIA',
    name: 'Hora Nocturna Ordinaria',
    description: 'Horas trabajadas entre las 10:00 pm y las 6:00 am'
  },
  EXTRA_DIURNA: {
    id: 'EXTRA_DIURNA',
    name: 'Hora Extra Diurna',
    description: 'Horas extra trabajadas entre las 6:00 am y las 10:00 pm'
  },
  EXTRA_NOCTURNA: {
    id: 'EXTRA_NOCTURNA',
    name: 'Hora Extra Nocturna',
    description: 'Horas extra trabajadas entre las 10:00 pm y las 6:00 am'
  },
  DOMINICAL_DIURNA: {
    id: 'DOMINICAL_DIURNA',
    name: 'Hora Dominical Diurna',
    description: 'Horas trabajadas en domingo entre las 6:00 am y las 10:00 pm'
  },
  DOMINICAL_NOCTURNA: {
    id: 'DOMINICAL_NOCTURNA',
    name: 'Hora Dominical Nocturna',
    description: 'Horas trabajadas en domingo entre las 10:00 pm y las 6:00 am'
  },
  FESTIVO_DIURNO: {
    id: 'FESTIVO_DIURNO',
    name: 'Hora Festivo Diurno',
    description: 'Horas trabajadas en día festivo entre las 6:00 am y las 10:00 pm'
  },
  FESTIVO_NOCTURNO: {
    id: 'FESTIVO_NOCTURNO',
    name: 'Hora Festivo Nocturno',
    description: 'Horas trabajadas en día festivo entre las 10:00 pm y las 6:00 am'
  },
  EXTRA_DOMINICAL_DIURNA: {
    id: 'EXTRA_DOMINICAL_DIURNA',
    name: 'Hora Extra Dominical Diurna',
    description: 'Horas extra trabajadas en domingo entre las 6:00 am y las 10:00 pm'
  },
  EXTRA_DOMINICAL_NOCTURNA: {
    id: 'EXTRA_DOMINICAL_NOCTURNA',
    name: 'Hora Extra Dominical Nocturna',
    description: 'Horas extra trabajadas en domingo entre las 10:00 pm y las 6:00 am'
  },
  EXTRA_FESTIVO_DIURNO: {
    id: 'EXTRA_FESTIVO_DIURNO',
    name: 'Hora Extra Festivo Diurno',
    description: 'Horas extra trabajadas en festivo entre las 6:00 am y las 10:00 pm'
  },
  EXTRA_FESTIVO_NOCTURNO: {
    id: 'EXTRA_FESTIVO_NOCTURNO',
    name: 'Hora Extra Festivo Nocturno',
    description: 'Horas extra trabajadas en festivo entre las 10:00 pm y las 6:00 am'
  }
};

// Mock data structure
const mockExtraHours = [
  {
    id: 1,
    date: '2024-03-25',
    startTime: '18:00',
    endTime: '20:00',
    typeOfHour: 'DIURNA_ORDINARIA',
    status: 'Aprobado',
    totalHours: 2,
    project: 'Sistema de Gestión RH',
    description: 'Desarrollo de módulo de horas extras'
  },
  {
    id: 2,
    date: '2024-03-26',
    startTime: '19:00',
    endTime: '22:00',
    typeOfHour: 'NOCTURNA_ORDINARIA',
    status: 'Pendiente',
    totalHours: 3,
    project: 'Migración de Base de Datos',
    description: 'Trabajo de migración fuera de horario'
  }
];

const App = () => {
  const [extraHours, setExtraHours] = useState(mockExtraHours);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    typeOfHour: '',
    dateFrom: '',
    dateTo: ''
  });
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    typeOfHour: '',
    project: '',
    description: ''
  });

  // Validate if hours are actually overtime
  const validateOvertimeHours = (startTime, endTime) => {
    const start = new Date(`2024-01-01T${startTime}`);
    const end = new Date(`2024-01-01T${endTime}`);
    const standardWorkStart = new Date(`2024-01-01T06:00`);
    const standardWorkEnd = new Date(`2024-01-01T18:00`);

    if (start < standardWorkStart || end > standardWorkEnd) {
      return {
        isOvertime: true,
        message: ''
      };
    }

    return {
      isOvertime: false,
      message: 'Las horas registradas están dentro del horario laboral estándar. No son horas extras.'
    };
  };

  const employeeProfile = {
    name: 'María García',
    email: 'maria.garcia@empresa.com',
    department: 'Desarrollo de Software',
    position: 'Desarrolladora Senior',
    avatar: '/api/placeholder/100/100'
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Aprobado':
        return <CheckCircle2 className="text-green-500" />;
      case 'Rechazado':
        return <XCircle className="text-red-500" />;
      case 'Pendiente':
        return <AlertCircle className="text-yellow-500" />;
      default:
        return <Clock />;
    }
  };

  const filteredExtraHours = extraHours.filter(entry => {
    const matchStatus = !filters.status || entry.status === filters.status;
    const matchType = !filters.typeOfHour || entry.typeOfHour === filters.typeOfHour;
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
        description: entry.description
      });
    } else {
      setCurrentEntry(null);
      setFormData({
        date: '',
        startTime: '',
        endTime: '',
        typeOfHour: '',
        project: '',
        description: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este registro de horas extras?')) {
      setExtraHours(extraHours.filter(entry => entry.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.date || !formData.startTime || !formData.endTime || !formData.project || !formData.typeOfHour) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    const overtimeValidation = validateOvertimeHours(formData.startTime, formData.endTime);
    if (!overtimeValidation.isOvertime) {
      alert(overtimeValidation.message);
      return;
    }

    const startTime = new Date(`2024-01-01T${formData.startTime}`);
    const endTime = new Date(`2024-01-01T${formData.endTime}`);
    const totalHours = (endTime - startTime) / (1000 * 60 * 60);

    const selectedHourType = HOUR_TYPES[formData.typeOfHour];

    if (currentEntry) {
      setExtraHours(extraHours.map(e => 
        e.id === currentEntry.id 
          ? {
              ...e,
              ...formData,
              totalHours,
              status: 'Pendiente'
            } 
          : e
      ));
    } else {
      const newEntry = {
        id: extraHours.length + 1,
        ...formData,
        totalHours,
        status: 'Pendiente'
      };
      setExtraHours([...extraHours, newEntry]);
    }
    setIsModalOpen(false);
  };

  const renderModal = () => {
    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
          <h2 className="text-2xl font-bold mb-4">
            {currentEntry ? 'Editar' : 'Registrar'} Horas Extras
          </h2>
          <div className="space-y-4">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            <div className="flex space-x-2">
              <div className="w-1/2">
                <div className="flex items-center mb-2">
                  <Play className="mr-2 text-green-600" />
                  <h3 className="font-semibold text-green-700">Hora de Inicio</h3>
                </div>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md bg-green-50"
                  required
                />
              </div>

              <div className="w-1/2">
                <div className="flex items-center mb-2">
                  <Square className="mr-2 text-red-600" />
                  <h3 className="font-semibold text-red-700">Hora Final</h3>
                </div>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md bg-red-50"
                  required
                />
              </div>
            </div>

            <select
              name="typeOfHour"
              value={formData.typeOfHour}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Seleccionar Tipo de Hora</option>
              {Object.values(HOUR_TYPES).map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="project"
              value={formData.project}
              onChange={handleInputChange}
              placeholder="Proyecto"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descripción"
              className="w-full px-3 py-2 border rounded-md"
              rows="3"
            />
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-200 rounded-md"
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
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Filters */}
        <div className="p-4 bg-gray-100 flex space-x-4">
          <select
            name="status"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
            className="flex-1 px-3 py-2 border rounded-md"
          >
            <option value="">Estado</option>
            <option value="Aprobado">Aprobado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Rechazado">Rechazado</option>
          </select>
          <select
            name="typeOfHour"
            value={filters.typeOfHour}
            onChange={(e) => setFilters(prev => ({...prev, typeOfHour: e.target.value}))}
            className="flex-1 px-3 py-2 border rounded-md"
          >
            <option value="">Tipo de Hora</option>
            {Object.values(HOUR_TYPES).map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={(e) => setFilters(prev => ({...prev, dateFrom: e.target.value}))}
            placeholder="Desde"
            className="flex-1 px-3 py-2 border rounded-md"
          />
          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={(e) => setFilters(prev => ({...prev, dateTo: e.target.value}))}
            placeholder="Hasta"
            className="flex-1 px-3 py-2 border rounded-md"
          />
        </div>

        {/* Table */}
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-left">Proyecto</th>
              <th className="p-3 text-left">Tipo de Hora</th>
              <th className="p-3 text-left">Horas</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredExtraHours.map(entry => (
              <tr 
                key={entry.id} 
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3">{entry.date}</td>
                <td className="p-3">{entry.project}</td>
                <td className="p-3">
                  <div title={HOUR_TYPES[entry.typeOfHour].description}>
                    {HOUR_TYPES[entry.typeOfHour].name}
                  </div>
                </td>
                <td className="p-3">{entry.totalHours}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header Section with Profile */}
        <div className="mb-8 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            {/* Profile Avatar */}
            <div className="relative">
              <img 
                src={employeeProfile.avatar} 
                alt={employeeProfile.name} 
                className="w-16 h-16 rounded-full border-4 border-blue-500 object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
            </div>

            {/* Profile Info */}
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-3xl font-bold text-gray-800">{employeeProfile.name}</h1>
                <div className="bg-blue-100 px-2 py-1 rounded-full text-xs text-blue-700">
                  {employeeProfile.position}
                </div>
              </div>
              <div className="flex items-center space-x-4 text-gray-600 mt-2">
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{employeeProfile.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-sm">{employeeProfile.department}</span>
                </div>
              </div>
            </div>

            {/* Hours Icon */}
            <div className="bg-blue-100 p-3 rounded-full ml-4">
              <Clock className="text-blue-600 w-6 h-6" />
            </div>
          </div>

          <button 
            onClick={() => handleAddEdit()}
            className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2.5 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
          >
            <Plus className="mr-2" /> Registrar Horas
          </button>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {[
            { 
              icon: <Calendar className="w-6 h-6 text-blue-600" />, 
              title: 'Total Horas', 
              value: filteredExtraHours.reduce((sum, entry) => sum + entry.totalHours, 0)
            },
            { 
              icon: <ClockIcon className="w-6 h-6 text-green-600" />, 
              title: 'Horas Aprobadas', 
              value: filteredExtraHours.filter(e => e.status === 'Aprobado').reduce((sum, entry) => sum + entry.totalHours, 0)
            },
            { 
              icon: <AlertCircle className="w-6 h-6 text-yellow-600" />, 
              title: 'Horas Pendientes', 
              value: filteredExtraHours.filter(e => e.status === 'Pendiente').reduce((sum, entry) => sum + entry.totalHours, 0)
            }
          ].map((card, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow duration-300 flex items-center space-x-4"
            >
              <div className="bg-gray-100 p-3 rounded-full">
                {card.icon}
              </div>
              <div>
                <p className="text-gray-500 text-sm">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Extra Hours Table */}
        {renderExtraHoursTable()}

        {/* Modal */}
        {renderModal()}
      </div>
    </div>
  );
};

export default App;