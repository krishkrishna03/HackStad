// import React, { useState, useRef } from 'react';
// import { Camera, Trash2, Upload } from 'lucide-react';
// import { useEffect } from 'react';
// // Separate component for the image upload section
// const ProfileImage = ({ profileImage, isEditing, onImageChange, onImageDelete }) => {
//   const fileInputRef = useRef(null);
  
//   return (
//     <div className="relative">
//       <img 
//         src={profileImage}
//         alt="Profile" 
//         className="w-32 h-32 rounded-full border-2 border-gray-300 cursor-pointer"
//       />
      
//       {isEditing && (
//         <div className="absolute bottom-0 right-0 flex gap-2">
//           <input
//             type="file"
//             ref={fileInputRef}
//             onChange={onImageChange}
//             accept="image/*"
//             className="hidden"
//           />
//           <button 
//             onClick={() => fileInputRef.current?.click()}
//             className="p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors"
//             title="Upload photo"
//           >
//             <Upload size={16} />
//           </button>
//           <button 
//             onClick={onImageDelete}
//             className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
//             title="Delete photo"
//           >
//             <Trash2 size={16} />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// // Reusable form field component
// const FormField = ({ isEditing, label, value, onChange, type = "text", options }) => {
//   if (isEditing) {
//     if (type === "select") {
//       return (
//         <select
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           className="border rounded px-2 py-1 w-full"
//         >
//           {options.map(opt => (
//             <option key={opt.value} value={opt.value}>{opt.label}</option>
//           ))}
//         </select>
//       );
//     }
//     return (
//       <input
//         type={type}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="border rounded px-2 py-1 w-full"
//       />
//     );
//   }
//   return <span>{value}</span>;
// };

