import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Requests = () => {
  const [filter, setFilter] = useState("Todos los estados");
  const [extraHourType, setExtraHourType] = useState("");
  const [notes, setNotes] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [noteInput, setNoteInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [requests, setRequests] = useState([]);

  // Cargar solicitudes desde localStorage al montar el componente
  useEffect(() => {
    const savedHours = localStorage.getItem("pendingHours");
    if (savedHours) {
      const parsedHours = JSON.parse(savedHours);
      // Mapear las horas a la estructura de solicitudes
      const mappedRequests = parsedHours.map((entry, index) => ({
        id: index + 1, // Asignar un ID único
        user: "Usuario", // Aquí puedes asignar el nombre del usuario si lo tienes
        date: entry.date,
        startTime: entry.startTime,
        endTime: entry.endTime,
        type: entry.typeOfHour,
        status: entry.status,
      }));
      setRequests(mappedRequests);
    }
  }, []);

  const filteredRequests = requests.filter((request) => {
    const requestDate = new Date(request.date);
    const isWithinDateRange =
      (!startDate || requestDate >= new Date(startDate)) &&
      (!endDate || requestDate <= new Date(endDate));
    if (!isWithinDateRange) return false;
    if (filter === "Todos los estados") return true;
    if (filter === "Pendiente" && request.status === "Pendiente") return true;
    if (filter === "Aprobado" && request.status === "Aprobada") return true;
    if (filter === "Rechazada" && request.status === "Rechazada") return true;
    if (filter === "Tipo de Hora" && extraHourType && request.type === extraHourType) return true;
    return false;
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAddNote = (request) => {
    setSelectedRequest(request);
    setNoteInput(notes[request.id] || "");
    setIsEditing(request.status === "Pendiente");
  };

  const handleSaveNote = () => {
    setNotes({ ...notes, [selectedRequest.id]: noteInput });
    setSelectedRequest(null);
    setIsEditing(false);
  };

  const handleCloseNote = () => {
    setSelectedRequest(null);
    setIsEditing(false);
  };

  const handleApprove = (id) => {
    setRequests(requests.map((request) => (request.id === id ? { ...request, status: "Aprobada" } : request)));
  };

  const handleReject = (id) => {
    setRequests(requests.map((request) => (request.id === id ? { ...request, status: "Rechazada" } : request)));
  };

  const handleEditNote = () => {
    setIsEditing(true);
  };

  const handleStatusChange = (e) => {
    setRequests(requests.map((request) => (request.id === selectedRequest.id ? { ...request, status: e.target.value } : request)));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:space-x-2 mb-4">
            <CardTitle> Gestión de Solicitudes</CardTitle>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-2 mt-2 md:mt-0">
              <select
                className="border border-gray-300 rounded p-2 mb-2 md:mb-0"
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setExtraHourType(""); // Reset extra hour type when changing filter
                }}
              >
                <option>Todos los estados</option>
                <option>Pendiente</option>
                <option>Aprobado</option>
                <option>Rechazada</option>
                <option>Tipo de Hora</option>
              </select>
              {filter === "Tipo de Hora" && (
                <select
                  className="border border-gray-300 rounded p-2 mb-2 md:mb-0"
                  value={extraHourType}
                  onChange={(e) => setExtraHourType(e.target.value)}
                >
                  <option value="">Selecciona un tipo</option>
                  <option>Extra Diurna</option>
                  <option>Extra Nocturna</option>
                  <option>Dominical/Festivo</option>
                </select>
              )}
              <input
                type="date"
                className="border border-gray-300 rounded p-2 mb-2 md:mb-0"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                className="border border-gray-300 rounded p-2"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <CardDescription>Aprueba o rechaza solicitudes de horas extras</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">ID</th>
                  <th className="py-2 px-4 border-b text-left">Usuario</th>
                  <th className="py-2 px-4 border-b text-left">Fecha</th>
                  <th className="py-2 px-4 border-b text-left">Hora Inicio</th>
                  <th className="py-2 px-4 border-b text-left">Hora Fin</th>
                  <th className="py-2 px-4 border-b text-left">Tipo</th>
                  <th className="py-2 px-4 border-b text-left">Estado</th>
                  <th className="py-2 px-4 border-b text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.map((request) => (
                  <tr key={request.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{request.id}</td>
                    <td className="py-2 px-4 border-b">{request.user}</td>
                    <td className="py-2 px-4 border-b">{request.date}</td>
                    <td className="py-2 px-4 border-b">{request.startTime}</td>
                    <td className="py-2 px-4 border-b">{request.endTime}</td>
                    <td className="py-2 px-4 border-b">{request.type}</td>
                    <td className="py-2 px-4 border-b">
                      <span className={`px-2 py-1 rounded-full text-xs ${request.status === 'Aprobada' ? 'bg-green-100 text-green-800' : request.status === 'Rechazada' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex space-x-2">
                        {request.status === 'Pendiente' && (
                          <>
                            <button className="text-green-500 hover:underline" onClick={() => handleApprove(request.id)}>Aprobar</button>
                            <button className="text-red-500 hover:underline" onClick={() => handleReject(request.id)}>Rechazar</button>
                            <button className="text-gray-500 hover:underline" onClick={() => handleAddNote(request)}><i className="fas fa-sticky-note"></i> Nota</button>
                          </>
                        )}
                        {request.status !== 'Pendiente' && (
                          <button className="text -blue-500 hover:underline" onClick={() => handleAddNote(request)}>Ver Detalles</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="text-gray-600">Mostrando {paginatedRequests.length} de {filteredRequests.length} solicitudes</p>
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={`px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl font-semibold mb-4">{selectedRequest.status === 'Pendiente' ? 'Agregar Nota' : 'Detalles de la Nota'}</h2>
            {isEditing ? (
              <>
                <textarea
                  className="w-full border border-gray-300 rounded p-2 mb-4"
                  rows="8"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                ></textarea>
                {(selectedRequest.status === 'Aprobada' || selectedRequest.status === 'Rechazada') && (
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Estado de la Solicitud</label>
                    <select
                      className="border border-gray-300 rounded p-2 w-full"
                      value={selectedRequest.status}
                      onChange={handleStatusChange}
                    >
                      <option value="Aprobada">Aprobada</option>
                      <option value="Rechazada">Rechazada</option>
                    </select>
                  </div>
                )}
                <div className="flex justify-end space-x-2">
                  <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={handleCloseNote}>Cancelar</button>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSaveNote}>Guardar</button>
                </div>
              </>
            ) : (
              <>
                <p className="mb-4">{notes[selectedRequest.id]}</p>
                <div className="flex justify-end space-x-2">
                  <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={handleCloseNote}>Regresar</button>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleEditNote}>Editar</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;