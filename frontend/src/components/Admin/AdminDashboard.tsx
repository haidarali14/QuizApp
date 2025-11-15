import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { quizAPI } from '../../services/api';
import { Link } from 'wouter';
import { useAuth } from '../../contexts/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { admin } = useAuth();
  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['admin-quizzes'],
    queryFn: () => quizAPI.getMyQuizzes().then(res => res.data)
  });

  const totalQuizzes = quizzes?.length || 0;
  const totalQuestions = quizzes?.reduce((acc: number, quiz: any) => acc + quiz.questions.length, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {admin?.name}! 👋
        </h1>
        <p className="text-gray-600">
          Manage your quizzes and track their performance from your dashboard.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
              <p className="text-2xl font-bold text-gray-900">{totalQuizzes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">❓</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Questions</p>
              <p className="text-2xl font-bold text-gray-900">{totalQuestions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Since</p>
              <p className="text-lg font-bold text-gray-900">Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/create">
            <a className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group">
              <span className="text-3xl mb-2 group-hover:text-blue-600">➕</span>
              <span className="font-medium text-gray-700 group-hover:text-blue-600">Create Quiz</span>
            </a>
          </Link>

          <Link href="/admin/quizzes">
            <a className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group">
              <span className="text-3xl mb-2 group-hover:text-green-600">📝</span>
              <span className="font-medium text-gray-700 group-hover:text-green-600">My Quizzes</span>
            </a>
          </Link>

          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group cursor-not-allowed opacity-50">
            <span className="text-3xl mb-2 group-hover:text-purple-600">📈</span>
            <span className="font-medium text-gray-700 group-hover:text-purple-600">Analytics</span>
            <span className="text-xs text-gray-500 mt-1">Coming Soon</span>
          </div>

          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors group cursor-not-allowed opacity-50">
            <span className="text-3xl mb-2 group-hover:text-orange-600">⚙️</span>
            <span className="font-medium text-gray-700 group-hover:text-orange-600">Settings</span>
            <span className="text-xs text-gray-500 mt-1">Coming Soon</span>
          </div>
        </div>
      </div>

      {/* Recent Quizzes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Quizzes</h2>
          <Link href="/admin/quizzes">
            <a className="text-sm text-blue-600 hover:text-blue-500 font-medium">
              View all
            </a>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading quizzes...</p>
          </div>
        ) : quizzes && quizzes.length > 0 ? (
          <div className="space-y-3">
            {quizzes.slice(0, 5).map((quiz: any) => (
              <div key={quiz._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-medium text-gray-900">{quiz.title}</h3>
                  <p className="text-sm text-gray-600">
                    {quiz.questions.length} questions • Created {new Date(quiz.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Link href={`/quiz/${quiz._id}`}>
                  <a className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                    View
                  </a>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">You haven't created any quizzes yet</p>
            <Link href="/admin/create">
              <a className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Create Your First Quiz
              </a>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};