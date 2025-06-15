import React, { useState, useEffect } from "react";
import { Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openSuccessPopup, setOpenSuccessPopup] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("");
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
    setSnackbarMessage("");
    setSnackbarType("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setSnackbarType("error");
      setSnackbarMessage("Passwords do not match");
      setOpenSnackbar(true);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("https://hotel-booking-system-fully-vercel-v-sigma.vercel.app/api/users/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        contact_number: formData.phone,
      });

      setSnackbarType("success");
      setSnackbarMessage(response.data.message || "You registered successfully.");
      setOpenSuccessPopup(true);

      setTimeout(() => {
        document.title = "Login - Your Website";
        navigate("/login");
      }, 3000);
    } catch (error) {
      setSnackbarType("error");
      setSnackbarMessage(
        error.response?.data?.message || "Registration failed. Please try again."
      );
      setOpenSnackbar(true);
    }
    setLoading(false);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const handleSuccessPopupClose = () => {
    setOpenSuccessPopup(false);
  };

  const handleSocialRegister = (provider) => {
    const url = `https://hotel-booking-system-fully-vercel-v-sigma.vercel.app/api/users/auth/${provider}`;
    window.location.href = url;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-600 via-blue-900 to-slate-800 flex items-center justify-center p-4 sm:p-6 lg:p-24">
      <div className={`w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}>
        <div className="grid lg:grid-cols-2 min-h-[600px] lg:min-h-[700px]">
          {/* Left Side */}
          <div className="relative order-2 lg:order-1 overflow-hidden">
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1925&auto=format&fit=crop"
                alt="Luxury Resort"
                className="w-full h-full object-cover animate-pulse"
                style={{ animation: 'kenBurns 20s ease-in-out infinite alternate' }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-slate-800/70 to-blue-800/80">
              <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" 
                   style={{ animation: 'float 6s ease-in-out infinite' }}></div>
              <div className="absolute top-32 right-16 w-12 h-12 bg-blue-300/20 rounded-full blur-lg animate-pulse" 
                   style={{ animation: 'float 4s ease-in-out infinite 2s' }}></div>
              <div className="absolute bottom-20 left-20 w-16 h-16 bg-slate-300/15 rounded-full blur-xl animate-pulse" 
                   style={{ animation: 'float 5s ease-in-out infinite 1s' }}></div>
              <div className={`flex items-center justify-center h-full transform transition-all duration-1200 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                <div className="text-center text-white max-w-lg px-8">
                  <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                    Join The Luxury Experience
                  </h2>
                  <p className={`text-blue-100 text-base lg:text-lg leading-relaxed opacity-90 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-90' : 'translate-y-5 opacity-0'}`}>
                    Create your account and unlock exclusive access to premium destinations and unforgettable experiences.
                  </p>
                  <div className={`flex justify-center space-x-6 mt-8 transform transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                    <div className="text-center group cursor-pointer">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs text-blue-100">Premium</span>
                    </div>
                    <div className="text-center group cursor-pointer">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs text-blue-100">Exclusive</span>
                    </div>
                    <div className="text-center group cursor-pointer">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs text-blue-100">Secure</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className={`flex items-center justify-center p-6 lg:p-12 order-1 lg:order-2 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="w-full max-w-md">
              <div className="text-center mb-10">
                <h1 className={`text-3xl lg:text-5xl font-bold text-gray-800 mb-5 transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                  Create Account
                </h1>
                <p className={`text-gray-600 text-sm lg:text-base transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                  Join us for an extraordinary journey
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-5">
                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          className="w-full px-4 py-3 pl-11 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white outline-none hover:border-gray-400 hover:shadow-md focus:shadow-lg"
                          required
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Phone Number
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Your phone number"
                          className="w-full px-4 py-3 pl-11 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white outline-none hover:border-gray-400 hover:shadow-md focus:shadow-lg"
                          required
                        />
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  <div className={`space-y-2 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                    <label className="block text-sm font-semibold text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        className="w-full px-4 py-3 pl-11 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white outline-none hover:border-gray-400 hover:shadow-md focus:shadow-lg"
                        required
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </div>

                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transform transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Create password"
                          className="w-full px-4 py-3 pl-11 pr-12 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white outline-none hover:border-gray-400 hover:shadow-md focus:shadow-lg"
                          required
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm password"
                          className="w-full px-4 py-3 pl-11 pr-12 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white outline-none hover:border-gray-400 hover:shadow-md focus:shadow-lg"
                          required
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-gradient-to-r from-blue-900 via-slate-800 to-blue-800 hover:from-blue-800 hover:via-slate-700 hover:to-blue-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm shadow-lg transform transition-all duration-1000 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
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
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Registering...
                      </div>
                    ) : (
                      "Sign Up"
                    )}
                  </button>

                  <div className={`relative flex items-center justify-center py-4 transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                    <div className="border-t border-gray-300 flex-1" />
                    <span className="bg-white px-4 text-sm font-medium text-gray-500">
                      Or continue with
                    </span>
                    <div className="border-t border-gray-300 flex-1" />
                  </div>

                  <div className={`grid grid-cols-2 gap-4 transform transition-all duration-1000 delay-1100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                    <button
                      type="button"
                      onClick={() => handleSocialRegister("google")}
                      className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 group hover:shadow-md hover:scale-105"
                    >
                      <img
                        src="https://developers.google.com/identity/images/g-logo.png"
                        alt="Google"
                        className="h-5 w-5 mr-3"
                      />
                      <span className="text-gray-700 font-medium text-sm group-hover:text-gray-800">
                        Google
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSocialRegister("facebook")}
                      className="flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                        alt="Facebook"
                        className="h-5 w-5 mr-3"
                      />
                      <span className="font-medium text-sm">Facebook</span>
                    </button>
                  </div>

                  <div className={`text-center pt-4 transform transition-all duration-1000 delay-1200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                    <p className="text-gray-600 text-sm">
                      Already have an account?{' '}
                      <Link 
                        to="/login" 
                        onClick={scrollToTop}
                        className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 hover:underline"
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {openSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100 animate-pulse">
            <div className="flex items-center justify-center mb-4">
              <svg className="h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Registration Successful!</h3>
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
        <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${openSnackbar ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
          <div className="px-6 py-3 rounded-xl text-white font-medium shadow-lg bg-red-500">
            {snackbarMessage}
            <button 
              onClick={handleSnackbarClose}
              className="ml-4 text-white hover:text-gray-200 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes kenBurns {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.1) translate(-2%, -2%); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
};

export default Signup;
