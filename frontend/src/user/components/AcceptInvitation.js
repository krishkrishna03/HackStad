import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Users, Globe, MapPin, CreditCard, Building, ChevronRight, Check 
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom'; 

const AcceptInvitation = () => {
  const navigate = useNavigate();
  const [hackathonDetails, setHackathonDetails] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Helper: Get backend base URL
  const getBaseURL = () => {
    const ip = window.location.hostname;
    return `http://${ip}:8000`;
  };

  // Parse query parameters. Our invitation link sends both a token and the hackathon title.
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tokenParam = queryParams.get('invite_token'); // Invitation token (if any)
  // Use the 'hackathon' query parameter if available; else fallback to 'title'
  const hackathonTitle = queryParams.get('hackathon') || queryParams.get('title');

  // Fetch hackathon details from backend using the title.
  useEffect(() => {
    const fetchHackathonDetails = async () => {
      try {
        const response = await fetch(`${getBaseURL()}/hackathon_details?title=${encodeURIComponent(hackathonTitle)}`);
        const data = await response.json();
        console.log('Fetched hackathon details:', data);
        setHackathonDetails(data);
      } catch (error) {
        console.error("Error fetching hackathon details:", error);
      }
    };
    if (hackathonTitle) {
      fetchHackathonDetails();
    }
  }, [hackathonTitle]);

  // Check if user is logged in by checking for an auth token in localStorage.
  const authToken = localStorage.getItem("token");
  console.log('Auth Token:', authToken);

  // If user is not logged in, show a login prompt.
  const renderLoginPrompt = () => {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm text-center">
        <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
        <p className="mb-4">You must be logged in to enroll and accept this invitation.</p>
        <button
          onClick={() =>
            navigate("/login", { state: { from: location.pathname + location.search } })
          }
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Login / Register
        </button>
      </div>
    );
  };

  // Handler for enrollment. If an invitation token is present, call the accept_invite endpoint.
  // Otherwise, use the normal enrollment flow.
  const handleEnroll = async () => {
    if (!authToken) {
      // This should not occur if we already show the login prompt.
      setErrorMessage("You must be logged in to enroll.");
      return;
    }
    
    // If an invitation token is present, use the invitation flow.
   
      // Normal enrollment flow (free/paid hackathon registration).
      try {
        // (Optional) Re-fetch hackathon details.
        const hackathonResponse = await fetch(
          `${getBaseURL()}/hackathon_details?title=${encodeURIComponent(hackathonDetails.title)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            }
          }
        );
        if (!hackathonResponse.ok) {
          const error = await hackathonResponse.json();
          setErrorMessage(error.detail || "Unable to fetch hackathon details.");
          return;
        }
        const hackathonData = await hackathonResponse.json();
        const registrationFee = hackathonData.registration_fee;
       
        if (registrationFee === 0) {
          const freeEnrollResponse = await fetch(`${getBaseURL()}/register_free_hackathon?title=${encodeURIComponent(hackathonDetails.title)}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          });
          if (freeEnrollResponse.ok) {
            const result = await freeEnrollResponse.json();
            setIsEnrolled(true);
            setSuccessMessage(result.message || "Enrollment successful!");
            if (hackathonData.team === "team") {
              setTimeout(() => {
                navigate('/user-dashboard/teamcreate', {
                  state: {
                    hackathonId: hackathonDetails.id,
                    noOfPeopleInTeam: hackathonDetails.no_of_people_in_team,
                  }
                });
              }, 3000);}

            
          } else {
            const errorData = await freeEnrollResponse.json();
            setErrorMessage(errorData.detail || "Enrollment failed.");
          }
        } else {
          // For paid hackathon enrollment: create a Razorpay order and handle payment.
          const paidEnrollResponse = await fetch(`${getBaseURL()}/register_paid_hackathon?title=${encodeURIComponent(hackathonDetails.title)}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          });
          if (!paidEnrollResponse.ok) {
            const errorData = await paidEnrollResponse.json();
            setErrorMessage(errorData.detail || "Failed to initiate payment.");
            return;
          }
          const result = await paidEnrollResponse.json();
          const { order_id, currency, key_id } = result;
  
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.async = true;
          script.onload = () => {
            const options = {
              key: "rzp_test_shS6viKWRoeKVm", // Replace with your Razorpay key
              amount: registrationFee * 100,
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
                  if (verificationResponse.ok) {
                    setIsEnrolled(true);
                    setSuccessMessage("Payment successful! You are now enrolled.");
                    if (hackathonData.team === "team") {
                      if (tokenParam) {
                        try {
                          const response = await fetch(`${getBaseURL()}/api/accept_invite?invite_token=${tokenParam}`, {
                            method: "GET",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${authToken}`,
                            },
                          });
                          if (response.ok) {
                            const data = await response.json();
                            setSuccessMessage(data.message || "You have successfully joined the team!");
                            setIsEnrolled(true);
                            // After a short delay, navigate to the hackathons registered page.
                            setTimeout(() => {
                              navigate('/user-dashboard/hackathons/registered');
                            }, 3000);
                          } else {
                            const errorData = await response.json();
                            setErrorMessage(errorData.detail || "Failed to accept invitation.");
                          }
                        } catch (error) {
                          console.error("Error accepting invitation:", error);
                          setErrorMessage("An error occurred while processing your invitation.");
                        }
                      } else {
                      setTimeout(() => {
                        navigate('/user-dashboard/teamcreate', {
                          state: {
                            hackathonId: hackathonDetails.id,
                            noOfPeopleInTeam: hackathonData.no_of_people_in_team,
                          }
                        });
                      }, 3000);
                    }}
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
        }
      } catch (error) {
        setErrorMessage("An unexpected error occurred. Please try again later.");
      }
    
  };

  // If hackathon details are not loaded, show a loading state.
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
          {/* Left Column - Hackathon Details */}
          <div className="lg:col-span-2 space-y-8">
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

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold mb-4">About the Hackathon</h2>
              <p className="text-gray-700 whitespace-pre-line">{hackathonDetails.description}</p>
            </div>

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
              
              {/* If user is not logged in, show the login prompt */}
              {!authToken ? (
                <div className="text-center">
                  <p className="mb-4 text-red-600">You must log in to enroll.</p>
                  <button
                    onClick={() => 

                        {localStorage.setItem('redirectUrl', location.pathname + location.search);
                            navigate("/login", { state: { from: location.pathname + location.search } })}}
                    
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Login / Register
                  </button>
                </div>
              ) : (
                <>
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
  
                    {successMessage && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full opacity-100 transition-all duration-300 ease-in-out">
                        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-lg border border-green-200 flex items-center space-x-2">
                          <Check className="w-4 h-4" />
                          <span>{successMessage}</span>
                        </div>
                      </div>
                    )}
  
                    {errorMessage && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full opacity-100 transition-all duration-300 ease-in-out">
                        <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg shadow-lg border border-red-200 flex items-center space-x-2">
                          <span>{errorMessage}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
  
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

export default AcceptInvitation;
