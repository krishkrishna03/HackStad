import React, { useState, useEffect,navigate } from 'react';
import { Calendar, Clock, Users, Globe, MapPin, CreditCard, Building, ChevronRight, Check } from 'lucide-react';
import { useLocation,useNavigate } from 'react-router-dom'; 

const HackathonDetails = () => {
  const navigate = useNavigate(); // Correct way to use navigate
  const [hackathonDetails, setHackathonDetails] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const getBaseURL = () => {
    const ip = window.location.hostname;
    return `http://${ip}:8000`;
  };
   // Get the query parameter 'title' from the URL
   const location = useLocation();
   const queryParams = new URLSearchParams(location.search);
   const hackathonId = queryParams.get('hackathonId');
  // Fetch hackathon details using title from backend
  useEffect(() => {
    const fetchHackathonDetails = async () => {
      try {
        const response = await fetch(`${getBaseURL()}/hackathon_details?id=${encodeURIComponent(hackathonId)}`);
        const data = await response.json();
        console.log('okokok',data._id);
        setHackathonDetails(data);
      } catch (error) {
        console.error("Error fetching hackathon details:", error);
      }
    };
    fetchHackathonDetails();
  }, []);
  console.log('Hackathon Details:', hackathonDetails);

  
  const handleEnroll = async () => {
    if (!isEnrolled) {
      const authToken = localStorage.getItem("token");
      if (!authToken) {
        setErrorMessage("You must be logged in to enroll.");
        return;
      }
      try {
        // Fetch hackathon details
        const hackathonResponse = await fetch(
          `${getBaseURL()}/hackathon_details?id=${hackathonDetails.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            }
          }
        );
        console.log(hackathonResponse);
        if (!hackathonResponse.ok) {
          const error = await hackathonResponse.json();
          setErrorMessage(error.detail || "Unable to fetch hackathon details.");
          return;
        }
        
        const hackathonData = await hackathonResponse.json();
        const registrationFee = hackathonData.registration_fee;
       
        // If it's a free hackathon, register directly
        if (registrationFee === 0) {
          const freeEnrollResponse = await fetch(`${getBaseURL()}/register_free_hackathon?title=${hackathonDetails.title}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          });
        
          const result = await freeEnrollResponse.json(); // Read JSON response only once
        
          console.log("Free enrollment response:", result); // Debugging
        
          if (freeEnrollResponse.ok) {
            setIsEnrolled(true);
            setSuccessMessage(result.message || "Enrollment successful!");
        
            setTimeout(() => {
              setSuccessMessage("");
              if (hackathonDetails.team === "individual") {
                navigate('/user-dashboard/hackathons/registered');
              } else if (hackathonDetails.team === "team") {
                navigate('/user-dashboard/teamcreate', {
                  state: {
                    hackathonId: hackathonDetails.id,
                    noOfPeopleInTeam: hackathonDetails.no_of_people_in_team,
                  }
                });
              }
            }, 3000);
          } else {
            setErrorMessage(result.detail ? JSON.stringify(result.detail) : "Enrollment failed.");
          }
          return;
        }
        
        
  
        // Paid hackathon - Create a Razorpay order
        const paidEnrollResponse = await fetch(`${getBaseURL()}/register_paid_hackathon?title=${hackathonDetails.title}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
  
        if (!paidEnrollResponse.ok) {
          const error = await paidEnrollResponse.json();
          setErrorMessage(error.detail ? JSON.stringify(error.detail) : "Failed to initiate payment.");
          return;
        }
  
        const result = await paidEnrollResponse.json();
        const { order_id, currency, key_id } = result;
  
        // ✅ Dynamically load Razorpay script before opening payment window
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => {
          // Initialize Razorpay Payment
          const options = {
            key: "rzp_test_shS6viKWRoeKVm",
            amount: registrationFee * 100, // Convert INR to paisa
            currency: currency,
            name: "Hackathon Registration",
            description: `Registration for ${hackathonDetails.title}`,
            order_id: order_id,
            handler: async (response) => {
              try {
                const verificationResponse = await fetch(`${getBaseURL()}/verify_payment`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                  },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  }),
                });
            
                const verificationData = await verificationResponse.json();
                console.log("Payment verification response:", verificationData); // Debugging
            
                if (verificationResponse.ok) {
                  setIsEnrolled(true);
                  setSuccessMessage("Payment successful! You are now enrolled.");
                  
                  // Navigate to team creation page after success


                  if (hackathonData.team == "team"){ setTimeout(() => {
                    setSuccessMessage("");
                    navigate('/user-dashboard/teamcreate',{state: {
                      hackathonId: hackathonDetails.id,
                      noOfPeopleInTeam: hackathonData.no_of_people_in_team,
                    }})  // Redirect after success
                  }, 3000);}
                  
                } else {
                  setErrorMessage(verificationData.detail || "Payment verification failed. Please contact support.");
                }
              } catch (error) {
                console.error("Error during payment verification:", error);
                setErrorMessage("An error occurred during payment verification. Please try again later.");
              }
            },
            theme: {
              color: "#3399cc",
            },
          };
  
          const rzp = new window.Razorpay(options);
          rzp.open();
        };
  
        document.body.appendChild(script);
        
      } catch (error) {
        setErrorMessage("An unexpected error occurred. Please try again later.");
      }
    }
  };
  

  
  // If hackathon details are not loaded yet, return a loading state
  if (!hackathonDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
          <img 
            src={hackathonDetails.poster_url}
            alt="Hackathon" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent">
            <div className="container mx-auto px-4 h-full flex items-end pb-8">
              <div className="text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {hackathonDetails.title}
                </h1>
                <p className="text-xl opacity-90">Hosted by {hackathonDetails.organization}</p>
              </div>
            </div>
          </div>
        </div>
    
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Key Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
              <h2 className="text-2xl font-bold mb-4">Key Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Registration Opens</p>
                    <p className="font-medium">{hackathonDetails.start_date}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Registration Deadline</p>
                    <p className="font-medium">{hackathonDetails.end_date}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Event Duration</p>
                    <p className="font-medium">36 Hours</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Participation Type</p>
                    <p className="font-medium">{hackathonDetails.hackathon_type}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-indigo-600" />
                  <div>
                    <p className="text-sm text-gray-600">Mode</p>
                    <p className="font-medium">{hackathonDetails.hackathon_mode}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">Registration Fee</p>
                    <p className="font-medium">{hackathonDetails.registration_fee}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">About the Hackathon</h2>
              <p className="text-gray-700 whitespace-pre-line">{hackathonDetails.description}</p>
            </div>

            {/* Themes */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Themes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {hackathonDetails.hackathon_focus && hackathonDetails.hackathon_focus.length > 0 ? (
                  hackathonDetails.themes.map((theme, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <ChevronRight className="w-4 h-4 text-blue-600" />
                      <span>{theme}</span>
                    </div>
                  ))
                ) : (
                  <p>No themes available.</p>
                )}
              </div>
            </div>

            {/* Prize Pool */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">Prize Pool</h2>
              <div className="space-y-3">
                {hackathonDetails.prizes && hackathonDetails.prizes.length > 0 ? (
                  hackathonDetails.prizes.map((prize, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <ChevronRight className="w-4 h-4 text-blue-600" />
                      <span>{prize}</span>
                    </div>
                  ))
                ) : (
                  <p>No prizes available.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
              <h2 className="text-2xl font-bold mb-4">Ready to Innovate?</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Category: </p>
                    <p className="font-medium">
                      {hackathonDetails.hackathon_category === "single_problem_statement" 
                        ? "Single Problem Statement: Everyone will have the same problem statement." 
                        : hackathonDetails.hackathon_category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Organizer</p>
                    <p className="font-medium">{hackathonDetails.organization}</p>
                  </div>
                </div>
              </div>

              <div className="relative">
  <button
    onClick={handleEnroll}
    disabled={isEnrolled}
    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2
      ${isEnrolled 
        ? 'bg-green-500 text-white cursor-default hover:bg-green-500' 
        : 'bg-blue-600 text-white hover:bg-blue-700'}`}
  >
    {isEnrolled ? (
      <>
        <Check className="w-5 h-5" />
        <span>Enrolled</span>
      </>
    ) : (
      'Enroll Now'
    )}
  </button>

  {/* Success Message Toast */}
  {successMessage && (
    <div
      className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full 
        opacity-100 translate-y-[-120%] transition-all duration-300 ease-in-out`}
    >
      <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-lg border border-green-200 flex items-center space-x-2">
        <Check className="w-4 h-4" />
        <span>{successMessage}</span>
      </div>
    </div>
  )}

  {/* Error Message Toast */}
  {errorMessage && (
    <div
      className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full 
        opacity-100 translate-y-[-120%] transition-all duration-300 ease-in-out`}
    >
      <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow-lg border border-red-200 flex items-center space-x-2">
        <span>{errorMessage}</span>
      </div>
    </div>
  )}
</div>


              <p className="text-center text-sm text-gray-600 mt-4">
                Registration deadline: {hackathonDetails.register_deadline}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackathonDetails;
