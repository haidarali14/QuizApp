import React from 'react';
import { useRoute } from 'wouter';

export const EditQuiz: React.FC = () => {
  const [match, params] = useRoute('/admin/edit/:id');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Edit Quiz</h1>
        <p className="text-gray-600 mb-6">Editing quiz ID: {params?.id}</p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Edit Feature Coming Soon</h3>
          <p className="text-gray-600">
            The quiz editing interface is currently under development. 
            For now, you can delete and recreate quizzes.
          </p>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Back to My Quizzes
          </button>
          <button
            onClick={() => window.location.href = `/admin/create`}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Create New Quiz Instead
          </button>
        </div>
      </div>
    </div>
  );
};