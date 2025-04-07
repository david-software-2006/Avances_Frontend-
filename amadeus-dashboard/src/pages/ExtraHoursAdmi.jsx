import React, { useState } from 'react';

const ExtraHours = () => {
  const [extraHoursTypes, setExtraHoursTypes] = useState([
    { id: 1, type: 'Extra Diurna', multiplier: 1.25, status: 'Activo' },
    { id: 2, type: 'Extra Nocturna', multiplier: 1.75, status: 'Activo' },
    { id: 3, type: 'Dominical/Festivo', multiplier: 2.00, status: 'Activo' },
    { id: 4, type: 'Extra Dominical/Festivo Diurna', multiplier: 2.50, status: 'Activo' },
    { id: 5, type: 'Extra Dominical/Festivo Nocturna', multiplier: 2.75, status: 'Activo' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentType, setCurrentType] = useState({ id: null, type: '', multiplier: '', status: 'Activo' });

  const handleDeleteType = (id) => {
    const updatedTypes = extraHoursTypes.filter((type) => type.id !== id);
    setExtraHoursTypes(updatedTypes);
  };

  const handleOpenModal = (type = { id: null, type: '', multiplier: '', status: 'Activo' }) => {
    setCurrentType(type);
    setIsEditMode(!!type.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentType({ id: null, type: '', multiplier: '', status: 'Activo' });
  };

  const handleSaveType = () => {
    if (isEditMode) {
      setExtraHoursTypes(extraHoursTypes.map((type) => (type.id === currentType.id ? currentType : type)));
    } else {
      setExtraHoursTypes([...extraHoursTypes, { ...currentType, id: extraHoursTypes.length + 1 }]);
    }
    handleCloseModal();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Panel de Administración</h1>
      <p className="text-gray-600 mb-8">Sistema de Gestión de Horas Extras</p>


      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">Gestión de Horas Extras</h2>
            <p className="text-gray-600">Administra los tipos de horas extras y tasas</p>
          </div>
          <button onClick={() => handleOpenModal()} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Nuevo Tipo</button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-center">ID</th>
                <th className="py-2 px-4 border-b text-left">Tipo</th>
                <th className="py-2 px-4 border-b text-left">Multiplicador</th>
                <th className="py-2 px-4 border-b text-left">Estado</th>
                <th className="py-2 px-4 border-b text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {extraHoursTypes.map((type) => (
                <tr key={type.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 text-center">{type.id}</td>
                  <td className="py-2 px-4 text-left">{type.type}</td>
                  <td className="py-2 px-4 text-left">{type.multiplier.toFixed(2)}</td>
                  <td className="py-2 px-4 text-left">
                    <span className={`px-2 py-1 rounded-full text-xs ${type.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {type.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-left">
                    <button onClick={() => handleOpenModal(type)} className="text-blue-500 hover:underline">Editar</button> | 
                    <button onClick={() => handleDeleteType(type.id)} className="text-red-500 hover:underline ml-2">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">{isEditMode ? 'Editar Tipo' : 'Nuevo Tipo'}</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Tipo</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded"
                value={currentType.type}
                onChange={(e) => setCurrentType({ ...currentType, type: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Multiplicador</label>
              <input
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border rounded"
                value={currentType.multiplier}
                onChange={(e) => setCurrentType({ ...currentType, multiplier: parseFloat(e.target.value) })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Estado</label>
              <select
                className="w-full px-3 py-2 border rounded"
                value={currentType.status}
                onChange={(e) => setCurrentType({ ...currentType, status: e.target.value })}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button onClick={handleCloseModal} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2">Cancelar</button>
              <button onClick={handleSaveType} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">{isEditMode ? 'Guardar Cambios' : 'Crear Tipo'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExtraHours;