import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, X, Calendar, Building, Download, Award, Search } from 'lucide-react';

// Custom hook for profile management
const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
};

// Sample data
const HACKATHON_DATA = [
  { 
    id: 1, 
    title: 'Hackathon A', 
    organization: 'Org A', 
    date: '2023-11-15',
    badge: '🏆',
    category: 'AI/ML'
  },
  { 
    id: 2, 
    title: 'Hackathon B', 
    organization: 'Org B', 
    date: '2023-10-20',
    badge: '🌟',
    category: 'Web Development'
  },
];

// Achievement Card Component
const AchievementCard = ({ hackathon, onClick }) => (
  <div
    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden"
    onClick={onClick}
  >
    <div className="p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-3xl mb-2">{hackathon.badge}</span>
          <h3 className="text-xl font-bold text-gray-800 mt-2">{hackathon.title}</h3>
        </div>
        <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm">
          {hackathon.category}
        </span>
      </div>
      <div className="space-y-2">
        <p className="text-gray-600 flex items-center">
          <Building className="w-4 h-4 mr-2" />
          {hackathon.organization}
        </p>
        <p className="text-gray-500 flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          {new Date(hackathon.date).toLocaleDateString()}
        </p>
      </div>
    </div>
  </div>
);

// Certificate Modal Component
const CertificateModal = ({ certificate, userName: prefilledUserName, onClose }) => {
  const [userName, setUserName] = useState(prefilledUserName || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCertificate, setGeneratedCertificate] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerateCertificate = async () => {
    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Simulated certificate generation with delay for UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      const url = `/api/placeholder/800/600`;
      const response = await fetch(url);
      const blob = await response.blob();
      setGeneratedCertificate({ url, blob });
    } catch (err) {
      setError('Failed to generate certificate. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedCertificate) {
      const fileName = `${certificate.title}-${userName}-Certificate.png`;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(generatedCertificate.blob);
      link.download = fileName;
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative animate-slideIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>

        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-8 h-8 text-indigo-600" />
            <h3 className="text-2xl font-bold text-gray-800">
              Generate Your Certificate
            </h3>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                disabled={isGenerating}
              />
              <button
                onClick={handleGenerateCertificate}
                disabled={isGenerating}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all disabled:bg-indigo-300 flex items-center justify-center gap-2 min-w-[200px]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : 'Generate Certificate'}
              </button>
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-4 rounded-lg border border-red-100 animate-shake">
                {error}
              </div>
            )}

            <div className="aspect-video relative bg-gray-50 rounded-lg overflow-hidden border-2 border-dashed border-gray-200">
              {isGenerating ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                  <p className="text-gray-500">Generating your certificate...</p>
                </div>
              ) : generatedCertificate ? (
                <img
                  src={generatedCertificate.url}
                  alt="Generated Certificate"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-3">
                  <Award className="w-12 h-12 text-gray-400" />
                  <p>Enter your name and generate your certificate</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-2">
                <p className="text-gray-600 flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  {certificate.organization}
                </p>
                <p className="text-gray-600 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {certificate.date}
                </p>
              </div>
              {generatedCertificate && (
                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <Download className="w-4 h-4" />
                  Download Certificate
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Achievement Component
const Achievement = () => {
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { profile, loading: profileLoading, error: profileError } = useProfile();

  const filteredAndSortedHackathons = useMemo(() => {
    return [...HACKATHON_DATA]
      .filter(hackathon => 
        hackathon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hackathon.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hackathon.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [searchQuery]);

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          <p className="text-gray-600">Loading your achievements...</p>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
          <p className="text-red-500 mb-4">Failed to load profile: {profileError.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Your Hackathon Achievements
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Showcase your hackathon journey and generate personalized certificates
          </p>
          
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by hackathon name, organization, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        {filteredAndSortedHackathons.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <p>No hackathons found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedHackathons.map((hackathon) => (
              <AchievementCard
                key={hackathon.id}
                hackathon={hackathon}
                onClick={() => setSelectedCertificate(hackathon)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedCertificate && profile && (
        <CertificateModal
          certificate={selectedCertificate}
          userName={profile.name}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </div>
  );
};

export default Achievement;