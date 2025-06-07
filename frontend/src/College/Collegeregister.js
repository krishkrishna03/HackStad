import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignupForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
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

  // Handle form data changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Move to the next or previous step
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // Dynamically fetch the API base URL
  const getBaseURL = () => {
    const ip = window.location.hostname;
    return `http://${ip === 'localhost' ? 'localhost' : ip}:8000`;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);

    try {
      const response = await axios.post(`${getBaseURL()}/college`, formData);

      if (response.status === 200) {
        console.log('Navigating with email:', formData.college_email);
        navigate('/collegeverify-otp', { state: { email: formData.college_email } });
      } else {
        alert('Failed to register college. Please try again.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
      console.error('Registration error:', errorMessage);
      alert(errorMessage);
    }
  };

  // Render step-based form fields
  const renderStep = () => {
    const stepFields = [
      // Step 1
      [
        { name: 'college_name', type: 'text', placeholder: 'College Name', required: true },
        { name: 'college_id', type: 'text', placeholder: 'College ID', required: true },
        {
          name: 'college_type',
          type: 'select',
          options: [
            { value: '', label: 'Select College Type' },
            { value: 'government', label: 'Government' },
            { value: 'private', label: 'Private' },
          ],
          required: true,
        },
        { name: 'college_address', type: 'textarea', placeholder: 'College Address', required: true },
      ],
      // Step 2
      [
        { name: 'college_link', type: 'url', placeholder: 'College Website', required: true },
        { name: 'college_email', type: 'email', placeholder: 'College Email', required: true },
        { name: 'college_contact', type: 'tel', placeholder: 'College Contact', required: true },
        { name: 'principal_name', type: 'text', placeholder: 'Principal Name', required: true },
      ],
      // Step 3
      [
        { name: 'point_of_contact_name', type: 'text', placeholder: 'Point of Contact Name', required: true },
        { name: 'poc_number', type: 'tel', placeholder: 'POC Contact Number', required: true },
        { name: 'poc_mail', type: 'email', placeholder: 'POC Email', required: true },
        { name: 'place', type: 'text', placeholder: 'Place', required: true },
      ],
    ];

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
                className="px-4 py-2 border focus:ring-purple-500 focus:border-purple-500 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none"
                required={field.required}
              >
                {field.options.map((option, i) => (
                  <option key={i} value={option.value}>
                    {option.label}
                  </option>
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
                className="px-4 py-2 border focus:ring-purple-500 focus:border-purple-500 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none"
                required={field.required}
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
                className="px-4 py-2 border focus:ring-purple-500 focus:border-purple-500 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none"
                required={field.required}
              />
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <h2 className="font-semibold text-xl text-gray-700 mb-2">College Registration</h2>
            <p className="text-sm text-gray-500 mb-8">Register your college for the hackathon</p>

            {/* Stepper */}
            <div className="flex items-center justify-between mb-6">
              {[1, 2, 3].map((stepNumber) => (
                <React.Fragment key={stepNumber}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= stepNumber ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && <div className={`h-1 w-12 sm:w-24 ${step > stepNumber ? 'bg-purple-500' : 'bg-gray-200'}`} />}
                </React.Fragment>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {renderStep()}
              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md focus:outline-none"
                  >
                    Back
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-4 py-2 bg-purple-500 text-white rounded-md focus:outline-none"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-500 text-white rounded-md focus:outline-none"
                  >
                    Register
                  </button>
                )}
              </div>
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
