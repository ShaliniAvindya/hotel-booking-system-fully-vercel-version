import React, { useState, useEffect, useContext } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { Snackbar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext); // Use context
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openSuccessPopup, setOpenSuccessPopup] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSnackbarMessage('');
    setSnackbarType('');
    setLoading(true);

    try {
      const response = await axios.post('https://hotel-booking-system-fully-vercel-v-sigma.vercel.app/users/login', {
        email: formData.email,
        password: formData.password,
      });

      const { user } = response.data;
      login(user);

      setSnackbarType('success');
      setSnackbarMessage(response.data.message || 'You logged in successfully.');
      setOpenSuccessPopup(true);

      setTimeout(() => {
        navigate('/'); // Use navigate instead of window.location.href
      }, 3000);
    } catch (error) {
      setSnackbarType('error');
      setSnackbarMessage(
        error.response?.data?.message || 'Login failed. Please try again.'
      );
      setOpenSnackbar(true);
    }
    setLoading(false);
  };

  const handleSocialLogin = (provider) => {
    const url = `https://hotel-booking-system-fully-vercel-v-sigma.vercel.app/users/auth/${provider}`;
    window.location.href = url;
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleSuccessPopupClose = () => {
    setOpenSuccessPopup(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-800 to-blue-800">
      <div className="h-20"></div>
      <div className="flex items-center justify-center px-4 py-8">
        <div
          className={`w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
          }`}
        >
          <div className="grid lg:grid-cols-2 min-h-[600px]">
            {/* Left Side  */}
            <div className="relative bg-gradient-to-br from-blue-900 via-slate-800 to-blue-800 p-8 flex items-center justify-center overflow-hidden">
              <div
                className="absolute top-10 left-10 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse"
                style={{ animation: 'float 6s ease-in-out infinite' }}
              ></div>
              <div
                className="absolute top-32 right-16 w-10 h-10 bg-blue-300/20 rounded-full blur-lg animate-pulse"
                style={{ animation: 'float 4s ease-in-out infinite 2s' }}
              ></div>
              <div
                className="absolute bottom-20 left-20 w-12 h-12 bg-slate-300/15 rounded-full blur-xl animate-pulse"
                style={{ animation: 'float 5s ease-in-out infinite 1s' }}
              ></div>

              <div
                className={`text-center text-white transform transition-all duration-1200 delay-300 ${
                  isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                }`}
              >
                <div
                  className={`mb-8 transform transition-all duration-1000 delay-400 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                  }`}
                >
                  <img
                    src="https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=1974&auto=format&fit=crop"
                    alt="Luxury Hotel"
                    className="w-full h-96 object-cover rounded-xl shadow-xl hover:scale-105 transition-transform duration-500"
                    style={{ animation: 'kenBurns 20s ease-in-out infinite alternate' }}
                  />
                </div>
                <h2
                  className={`text-3xl font-bold mb-4 transform transition-all duration-1000 delay-600 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                  }`}
                >
                  Welcome to The Luxury
                </h2>
                <p
                  className={`text-blue-100 text-lg leading-relaxed max-w-md mx-auto mb-8 transform transition-all duration-1000 delay-700 ${
                    isVisible ? 'translate-y-0 opacity-90' : 'translate-y-5 opacity-0'
                  }`}
                >
                  Experience luxury redefined in the pristine waters of the Maldives. Your dream vacation awaits.
                </p>
                <div
                  className={`grid grid-cols-3 gap-4 text-center transform transition-all duration-1000 delay-800 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                  }`}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300 hover:scale-105 group cursor-pointer">
                    <div className="text-2xl font-bold group-hover:scale-110 transition-transform duration-300">50+</div>
                    <div className="text-sm text-blue-100">Luxury Villas</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300 hover:scale-105 group cursor-pointer">
                    <div className="text-2xl font-bold group-hover:scale-110 transition-transform duration-300">15</div>
                    <div className="text-sm text-blue-100">Years Experience</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300 hover:scale-105 group cursor-pointer">
                    <div className="text-2xl font-bold group-hover:scale-110 transition-transform duration-300">98%</div>
                    <div className="text-sm text-blue-100">Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div
              className={`flex items-center justify-center p-8 lg:p-14 transform transition-all duration-1000 delay-200 ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}
            >
              <div className="w-full max-w-md">
                <div className="text-center mb-10">
                  <h1
                    className={`text-5xl font-bold text-gray-800 mb-4 transform transition-all duration-1000 delay-400 ${
                      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                    }`}
                  >
                    Welcome Back
                  </h1>
                  <p
                    className={`text-gray-600 transform transition-all duration-1000 delay-500 ${
                      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                    }`}
                  >
                    Please sign in to your account
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div
                    className={`space-y-2 transform transition-all duration-1000 delay-600 ${
                      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                    }`}
                  >
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white outline-none hover:border-gray-400 hover:shadow-md focus:shadow-lg"
                        required
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </div>

                  <div
                    className={`space-y-2 transform transition-all duration-1000 delay-700 ${
                      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                    }`}
                  >
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="w-full px-4 py-3 pl-11 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white outline-none hover:border-gray-400 hover:shadow-md focus:shadow-lg"
                        required
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110"
                      >
                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div
                    className={`text-right transform transition-all duration-1000 delay-800 ${
                      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                    }`}
                  >
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-gradient-to-r from-blue-900 to-slate-800 hover:from-blue-800 hover:to-slate-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg transform transition-all duration-1000 delay-900 ${
                      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Signing In...
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </button>

                  <div
                    className={`relative flex items-center justify-center py-4 transform transition-all duration-1000 delay-1000 ${
                      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                    }`}
                  >
                    <div className="border-t border-gray-300 flex-1"></div>
                    <span className="bg-white px-4 text-sm font-medium text-gray-500">OR continue with</span>
                    <div className="border-t border-gray-300 flex-1"></div>
                  </div>

                  <div
                    className={`space-y-3 transform transition-all duration-1000 delay-1100 ${
                      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSocialLogin('google')}
                      className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 hover:shadow-md hover:scale-105"
                    >
                      <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google"
                        className="h-5 w-5 mr-3"
                      />
                      <span className="text-gray-700 font-medium">Continue with Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialLogin('facebook')}
                      className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                        alt="Facebook"
                        className="h-5 w-5 mr-3"
                      />
                      <span className="font-medium">Continue with Facebook</span>
                    </button>
                  </div>

                  <div
                    className={`text-center pt-4 transform transition-all duration-1000 delay-1200 ${
                      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                    }`}
                  >
                    <p className="text-gray-600">
                      Don't have an account?{' '}
                      <Link
                        to="/register"
                        onClick={scrollToTop}
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
                      >
                        Create Account
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {openSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 animate-pulse">
            <div className="flex items-center justify-center mb-4">
              <svg
                className="h-12 w-12 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Login Successful!</h3>
            <p className="text-gray-600 text-center mb-6">{snackbarMessage}</p>
            <button
              onClick={handleSuccessPopupClose}
              className="w-full bg-gradient-to-r from-blue-900 to-slate-800 hover:from-blue-800 hover:to-slate-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Error Snackbar */}
      {openSnackbar && snackbarType === 'error' && (
        <div
          className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
            openSnackbar ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
          }`}
        >
          <div className="px-6 py-3 rounded-xl text-white font-medium shadow-lg bg-red-500">
            {snackbarMessage}
            <button onClick={handleSnackbarClose} className="ml-4 text-white hover:text-gray-200 transition-colors">
              ×
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes kenBurns {
          0% {
            transform: scale(1) translate(0, 0);
          }
          100% {
            transform: scale(1.1) translate(-2%, -2%);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
