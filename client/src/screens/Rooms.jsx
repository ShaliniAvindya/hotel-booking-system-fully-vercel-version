import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, Dialog, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import dayjs from 'dayjs';
import { 
  Search, Wifi, Coffee, Droplet, ShowerHead, Shirt, Lock, Phone, Star, Map, Tv, Wind, Dumbbell
} from 'lucide-react';
import BookingCalendar from './Bookingcalender';
import RoomSearch from './RoomSearch';
import DateRange from '../components/DateRange';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [searchFilteredRooms, setSearchFilteredRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [calendarSearchTerm, setCalendarSearchTerm] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

    const handleDateRangeSelect = (from, to) => {
      setFromDate(from);
      setToDate(to);
    };

      const  handleDateRangeChange = (dates) => {
    setFromDate(dates[0]);
    setToDate(dates[1]);
  };

  // Facility icons 
  const facilityIcons = {
    "Free Wi-Fi": <Wifi className="text-blue-500" />,
    "Minibar": <Coffee className="text-amber-700" />,
    "Shower WC": <ShowerHead className="text-blue-400" />,
    "Bathrobe": <Shirt className="text-gray-500" />,
    "In-room Digital Safe": <Lock className="text-gray-700" />,
    "Iron and Iron Board": <Shirt className="text-gray-500" />,
    "Ocean View": <Map className="text-indigo-500" />,
    "Private Pool": <Droplet className="text-cyan-500" />,
    "Air Conditioning": <Wind className="text-blue-300" />,
    "Flat Screen TV": <Tv className="text-gray-600" />,
    "Spa Access": <Star className="text-pink-500" />,
    "Gym Access": <Dumbbell className="text-yellow-600" />
  };

  const baseRoomCategories = [
    { id: 'all', name: 'All Rooms' },
    { id: 'standard', name: 'Standard' },
    { id: 'deluxe', name: 'Deluxe' },
    { id: 'suites', name: 'Suites' },
    { id: 'family', name: 'Family' },
    { id: 'accessible', name: 'Accessible' }
  ];

  const [roomCategories, setRoomCategories] = useState(baseRoomCategories);

  // Initialize search data 
  useEffect(() => {
    localStorage.removeItem('fromDate');
    localStorage.removeItem('toDate');
    localStorage.removeItem('searchTerm');

    if (location.state && (location.state.fromDate || location.state.toDate || location.state.searchTerm)) {
      const stateFromDate = location.state.fromDate;
      const stateToDate = location.state.toDate;
      const stateSearchTerm = location.state.searchTerm;

      const newFromDate = stateFromDate ? new Date(stateFromDate) : null;
      const newToDate = stateToDate ? new Date(stateToDate) : null;
      const newSearchTerm = stateSearchTerm || '';

      console.log('Initializing search data from location.state:', { newFromDate, newToDate, newSearchTerm });

      setFromDate(newFromDate);
      setToDate(newToDate);
      setCalendarSearchTerm(newSearchTerm);

      if (newSearchTerm || (newFromDate && newToDate)) {
        setRoomCategories([
          ...baseRoomCategories,
          { id: 'available', name: 'Available Rooms' }
        ]);
        setActiveTab('available');
      }
    } else {
      console.log('No valid location.state, clearing search data');
      setFromDate(null);
      setToDate(null);
      setCalendarSearchTerm('');
      setActiveTab('all');
      setRoomCategories(baseRoomCategories);
    }
  }, [location.key]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fetch rooms and bookings
  useEffect(() => {
    const fetchData = async () => {
      try {
        let roomsUrl = 'http://localhost:8000/api/rooms';
        if (fromDate && toDate) {
          roomsUrl += `?fromDate=${dayjs(fromDate).format('YYYY-MM-DD')}&toDate=${dayjs(toDate).format('YYYY-MM-DD')}`;
        }
        console.log('Fetching rooms from:', roomsUrl);
        const roomsResponse = await axios.get(roomsUrl);
        console.log('Rooms API response:', roomsResponse.data);
        if (!Array.isArray(roomsResponse.data)) {
          console.error('Rooms API returned non-array data:', roomsResponse.data);
          setRooms([]);
          setFilteredRooms([]);
          setSearchFilteredRooms([]);
          return;
        }

        let availableRooms = roomsResponse.data;

        if (fromDate && toDate) {
          try {
            const bookingsUrl = 'http://localhost:8000/api/bookings';
            console.log('Fetching bookings from:', bookingsUrl);
            const bookingsResponse = await axios.get(bookingsUrl, {
              params: {
                fromDate: dayjs(fromDate).format('YYYY-MM-DD'),
                toDate: dayjs(toDate).format('YYYY-MM-DD')
              }
            });
            console.log('Bookings API response:', bookingsResponse.data);
            setBookings(bookingsResponse.data);

            const bookedRoomIds = bookingsResponse.data
              .filter(booking => {
                const bookingFrom = dayjs(booking.fromDate);
                const bookingTo = dayjs(booking.toDate);
                const searchFrom = dayjs(fromDate);
                const searchTo = dayjs(toDate);
                return (
                  bookingFrom.isBefore(searchTo) && bookingTo.isAfter(searchFrom)
                );
              })
              .map(booking => booking.roomId);

            console.log('Booked room IDs:', bookedRoomIds);
            availableRooms = roomsResponse.data.filter(room => !bookedRoomIds.includes(room._id));
            console.log('Available rooms after booking filter:', availableRooms.map(room => ({ id: room._id, name: room.name })));
          } catch (bookingError) {
            console.warn('Error fetching bookings, assuming API filters rooms:', bookingError.response?.data || bookingError.message);
          }
        }

        setRooms(availableRooms);
        setFilteredRooms(availableRooms);
        setSearchFilteredRooms(availableRooms);
      } catch (error) {
        console.error('Error fetching rooms:', error.response?.data || error.message);
        setRooms([]);
        setFilteredRooms([]);
        setSearchFilteredRooms([]);
        setBookings([]);
      }
    };
    fetchData();
  }, [fromDate, toDate]);

  useEffect(() => {
    console.log('searchFilteredRooms updated:', searchFilteredRooms.map(room => ({ id: room._id, name: room.name })));
    filterByCategory(activeTab);
  }, [searchFilteredRooms]);

  const resetSearch = () => {
    console.log('Resetting search');
    setFromDate(null);
    setToDate(null);
    setCalendarSearchTerm('');
    setActiveTab('all');
    setRoomCategories(baseRoomCategories);
    setFilteredRooms(rooms);
    setSearchFilteredRooms(rooms);
    localStorage.removeItem('fromDate');
    localStorage.removeItem('toDate');
    localStorage.removeItem('searchTerm');
    navigate('/rooms', { replace: true, state: {} });
  };

  const handleRoomClick = (room) => {
    console.log('Room clicked:', room);
    setSelectedRoom(room);
    setCurrentImageIndex(0);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    console.log('Closing dialog');
    setOpenDialog(false);
  };

  const handleOpenPaymentDialog = () => {
    console.log('Opening payment dialog for:', selectedRoom);
    if (selectedRoom) {
      localStorage.setItem('fromDate', dayjs(fromDate).format('YYYY-MM-DD'));
      localStorage.setItem('toDate', dayjs(toDate).format('YYYY-MM-DD'));
      navigate(`/rooms/payment/${selectedRoom._id}`, {
        state: {
          fromDate,
          toDate,
        },
      });
    }
  };

  const filterByCategory = (category) => {
    setActiveTab(category);
    console.log('Filtering by category:', category);
    if (category === 'all' || category === 'available') {
      setFilteredRooms(searchFilteredRooms);
    } else {
      const filtered = searchFilteredRooms.filter(room =>
        room.type && (
          (category === 'standard' && (
            room.type.toLowerCase().includes('standard') ||
            room.type.toLowerCase().includes('single') ||
            room.type.toLowerCase().includes('double') ||
            room.type.toLowerCase() === 'singlebedroom1' ||
            room.type.toLowerCase() === 'doublebedroom1'
          )) ||
          (category === 'deluxe' && room.type.toLowerCase().includes('deluxe')) ||
          (category === 'suites' && (
            room.type.toLowerCase().includes('suite') ||
            room.type.toLowerCase().includes('penthouse')
          )) ||
          (category === 'family' && room.type.toLowerCase().includes('family')) ||
          (category === 'accessible' && room.type.toLowerCase().includes('accessible'))
        )
      );
      console.log('Filtered rooms in filterByCategory:', filtered.map(room => ({ id: room._id, name: room.name, type: room.type })));
      setFilteredRooms(filtered);
    }
  };

  const nextImage = () => {
    if (selectedRoom && selectedRoom.imageUrls) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === selectedRoom.imageUrls.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedRoom && selectedRoom.imageUrls) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? selectedRoom.imageUrls.length - 1 : prevIndex - 1
      );
    }
  };

  // Log props passed to RoomSearch
  console.log('Props passed to RoomSearch:', {
    roomsCount: rooms.length,
    fromDate: fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null,
    toDate: toDate ? dayjs(toDate).format('YYYY-MM-DD') : null,
    bookingsCount: bookings.length
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div
        className="relative h-[720px] bg-cover bg-fixed bg-center overflow-hidden"
        style={{
          backgroundImage: "url('https://i.postimg.cc/76pCMfrN/pexels-asadphoto-2245290.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white z-10 px-6 max-w-4xl mx-auto transform transition-all duration-700 hover:scale-105">
            <div className="relative mb-4">
              <h1 className="text-5xl md:text-7xl font-bold mb-8 drop-shadow-lg">
                Luxury Accommodations
              </h1>
              <div className="h-1 w-24 bg-blue-400 mx-auto"></div>
            </div>
            <p className="text-xl md:text-2xl mb-8  max-w-2xl mx-auto opacity-90 leading-relaxed">
              Experience unparalleled comfort and elegance in our meticulously designed sanctuaries of relaxation
            </p>
          </div>
        </div>
      </div>

      {/* Search Components */}
      <div className="relative z-20 max-w-6xl mx-auto -mt-60">
        <div className="bg rounded-xl text-white shadow-xl p-6 transition-all duration-300  w-fit mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <BookingCalendar
              fromDate={fromDate}
              setFromDate={setFromDate}
              toDate={toDate}
              setToDate={setToDate}
              searchTerm={calendarSearchTerm}
              setSearchTerm={setCalendarSearchTerm}
              onSearch={() => setActiveTab('available')}
              resetSearch={resetSearch}
            />
          </div>
        </div><br />

        <RoomSearch
          setFilteredRooms={setSearchFilteredRooms}
          rooms={rooms}
          fromDate={fromDate}
          toDate={toDate}
          bookings={bookings}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto pt-4 max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block relative">
            <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-7xl text-blue-100 opacity-70 font-serif">❝</span>
            <h2 className="font-serif text-5xl font-bold mb-3 text-gray-800 relative">
              Find Your Perfect Stay
            </h2>
          </div>
          {filteredRooms.length > 0 ? (
            <Typography variant="h6" className="text-gray-600 mt-2">
              {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'} {activeTab === 'available' ? 'available' : 'found'}
              {activeTab === 'available' && fromDate && toDate ? ` for ${dayjs(fromDate).format('MMM D, YYYY')} to ${dayjs(toDate).format('MMM D, YYYY')}` : ''}
            </Typography>
          ) : (
            <Typography variant="h6" className="text-gray-600 mt-2">
              No rooms {activeTab === 'available' ? 'available' : 'found'}
              {activeTab === 'available' && fromDate && toDate ? ` for ${dayjs(fromDate).format('MMM D, YYYY')} to ${dayjs(toDate).format('MMM D, YYYY')}` : ''}
            </Typography>
          )}
        </div>

        {/* Room Category Tabs */}
        <div className="flex overflow-x-auto pb-4 mb-8 scrollbar-hide">
          <div className="flex space-x-2 mx-auto bg-blue-50 p-1 rounded-full">
            {roomCategories.map(category => (
              <button
                key={category.id}
                onClick={() => filterByCategory(category.id)}
                className={`py-2 px-6 rounded-full whitespace-nowrap transition-all duration-300 ${
                  activeTab === category.id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-transparent text-gray-700 hover:bg-blue-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Room Cards */}
        <Grid container spacing={4}>
          {Array.isArray(filteredRooms) && filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <Grid item key={room._id} xs={12} sm={6} md={4}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'left',
                    boxSizing: 'border-box',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    paddingBottom: '2vh',
                    backgroundColor: '#fff',
                    width: '100%',
                    height: '100%',
                    margin: '0',
                  }}
                  onClick={() => handleRoomClick(room)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0px 8px 12px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <Carousel
                    showThumbs={false}
                    infiniteLoop
                    useKeyboardArrows
                    autoPlay
                    showStatus={false}
                    showIndicators={true}
                    style={{ width: '100%', height: '38%' }}
                  >
                    {room.imageUrls && Array.isArray(room.imageUrls) && room.imageUrls.length > 0 ? (
                      room.imageUrls.map((image, index) => (
                        <div key={index}>
                          <img
                            src={image}
                            alt={`${room.name || 'Room'} ${index}`}
                            style={{
                              width: '100%',
                              height: '30vh',
                              objectFit: 'cover',
                            }}
                            onError={(e) => (e.target.src = 'https://via.placeholder.com/800x500')}
                          />
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: 'center', padding: '10px', height: '30vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' }}>
                        <p>No images available</p>
                      </div>
                    )}
                  </Carousel>
                  <p
                    style={{
                      position: 'relative',
                      top: '-28vh',
                      left: '1.5vw',
                      zIndex: '1',
                      backgroundColor: 'rgba(0, 0, 50, 0.8)',
                      color: '#fff',
                      width: 'fit-content',
                      padding: '4px 8px',
                    }}
                  >
                    {room.type || 'Unknown'}
                  </p>
                  <div style={{ height: '55%', padding: '1vh 1vw' }}>
                    <h3
                      style={{
                        margin: '0px 0vw 1vh 0vw',
                        fontSize: '1.4rem',
                        fontWeight: 'bold',
                        color: '#333',
                      }}
                    >
                      {room.name || 'Unnamed Room'}
                    </h3>
                    <p
                      style={{
                        margin: '0 1vw 0 0vw',
                        textAlign: 'left',
                        fontSize: '0.9rem',
                        color: '#555',
                      }}
                    >
                      {room.description || 'No description available'}
                    </p>
                    <div style={{ backgroundColor: '#0A369D', height: '5px', width: '20%', margin: '1vh 0 1vh 0' }}></div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        gap: '0.6vw',
                        alignItems: 'center',
                        overflowX: 'auto',
                        width: '100%',
                        height: '30%',
                      }}
                    >
                      {room.facilities && Array.isArray(room.facilities) && room.facilities.length > 0 ? (
                        room.facilities.map((facility, index) => (
                          <div
                            key={index}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minWidth: '5vw',
                              maxWidth: '6vw',
                              flexShrink: 0,
                            }}
                          >
                            {facilityIcons[facility] || <Shirt className="text-gray-500" />}
                            <span style={{ fontSize: '0.8rem', marginTop: '4px', textAlign: 'center' }}>
                              {facility}
                            </span>
                          </div>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#555' }}>No facilities listed</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'left', marginTop: '1vh' }}>
                      <div>
                        <p style={{ fontSize: '15px', color: 'rgba(0,0,0,0.5)', marginBottom: '0' }}>Starting From</p>
                        <p
                          style={{
                            fontSize: '30px',
                            fontWeight: 'bold',
                            color: 'black',
                          }}
                        >
                          ${room.rentPerDay || 'N/A'}
                          <span style={{ fontSize: '20px', color: 'rgba(0,0,0,0.5)' }}>/night</span>
                        </p>
                      </div>
                      <button
                        style={{
                          backgroundColor: '#0A369D',
                          color: '#fff',
                          padding: '5px 15px',
                          margin: '2vh 0 0 0',
                          height: '40px',
                          borderRadius: '5px',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </Grid>
            ))
          ) : (
            <div style={{ width: '100%', textAlign: 'center', padding: '40px 0' }}>
              <div style={{ backgroundColor: '#eff6ff', borderRadius: '8px', padding: '32px', maxWidth: '400px', margin: '0 auto' }}>
                <Search style={{ margin: '0 auto 16px', color: '#3b82f6', width: '48px', height: '48px' }} />
                <h3 style={{ fontSize: '20px', fontWeight: '500', color: '#1f2937', marginBottom: '8px' }}>
                  No rooms {activeTab === 'available' ? 'available' : 'found'}
                </h3>
                <p style={{ color: '#4b5563' }}>
                  {activeTab === 'available' && fromDate && toDate
                    ? `No rooms available for ${dayjs(fromDate).format('MMM D, YYYY')} to ${dayjs(toDate).format('MMM D, YYYY')}`
                    : `No rooms ${activeTab === 'available' ? 'available' : 'found'} for the selected category.`}
                  . Try adjusting your search criteria or check back later.
                </p>
              </div>
            </div>
          )}
        </Grid>
      </div>

      {/* Room Detail Modal */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            minHeight: '79vh',
            borderRadius: '10px',
          },
        }}
      >
        {selectedRoom && (
          <>
            <div style={{ position: 'relative', width: '100%' }}>
              <Carousel
                showThumbs={false}
                infiniteLoop
                useKeyboardArrows
                autoPlay
                renderArrowPrev={(onClickHandler, hasPrev) =>
                  hasPrev && (
                    <div
                      onClick={onClickHandler}
                      style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        zIndex: 10,
                      }}
                    >
                      <KeyboardArrowLeft style={{ fontSize: '40px', color: '#fff' }} />
                    </div>
                  )
                }
                renderArrowNext={(onClickHandler, hasNext) =>
                  hasNext && (
                    <div
                      onClick={onClickHandler}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        zIndex: 10,
                      }}
                    >
                      <KeyboardArrowRight style={{ fontSize: '40px', color: '#fff' }} />
                    </div>
                  )
                }
              >
                {selectedRoom.imageUrls && Array.isArray(selectedRoom.imageUrls) && selectedRoom.imageUrls.length > 0 ? (
                  selectedRoom.imageUrls.map((url, index) => (
                    <div key={index}>
                      <img
                        src={url}
                        alt={`${selectedRoom.name || 'Room'}`}
                        style={{
                          width: '100%',
                          height: '350px',
                          objectFit: 'cover',
                        }}
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/800x500')}
                      />
                    </div>
                  ))
                ) : (
                  <div style={{ width: '100%', height: '350px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p>No images available</p>
                  </div>
                )}
              </Carousel>
              <div
                style={{
                  position: 'absolute',
                  bottom: '0',
                  width: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  padding: '10px 20px',
                  zIndex: 5,
                  textAlign: 'center',
                }}
              >
                <Typography
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    color: '#fff',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  {selectedRoom.name || 'Unnamed Room'}
                </Typography>
              </div>
            </div>
            <br />
            <DialogContent style={{ padding: '0 20px' }}>
              <Typography
                variant="body1"
                style={{ fontFamily: 'Playfair Display, serif', color: '#2b2a78', marginBottom: '20px', textAlign: 'center' }}
              >
                {selectedRoom.description || 'No description available'}
              </Typography>
              <Box display="flex" justifyContent="space-between" mt={2} style={{ padding: '0 1vw' }}>
                <Typography
                  variant="body1"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    color: '#2b2a78',
                    marginBottom: '10px',
                    backgroundColor: 'rgba(0,0,50,0.2)',
                    padding: '5px 10px',
                  }}
                >
                  {selectedRoom.type || 'Unknown'}
                </Typography>
                <Typography
                  variant="body1"
                  style={{ fontFamily: 'Playfair Display, serif', color: '#2b2a78' }}
                >
                  Max Count: {selectedRoom.maxCount || 'N/A'}
                </Typography>
                <Typography
                  variant="body1"
                  style={{ fontFamily: 'Playfair Display, serif', color: '#2b2a78', display: 'flex', alignItems: 'center' }}
                >
                  <Phone className="mr-2 text-[#2b2a78]" size={20} />
                  {selectedRoom.phoneNumber || 'Contact available'}
                </Typography>
                <Typography
                  variant="body1"
                  style={{ fontFamily: 'Playfair Display, serif', color: '#2b2a78' }}
                >
                  <span style={{ fontWeight: 'bold', fontSize: '25px' }}>${selectedRoom.rentPerDay || 'N/A'}</span>/night
                </Typography>
              </Box>
              <Box
                display="flex"
                flexWrap="wrap"
                gap={2}
                alignItems="center"
                style={{
                  padding: '10px',
                  backgroundColor: '#f9f9f9',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  margin: '0 1vw 1vh 1vw',
                }}
              >
                {Array.isArray(selectedRoom.facilities) && selectedRoom.facilities.length > 0 ? (
                  selectedRoom.facilities.map((facility, index) => (
                    <Box key={index} display="flex" alignItems="center" style={{ margin: '5px 10px' }}>
                      {facilityIcons[facility] || <Shirt className="text-gray-500" />}
                      <Typography
                        variant="body2"
                        style={{
                          marginLeft: '8px',
                          fontWeight: 'bold',
                          fontFamily: 'Playfair Display, serif',
                          color: '#6B4F4F',
                        }}
                      >
                        {facility}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      color: '#6B4F4F',
                    }}
                  >
                    No facilities listed
                  </Typography>
                )}
              </Box>
              <BookingCalendar onDateRangeSelect={handleDateRangeSelect} />
            </DialogContent>
            <DialogActions style={{ display: 'flex', justifyContent: 'space-between', padding: '1vh 2vw 4vh 2vw' }}>
              <Button
                onClick={handleCloseDialog}
                style={{
                  border: '1px solid red',
                  color: '#633434',
                  padding: '5px 10px',
                  borderRadius: '8px',
                }}
              >
                Close
              </Button>
              <Button
                style={{
                  backgroundColor: '#1E3A8A',
                  color: '#fff',
                  padding: '5px 10px',
                  fontSize: '16px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
                onClick={handleOpenPaymentDialog}
              >
                Book Now
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog><br/><br/><br/>

    
    </div>
  );
};

export default Rooms;