import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate,useLocation } from 'react-router-dom';
import axios from 'axios';

const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    full_name: '', email: '', phone: '', rollnum: '', college: '',
    branch: '', year_of_study: '', dob: '', linkedin_url: '', github_url: '', otp: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formFields = {
    1: [
      { name: 'full_name', type: 'text', label: 'Full Name', icon: '👤' },
      { name: 'email', type: 'email', label: 'Email Address', icon: '✉️' },
      { name: 'phone', type: 'tel', label: 'Phone Number', icon: '📱' },
      { name: 'rollnum', type: 'text', label: 'Roll Number', icon: '🔢' },
      { name: 'college', type: 'text', label: 'College Name', icon: '🏫' },
      { name: 'branch', type: 'text', label: 'Branch', icon: '📚' },
      { name: 'year_of_study', type: 'number', label: 'Year of Study', icon: '📅' },
      { name: 'dob', type: 'date', label: 'Date of Birth', icon: '🎂' },
      { name: 'linkedin_url', type: 'url', label: 'LinkedIn Profile', icon: '💼' },
      { name: 'github_url', type: 'url', label: 'GitHub Profile', icon: '💻' }
    ],
    2: [{ name: 'otp', type: 'text', label: 'Enter OTP', icon: '🔐' }]
  };

  const getBaseURL = () => {
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    return 'https://hackstad-0nqg.onrender.com';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const nextStep = async () => {
    if (step === 1) {
      const requiredFields = formFields[1].filter(field => 
        !formData[field.name]?.trim()
      );

      if (requiredFields.length) {
        toast.error(`Please fill in: ${requiredFields.map(f => f.label).join(', ')}`);
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.post(`${getBaseURL()}/user`, formData);
        if (response.data.message.includes('OTP sent')) {
          toast.success('OTP sent to your email!');
          setStep(2);
        }
      } catch (error) {
        const message = error.response?.data?.detail || 'Registration failed. Please try again.';
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step !== 2 || !formData.otp) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`${getBaseURL()}/verify-otp`, { otp: formData.otp });
      if (response.data.message === 'User registered successfully.') {
        toast.success('Registration successful!');
        navigate('/login-student');
      }
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4 md:p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Registration</h1>
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2].map(num => (
                  <div key={num} 
                    className={`w-3 h-3 rounded-full ${step >= num ? 'bg-purple-600' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {formFields[step].map(field => (
                  <div key={field.name} className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">
                      {field.icon}
                    </span>
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      placeholder={field.label}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-6">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  type={step === 2 ? 'submit' : 'button'}
                  onClick={step === 1 ? nextStep : undefined}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : step === 1 ? 'Next' : 'Complete Registration'}
                </button>
              </div>
            </form>

            <p className="text-center text-gray-600">
              Already registered?{' '}
              <Link to="/login-student" className="text-purple-600 hover:text-purple-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
