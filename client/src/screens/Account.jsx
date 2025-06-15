import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import AdminPanel from '../components/AdminPanel';
import { Mail, Phone, Edit3, Key, Calendar, MapPin, CreditCard, Star, X, User, Settings, Clock, CheckCircle, XCircle, UserCircle, Shield, BookOpen, History, Sparkles } from 'lucide-react';

const Account = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  console.log(currentUser);
  const { id: id, name, email, contact_number, isAdmin: admin } = currentUser;

  const [ongoingBookings, setOngoingBookings] = useState([]);
  const [previousBookings, setPreviousBookings] = useState([]);
  const [roomImages, setRoomImages] = useState({}); 
  const [newName, setNewName] = useState(name); 
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [openNameDialog, setOpenNameDialog] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

  // Fetch booking data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://hotel-booking-system-fully-vercel-v-sigma.vercel.app/api/book/${id}`);
        if (!response.ok) throw new Error('Failed to fetch booking data');
        const data = await response.json();
        const ongoing = data.filter((b) => b.status === 'Booked');
        const previous = data.filter((b) => b.status === 'Cancelled').slice(0, 5);

        // Preload room images for ongoing bookings
        const images = {};
        await Promise.all(
          ongoing.map(async (booking) => {
            const roomResponse = await fetch(`https://hotel-booking-system-fully-vercel-v-sigma.vercel.app/api/rooms/${booking.room_id}`);
            const roomData = await roomResponse.json();
            images[booking.room_id] = roomData.imageUrls[0]; 
          }),
          previous.map(async (booking) => {
            const roomResponse = await fetch(`https://hotel-booking-system-fully-vercel-v-sigma.vercel.app/api/rooms/${booking.room_id}`);
            const roomData = await roomResponse.json();
            images[booking.room_id] = roomData.imageUrls[0];
          })
        );
        setRoomImages(images);
        setOngoingBookings(ongoing);
        setPreviousBookings(previous);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchData();
  }, [id]);

  // Cancel booking handler
  const handleCancelBooking = (bookingId) => {
    fetch(`https://hotel-booking-system-fully-vercel-v-sigma.vercel.app/api/book/cancel/${bookingId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => response.json())
      .then(() => {
        Swal.fire('Success', 'Your booking has been cancelled.', 'success').then(() => {
          window.location.reload();
        });
      })
      .catch((error) => {
        console.error('Error canceling booking:', error);
        Swal.fire('Error', 'Something went wrong.', 'error');
      });
  };

  const handleOpenNameDialog = () => setOpenNameDialog(true);
  const handleCloseNameDialog = () => setOpenNameDialog(false);

  const handleOpenPasswordDialog = () => setOpenPasswordDialog(true);
  const handleClosePasswordDialog = () => {
    setOpenPasswordDialog(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSaveName = () => {
    if (!newName) {
      Swal.fire('Error', 'Name cannot be empty.', 'error');
      return;
    }

    fetch(`https://hotel-booking-system-fully-vercel-v-sigma.vercel.app/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    })
      .then((response) => {
        if (response.ok) {
          Swal.fire('Success', 'Name updated successfully.', 'success').then(() => {
            localStorage.setItem(
              'currentUser',
              JSON.stringify({ ...currentUser, name: newName })
            );
          });
          setOpenNameDialog(false);
          window.location.reload();
        } else {
          Swal.fire('Error', 'Failed to update name.', 'error');
        }
      })
      .catch((error) => {
        console.error('Error updating name:', error);
        Swal.fire('Error', 'Something went wrong.', 'error');
      });
  };

  const handleSavePassword = () => {
    if (!newPassword || !confirmPassword) {
      Swal.fire('Error', 'Both password fields are required.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      Swal.fire('Error', 'Passwords do not match.', 'error');
      return;
    }

    fetch(`https://hotel-booking-system-fully-vercel-v-sigma.vercel.app/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: newPassword }),
    })
      .then((response) => {
        if (response.ok) {
          setOpenPasswordDialog(false); 
          Swal.fire('Success', 'Password updated successfully.', 'success');
        } else {
          Swal.fire('Error', 'Failed to update password.', 'error');
        }
      })
      .catch((error) => {
        console.error('Error updating password:', error);
        Swal.fire('Error', 'Something went wrong.', 'error');
      });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="font-sans text-gray-800 bg-white">
      {/* Hero Section */}
      <section className="relative h-[800px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://i.postimg.cc/fLgyWkbN/pexels-asadphoto-3320516.jpg"
            alt=" Account "
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-400/30 rounded-full blur-2xl animate-bounce delay-500"></div>
        </div>

        <div className="relative h-full flex flex-col justify-center items-center text-white text-center px-6">
          <div className="max-w-5xl">
            {/* Profile Avatar with Animation */}
            <div className="relative inline-block mb-8 group">
              <div className="w-40 h-40 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 backdrop-blur-lg rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl group-hover:scale-110 transition-all duration-500">
                <UserCircle className="w-20 h-20 text-white" />
              </div>
              <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-xl animate-bounce">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div className="absolute inset-0 rounded-full bg-white/10 group-hover:bg-white/20 transition-all duration-500"></div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Welcome, <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">{name}</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto opacity-90 leading-relaxed">
              Your personal paradise dashboard. Manage your bookings, update your profile, and discover your next luxury adventure.
            </p>

            {/*  User Info Cards */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-16">
              <div className="group bg-white/10 backdrop-blur-lg rounded-3xl px-8 py-6 border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-500 hover:scale-105">
                <div className="flex items-center gap-4 text-white">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600/50 to-blue-700/50 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <Mail className="w-7 h-7" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-blue-200 uppercase tracking-wider font-bold mb-1">Email Address</p>
                    <p className="font-bold text-lg">{email}</p>
                  </div>
                </div>
              </div>
              
              <div className="group bg-white/10 backdrop-blur-lg rounded-3xl px-8 py-6 border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-500 hover:scale-105">
                <div className="flex items-center gap-4 text-white">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-600/50 to-cyan-700/50 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <Phone className="w-7 h-7" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-cyan-200 uppercase tracking-wider font-bold mb-1">Phone Number</p>
                    <p className="font-bold text-lg">{contact_number}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={handleOpenNameDialog}
                className="group relative bg-gradient-to-r from-blue-600/80 to-cyan-600/80 backdrop-blur-lg border border-white/30 text-white px-10 py-5 rounded-2xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl hover:scale-105"
              >
                <Edit3 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                Update Profile
                <Sparkles className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
              </button>
              
              <button
                onClick={handleOpenPasswordDialog}
                className="group relative bg-white/10 backdrop-blur-lg border-2 border-white/40 text-white px-10 py-5 rounded-2xl font-bold hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl hover:scale-105"
              >
                <Shield className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                Security Settings
              </button>

              <button
                onClick={() => scrollToSection('bookings')}
                className="group relative bg-gradient-to-r from-purple-600/80 to-pink-600/80 backdrop-blur-lg border border-white/30 text-white px-10 py-5 rounded-2xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl hover:scale-105"
              >
                <BookOpen className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                View Bookings
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Name Dialog */}
      {openNameDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full transform transition-all scale-100 animate-in">
            <div className="p-10 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Edit3 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-800">Update Profile</h3>
                    <p className="text-gray-500 mt-1">Personalize your account information</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseNameDialog}
                  className="p-3 hover:bg-gray-100 rounded-2xl transition-colors group"
                >
                  <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                </button>
              </div>
            </div>
            
            <div className="p-10">
              <div className="mb-10">
                <label className="block text-lg font-bold text-gray-700 mb-4 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-8 py-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-xl font-medium bg-gray-50 focus:bg-white"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={handleCloseNameDialog}
                  className="flex-1 px-8 py-5 border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all font-bold text-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveName}
                  className="flex-1 px-8 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl hover:from-blue-700 hover:to-cyan-700 transition-all font-bold shadow-xl hover:shadow-2xl hover:scale-105 text-lg"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Dialog */}
      {openPasswordDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full transform transition-all scale-100 animate-in">
            <div className="p-10 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-800">Security Settings</h3>
                    <p className="text-gray-500 mt-1">Update your account password</p>
                  </div>
                </div>
                <button
                  onClick={handleClosePasswordDialog}
                  className="p-3 hover:bg-gray-100 rounded-2xl transition-colors group"
                >
                  <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                </button>
              </div>
            </div>
            
            <div className="p-10">
              <div className="space-y-8 mb-10">
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-4 uppercase tracking-wider">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-8 py-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-xl bg-gray-50 focus:bg-white"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-4 uppercase tracking-wider">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-8 py-5 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-xl bg-gray-50 focus:bg-white"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={handleClosePasswordDialog}
                  className="flex-1 px-8 py-5 border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all font-bold text-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePassword}
                  className="flex-1 px-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all font-bold shadow-xl hover:shadow-2xl hover:scale-105 text-lg"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Bookings Section */}
      <section id="bookings" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-full font-bold mb-8 shadow-lg">
              <Clock className="w-6 h-6" />
              ACTIVE RESERVATIONS
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Your Current{' '}
              <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent">
                Bookings
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Manage and track your upcoming luxury experiences in paradise</p>
          </div>
          
          {ongoingBookings.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {ongoingBookings.map((booking) => (
                <div
                  key={booking.transaction_id}
                  className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 overflow-hidden border border-gray-100 hover:scale-105"
                >
                  <div className="flex h-80">
                    <div className="w-2/5 relative overflow-hidden">
                      {roomImages[booking.room_id] ? (
                        <img
                          src={roomImages[booking.room_id]}
                          alt={booking.room}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-700 flex items-center justify-center">
                          <MapPin className="w-16 h-16 text-white" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute top-6 left-6">
                        <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                          <CheckCircle className="w-4 h-4" />
                          {booking.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 p-10 flex flex-col justify-between">
                      <div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-6">{booking.room}</h3>
                        
                        <div className="space-y-5 mb-8">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Duration</p>
                              <p className="font-bold text-gray-800 text-lg">
                                {new Date(booking.from_date).toLocaleDateString('en-CA')} - {new Date(booking.to_date).toLocaleDateString('en-CA')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-2xl flex items-center justify-center">
                              <CreditCard className="w-6 h-6 text-cyan-600" />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Total Amount</p>
                              <p className="font-black text-3xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">${booking.total_amount}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="self-start bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-3"
                      >
                        <XCircle className="w-5 h-5" />
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="w-40 h-40 bg-gradient-to-br from-blue-100 to-cyan-200 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg">
                <Calendar className="w-20 h-20 text-blue-400" />
              </div>
              <h3 className="text-4xl font-bold text-gray-600 mb-6">No Active Reservations</h3>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8">Ready to embark on your next luxury adventure in paradise?</p>
              <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-10 py-4 rounded-2xl font-bold hover:shadow-xl transition-all duration-300 hover:scale-105">
                Explore New Destinations
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Previous Bookings Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold mb-8 shadow-lg">
              <History className="w-6 h-6" />
              BOOKING HISTORY
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Your{' '}
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-700 bg-clip-text text-transparent">
                Travel History
              </span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-400 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Relive the memories from your previous luxury experiences</p>
          </div>
          
          {previousBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {previousBookings.map((booking) => (
                <div
                  key={booking.transaction_id}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:scale-105"
                >
                  <div className="relative h-64 overflow-hidden">
                    {roomImages[booking.room_id] ? (
                      <img
                        src={roomImages[booking.room_id]}
                        alt={booking.room}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-700 flex items-center justify-center">
                        <MapPin className="w-16 h-16 text-white" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="font-bold text-2xl mb-3">{booking.room}</h3>
                      <span className="bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        Cancelled
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Period</p>
                        <p className="text-lg font-bold text-gray-800">
                          {new Date(booking.from_date).toLocaleDateString('en-CA')} - {new Date(booking.to_date).toLocaleDateString('en-CA')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-cyan-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 uppercase tracking-wider font-bold">Amount</p>
                          <p className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">${booking.total_amount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="w-40 h-40 bg-gradient-to-br from-purple-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg">
                <History className="w-20 h-20 text-purple-400" />
              </div>
              <h3 className="text-4xl font-bold text-gray-600 mb-6">No Previous Bookings</h3>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">Your travel history will appear here once you make your first booking.</p>
            </div>
          )}
        </div>
      </section>

      {/* Admin Panel Section */}
      {admin && (
        <section className="py-24 px-6 bg-gradient-to-br from-gray-900 via-blue-900 to-cyan-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-full font-bold mb-8 shadow-lg">
                <Shield className="w-6 h-6" />
                ADMIN ACCESS
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-8 text-white">
                Admin{' '}
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                  Dashboard
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-400 mx-auto mb-8"></div>
              <p className="text-xl text-blue-200 max-w-3xl mx-auto">Manage your hotel operations with advanced administrative tools</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
              <AdminPanel />
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Account;
