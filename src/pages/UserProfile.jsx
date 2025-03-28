import { User } from 'lucide-react';
import React, { useState } from 'react';

// import { 
//   User, 
//   Settings, 
//   Briefcase, 
//   Award, 
//   Mail, 
//   Clock, 
//   Sun,
//   Moon
// } from 'lucide-react';



const UserProfile = () => {
  const [user, setUser] = useState({
    name: 'Juan Pérez',
    email: 'juan.perez@company.com',
    role: 'Software Engineer',
    department: 'IT Development',
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
      primary: '#3B82F6', // Vibrant Blue
      accent: '#10B981',  // Emerald Green
      background: '#F3F4F6',
      cardBackground: '#FFFFFF',
      text: '#1F2937',
      subtleText: '#6B7280',
      border: '#E5E7EB',
      iconBackground: '#EFF6FF'
    },
    dark: {
      primary: '#60A5FA', // Lighter Blue
      accent: '#34D399',  // Mint Green
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
        className="w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden"
        style={{ 
          backgroundColor: currentTheme.cardBackground,
        }}
      >
        {/* Header Section */}
        <div 
          className="relative py-12 px-8 flex flex-col md:flex-row items-center justify-between"
          style={{ 
            backgroundColor: currentTheme.primary,
            color: 'white'
          }}
        >
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            {user.isLightTheme ? <Moon size={24} /> : <Sun size={24} />}
          </button>

          {/* Profile Avatar and Info */}
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <div 
              className="w-28 h-28 rounded-full flex items-center justify-center shadow-lg"
              style={{ 
                backgroundColor: currentTheme.iconBackground,
              }}
            >
              <User 
                size={64} 
                color={currentTheme.primary} 
                strokeWidth={1.5}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <p className="text-lg opacity-80">{user.role}</p>
              <div className="flex items-center mt-2 space-x-2">
                <Mail className="w-5 h-5" />
                <span className="text-sm">{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid md:grid-cols-3 gap-6 p-8">
          {/* Professional Details */}
          <div 
            className="rounded-2xl p-6 space-y-4 border"
            style={{ 
              backgroundColor: currentTheme.cardBackground,
              borderColor: currentTheme.border,
              color: currentTheme.text
            }}
          >
            <h2 
              className="text-xl font-semibold flex items-center mb-4"
              style={{ color: currentTheme.primary }}
            >
              <Briefcase className="mr-3" /> Professional Details
            </h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <Briefcase 
                  className="mr-3" 
                  color={currentTheme.primary} 
                />
                <span>Department: {user.department}</span>
              </div>
              <div>
                <span>Status: 
                  <span 
                    className="ml-2 px-3 py-1 rounded-full text-sm font-medium"
                    style={{ 
                      backgroundColor: user.isActiveUser 
                        ? currentTheme.accent 
                        : '#EF4444',
                      color: 'white'
                    }}
                  >
                    {user.isActiveUser ? 'Active' : 'Inactive'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          <div 
            className="rounded-2xl p-6 space-y-4 border"
            style={{ 
              backgroundColor: currentTheme.cardBackground,
              borderColor: currentTheme.border,
              color: currentTheme.text
            }}
          >
            <h2 
              className="text-xl font-semibold flex items-center mb-4"
              style={{ color: currentTheme.primary }}
            >
              <Award className="mr-3" /> Performance
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Extra Hours', value: '20 this month', icon: Clock },
                { label: 'Overtime Approval', value: '95%', icon: Award },
                { label: 'Last Review', value: 'Excellent', icon: User }
              ].map((item) => (
                <div 
                  key={item.label} 
                  className="flex items-center justify-between p-4 rounded-xl border"
                  style={{ 
                    backgroundColor: currentTheme.cardBackground,
                    borderColor: currentTheme.border
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <item.icon 
                      className="w-6 h-6" 
                      color={currentTheme.primary} 
                    />
                    <div>
                      <h3 className="text-sm text-gray-500">{item.label}</h3>
                      <p 
                        className="text-lg font-bold"
                        style={{ color: currentTheme.accent }}
                      >
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
            className="rounded-2xl p-6 space-y-4 border"
            style={{ 
              backgroundColor: currentTheme.cardBackground,
              borderColor: currentTheme.border,
              color: currentTheme.text
            }}
          >
            <h2 
              className="text-xl font-semibold flex items-center mb-4"
              style={{ color: currentTheme.primary }}
            >
              <Settings className="mr-3" /> Account Settings
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Theme Preference</span>
                <div 
                  className="w-16 h-8 rounded-full flex items-center cursor-pointer"
                  style={{ 
                    backgroundColor: user.isLightTheme 
                      ? '#E0E0E0' 
                      : '#444444',
                    justifyContent: user.isLightTheme ? 'flex-start' : 'flex-end'
                  }}
                  onClick={toggleTheme}
                >
                  <span 
                    className="w-6 h-6 rounded-full m-1"
                    style={{ 
                      backgroundColor: user.isLightTheme 
                        ? 'white' 
                        : '#2196F3'
                    }}
                  ></span>
                </div>
              </div>
              <div 
                className="text-sm"
                style={{ color: currentTheme.subtleText }}
              >
                Current Theme: {user.isLightTheme ? 'Light' : 'Dark'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;