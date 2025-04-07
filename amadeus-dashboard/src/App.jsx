import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserPage from "./pages/UserPage";
import UserProfile from "./pages/UserProfile";
import Header from "./components/ui/Header"; 
import Login from "./pages/Login";
import { ThemeProvider } from './context/ThemeContext'; 
import AdminDashboard from './pages/AdminDashboard';
import ExtraHour from './pages/ExtraHour';
import Dashboard from "./pages/Dashboard";
import Password from "./pages/Password";
import AdminProfile from "./pages/AdminProfile";
import ExtraHoursHistory  from './pages/ExtraHoursHistory';
import OvertimeDashboard from './pages/OvertimeDashboard';

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        {window.location.pathname !== "/login" && <Header />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/user-page" element={<UserPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/extrahour" element={<ExtraHour />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/password" element={<Password />} />
          <Route path="/admin-profile" element={<AdminProfile />} />
          <Route path="/extra-hours-history" element={<ExtraHoursHistory />} />
          <Route path="/overtime-dashboard" element={<OvertimeDashboard />} />   
          <Route path="*" element={<Navigate to="/login" replace />} />      
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;


// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import UserPage from "./pages/UserPage";
// import UserProfile from "./pages/UserProfile";
// import Header from "./components/ui/Header"; 
// import Login from "./pages/Login";
// import { ThemeProvider } from './context/ThemeContext'; 
// import AdminDashboard from './pages/AdminDashboard';
// import ExtraHour from './pages/ExtraHour';
// import Dashboard from "./pages/Dashboard";
// import Password from "./pages/Password";
// import AdminProfile from "./pages/AdminProfile";
// import ExtraHoursHistory from './pages/ExtraHoursHistory';
// import OvertimeDashboard from './pages/OvertimeDashboard';

// const App = () => {
//   return (
//     <ThemeProvider>
//       <Router>
//         {/* Mostrar el Header solo si no estamos en la página de AdminDashboard */}
//         <Header />
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/" element={<Navigate to="/admin-dashboard" replace />} />
//           <Route path="/admin-dashboard" element={<AdminDashboard />} />
//           <Route path="/user-page" element={<UserPage />} />
//           <Route path="/profile" element={<UserProfile />} />
//           <Route path="/extrahour" element={<ExtraHour />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/password" element={<Password />} />
//           <Route path="/admin-profile" element={<AdminProfile />} />
//           <Route path="/extra-hours-history" element={<ExtraHoursHistory />} />
//           <Route path="/overtime-dashboard" element={<OvertimeDashboard />} />   
//           <Route path="*" element={<Navigate to="/admin-dashboard" replace />} />      
//         </Routes>
//       </Router>
//     </ThemeProvider>
//   );
// }

// export default App;