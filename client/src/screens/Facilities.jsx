import React, { useState, useEffect } from 'react';
import { ChevronRight, MapPin, Users, Star, Waves, Utensils, Dumbbell, Wifi, Car, Phone, Baby, Gamepad2, Calendar, ArrowRight } from 'lucide-react';

const Facilities = () => {
  const [hoveredFacility, setHoveredFacility] = useState(null);

  const scrollToFacilities = () => {
    const facilitiesSection = document.getElementById('facilities-section');
    if (facilitiesSection) {
      facilitiesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const facilities = [
    { 
      id: 1,
      name: 'Luxurious Accommodations',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop',
      description: 'Elegantly appointed overwater and beachfront villas with premium furnishings and breathtaking ocean views.',
      icon: <MapPin className="h-6 w-6" />,
      category: 'accommodation',
      features: ['Ocean Views', 'Private Terrace', 'Premium Amenities']
    },
    { 
      id: 2,
      name: 'Fine Dining Restaurants',
      image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=2071&auto=format&fit=crop',
      description: 'World-class culinary experiences featuring international cuisine and fresh local seafood.',
      icon: <Utensils className="h-6 w-6" />,
      category: 'dining',
      features: ['International Cuisine', 'Ocean Views', 'Private Dining']
    },
    { 
      id: 3,
      name: 'Infinity Swimming Pools',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop',
      description: 'Stunning infinity pools that blend seamlessly with the horizon, offering the ultimate relaxation experience.',
      icon: <Waves className="h-6 w-6" />,
      category: 'recreation',
      features: ['Infinity Edge', 'Pool Bar', 'Sunset Views']
    },
    { 
      id: 4,
      name: 'Spa & Wellness Center',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop',
      description: 'Rejuvenating spa treatments in overwater pavilions with traditional and modern wellness therapies.',
      icon: <Star className="h-6 w-6" />,
      category: 'wellness',
      features: ['Overwater Treatment', 'Couples Spa', 'Holistic Therapies']
    },
    { 
      id: 5,
      name: 'Business & Event Spaces',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069&auto=format&fit=crop',
      description: 'State-of-the-art conference facilities and stunning event venues for meetings and celebrations.',
      icon: <Calendar className="h-6 w-6" />,
      category: 'business',
      features: ['Modern Technology', 'Ocean Views', 'Flexible Layouts']
    },
    { 
      id: 6,
      name: 'Concierge Services',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop',
      description: 'Personalized assistance for excursions, dining reservations, and bespoke experiences.',
      icon: <Phone className="h-6 w-6" />,
      category: 'service',
      features: ['24/7 Available', 'Local Expertise', 'Personalized Service']
    },
    { 
      id: 7,
      name: '24-Hour Room Service',
      image: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?q=80&w=2070&auto=format&fit=crop',
      description: 'Gourmet dining delivered to your villa at any hour, ensuring comfort and convenience.',
      icon: <Utensils className="h-6 w-6" />,
      category: 'service',
      features: ['Gourmet Menu', 'Any Time', 'Villa Delivery']
    },
    { 
      id: 8,
      name: 'Kids Club & Family Services',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop',
      description: 'Supervised activities and childcare services allowing parents to enjoy their vacation worry-free.',
      icon: <Baby className="h-6 w-6" />,
      category: 'family',
      features: ['Supervised Activities', 'Educational Programs', 'Safe Environment']
    },
    { 
      id: 9,
      name: 'Water Sports & Activities',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop',
      description: 'Exciting water sports including snorkeling, diving, kayaking, and sunset cruises.',
      icon: <Gamepad2 className="h-6 w-6" />,
      category: 'recreation',
      features: ['Snorkeling', 'Diving', 'Sunset Cruises']
    },
  ];

  const categories = [
    { id: 'all', name: 'All Facilities' },
    { id: 'accommodation', name: 'Accommodation' },
    { id: 'dining', name: 'Dining' },
    { id: 'wellness', name: 'Wellness' },
    { id: 'recreation', name: 'Recreation' },
    { id: 'service', name: 'Services' },
    { id: 'business', name: 'Business' },
    { id: 'family', name: 'Family' }
  ];

  const [activeCategory, setActiveCategory] = useState('all');
  const filteredFacilities = activeCategory === 'all' 
    ? facilities 
    : facilities.filter(facility => facility.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
       {/* Hero Section */}
      <div
        className="relative h-[720px] bg-cover bg-fixed bg-center overflow-hidden"
        style={{
          backgroundImage: "url('https://i.postimg.cc/k4MRXkFx/maldives-3793871_1280.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white z-10 px-6 max-w-4xl mx-auto transform transition-all duration-700 hover:scale-105">
            <div className="relative mb-4">
               <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Luxury Facilities &{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Amenities
              </span>
            </h1>
              <div className="h-1 w-24 bg-blue-400 mx-auto"></div>
            </div>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90 leading-relaxed">
              Discover world-class facilities designed to create unforgettable moments in paradise
            </p>
            <button 
              onClick={scrollToFacilities}
              className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center mx-auto"
            >
              Explore Facilities
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Facilities Section */}
      <section id="facilities-section" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block relative">
              <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-7xl text-blue-100 opacity-70 font-serif">❝</span>
              <h2 className="font-serif text-5xl font-bold mb-3 text-gray-800 relative">
                World-Class Facilities
              </h2>
            </div>
            
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mx-auto mb-6"></div>
            
            <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
              Experience unparalleled luxury with our comprehensive range of facilities, each designed to enhance your stay and create lasting memories.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex overflow-x-auto pb-4 mb-8 scrollbar-hide">
            <div className="flex space-x-2 mx-auto bg-blue-50 p-1 rounded-full">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`py-2 px-6 rounded-full whitespace-nowrap transition-all duration-300 ${
                    activeCategory === category.id 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-transparent text-gray-700 hover:bg-blue-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Facilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFacilities.map((facility, index) => (
              <div
                key={facility.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'left',
                  boxSizing: 'border-box',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  backgroundColor: '#fff',
                  width: '100%',
                  height: '100%',
                  margin: '0',
                }}
                onMouseEnter={() => setHoveredFacility(facility.id)}
                onMouseLeave={() => setHoveredFacility(null)}
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={facility.image}
                    alt={facility.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-full p-3 text-white">
                    {facility.icon}
                  </div>
                  <div
                    className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium capitalize"
                  >
                    {facility.category}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {facility.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed flex-1">
                    {facility.description}
                  </p>
                  
                  {/* Blue divider line */}
                  <div className="bg-blue-600 h-1 w-1/5 mb-4"></div>
                  
                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {facility.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-500">
                        <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mr-3"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Statistics Section */}
          <div className="mt-20 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 md:p-12 text-white">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Award-Winning Excellence</h3>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                Our commitment to providing world-class facilities has earned us recognition from prestigious hospitality organizations worldwide.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-blue-100 text-sm">Premium Facilities</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">15</div>
                <div className="text-blue-100 text-sm">Years of Excellence</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">98%</div>
                <div className="text-blue-100 text-sm">Guest Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">25+</div>
                <div className="text-blue-100 text-sm">International Awards</div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 max-w-4xl mx-auto">
              <h3 className="text-3xl font-bold mb-4 text-gray-800">Ready to Experience Paradise?</h3>
              <p className="text-gray-600 mb-8 text-lg">
                Book your stay today and discover why our facilities make us the premier luxury destination.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Book Now
                </button>
                <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-4 px-8 rounded-lg transition-all duration-300">
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Facilities;