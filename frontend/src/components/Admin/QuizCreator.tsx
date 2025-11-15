import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { quizAPI } from '../../services/api';
import { useLocation } from 'wouter';

interface QuizFormData {
  title: string;
  description: string;
}

interface Question {
  id: string;
  type: 'mcq' | 'truefalse' | 'text';
  questionText: string;
  options?: string[];
  correctAnswer: string;
  points: number;
}

export const QuizCreator: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<QuizFormData>();
  const [, setLocation] = useLocation();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addQuestion = (type: 'mcq' | 'truefalse' | 'text') => {
    const newQuestion: Question = {
      id: `q${Date.now()}`,
      type,
      questionText: '',
      correctAnswer: '',
      points: 1,
      ...(type === 'mcq' && { options: ['', '', '', ''] })
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options![optionIndex] = value;
      setQuestions(updatedQuestions);
    }
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: QuizFormData) => {
    if (questions.length === 0) {
      setError('Please add at least one question');
      return;
    }

    // Validate all questions have content
    for (const question of questions) {
      if (!question.questionText.trim()) {
        setError('All questions must have text');
        return;
      }
      if (!question.correctAnswer.trim()) {
        setError('All questions must have a correct answer');
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      const quizData = {
        ...data,
        questions: questions.map(q => ({
          ...q,
          id: `q${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }))
      };

      const response = await quizAPI.create(quizData);
      console.log('✅ Quiz created:', response.data);
      setLocation('/admin/quizzes');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Quiz</h1>
        <p className="text-gray-600 mb-6">Build your quiz with multiple question types</p>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Quiz Basic Info */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quiz Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Quiz Title *
                </label>
                <input
                  {...register('title', { required: 'Quiz title is required' })}
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter quiz title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter quiz description (optional)"
                />
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Questions</h2>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => addQuestion('mcq')}
                  className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                >
                  + Multiple Choice
                </button>
                <button
                  type="button"
                  onClick={() => addQuestion('truefalse')}
                  className="px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                >
                  + True/False
                </button>
                <button
                  type="button"
                  onClick={() => addQuestion('text')}
                  className="px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700"
                >
                  + Text Answer
                </button>
              </div>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">No questions added yet</p>
                <p className="text-sm text-gray-400 mt-1">Click the buttons above to add questions</p>
              </div>
            ) : (
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={question.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">
                        Question {index + 1} ({question.type})
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Question Text */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Question Text *
                        </label>
                        <input
                          type="text"
                          value={question.questionText}
                          onChange={(e) => updateQuestion(index, 'questionText', e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your question"
                        />
                      </div>

                      {/* Question Type Specific Fields */}
                      {question.type === 'mcq' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Options *
                          </label>
                          <div className="space-y-2">
                            {question.options?.map((option, optIndex) => (
                              <input
                                key={optIndex}
                                type="text"
                                value={option}
                                onChange={(e) => updateOption(index, optIndex, e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder={`Option ${optIndex + 1}`}
                              />
                            ))}
                          </div>
                          <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-700">
                              Correct Answer *
                            </label>
                            <select
                              value={question.correctAnswer}
                              onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Select correct option</option>
                              {question.options?.map((option, optIndex) => (
                                <option key={optIndex} value={option}>
                                  {option || `Option ${optIndex + 1}`}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}

                      {question.type === 'truefalse' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Correct Answer *
                          </label>
                          <select
                            value={question.correctAnswer}
                            onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select correct answer</option>
                            <option value="true">True</option>
                            <option value="false">False</option>
                          </select>
                        </div>
                      )}

                      {question.type === 'text' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Correct Answer *
                          </label>
                          <input
                            type="text"
                            value={question.correctAnswer}
                            onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter the correct answer"
                          />
                        </div>
                      )}

                      {/* Points */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Points
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={question.points}
                          onChange={(e) => updateQuestion(index, 'points', parseInt(e.target.value) || 1)}
                          className="mt-1 block w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Quiz...' : 'Create Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};