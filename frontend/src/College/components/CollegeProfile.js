import React, { useState ,useEffect} from 'react';
import { Building2,  Mail, Phone, MapPin,  School, Globe } from 'lucide-react';
// import await from 'await';
// import {  } from 'react-router-dom';
function CollegeProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [collegeProfile, setCollegeProfile] = useState({
    college_name: '',
    college_id: '',
    college_type: '',
    college_address: '',
    college_link: '',
    college_email: '',
    college_contact: '',
    principal_name: '',
    point_of_contact_name: '',
    poc_number: '',
    poc_mail: '',
    place: '',
    profile_picture: '',
  });
      const getBaseURL = () => {
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    return 'https://hackstad-0nqg.onrender.com';
  };

  useEffect(() => {
      const fetchProfile = async () => {
        try {
          const response = await fetch(`${getBaseURL()}/collegeprofile`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
  
          if (!response.ok) throw new Error('Failed to fetch profile');
  
          const data = await response.json();
  
          setCollegeProfile({
            college_name: data.college_name || '',
            college_id: data.college_id || '',
            college_type: data.college_type || '',
            college_address: data.college_address || '',
            college_link: data.college_link || 'Not provided',
            college_email: data.college_email || '',
            college_contact: data.college_contact|| '',
            principal_name: data.principal_name || '',
            point_of_contact_name: data.point_of_contact_name || '',
            poc_number: data.poc_number || '',
            poc_mail: data.poc_mail || '',
            place: data.place || '',
            profile_picture: data.profile_picture || '',
            
          });
  
          // If image exists in DB
          // setProfileImage(data.profile_image_url || '/api/placeholder/128/128');
        } catch (err) {
          console.error('Error fetching profile:', err);
        }
      };
  
      fetchProfile();
    }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCollegeProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleInputChangeForFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setCollegeProfile((prev) => ({
          ...prev,
          profile_picture: ev.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
    const updatePayload = {
      principal_name: collegeProfile.principal_name,
      point_of_contact_name: collegeProfile.point_of_contact_name,
      poc_number: collegeProfile.poc_number,
      poc_mail: collegeProfile.poc_mail,
      place: collegeProfile.place,
      profile_picture: collegeProfile.profile_picture,
    };
      const response =  fetch(`${getBaseURL()}/collegeprofile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const errData =  response.json();
        console.error('Error updating profile:', errData);
        alert('Failed to update profile.');
        return;
      }

      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Update error:', err);
    } finally {
      setLoading(false);
    }

    // Add API call here to update college profile
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Top Banner */}
      <div className="h-48 bg-gradient-to-r from-[#888F7E] to-[#A0A89E] rounded-xl mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute bottom-6 left-6">
          <h1 className="text-4xl font-bold text-white mb-2">{collegeProfile.college_name}</h1>
          <div className="flex items-center gap-2 text-white/90">
            <MapPin className="w-4 h-4" />
            <span>{collegeProfile.place}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header Actions */}
        <div className="flex justify-end mb-6">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-[#888F7E] text-white rounded-lg hover:bg-[#A0A89E] transition-colors"
            >
              Edit College Profile
            </button>
          ) : (
            <div className="space-x-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-black border border-[#888F7E] text-white rounded-lg hover:bg-[#888F7E]/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-[#888F7E] text-white rounded-lg hover:bg-[#A0A89E] transition-colors"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Quick Info */}
          <div className="lg:col-span-1">
            <div className="bg-black/50 backdrop-blur-sm border border-[#888F7E] rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-semibold text-[#F3FDC9] mb-4">Quick Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[#888F7E]">
                  <Building2 className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-[#888F7E]">College ID</p>
                    <p className="text-white">{collegeProfile.college_id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[#888F7E]">
                  <School className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-[#888F7E]">Type</p>
                    <p className="text-white">{collegeProfile.college_type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[#888F7E]">
                  <Globe className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-[#888F7E]">Website</p>
                    <a 
                      href={collegeProfile.college_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#F3FDC9] hover:underline"
                    >
                      {collegeProfile.college_link}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[#888F7E]">
                  <Mail className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-[#888F7E]">Email</p>
                    <p className="text-white">{collegeProfile.college_email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[#888F7E]">
                  <Phone className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-[#888F7E]">Contact</p>
                    <p className="text-white">{collegeProfile.college_contact}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2">
            <div className="bg-black/50 backdrop-blur-sm border border-[#888F7E] rounded-xl p-6">
              <form className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h2 className="text-xl font-semibold text-[#F3FDC9] mb-4 pb-2 border-b border-[#888F7E]">
                    Basic Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#F3FDC9] mb-2">
                        College Name
                      </label>
                      <input
                        type="text"
                        name="college_name"
                        value={collegeProfile.college_name}
                        className="w-full bg-black/50 border border-[#888F7E] rounded-lg px-4 py-2 text-white placeholder-[#888F7E] focus:outline-none focus:border-[#F3FDC9] disabled:opacity-70"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#F3FDC9] mb-2">
                        College ID
                      </label>
                      <input
                        type="text"
                        name="college_id"
                        value={collegeProfile.college_id}
                  
                        className="w-full bg-black/50 border border-[#888F7E] rounded-lg px-4 py-2 text-white placeholder-[#888F7E] focus:outline-none focus:border-[#F3FDC9] disabled:opacity-70"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#F3FDC9] mb-2">
                        College Type
                      </label>
                      <input
                        type="text"
                        name="college_type"
                        value={collegeProfile.college_type}
                      
                        className="w-full bg-black/50 border border-[#888F7E] rounded-lg px-4 py-2 text-white placeholder-[#888F7E] focus:outline-none focus:border-[#F3FDC9] disabled:opacity-70"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#F3FDC9] mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        name="place"
                        value={collegeProfile.place}
                        
                        className="w-full bg-black/50 border border-[#888F7E] rounded-lg px-4 py-2 text-white placeholder-[#888F7E] focus:outline-none focus:border-[#F3FDC9] disabled:opacity-70"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h2 className="text-xl font-semibold text-[#F3FDC9] mb-4 pb-2 border-b border-[#888F7E]">
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#F3FDC9] mb-2">
                        College Email
                      </label>
                      <input
                        type="email"
                        name="college_email"
                        value={collegeProfile.college_email}
                        
                        className="w-full bg-black/50 border border-[#888F7E] rounded-lg px-4 py-2 text-white placeholder-[#888F7E] focus:outline-none focus:border-[#F3FDC9] disabled:opacity-70"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#F3FDC9] mb-2">
                        College Contact
                      </label>
                      <input
                        type="tel"
                        name="college_contact"
                        value={collegeProfile.college_contact}
                       
                        className="w-full bg-black/50 border border-[#888F7E] rounded-lg px-4 py-2 text-white placeholder-[#888F7E] focus:outline-none focus:border-[#F3FDC9] disabled:opacity-70"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#F3FDC9] mb-2">
                        College Address
                      </label>
                      <textarea
                        name="college_address"
                        value={collegeProfile.college_address}
                      
                        rows="3"
                        className="w-full bg-black/50 border border-[#888F7E] rounded-lg px-4 py-2 text-white placeholder-[#888F7E] focus:outline-none focus:border-[#F3FDC9] disabled:opacity-70"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#F3FDC9] mb-2">
                        College Website
                      </label>
                      <input
                        type="url"
                        name="college_link"
                        value={collegeProfile.college_link}
                       
                        className="w-full bg-black/50 border border-[#888F7E] rounded-lg px-4 py-2 text-white placeholder-[#888F7E] focus:outline-none focus:border-[#F3FDC9] disabled:opacity-70"
                      />
                    </div>
                  </div>
                </div>

                {/* Management Information */}
                <div>
                  <h2 className="text-xl font-semibold text-[#F3FDC9] mb-4 pb-2 border-b border-[#888F7E]">
                    Management Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#F3FDC9] mb-2">
                        Principal Name
                      </label>
                      <input
                        type="text"
                        name="principal_name"
                        value={collegeProfile.principal_name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full bg-black/50 border border-[#888F7E] rounded-lg px-4 py-2 text-white placeholder-[#888F7E] focus:outline-none focus:border-[#F3FDC9] disabled:opacity-70"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#F3FDC9] mb-2">
                        Point of Contact Name
                      </label>
                      <input
                        type="text"
                        name="point_of_contact_name"
                        value={collegeProfile.point_of_contact_name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full bg-black/50 border border-[#888F7E] rounded-lg px-4 py-2 text-white placeholder-[#888F7E] focus:outline-none focus:border-[#F3FDC9] disabled:opacity-70"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#F3FDC9] mb-2">
                        POC Contact Number
                      </label>
                      <input
                        type="tel"
                        name="poc_number"
                        value={collegeProfile.poc_number}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full bg-black/50 border border-[#888F7E] rounded-lg px-4 py-2 text-white placeholder-[#888F7E] focus:outline-none focus:border-[#F3FDC9] disabled:opacity-70"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#F3FDC9] mb-2">
                        POC Email
                      </label>
                      <input
                        type="email"
                        name="poc_mail"
                        value={collegeProfile.poc_mail}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full bg-black/50 border border-[#888F7E] rounded-lg px-4 py-2 text-white placeholder-[#888F7E] focus:outline-none focus:border-[#F3FDC9] disabled:opacity-70"
                      />
                    </div>
                  </div>
                </div>
                {/* File Upload for Profile Picture - Editable */}
                {isEditing && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-[#F3FDC9] mb-2">
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleInputChangeForFile}
                      className="w-full text-white"
                      disabled={!isEditing}
                    />
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollegeProfile;
