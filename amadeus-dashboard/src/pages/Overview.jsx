import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const Overview = () => {
  const users = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'Administrador', department: 'RRHH', active: true },
    { id: 2, name: 'María López', email: 'maria@example.com', role: 'Empleado', department: 'Ventas', active: true },
    { id: 3, name: 'Carlos Rodríguez', email: 'carlos@example.com', role: 'Empleado', department: 'IT', active: false },
  ];

  const departmentStats = [
    { department: 'RRHH', employees: 8, totalExtraHours: 24 },
    { department: 'Ventas', employees: 12, totalExtraHours: 36 },
    { department: 'IT', employees: 15, totalExtraHours: 45 },
    { department: 'Contabilidad', employees: 5, totalExtraHours: 15 },
  ];

  const extraHoursRequests = [
    { id: 1, user: 'Juan Pérez', date: '2025-03-28', hours: 2.5, type: 'Extra Diurna', status: 'Pendiente' },
    { id: 2, user: 'María López', date: '2025-03-27', hours: 3, type: 'Extra Nocturna', status: 'Aprobado' },
    { id: 3, user: 'Carlos Rodríguez', date: '2025-03-26', hours: 4, type: 'Dominical/Festivo', status: 'Rechazado' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-green-500 flex items-center mt-1">
              <span>+5.2% desde el mes pasado</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Horas Extra Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">37</div>
            <p className="text-xs text-yellow-500 flex items-center mt-1">
              <span>14 solicitudes nuevas hoy</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Horas Aprobadas (Mes)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">283</div>
            <p className="text-xs text-blue-500 flex items-center mt-1">
              <span>$18,450 en compensación</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Departamentos Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentStats.length}</div>
            <p className="text-xs text-gray-500 flex items-center mt-1">
              <span>{users.length} empleados en total</span>
            </p>
 </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes Recientes</CardTitle>
            <CardDescription>Últimas solicitudes de horas extras</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-1 font-medium">Usuario</th>
                    <th className="text-left py-2 px-1 font-medium">Fecha</th>
                    <th className="text-left py-2 px-1 font-medium">Tipo</th>
                    <th className="text-left py-2 px-1 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {extraHoursRequests.map((request) => (
                    <tr key={request.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-1">{request.user}</td>
                      <td className="py-2 px-1">{request.date}</td>
                      <td className="py-2 px-1">{request.type}</td>
                      <td className="py-2 px-1">
                        <span className={`px-2 py-1 rounded-full text-xs ${request.status === 'Aprobado' ? 'bg-green-100 text-green-800' : request.status === 'Rechazado' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {request.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Departamentos</CardTitle>
            <CardDescription>Empleados y horas extras por departamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-1 font-medium">Departamento</th>
                    <th className="text-left py-2 px-1 font-medium">Empleados</th>
                    <th className="text-left py-2 px-1 font-medium">Horas Extras</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentStats.map((dept, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-1">{dept.department}</td>
                      <td className="py-2 px-1">{dept.employees}</td>
                      <td className="py-2 px-1">{dept.totalExtraHours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Overview;