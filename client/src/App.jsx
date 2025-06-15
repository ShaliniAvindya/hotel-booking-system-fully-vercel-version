import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import Navigation from './screens/Navigation.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import RoomsList from './screens/Rooms.jsx';
import Register from './screens/Register.jsx';
import Login from './screens/Login.jsx';
import Account from './screens/Account.jsx';
import BookRoom from './screens/BookRoom.jsx';
import Facilities from './screens/Facilities.jsx';
import Contact from './screens/Contact.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import Footer from './screens/Footer.jsx';

const App = () => {
  return (
    <AuthProvider>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/rooms" element={<RoomsList />} />
        <Route path="/rooms/payment/:id" element={<BookRoom />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
      <Footer />
    </AuthProvider>
  );
};

export default App;