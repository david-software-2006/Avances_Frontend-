import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

const Users = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan@example.com',
      role: 'Administrador',
      department: 'RRHH',
      active: true,
    },
    {
      id: 2,
      name: 'María López',
      email: 'maria@example.com',
      role: 'Supervisor',
      department: 'Ventas',
      active: true,
    },
    {
      id: 3,
      name: 'Carlos Rodríguez',
      email: 'carlos@example.com',
      role: 'Empleado',
      department: 'IT',
      active: false,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: null,
    name: '',
    email: '',
    role: '',
    department: '',
    active: true,
  });

  const handleOpenModal = (user = { id: null, name: '', email: '', role: '', department: '', active: true }) => {
    setCurrentUser(user);
    setIsEditMode(!!user.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUser({ id: null, name: '', email: '', role: '', department: '', active: true });
  };

  const handleSaveUser = () => {
    if (isEditMode) {
      setUsers(users.map((user) => (user.id === currentUser.id ? currentUser : user)));
    } else {
      setUsers([...users, { ...currentUser, id: users.length + 1 }]);
    }
    handleCloseModal();
  };

  const handleDeleteUser = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gestión de Usuarios</CardTitle>
          <CardDescription>Administra los usuarios del sistema</CardDescription>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-4 py-2 rounded">
          Nuevo Usuario
        </button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 font-medium">ID</th>
                <th className="text-left py-3 px-2 font-medium">Nombre</th>
                <th className="text-left py-3 px-2 font-medium">Email</th>
                <th className="text-left py-3 px-2 font-medium">Rol</th>
                <th className="text-left py-3 px-2 font-medium">Departamento</th>
                <th className="text-left py-3 px-2 font-medium">Estado</th>
                <th className="text-left py-3 px-2 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2">{user.id}</td>
                  <td className="py-2 px-2">{user.name}</td>
                  <td className="py-2 px-2">{user.email}</td>
                  <td className="py-2 px-2">{user.role}</td>
                  <td className="py-2 px-2">{user.department}</td>
                  <td className="py-2 px-2">
                    <span
                      className={
                        user.active
                          ? 'px-2 py-1 rounded-full text-xs bg-green-100 text-green-800'
                          : 'px-2 py-1 rounded-full text-xs bg-red-100 text-red-800'
                      }
                    >
                      {user.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="py-2 px-2 flex justify-start">
                    <button
                      onClick={() => handleOpenModal(user)}
                      className="text-blue-600 mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-4 sm:mx-auto">
            <h2 className="text-2xl font-bold mb-4">{isEditMode ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Nombre</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded"
                value={currentUser.name}
                onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded"
                value={currentUser.email}
                onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Rol</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded"
                value={currentUser.role}
                onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Departamento</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded"
                value={currentUser.department}
                onChange={(e) => setCurrentUser({ ...currentUser, department: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Estado</label>
              <select
                className="w-full px-3 py-2 border rounded"
                value={currentUser.active}
                onChange={(e) => setCurrentUser({ ...currentUser, active: e.target.value === 'true' })}
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button onClick={handleCloseModal} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2">Cancelar</button>
              <button onClick={handleSaveUser} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">{isEditMode ? 'Guardar Cambios' : 'Crear Usuario'}</button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default Users;
