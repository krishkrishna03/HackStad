import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaClock, FaUser, FaBook } from 'react-icons/fa';
import { Search, X } from 'lucide-react';

const courses = [
  {
    id: '1',
    title: 'Full Stack Web Development Bootcamp',
    description: 'Learn modern web development with React and Node.js',
    instructor: 'Sarah Johnson',
    duration: '12 weeks',
    level: 'Intermediate',
    category: 'web',
    lessons: 48,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    progress: 75,
    source: 'https://www.youtube.com/embed/m4WLln2UMzk',
    topics: [
      'React.js Fundamentals',
      'Node.js & Express',
      'Database Design',
      'API Development',
      'Authentication & Security'
    ]
  },
  {
    id: '2',
    title: 'Machine Learning Fundamentals',
    description: 'Master the basics of ML and AI',
    instructor: 'Dr. Michael Chen',
    duration: '8 weeks',
    level: 'Beginner',
    category: 'ai',
    lessons: 32,
    source: 'https://www.youtube.com/embed/b2q5OFtxm6A',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c',
    progress: 30,
    topics: [
      'Python for ML',
      'Data Preprocessing',
      'Supervised Learning',
      'Neural Networks',
      'Model Deployment'
    ]
  },
  {
    id: '3',
    title: 'Mobile App Development with React Native',
    description: 'Build cross-platform mobile apps',
    instructor: 'Alex Rodriguez',
    duration: '10 weeks',
    level: 'Intermediate',
    category: 'mobile',
    lessons: 40,
    source: 'https://www.youtube.com/embed/ZBCUegTZF7M',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c',
    progress: 0,
    topics: [
      'React Native Basics',
      'Navigation',
      'State Management',
      'Native Modules',
      'App Publishing'
    ]
  },
  {
    id: '4',
    title: 'Cloud Architecture on AWS',
    description: 'Design scalable cloud solutions',
    instructor: 'Emily White',
    duration: '6 weeks',
    level: 'Advanced',
    category: 'cloud',
    lessons: 24,
    source: 'https://www.youtube.com/embed/gIWel4gFZaY',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
    progress: 15,
    topics: [
      'AWS Services',
      'Serverless Architecture',
      'Microservices',
      'DevOps Practices',
      'Security Best Practices'
    ]
  },
  {
    id: '5',
    title: 'Blockchain Development',
    description: 'Build decentralized applications',
    instructor: 'David Kumar',
    duration: '8 weeks',
    level: 'Intermediate',
    category: 'blockchain',
    lessons: 32,
    source: 'https://www.youtube.com/embed/SyVMma1IkXM',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0',
    progress: 0,
    topics: [
      'Smart Contracts',
      'Ethereum Development',
      'Web3.js',
      'DApp Architecture',
      'Token Standards'
    ]
  }
];

const CourseCard = ({ course }) => {
  const { title, instructor, duration, level, lessons, image, progress, source } = course;

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
      {source ? (
        <iframe
          src={source}
          frameBorder="0"
          title={title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <FaUser className="w-4 h-4 mr-2" />
            <span>{instructor}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaClock className="w-4 h-4 mr-2" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaBook className="w-4 h-4 mr-2" />
            <span>{lessons} lessons</span>
          </div>
        </div>
      </div>
    </div>
  );
};

CourseCard.propTypes = {
  course: PropTypes.shape({
    title: PropTypes.string.isRequired,
    instructor: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    lessons: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
    source: PropTypes.string
  }).isRequired
};

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = courses.filter(course => {
    const categoryMatch = selectedCategory === 'all' || course.category === selectedCategory;
    const searchMatch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Learning Hub</h1>
        <p className="text-gray-600 mt-1">Enhance your skills with our curated courses</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        {filteredCourses.length > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Search className="h-12 w-12 mb-4 text-gray-400" />
          <p className="text-lg font-medium">No courses found</p>
          <p className="text-sm">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Courses;
