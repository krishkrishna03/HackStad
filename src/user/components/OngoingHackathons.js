// Component: Ongoing Hackathons
import HackathonCard from './HackathonCard';

const OngoingHackathons = () => {
  const ongoingHackathons = [
    {
      id: 'hack-3',
      title: 'Cloud Computing Challenge',
      description: 'Build scalable cloud solutions',
      startDate: 'Mar 20, 2024',
      endDate: 'Mar 22, 2024',
      teamSize: '2-4',
      prizePool: 12000,
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
      timeLeft: '12 hours left',
    },
    // Add more ongoing hackathons here
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Ongoing Hackathons</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ongoingHackathons.map((hackathon) => (
          <HackathonCard 
            key={hackathon.id} 
            hackathon={hackathon} 
            status="ongoing" 
          />
        ))}
      </div>
    </div>
  );
};

export default OngoingHackathons;
