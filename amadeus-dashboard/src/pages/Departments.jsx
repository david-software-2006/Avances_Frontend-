import React, { useState } from 'react';

const Departments = () => {
  const [departments, setDepartments] = useState([
    { id: 1, name: 'RRHH', employees: 8, totalExtraHours: 24, status: 'Activo' },
    { id: 2, name: 'Ventas', employees: 12, totalExtraHours: 36, status: 'Activo' },
    { id: 3, name: 'IT', employees: 15, totalExtraHours: 45, status: 'Activo' },
    { id: 4, name: 'Contabilidad', employees: 5, totalExtraHours: 15, status: 'Activo' },
  ]);

  const [editingDepartment, setEditingDepartment] = useState(null);
  const [newDepartment, setNewDepartment] = useState({ name: '', employees: '', totalExtraHours: '', status: 'Activo' });

  const handleAddDepartment = () => {
    const newId = departments.length ? departments[departments.length - 1].id + 1 : 1;
    const updatedDepartments = [...departments, { ...newDepartment, id: newId }];
    setDepartments(updatedDepartments);
    setNewDepartment({ name: '', employees: '', totalExtraHours: '', status: 'Activo' });
    setEditingDepartment(null);
  };

  const handleDeleteDepartment = (id) => {
    const updatedDepartments = departments.filter((department) => department.id !== id);
    setDepartments(updatedDepartments);
  };

  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    setNewDepartment(department);
  };

  const handleSaveEdit = () => {
    const updatedDepartments = departments.map((department) =>
      department.id === editingDepartment.id ? newDepartment : department
    );
    setDepartments(updatedDepartments);
    setEditingDepartment(null);
    setNewDepartment({ name: '', employees: '', totalExtraHours: '', status: 'Activo' });
  };

  const handleCancelEdit = () => {
    setEditingDepartment(null);
    setNewDepartment({ name: '', employees: '', totalExtraHours: '', status: 'Activo' });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Panel de Administración</h1>
      <p className="text-gray-600">Sistema de Gestión de Horas Extras</p>
      
      {editingDepartment ? (
        <div className="mt-8 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold">{editingDepartment.id ? 'Editar Departamento' : 'Nuevo Departamento'}</h2>
          <div className="mt-4">
            <label className="block text-gray-700">Nombre</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded mt-2"
              value={newDepartment.name}
              onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Empleados</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded mt-2"
              value={newDepartment.employees}
              onChange={(e) => setNewDepartment({ ...newDepartment, employees: e.target.value })}
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Horas Extras (Mes)</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded mt-2"
              value={newDepartment.totalExtraHours}
              onChange={(e) => setNewDepartment({ ...newDepartment, totalExtraHours: e.target.value })}
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Estado</label>
            <select
              className="w-full px-4 py-2 border rounded mt-2"
              value={newDepartment.status}
              onChange={(e) => setNewDepartment({ ...newDepartment, status: e.target.value })}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={handleCancelEdit}>Cancelar</button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={editingDepartment.id ? handleSaveEdit : handleAddDepartment}>
              {editingDepartment.id ? 'Guardar' : 'Agregar'}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-8 bg-white p-6 rounded shadow">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Gestión de Departamentos</h2>
              <p className="text-gray-600">Administra los departamentos de la organización</p>
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setEditingDepartment({ id: null, name: '', employees: '', totalExtraHours: '', status: 'Activo' })}>Nuevo Departamento</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {departments.map((department) => (
              <div key={department.id} className="bg-white p-4 rounded shadow relative">
                <h3 className="text-lg font-bold">{department.name}</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p>Empleados:</p>
                    <p className="font-semibold">{department.employees}</p>
                  </div>
                  <div className="ml-4 flex flex-col items-start justify-center">
                    <p>Horas Extras (Mes):</p>
                    <p className="font-semibold ml-0">{department.totalExtraHours}</p>
                  </div>
                </div>
                <p className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs ${department.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {department.status}
                </p>
                <div className="flex justify-end space-x-2">
                  <button onClick={() => handleEditDepartment(department)} className="text-blue-500">Editar</button>
                  <button onClick={() => handleDeleteDepartment(department.id)} className="text-red-500">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;