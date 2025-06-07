import React from 'react';

const Quiz = () => {
  const handleQuizRedirect = () => {
    window.open('https://www.mentimeter.com/', '_blank');
  };

  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Interactive Quizzes</h2>
      <p className="text-gray-600 mb-8">Create engaging quizzes for your students using Mentimeter</p>
      <button
        onClick={handleQuizRedirect}
        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Create Quiz with Mentimeter
      </button>
    </div>
  );
};

export default Quiz;