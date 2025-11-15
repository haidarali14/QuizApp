import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quizAPI } from '../../services/api';
import { QuizCard } from '../Quiz/QuizCard';
import { Link } from 'wouter';

export const AdminQuizzes: React.FC = () => {
  const queryClient = useQueryClient();
  const [deleteError, setDeleteError] = useState('');

  const { data: quizzes, isLoading, error } = useQuery({
    queryKey: ['admin-quizzes'],
    queryFn: () => quizAPI.getMyQuizzes().then(res => res.data),
    retry: 1
  });

  const deleteMutation = useMutation({
    mutationFn: (quizId: string) => quizAPI.delete(quizId),
    onSuccess: () => {
      // Refresh the quizzes list
      queryClient.invalidateQueries(['admin-quizzes']);
      setDeleteError('');
    },
    onError: (error: any) => {
      setDeleteError(error.response?.data?.error || 'Failed to delete quiz');
    }
  });

  const handleDeleteQuiz = async (quizId: string) => {
    deleteMutation.mutate(quizId);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your quizzes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="text-red-600 text-lg mb-4">Failed to load quizzes</div>
            <p className="text-gray-600 mb-4">
              {error instanceof Error ? error.message : 'Please check your authentication'}
            </p>
            <Link href="/admin">
              <a className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Back to Dashboard
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">My Quizzes</h1>
            <p className="text-gray-600">
              Manage all your created quizzes. View, edit, or delete them as needed.
            </p>
          </div>
          <Link href="/admin/create">
            <a className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center">
              <span className="mr-2">➕</span>
              Create New Quiz
            </a>
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {deleteError && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400">❌</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-1 text-sm text-red-700">{deleteError}</div>
            </div>
          </div>
        </div>
      )}

      {/* Quizzes Grid */}
      <div className="mb-8">
        {quizzes && quizzes.length > 0 ? (
          <div>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <span className="text-blue-600">📊</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
                    <p className="text-xl font-bold text-gray-900">{quizzes.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <span className="text-green-600">❓</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Questions</p>
                    <p className="text-xl font-bold text-gray-900">
                      {quizzes.reduce((acc: number, quiz: any) => acc + quiz.questions.length, 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <span className="text-purple-600">📅</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Latest Quiz</p>
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(quizzes[0]?.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg mr-3">
                    <span className="text-orange-600">⭐</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Questions</p>
                    <p className="text-xl font-bold text-gray-900">
                      {Math.round(quizzes.reduce((acc: number, quiz: any) => acc + quiz.questions.length, 0) / quizzes.length)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quizzes List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz: any) => (
                <QuizCard 
                  key={quiz._id} 
                  quiz={quiz} 
                  showActions={true}
                  onDelete={handleDeleteQuiz}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No quizzes yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven't created any quizzes yet. Start by creating your first quiz to share with others.
            </p>
            <Link href="/admin/create">
              <a className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center">
                <span className="mr-2">➕</span>
                Create Your First Quiz
              </a>
            </Link>
          </div>
        )}
      </div>

      {/* Quick Tips */}
      {quizzes && quizzes.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Quick Tips</h3>
          <ul className="text-blue-800 space-y-2">
            <li>• Click "Take Quiz" to preview how your quiz looks to users</li>
            <li>• Share the quiz link with others to let them take your quiz</li>
            <li>• Use the edit feature to update quiz content anytime</li>
            <li>• Delete quizzes you no longer need to keep your list organized</li>
          </ul>
        </div>
      )}
    </div>
  );
};