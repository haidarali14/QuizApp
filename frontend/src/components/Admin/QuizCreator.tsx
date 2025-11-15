import React from 'react';

export const QuizCreator: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Quiz</h1>
        <p className="text-gray-600 mb-6">This feature is coming soon!</p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Under Construction</h3>
          <p className="text-gray-600">
            The quiz creation interface is being built. Check back soon!
          </p>
        </div>
      </div>
    </div>
  );
};