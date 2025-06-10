import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Shield, ArrowLeft, User } from 'lucide-react';
import axios from 'axios';
import Navbar from './Navbar';

function StudentLoginForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Use environment variable or fallback to your deployed backend URL (HTTPS)
  const getBaseURL = () => {
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    return 'https://hackstad-0nqg.onrender.com';
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(`${getBaseURL()}/userlogin`, { email });
      toast.success('OTP sent to your email!');
      setStep('otp'); // Move to OTP verification step
    } catch (error) {
      console.error('Error Sending OTP:', error);
      toast.error('Failed to Send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const redirectUrlFromState = location.state?.from;
  const storedRedirectUrl = localStorage.getItem('redirectUrl');
  const redirectUrl = redirectUrlFromState || storedRedirectUrl || '/user-dashboard';

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${getBaseURL()}/verify-user`, { otp: parseInt(otp) });
      const accessToken = response.data.access_token;
      const refreshToken = response.data.refresh_token;

      // Store tokens
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);

      toast.success('Login successful!');
      localStorage.removeItem('redirectUrl');
      navigate(redirectUrl, { replace: true });
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="rounded-full bg-violet-500/20 p-4 backdrop-blur-sm border border-white/10">
                <User className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-200 to-white">
              Student Login
            </h1>
            <p className="text-violet-200 text-lg">
              {step === 'email' ? 'Enter your email to get started' : 'Verify your identity with OTP'}
            </p>
          </div>

          {/* Login Form */}
          <div className="max-w-md mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-xl">
              {step === 'email' ? (
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-violet-200 block mb-3">
                      <Mail className="inline h-4 w-4 mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-violet-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all duration-200 backdrop-blur-sm"
                      placeholder="Enter your email address"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white py-3 rounded-lg hover:from-violet-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending OTP...
                      </div>
                    ) : (
                      'Send OTP'
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-violet-200 block mb-3">
                      <Shield className="inline h-4 w-4 mr-2" />
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-violet-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all duration-200 backdrop-blur-sm text-center text-lg tracking-widest"
                      placeholder="000000"
                      maxLength="6"
                      required
                      disabled={isLoading}
                    />
                    <div className="mt-3 p-3 bg-violet-500/10 rounded-lg border border-violet-500/20">
                      <p className="text-sm text-violet-200">
                        OTP sent to <span className="font-medium text-white">{email}</span>
                      </p>
                      <button
                        type="button"
                        onClick={() => setStep('email')}
                        className="mt-2 text-sm text-violet-300 hover:text-white transition-colors duration-200 flex items-center"
                      >
                        <ArrowLeft className="h-3 w-3 mr-1" />
                        Change email address
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white py-3 rounded-lg hover:from-violet-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Verifying...
                      </div>
                    ) : (
                      'Verify & Sign In'
                    )}
                  </button>
                </form>
              )}

              {/* Footer Links */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="text-center space-y-3">
                  <p className="text-sm text-violet-200">
                    Don't have an account?{' '}
                    <a 
                      href="/student-signup" 
                      className="text-white font-medium hover:text-violet-200 transition-colors duration-200"
                    >
                      Sign up here
                    </a>
                  </p>
                  <button
                    onClick={() => navigate('/signin')}
                    className="text-sm text-violet-300 hover:text-white transition-colors duration-200 flex items-center justify-center mx-auto"
                  >
                    <ArrowLeft className="h-3 w-3 mr-1" />
                    Back to role selection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          },
        }}
      />
    </>
  );
}

export default StudentLoginForm;
