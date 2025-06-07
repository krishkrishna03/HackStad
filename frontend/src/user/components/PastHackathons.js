// Component: Past Hackathons
import HackathonCard from './HackathonCard';

const PastHackathons = () => {
  const pastHackathons = [
    {
      id: 'hack-4',
      title: 'Mobile App Innovation',
      description: 'Create next-generation mobile applications',
      startDate: 'Feb 15, 2024',
      endDate: 'Feb 17, 2024',
      teamSize: '2-4',
      prizePool: 8000,
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
    },
    // Add more past hackathons here
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Past Hackathons</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pastHackathons.map((hackathon) => (
          <HackathonCard 
            key={hackathon.id} 
            hackathon={hackathon} 
            status="past" 
          />
        ))}
      </div>
    </div>
  );
};

export default PastHackathons;
