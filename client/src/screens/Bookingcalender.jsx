import { useState } from 'react';
import { Calendar, Users, Search } from 'lucide-react';

export default function BookingCalendar() {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-6 w-full max-w-4xl border border-white border-opacity-20 shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium mb-2 text-left">Check-in</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input 
              type="date" 
              className="pl-10 w-full p-3 bg-white bg-opacity-20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium mb-2 text-left">Check-out</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input 
              type="date" 
              className="pl-10 w-full p-3 bg-white bg-opacity-20 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-sm font-medium mb-2 text-left">Guests</label>
          <div className="relative">
            <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <select 
              className="pl-10 w-full p-3 bg-white bg-opacity-20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num} className="text-gray-800">{num} {num === 1 ? 'Guest' : 'Guests'}</option>
              ))}
            </select>
          </div>
        </div>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-300 flex items-center justify-center">
          <Search className="mr-2 h-5 w-5" />
          Search
        </button>
      </div>
    </div>
  );
}