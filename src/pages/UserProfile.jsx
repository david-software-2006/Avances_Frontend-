import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Briefcase, 
  Award, 
  Mail, 
  Clock, 
  Sun, 
  Moon 
} from 'lucide-react';

const UserProfile = () => {
  const [user, setUser] = useState({
    name: 'Juan Pérez',
    email: 'juan.perez@company.com',
    role: 'Desarrollador',
    department: 'Desarrollo',
    isActiveUser: true,
    isLightTheme: true,
  });

  const toggleTheme = () => {
    setUser(prev => ({
      ...prev,
      isLightTheme: !prev.isLightTheme
    }));
  };

  const colors = {
    light: {
      primary: '#3B82F6',
      accent: '#10B981',
      background: '#F3F4F6',
      cardBackground: '#FFFFFF',
      text: '#1F2937',
      subtleText: '#6B7280',
      border: '#E5E7EB',
      iconBackground: '#EFF6FF'
    },
    dark: {
      primary: '#60A5FA',
      accent: '#34D399',
      background: '#111827',
      cardBackground: '#1F2937',
      text: '#F9FAFB',
      subtleText: '#9CA3AF',
      border: '#374151',
      iconBackground: '#1E40AF'
    }
  };

  const currentTheme = user.isLightTheme ? colors.light : colors.dark;

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 transition-colors duration-300"
      style={{ 
        backgroundColor: currentTheme.background,
        color: currentTheme.text
      }}
    >
      <div 
        className="w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: currentTheme.cardBackground }}
      >
        {/* Header Section */}
        <div 
          className="relative py-12 px-8 flex flex-col items-center"
          style={{ backgroundColor: currentTheme.primary, color: 'white' }}
        >
          {/* Theme Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            {user.isLightTheme ? <Moon size={24} /> : <Sun size={24} />}
          </button>

          {/* Profile Picture & Info */}
          <div 
            className="w-28 h-28 rounded-full flex items-center justify-center shadow-lg mb-4"
            style={{ backgroundColor: currentTheme.iconBackground }}
          >
            <User size={64} color={currentTheme.primary} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-lg opacity-80">{user.role}</p>
          <div className="flex items-center mt-2 space-x-2">
            <Mail className="w-5 h-5" />
            <span className="text-sm">{user.email}</span>
          </div>
        </div>

        {/* Content Sections */}
        <div className="flex flex-col items-center p-8">
          {/* Professional Details */}
          <div 
            className="w-full rounded-2xl p-6 space-y-4 border"
            style={{ 
              backgroundColor: currentTheme.cardBackground,
              borderColor: currentTheme.border,
              color: currentTheme.text
            }}
          >
            <h2 className="text-xl font-semibold flex items-center mb-4" style={{ color: currentTheme.primary }}>
              <Briefcase className="mr-3" /> Detalles profesionales
            </h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <Briefcase className="mr-3" color={currentTheme.primary} />
                <span>Departamento: {user.department}</span>
              </div>
              <div>
                <span>Estado: 
                  <span 
                    className="ml-2 px-3 py-1 rounded-full text-sm font-medium"
                    style={{ backgroundColor: user.isActiveUser ? currentTheme.accent : '#EF4444', color: 'white' }}
                  >
                    {user.isActiveUser ? 'Activo' : 'Inactivo'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          <div 
            className="w-full rounded-2xl p-6 space-y-4 border mt-6"
            style={{ backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.border, color: currentTheme.text }}
          >
            <h2 className="text-xl font-semibold flex items-center mb-4" style={{ color: currentTheme.primary }}>
              <Award className="mr-3" /> Rendimiento
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Horas extra', value: '20 este mes', icon: Clock },
                { label: 'Aprobación de horas extra', value: '95%', icon: Award },
                { label: 'Última revisión', value: 'Excelente', icon: User }
              ].map((item) => (
                <div 
                  key={item.label} 
                  className="flex items-center justify-between p-4 rounded-xl border"
                  style={{ backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.border }}
                >
                  <div className="flex items-center space-x-4">
                    <item.icon className="w-6 h-6" color={currentTheme.primary} />
                    <div>
                      <h3 className="text-sm text-gray-500">{item.label}</h3>
                      <p className="text-lg font-bold" style={{ color: currentTheme.accent }}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account Settings */}
          <div 
            className="w-full rounded-2xl p-6 space-y-4 border mt-6"
            style={{ backgroundColor: currentTheme.cardBackground, borderColor: currentTheme.border, color: currentTheme.text }}
          >
            <h2 className="text-xl font-semibold flex items-center mb-4" style={{ color: currentTheme.primary }}>
              <Settings className="mr-3" /> Configuración de la cuenta
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Tema preferido</span>
                <div 
                  className="w-16 h-8 rounded-full flex items-center cursor-pointer"
                  style={{ backgroundColor: user.isLightTheme ? '#E0E0E0' : '#444444', justifyContent: user.isLightTheme ? 'flex-start' : 'flex-end' }}
                  onClick={toggleTheme}
                >
                  <span 
                    className="w-6 h-6 rounded-full m-1"
                    style={{ backgroundColor: user.isLightTheme ? 'white' : '#2196F3' }}
                  ></span>
                </div>
              </div>
              <div className="text-sm" style={{ color: currentTheme.subtleText }}>
                Tema actual: {user.isLightTheme ? 'Claro' : 'Oscuro'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
