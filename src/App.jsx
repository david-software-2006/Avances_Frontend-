import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserPage from "./pages/UserPage";
import UserProfile from "./pages/UserProfile";
import Header from "./components/Header"; 

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {window.location.pathname !== "/user-page" && <Header />}
        <main className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/user-page" replace />} />
            <Route path="/user-page" element={<UserPage />} />
            <Route path="/profile" element={<UserProfile />} />
            {/* Ruta comodín debe ir al final */}
            <Route path="*" element={<Navigate to="/user-page" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App;