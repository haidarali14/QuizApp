import React, { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { quizAPI } from '../../services/api';

export const QuizTakePage: React.FC = () => {
  const [match, params] = useRoute('/quiz/:id');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: quiz, isLoading, error } = useQuery({
    queryKey: ['quiz', params?.id],
    queryFn: () => quizAPI.getById(params!.id).then(res => res.data),
    enabled: !!params?.id
  });

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== quiz.questions.length) {
      if (!window.confirm('You have not answered all questions. Are you sure you want to submit?')) {
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const response = await quizAPI.submit(quiz._id, answers);
      // Redirect to results page
      window.location.href = `/quiz/${quiz._id}/results?score=${response.data.score}&total=${response.data.totalPoints}&percentage=${response.data.percentage}`;
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Quiz Not Found</h1>
            <p className="text-gray-600 mb-6">
              The quiz you're looking for doesn't exist or couldn't be loaded.
            </p>
            <Link href="/">
              <a className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Back to Home
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const answeredQuestions = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Quiz Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
              {quiz.description && (
                <p className="text-gray-600">{quiz.description}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Created by {quiz.createdBy?.name || 'Unknown'}
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <div className="text-lg font-semibold text-gray-900">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </div>
              <div className="text-sm text-gray-600">
                {answeredQuestions} of {quiz.questions.length} answered
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {currentQuestion.questionText}
            </h2>
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Question Type Specific Input */}
          {currentQuestion.type === 'mcq' && (
            <div className="space-y-3">
              {currentQuestion.options?.map((option: string, index: number) => (
                <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option}
                    checked={answers[currentQuestion.id] === option}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          )}

          {currentQuestion.type === 'truefalse' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center justify-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value="true"
                  checked={answers[currentQuestion.id] === 'true'}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="text-lg font-medium text-green-700">True</span>
              </label>
              <label className="flex items-center justify-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value="false"
                  checked={answers[currentQuestion.id] === 'false'}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  className="text-red-600 focus:ring-red-500"
                />
                <span className="text-lg font-medium text-red-700">False</span>
              </label>
            </div>
          )}

          {currentQuestion.type === 'text' && (
            <div>
              <textarea
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                placeholder="Type your answer here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={4}
              />
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Next Question
            </button>
          )}
        </div>

        {/* Question Navigation Dots */}
        <div className="mt-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {quiz.questions.map((question: any, index: number) => (
              <button
                key={question.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : answers[question.id]
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
                title={`Question ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};