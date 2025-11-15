import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { quizAPI } from '../../services/api';
import { QuizCard } from './QuizCard';
import { Link } from 'wouter';

export const QuizListPage: React.FC = () => {
  const { data: quizzes, isLoading, error } = useQuery({
    queryKey: ['quizzes'],
    queryFn: () => quizAPI.getAll().then(res => res.data)
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading quizzes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-600 text-lg">Failed to load quizzes</div>
            <p className="text-gray-600 mt-2">Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to QuizMaster
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Test your knowledge with our interactive quizzes. Choose from a variety of topics and challenge yourself!
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link href="/login">
              <a className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Admin Login
              </a>
            </Link>
            <Link href="/register">
              <a className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Become Admin
              </a>
            </Link>
          </div>
        </div>

        {/* Quizzes Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Quizzes</h2>
          {quizzes && quizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz: any) => (
                <QuizCard key={quiz._id} quiz={quiz} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">No quizzes available yet</div>
              <p className="text-gray-400">Check back later or create an admin account to add quizzes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};