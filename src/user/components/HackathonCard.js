import PropTypes from 'prop-types';
import { FaCalendar, FaUsers, FaTrophy, FaClock, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// HackathonCard Component
const HackathonCard = ({ hackathon, status }) => {
  const {
    id,
    title,
    description,
    startDate,
    endDate,
    teamSize,
    prizePool,
    image,
    timeLeft,
    location,
    registrationFee,
    hackathonType,
    hackathonMode,
    hackathon_category,
    registrationDate,
    registration_id,
  } = hackathon;
  console.log(hackathon);
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <HackathonStatus status={status} />
        </div>
        {description && (
          <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        )}

        <div className="space-y-2 mb-4">
          {startDate && endDate && (
            <div className="flex items-center text-gray-600">
              <FaCalendar className="w-4 h-4 mr-2" />
              <span>{startDate} - {endDate}</span>
            </div>
          )}
          {teamSize && (
            <div className="flex items-center text-gray-600">
              <FaUsers className="w-4 h-4 mr-2" />
              <span>Team Size: {teamSize}</span>
            </div>
          )}
          {prizePool !== undefined && (
            <div className="flex items-center text-gray-600">
              <FaTrophy className="w-4 h-4 mr-2" />
              <span>Prize Pool: {prizePool}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center text-gray-600">
              <FaMapMarkerAlt className="w-4 h-4 mr-2" />
              <span>Location: {location}</span>
            </div>
          )}
          {registrationFee !== undefined && (
            <div className="flex items-center text-gray-600">
              <FaDollarSign className="w-4 h-4 mr-2" />
              <span>Registration Fee: ${registrationFee}</span>
            </div>
          )}
          {hackathonType && (
            <div className="flex items-center text-gray-600">
              <span>Type: {hackathonType}</span>
            </div>
          )}
          {hackathonMode && (
            <div className="flex items-center text-gray-600">
              <span>Mode: {hackathonMode}</span>
            </div>
          )}
          {timeLeft && (
            <div className="flex items-center text-gray-600">
              <FaClock className="w-4 h-4 mr-2" />
              <span>{timeLeft}</span>
            </div>
          )}
        </div>
        

        <RegisterButton status={status} hackathonId={id} title={title} startDate={startDate} registration_id={registration_id}  />
      </div>
    </div>
  );
};

HackathonCard.propTypes = {
  hackathon: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    teamSize: PropTypes.string.isRequired,
    prizePool: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    hackathon_category: PropTypes.string.isRequired,
    timeLeft: PropTypes.string,
    registration_id: PropTypes.string,
  }).isRequired,
  status: PropTypes.oneOf(['registered', 'upcoming', 'ongoing', 'past']).isRequired,
};

// HackathonStatus Component
const HackathonStatus = ({ status }) => {
  const statusStyles = {
    registered: 'bg-green-50 text-green-600',
    upcoming: 'bg-blue-50 text-blue-600',
    ongoing: 'bg-yellow-50 text-yellow-600',
    past: 'bg-gray-50 text-gray-600',
  };

  const statusText = {
    registered: 'Registered',
    upcoming: 'Upcoming',
    ongoing: 'Live Now',
    past: 'Completed',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}>
      {statusText[status]}
    </span>
  );
};

HackathonStatus.propTypes = {
  status: PropTypes.oneOf(['registered', 'upcoming', 'ongoing', 'past']).isRequired,
};

// RegisterButton Component
const RegisterButton = ({ status, hackathonId, id,title,startDate,registration_id }) => {
  const navigate = useNavigate();
  console.log("Registration ID:", hackathonId);
  const handleRegister = () => {
    navigate(`/user-dashboard/hackathons/details?hackathonId=${encodeURIComponent(hackathonId)}`);
    console.log('Registering for hackathon:', hackathonId);
  };

  const handleViewDetails = () => {
    const currentDate = new Date();
    const hackathonStartDate = new Date(startDate);
  
    if (currentDate < hackathonStartDate) {
      alert("Hackathon not yet started!");
      return;
    }
  
    if (!registration_id) {
      console.error("Registration ID is undefined!");
      return;
    }
  
    console.log("Viewing details for hackathon:", hackathonId, "with registration_id:", registration_id);
    navigate(`/user-dashboard/hackathons/dashboard?registration_id=${encodeURIComponent(registration_id)}`);
  };
  

  if (status === 'registered') {
    return (
      <button
        onClick={handleViewDetails}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        View Dashboard
      </button>
    );
  }

  if (status === 'upcoming') {
    return (
      <button
        onClick={handleRegister}
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
      >
        Register Now
      </button>
    );
  }

  if (status === 'ongoing') {
    return (
      <button
        onClick={handleViewDetails}
        className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition-colors"
      >
        View Live
      </button>
    );
  }

  return (
    <button
      onClick={handleViewDetails}
      className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
    >
      View Results
    </button>
  );
};

RegisterButton.propTypes = {
  status: PropTypes.oneOf(['registered', 'upcoming', 'ongoing', 'past']).isRequired,
  hackathonId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  registration_id: PropTypes.string, // Add registration_id
};

export default HackathonCard;