// const Profile = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [profileImage, setProfileImage] = useState('/api/placeholder/128/128');
//   const [showFullImage, setShowFullImage] = useState(false);
//   const [profile, setProfile] = useState([]);
//   const getBaseURL = () => {
//     const ip = window.location.hostname; // Automatically gets the frontend's IP
//     return `http://${ip}:8000`;
//   };
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await fetch(`${getBaseURL()}/user/profile`, {
//           headers: {
//             'Authorization': `Bearer ${localStorage.getItem("token")}`, // or where you store JWT
//           },
//         });
  
//         if (!response.ok) {
//           throw new Error('Failed to fetch profile');
//         }
  
//         const data = await response.json();
  
//         setProfile({
//           name: data.full_name || '',
//           branch: data.branch || '',
//           degree: 'B.Tech', // Update based on your DB structure
//           college: data.college || '',
//           dob: data.dob || '',
//           gender: 'Not provided', // If your backend returns it, map it
//           address: 'Not provided',
//           year: data.year_of_study?.toString() || '',
//         });
//         console.log(data);
//         // If you store profile image URL in DB, add it here
//         // setProfileImage(data.profile_image_url);
  
//       } catch (error) {
//         console.error('Error fetching profile:', error);
//       }
//     };
  
//     fetchProfile();
//   }, []);
//   const handleImageUpload = (event) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => setProfileImage(e.target.result);
//     reader.readAsDataURL(file);
//   };

//   const handleDeleteImage = () => {
//     setProfileImage('/api/placeholder/128/128');
//   };

//   const handleChange = (field, value) => {
//     setProfile(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = () => {
//     // Add validation here if needed
//     setIsEditing(false);
//     // Add API call to save changes if needed
//   };

//   const yearOptions = [1, 2, 3, 4].map(year => ({
//     value: year.toString(),
//     label: year.toString()
//   }));

//   const genderOptions = [
//     { value: 'Not provided', label: 'Not provided' },
//     { value: 'Male', label: 'Male' },
//     { value: 'Female', label: 'Female' },
//     { value: 'Other', label: 'Other' }
//   ];

//   return (
//     <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
//       <button
//         onClick={isEditing ? handleSubmit : () => setIsEditing(true)}
//         className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors float-right"
//       >
//         {isEditing ? 'Save Changes' : 'Edit Profile'}
//       </button>

//       <div className="flex items-center mb-6">
//         <ProfileImage 
//           profileImage={profileImage}
//           isEditing={isEditing}
//           onImageChange={handleImageUpload}
//           onImageDelete={handleDeleteImage}
//         />

//         <div className="ml-6 flex-1">
//           <FormField
//             isEditing={isEditing}
//             value={profile.name}
//             onChange={(value) => handleChange('name', value)}
//             className="text-2xl font-semibold text-gray-800"
//           />
//           <div className="text-gray-600">
//             <FormField
//               isEditing={isEditing}
//               value={profile.branch}
//               onChange={(value) => handleChange('branch', value)}
//             /> • 
//             <FormField
//               isEditing={isEditing}
//               value={profile.degree}
//               onChange={(value) => handleChange('degree', value)}
//             />
//           </div>
//         </div>
//       </div>

//       {showFullImage && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//           onClick={() => setShowFullImage(false)}
//         >
//           <img 
//             src={profileImage}
//             alt="Profile"
//             className="max-w-lg max-h-lg rounded-lg"
//           />
//         </div>
//       )}

//       <div className="grid grid-cols-2 gap-6">
//         <div>
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
//           <div className="space-y-3">
//             <div>
//               <span className="font-medium">Date of Birth: </span>
//               <FormField
//                 isEditing={isEditing}
//                 type="date"
//                 value={profile.dob}
//                 onChange={(value) => handleChange('dob', value)}
//               />
//             </div>
//             <div>
//               <span className="font-medium">Gender: </span>
//               <FormField
//                 isEditing={isEditing}
//                 type="select"
//                 value={profile.gender}
//                 onChange={(value) => handleChange('gender', value)}
//                 options={genderOptions}
//               />
//             </div>
//             <div>
//               <span className="font-medium">Address: </span>
//               <FormField
//                 isEditing={isEditing}
//                 value={profile.address}
//                 onChange={(value) => handleChange('address', value)}
//               />
//             </div>
//           </div>
//         </div>

//         <div>
//           <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Information</h3>
//           <div className="space-y-3">
//             <div>
//               <span className="font-medium">Year: </span>
//               <FormField
//                 isEditing={isEditing}
//                 type="select"
//                 value={profile.year}
//                 onChange={(value) => handleChange('year', value)}
//                 options={yearOptions}
//               />
//             </div>
//             <div>
//               <span className="font-medium">Branch: </span>
//               <FormField
//                 isEditing={isEditing}
//                 value={profile.branch}
//                 onChange={(value) => handleChange('branch', value)}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="mt-6 flex justify-center space-x-6">
//         <a 
//           href="https://www.linkedin.com" 
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-blue-500 hover:underline text-lg font-medium transition-colors"
//         >
//           LinkedIn
//         </a>
//         <a 
//           href="https://github.com" 
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-blue-500 hover:underline text-lg font-medium transition-colors"
//         >
//           GitHub
//         </a>
//       </div>
//     </div>
//   );
// };

// export default Profile;




import React, { useState, useEffect, useRef } from 'react';
import { Upload, Trash2 } from 'lucide-react';
const BASE_URL = 'https://hackstad-0nqg.onrender.com';
// Image Upload Section
const ProfileImage = ({ profileImage, isEditing, onImageChange, onImageDelete }) => {
  const fileInputRef = useRef(null);

  return (
    <div className="relative">
      <img
        src={profileImage}
        alt="Profile"
        className="w-32 h-32 rounded-full border-2 border-gray-300 cursor-pointer"
      />

      {isEditing && (
        <div className="absolute bottom-0 right-0 flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={onImageChange}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors"
            title="Upload photo"
          >
            <Upload size={16} />
          </button>
          <button
            onClick={onImageDelete}
            className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
            title="Delete photo"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

// Form Field Reusable Component
const FormField = ({ isEditing, value, onChange, type = "text", options }) => {
  if (isEditing) {
    if (type === "select") {
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }
    return (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded px-2 py-1 w-full"
      />
    );
  }
  return <span>{value || 'Not provided'}</span>;
};

// Main Profile Component
const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState('/api/placeholder/128/128');
  const [profile, setProfile] = useState({
    name: '',
    branch: '',
    degree: 'B.Tech',
    college: '',
    dob: '',
    gender: 'Not provided',
    address: '',
    year: ''
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
        const response = await fetch(`${getBaseURL()}/user/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch profile');

        const data = await response.json();

        setProfile({
          name: data.full_name || '',
          branch: data.branch || '',
          degree: 'B.Tech',
          college: data.college || '',
          dob: data.dob || '',
          gender: data.gender || 'Not provided',
          address: data.address || '',
          year: data.year_of_study?.toString() || '',
        });

        // If image exists in DB
        // setProfileImage(data.profile_image_url || '/api/placeholder/128/128');
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => setProfileImage(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = () => {
    setProfileImage('/api/placeholder/128/128');
  };

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setIsEditing(false);
    // Send PUT/PATCH request to backend to save profile here
  };

  const yearOptions = [1, 2, 3, 4].map((year) => ({
    value: year.toString(),
    label: year.toString(),
  }));

  const genderOptions = [
    { value: 'Not provided', label: 'Not provided' },
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <button
        onClick={isEditing ? handleSubmit : () => setIsEditing(true)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors float-right"
      >
        {isEditing ? 'Save Changes' : 'Edit Profile'}
      </button>

      <div className="flex items-center mb-6">
        <ProfileImage
          profileImage={profileImage}
          isEditing={isEditing}
          onImageChange={handleImageUpload}
          onImageDelete={handleDeleteImage}
        />
        <div className="ml-6 flex-1">
          <FormField
            isEditing={isEditing}
            value={profile.name}
            onChange={(val) => handleChange('name', val)}
          />
          <div className="text-gray-600">
            <FormField
              isEditing={isEditing}
              value={profile.branch}
              onChange={(val) => handleChange('branch', val)}
            />{' '}
            •{' '}
            <FormField
              isEditing={isEditing}
              value={profile.degree}
              onChange={(val) => handleChange('degree', val)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
          <div className="space-y-3">
            <div>
              <span className="font-medium">Date of Birth: </span>
              <FormField
                isEditing={isEditing}
                type="date"
                value={profile.dob}
                onChange={(val) => handleChange('dob', val)}
              />
            </div>
            <div>
              <span className="font-medium">Gender: </span>
              <FormField
                isEditing={isEditing}
                type="select"
                value={profile.gender}
                onChange={(val) => handleChange('gender', val)}
                options={genderOptions}
              />
            </div>
            <div>
              <span className="font-medium">Address: </span>
              <FormField
                isEditing={isEditing}
                value={profile.address}
                onChange={(val) => handleChange('address', val)}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Information</h3>
          <div className="space-y-3">
            <div>
              <span className="font-medium">Year: </span>
              <FormField
                isEditing={isEditing}
                type="select"
                value={profile.year}
                onChange={(val) => handleChange('year', val)}
                options={yearOptions}
              />
            </div>
            <div>
              <span className="font-medium">College: </span>
              <FormField
                isEditing={isEditing}
                value={profile.college}
                onChange={(val) => handleChange('college', val)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center space-x-6">
        <a
          href="https://www.linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline text-lg font-medium transition-colors"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline text-lg font-medium transition-colors"
        >
          GitHub
        </a>
      </div>
    </div>
  );
};

export default Profile;






































// import React, { useState, useEffect } from 'react';
// import { Loader2, Edit2, Save, X, RefreshCw } from 'lucide-react';
// import express from 'express';

// // Sample profile data - replace with your database implementation
// const profiles = {
//   1: {
//     id: 1,
//     name: 'John Doe',
//     email: 'john@example.com',
//     title: 'Full Stack Developer',
//     organization: 'Tech Corp',
//     achievements: [
//       { id: 1, type: 'hackathon', date: '2023-11-15' },
//       { id: 2, type: 'hackathon', date: '2023-10-20' }
//     ],
//     skills: ['React', 'Node.js', 'Python', 'AWS'],
//     joinedDate: '2023-01-15',
//     avatarUrl: '/api/placeholder/150/150'
//   }
// };

// // Custom hook for profile management
// const useProfile = () => {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchProfile = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('/api/profile');
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       setProfile(data);
//       setError(null);
//     } catch (err) {
//       setError(err.message);
//       setProfile(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateProfile = async (updates) => {
//     try {
//       setLoading(true);
//       const response = await fetch('/api/profile', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updates),
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const updatedProfile = await response.json();
//       setProfile(updatedProfile);
//       setError(null);
//       return updatedProfile;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   return {
//     profile,
//     loading,
//     error,
//     refreshProfile: fetchProfile,
//     updateProfile,
//   };
// };

// // Main Profile Component
// const Profile = () => {
//   const { profile, loading, error, updateProfile, refreshProfile } = useProfile();
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [updateError, setUpdateError] = useState(null);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[200px]">
//         <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 p-4 rounded-lg">
//         <p className="text-red-600">{error}</p>
//         <button
//           onClick={refreshProfile}
//           className="mt-2 flex items-center gap-2 text-red-600 hover:text-red-700"
//         >
//           <RefreshCw className="w-4 h-4" />
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   const handleEditToggle = () => {
//     if (isEditing) {
//       setIsEditing(false);
//       setUpdateError(null);
//     } else {
//       setFormData(profile);
//       setIsEditing(true);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await updateProfile(formData);
//       setIsEditing(false);
//       setUpdateError(null);
//     } catch (err) {
//       setUpdateError('Failed to update profile. Please try again.');
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
//       <div className="flex justify-between items-start mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
//         <button
//           onClick={handleEditToggle}
//           className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
//         >
//           {isEditing ? (
//             <>
//               <X className="w-4 h-4" />
//               Cancel
//             </>
//           ) : (
//             <>
//               <Edit2 className="w-4 h-4" />
//               Edit Profile
//             </>
//           )}
//         </button>
//       </div>

//       {updateError && (
//         <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
//           {updateError}
//         </div>
//       )}

//       {isEditing ? (
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name || ''}
//               onChange={handleInputChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               Title
//             </label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title || ''}
//               onChange={handleInputChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               Organization
//             </label>
//             <input
//               type="text"
//               name="organization"
//               value={formData.organization || ''}
//               onChange={handleInputChange}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//             />
//           </div>

//           <div className="pt-4">
//             <button
//               type="submit"
//               className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
//             >
//               <Save className="w-4 h-4" />
//               Save Changes
//             </button>
//           </div>
//         </form>
//       ) : (
//         <div className="space-y-6">
//           <div className="flex items-center gap-4">
//             <img
//               src={profile.avatarUrl}
//               alt={profile.name}
//               className="w-20 h-20 rounded-full object-cover"
//             />
//             <div>
//               <h3 className="text-xl font-semibold text-gray-800">
//                 {profile.name}
//               </h3>
//               <p className="text-gray-600">{profile.title}</p>
//               <p className="text-gray-500 text-sm">{profile.organization}</p>
//             </div>
//           </div>

//           <div className="border-t pt-4">
//             <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
//             <div className="flex flex-wrap gap-2">
//               {profile.skills.map((skill) => (
//                 <span
//                   key={skill}
//                   className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
//                 >
//                   {skill}
//                 </span>
//               ))}
//             </div>
//           </div>

//           <div className="border-t pt-4">
//             <h4 className="text-sm font-medium text-gray-700 mb-2">
//               Achievement Stats
//             </h4>
//             <p className="text-gray-600">
//               Total Hackathons: {profile.achievements.length}
//             </p>
//             <p className="text-gray-600">
//               Member since: {new Date(profile.joinedDate).toLocaleDateString()}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Express server setup
// const router = express.Router();

// // Get profile endpoint
// router.get('/api/profile', async (req, res) => {
//   try {
//     // In a real app, get the userId from the session/token
//     const userId = 1; // Hardcoded for example
//     const profile = profiles[userId];
    
//     if (!profile) {
//       return res.status(404).json({ error: 'Profile not found' });
//     }
    
//     res.json(profile);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Update profile endpoint
// router.put('/api/profile', async (req, res) => {
//   try {
//     const userId = 1; // Hardcoded for example
//     const updates = req.body;
    
//     if (!profiles[userId]) {
//       return res.status(404).json({ error: 'Profile not found' });
//     }
    
//     profiles[userId] = {
//       ...profiles[userId],
//       ...updates
//     };
    
//     res.json(profiles[userId]);
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// export { Profile as default, router };


