import React, { useState } from 'react';
import { Route, Switch, useLocation, Redirect } from 'wouter';
import { useAuth } from '../../contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { AdminDashboard } from '../Admin/AdminDashboard';
import { QuizCreator } from '../Admin/QuizCreator';
import { AdminQuizzes } from '../Admin/AdminQuizzes';
import { EditQuiz } from '../Admin/EditQuiz';

export const AdminLayout: React.FC = () => {
  const { admin, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location, setLocation] = useLocation();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!admin) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                type="button"
                className="lg:hidden text-gray-500 hover:text-gray-600"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-900">
                {location === '/admin' && 'Dashboard'}
                {location === '/admin/create' && 'Create Quiz'}
                {location === '/admin/quizzes' && 'My Quizzes'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {admin.name}</span>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {admin.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Switch>
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/admin/create" component={QuizCreator} />
            <Route path="/admin/quizzes" component={AdminQuizzes} />
            <Route path="/admin/edit/:id" component={EditQuiz} />
            {/* Catch all for /admin/* routes - Fixed syntax */}
            <Route path="/admin/:rest*">
              {() => <div>Admin route not found</div>}
            </Route>
          </Switch>
        </main>
      </div>
    </div>
  );
};