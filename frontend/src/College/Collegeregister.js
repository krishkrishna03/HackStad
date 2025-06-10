import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const getBaseURL = () => process.env.REACT_APP_API_URL || 'https://hackstad-0nqg.onrender.com';

function SignupForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [emailForOtp, setEmailForOtp] = useState('');
  const [formData, setFormData] = useState({
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
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${getBaseURL()}/college`, formData);
      if (response.status === 200) {
        setEmailForOtp(formData.college_email);
        setStep(4); // Show OTP input
      } else {
        alert('Failed to register college. Please try again.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
      console.error('Registration error:', errorMessage);
      alert(errorMessage);
    }
  };

  const handleOtpVerification = async () => {
    try {
      const res = await axios.post(`${getBaseURL()}/verify-college-otp`, {
        email: emailForOtp,
        otp,
      });

      if (res.status === 200) {
        alert('OTP Verified!');
        navigate('/college-dashboard'); // Change to your actual dashboard route
      } else {
        alert('OTP verification failed.');
      }
    } catch (error) {
      console.error('OTP error:', error.response?.data?.message || error.message);
      alert('Incorrect OTP or server error');
    }
  };

  const renderStep = () => {
    const stepFields = [
      [
        { name: 'college_name', type: 'text', placeholder: 'College Name' },
        { name: 'college_id', type: 'text', placeholder: 'College ID' },
        {
          name: 'college_type',
          type: 'select',
          options: [
            { value: '', label: 'Select College Type' },
            { value: 'government', label: 'Government' },
            { value: 'private', label: 'Private' },
          ],
        },
        { name: 'college_address', type: 'textarea', placeholder: 'College Address' },
      ],
      [
        { name: 'college_link', type: 'url', placeholder: 'College Website' },
        { name: 'college_email', type: 'email', placeholder: 'College Email' },
        { name: 'college_contact', type: 'tel', placeholder: 'College Contact' },
        { name: 'principal_name', type: 'text', placeholder: 'Principal Name' },
      ],
      [
        { name: 'point_of_contact_name', type: 'text', placeholder: 'Point of Contact Name' },
        { name: 'poc_number', type: 'tel', placeholder: 'POC Contact Number' },
        { name: 'poc_mail', type: 'email', placeholder: 'POC Email' },
        { name: 'place', type: 'text', placeholder: 'Place' },
      ],
    ];

    if (step <= 3) {
      return (
        <div className="space-y-4">
          {stepFields[step - 1].map((field, index) => {
            if (field.type === 'select') {
              return (
                <select
                  key={index}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="px-4 py-2 border w-full rounded-md"
                  required
                >
                  {field.options.map((option, i) => (
                    <option key={i} value={option.value}>{option.label}</option>
                  ))}
                </select>
              );
            } else if (field.type === 'textarea') {
              return (
                <textarea
                  key={index}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="px-4 py-2 border w-full rounded-md"
                  required
                />
              );
            } else {
              return (
                <input
                  key={index}
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="px-4 py-2 border w-full rounded-md"
                  required
                />
              );
            }
          })}
        </div>
      );
    }

    if (step === 4) {
      return (
        <div className="space-y-4">
          <p className="text-sm text-gray-700">OTP sent to: <strong>{emailForOtp}</strong></p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="px-4 py-2 border w-full rounded-md"
            required
          />
          <button
            type="button"
            onClick={handleOtpVerification}
            className="px-4 py-2 bg-purple-600 text-white rounded-md w-full"
          >
            Verify OTP
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <h2 className="font-semibold text-xl text-gray-700 mb-2">College Registration</h2>
            <p className="text-sm text-gray-500 mb-8">
              {step <= 3 ? 'Register your college for the hackathon' : 'Enter OTP to complete registration'}
            </p>

            {/* Stepper */}
            <div className="flex items-center justify-between mb-6">
              {[1, 2, 3, 4].map((stepNumber) => (
                <React.Fragment key={stepNumber}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= stepNumber ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {stepNumber}
                  </div>
                  {stepNumber < 4 && (
                    <div className={`h-1 w-12 sm:w-24 ${step > stepNumber ? 'bg-purple-500' : 'bg-gray-200'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {renderStep()}
              {step <= 3 && (
                <div className="flex justify-between mt-8">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md"
                    >
                      Back
                    </button>
                  )}
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-4 py-2 bg-purple-500 text-white rounded-md"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-500 text-white rounded-md"
                    >
                      Register
                    </button>
                  )}
                </div>
              )}
            </form>

            <p className="text-sm mt-4">
              Already have an account?{' '}
              <Link to="/college-login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
