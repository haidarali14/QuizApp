import React from 'react';

export const AdminQuizzes: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Quizzes</h1>
        <p className="text-gray-600 mb-6">This feature is coming soon!</p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Your Quizzes</h3>
          <p className="text-gray-600">
            Soon you'll be able to view, edit, and manage all your quizzes here.
          </p>
        </div>
      </div>
    </div>
  );
};