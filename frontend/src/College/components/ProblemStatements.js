import React, { useState } from 'react';
import { FileText, Plus, Edit2, Trash2, Tag } from 'lucide-react';

const ProblemStatements = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [problems, setProblems] = useState([
    {
      id: 1,
      title: "AI-Powered Healthcare Solutions",
      description: "Develop innovative healthcare solutions using artificial intelligence to improve patient care and medical diagnosis accuracy.",
      category: "Healthcare",
      difficulty: "Advanced",
      points: 100
    },
    {
      id: 2,
      title: "Sustainable Smart Cities",
      description: "Create solutions for smart city management focusing on sustainability, energy efficiency, and environmental impact reduction.",
      category: "Sustainability",
      difficulty: "Intermediate",
      points: 75
    }
  ]);

  const difficultyColors = {
    Beginner: 'text-green-600 bg-green-50',
    Intermediate: 'text-amber-600 bg-amber-50',
    Advanced: 'text-red-600 bg-red-50'
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FileText size={28} className="text-gray-700" strokeWidth={1.5} />
          <h2 className="text-2xl font-bold text-gray-800">Problem Statements</h2>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus size={20} />
          <span>Add Problem</span>
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Add New Problem Statement</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-200 focus:outline-none"
                placeholder="Problem title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-200 focus:outline-none"
                rows={4}
                placeholder="Problem description"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-200 focus:outline-none"
                  placeholder="Category"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-200 focus:outline-none">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Points
                </label>
                <input
                  type="number"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-200 focus:outline-none"
                  placeholder="Points"
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                Add Problem
              </button>
              <button 
                onClick={() => setShowAddForm(false)}
                className="flex-1 border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {problems.map(problem => (
          <div key={problem.id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-800">{problem.title}</h3>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Edit2 size={20} />
                </button>
                <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{problem.description}</p>
            
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg">
                <Tag size={16} />
                <span>{problem.category}</span>
              </span>
              <span className={`px-3 py-1 rounded-lg ${difficultyColors[problem.difficulty]}`}>
                {problem.difficulty}
              </span>
              <span className="px-3 py-1 bg-violet-50 text-violet-600 rounded-lg">
                {problem.points} points
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemStatements;