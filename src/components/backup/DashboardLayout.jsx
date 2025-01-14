import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar, Home, Settings, Users, HelpCircle, Clock } from 'lucide-react';
import CalendarView from './CalendarView';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('calendar');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigationItems = [
    { name: 'Home', icon: <Home className="w-5 h-5" />, view: 'dashboard' },
    { name: 'Calendar', icon: <Calendar className="w-5 h-5" />, view: 'calendar' },
    { name: 'Time-Off', icon: <Clock className="w-5 h-5" />, view: 'time-off' },
    { name: 'Users', icon: <Users className="w-5 h-5" />, view: 'users' },
    { name: 'Settings', icon: <Settings className="w-5 h-5" />, view: 'settings' },
    { name: 'Help', icon: <HelpCircle className="w-5 h-5" />, view: 'help' }
  ];

  const renderContent = () => {
    switch(currentView) {
      case 'calendar':
        return <CalendarView />;
      case 'dashboard':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Welcome to your dashboard!</p>
          </div>
        );
      default:
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">{currentView.charAt(0).toUpperCase() + currentView.slice(1)} page</p>
          </div>
        );
    }
  };

  const Sidebar = ({ mobile = false }) => (
    <nav className="h-full px-4 py-6">
      <ul className="space-y-2">
        {navigationItems.map((item) => (
          <li key={item.name}>
            <button
              onClick={() => {
                setCurrentView(item.view);
                if (mobile) setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 ${
                currentView === item.view ? 'bg-gray-100' : ''
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow-md z-30 h-16 flex-none">
        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-center gap-4">
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                aria-label="Toggle sidebar"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900">Cardiologie - CHU de Charleroi</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {isMobile ? (
          <aside
            className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            style={{ top: '4rem' }}
          >
            <Sidebar mobile />
          </aside>
        ) : (
          <aside className="w-64 bg-white shadow-lg flex-none">
            <Sidebar />
          </aside>
        )}

        <main className="flex-1 overflow-hidden">
          <div className="h-full p-6 lg:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              {currentView.charAt(0).toUpperCase() + currentView.slice(1)}
            </h1>
            <div className="h-full">
              {renderContent()}
            </div>
          </div>
        </main>

        {isSidebarOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;