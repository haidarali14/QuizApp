import React from 'react';
import { Link, useRoute } from 'wouter';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [isDashboard] = useRoute('/admin');
  const [isCreate] = useRoute('/admin/create');
  const [isQuizzes] = useRoute('/admin/quizzes');

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/create', label: 'Create Quiz', icon: '➕' },
    { path: '/admin/quizzes', label: 'My Quizzes', icon: '📝' },
  ];

  const handleNavClick = () => {
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200 transform
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">QuizMaster</h1>
          </div>

          {/* Navigation - FIXED: No nested <a> tags */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = 
                item.path === '/admin' ? isDashboard : 
                item.path === '/admin/create' ? isCreate :
                item.path === '/admin/quizzes' ? isQuizzes : false;

              return (
                <Link key={item.path} href={item.path}>
                  <div // Changed from <a> to <div>
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer
                      ${isActive 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                    onClick={handleNavClick}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};