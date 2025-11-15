import React from 'react';
import { useRoute } from 'wouter';

export const QuizTakePage: React.FC = () => {
  const [match, params] = useRoute('/quiz/:id');
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ready to Take Quiz</h1>
          <p className="text-gray-600 mb-6">
            Quiz ID: {params?.id}
          </p>
          <p className="text-gray-500">
            The quiz taking interface is coming soon!
          </p>
        </div>
      </div>
    </div>
  );
};