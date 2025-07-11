import React, { useState, useEffect, createContext, useContext } from 'react';
import './App.css';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('session_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${API}/auth/me`);
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('session_token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (sessionId) => {
    try {
      const response = await axios.post(`${API}/auth/session`, { session_id: sessionId });
      const { session_token, user: userData } = response.data;
      
      localStorage.setItem('session_token', session_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${session_token}`;
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('session_token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Login Component
const Login = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const redirectUrl = window.location.href;
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  // Handle redirect from auth service
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('session_id=')) {
      const sessionId = hash.split('session_id=')[1];
      if (sessionId) {
        login(sessionId).then(success => {
          if (success) {
            window.location.hash = '';
          }
        });
      }
    }
  }, [login]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-mint-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-navy-600 to-mint-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Mounti</h1>
          <p className="text-gray-600">Smart delivery between Tunisia & France</p>
        </div>
        
        <div className="space-y-6">
          <div className="text-center">
            <img 
              src="https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHx0cmF2ZWx8ZW58MHx8fGJsdWV8MTc1MjI0ODE5Mnww&ixlib=rb-4.1.0&q=85"
              alt="Travel"
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
            <h2 className="text-xl font-semibold text-navy-900 mb-2">Connect. Travel. Deliver.</h2>
            <p className="text-gray-600 text-sm">Join travelers and senders for smart parcel delivery</p>
          </div>
          
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-navy-600 to-mint-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-navy-700 hover:to-mint-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Connecting...' : 'Sign in with Email'}
          </button>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-500">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
};

// Navigation Component
const Navigation = () => {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-navy-600 to-mint-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-navy-900">Mounti</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
            <button
              onClick={logout}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [trips, setTrips] = useState([]);
  const [myTrips, setMyTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tripsRes, myTripsRes, bookingsRes, notificationsRes] = await Promise.all([
        axios.get(`${API}/trips`),
        axios.get(`${API}/trips/my`),
        axios.get(`${API}/bookings/my`),
        axios.get(`${API}/notifications`)
      ]);
      
      setTrips(tripsRes.data);
      setMyTrips(myTripsRes.data);
      setBookings(bookingsRes.data);
      setNotifications(notificationsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'create-trip':
        return <CreateTrip onSuccess={() => { setCurrentView('dashboard'); fetchData(); }} />;
      case 'search':
        return <TripSearch trips={trips} onBook={fetchData} />;
      case 'notifications':
        return <NotificationsList notifications={notifications} onMarkRead={fetchData} />;
      default:
        return <DashboardHome myTrips={myTrips} bookings={bookings} notifications={notifications} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-navy-600 to-mint-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Mobile Navigation */}
      <div className="lg:hidden bg-white border-t">
        <div className="grid grid-cols-4 gap-1">
          {[
            { key: 'dashboard', icon: '🏠', label: 'Home' },
            { key: 'create-trip', icon: '➕', label: 'Create' },
            { key: 'search', icon: '🔍', label: 'Search' },
            { key: 'notifications', icon: '🔔', label: 'Alerts' }
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setCurrentView(item.key)}
              className={`p-3 text-center ${currentView === item.key ? 'bg-mint-100 text-navy-600' : 'text-gray-600'}`}
            >
              <div className="text-lg mb-1">{item.icon}</div>
              <div className="text-xs">{item.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:block bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { key: 'dashboard', label: 'Dashboard' },
              { key: 'create-trip', label: 'Create Trip' },
              { key: 'search', label: 'Search Trips' },
              { key: 'notifications', label: 'Notifications' }
            ].map(item => (
              <button
                key={item.key}
                onClick={() => setCurrentView(item.key)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  currentView === item.key 
                    ? 'border-navy-500 text-navy-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>
    </div>
  );
};

// Dashboard Home Component
const DashboardHome = ({ myTrips, bookings, notifications }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-navy-900 mb-4">Your Travel Hub</h2>
        <p className="text-gray-600">Manage your trips and bookings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-navy-900">My Trips</h3>
            <span className="text-2xl font-bold text-navy-600">{myTrips.length}</span>
          </div>
          <p className="text-sm text-gray-600">Active trips you're transporting</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-navy-900">Bookings</h3>
            <span className="text-2xl font-bold text-mint-600">{bookings.length}</span>
          </div>
          <p className="text-sm text-gray-600">Your current bookings</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-navy-900">Notifications</h3>
            <span className="text-2xl font-bold text-orange-600">{notifications.filter(n => !n.read).length}</span>
          </div>
          <p className="text-sm text-gray-600">Unread notifications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-navy-900 mb-4">Recent Trips</h3>
          {myTrips.length === 0 ? (
            <div className="text-center py-8">
              <img 
                src="https://images.unsplash.com/photo-1512757776214-26d36777b513?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwzfHx0cmF2ZWx8ZW58MHx8fGJsdWV8MTc1MjI0ODE5Mnww&ixlib=rb-4.1.0&q=85"
                alt="No trips"
                className="w-24 h-24 object-cover rounded-lg mx-auto mb-4"
              />
              <p className="text-gray-500">No trips yet. Create your first trip!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myTrips.slice(0, 3).map(trip => (
                <div key={trip.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-navy-900">{trip.from_location} → {trip.to_location}</h4>
                      <p className="text-sm text-gray-600">{new Date(trip.departure_date).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      trip.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {trip.status}
                    </span>
                  </div>
                  <div className="flex space-x-4 text-sm text-gray-600">
                    <span>🪑 {trip.available_seats} seats</span>
                    <span>📦 {trip.available_weight_kg}kg</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-navy-900 mb-4">Recent Bookings</h3>
          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <img 
                src="https://images.unsplash.com/photo-1647221597996-54f3d0f73809?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeXxlbnwwfHx8Ymx1ZXwxNzUyMjQ4MTk3fDA&ixlib=rb-4.1.0&q=85"
                alt="No bookings"
                className="w-24 h-24 object-cover rounded-lg mx-auto mb-4"
              />
              <p className="text-gray-500">No bookings yet. Search for trips!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.slice(0, 3).map(booking => (
                <div key={booking.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-navy-900">{booking.booking_type} booking</h4>
                      <p className="text-sm text-gray-600">€{booking.total_price}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Quantity: {booking.quantity}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Create Trip Component
const CreateTrip = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    from_location: '',
    to_location: '',
    departure_date: '',
    available_seats: 1,
    available_weight_kg: 5,
    price_per_seat: 50,
    price_per_kg: 10,
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const tripData = {
        ...formData,
        departure_date: new Date(formData.departure_date).toISOString(),
        available_seats: parseInt(formData.available_seats),
        available_weight_kg: parseFloat(formData.available_weight_kg),
        price_per_seat: parseFloat(formData.price_per_seat),
        price_per_kg: parseFloat(formData.price_per_kg)
      };
      
      await axios.post(`${API}/trips`, tripData);
      onSuccess();
    } catch (error) {
      console.error('Failed to create trip:', error);
      alert('Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-navy-900 mb-6">Create New Trip</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <input
                type="text"
                name="from_location"
                value={formData.from_location}
                onChange={handleChange}
                placeholder="e.g., Tunis, Tunisia"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <input
                type="text"
                name="to_location"
                value={formData.to_location}
                onChange={handleChange}
                placeholder="e.g., Paris, France"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date</label>
            <input
              type="datetime-local"
              name="departure_date"
              value={formData.departure_date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Seats</label>
              <input
                type="number"
                name="available_seats"
                value={formData.available_seats}
                onChange={handleChange}
                min="1"
                max="8"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Weight (kg)</label>
              <input
                type="number"
                name="available_weight_kg"
                value={formData.available_weight_kg}
                onChange={handleChange}
                min="1"
                max="50"
                step="0.5"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price per Seat (€)</label>
              <input
                type="number"
                name="price_per_seat"
                value={formData.price_per_seat}
                onChange={handleChange}
                min="1"
                step="0.01"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price per KG (€)</label>
              <input
                type="number"
                name="price_per_kg"
                value={formData.price_per_kg}
                onChange={handleChange}
                min="1"
                step="0.01"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Additional information about your trip..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-navy-600 to-mint-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-navy-700 hover:to-mint-600 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Creating Trip...' : 'Create Trip'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Trip Search Component
const TripSearch = ({ trips, onBook }) => {
  const [filters, setFilters] = useState({
    from_location: '',
    to_location: '',
    departure_date: ''
  });
  const [filteredTrips, setFilteredTrips] = useState(trips);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFilteredTrips(trips);
  }, [trips]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.from_location) params.append('from_location', filters.from_location);
      if (filters.to_location) params.append('to_location', filters.to_location);
      if (filters.departure_date) params.append('departure_date', filters.departure_date);
      
      const response = await axios.get(`${API}/trips?${params}`);
      setFilteredTrips(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (tripId, bookingType, quantity) => {
    try {
      await axios.post(`${API}/bookings`, {
        trip_id: tripId,
        booking_type: bookingType,
        quantity: parseInt(quantity)
      });
      alert('Booking created successfully!');
      onBook();
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-navy-900 mb-6">Search Trips</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="From location"
            value={filters.from_location}
            onChange={(e) => setFilters({...filters, from_location: e.target.value})}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="To location"
            value={filters.to_location}
            onChange={(e) => setFilters({...filters, to_location: e.target.value})}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
          />
          <input
            type="date"
            value={filters.departure_date}
            onChange={(e) => setFilters({...filters, departure_date: e.target.value})}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-gradient-to-r from-navy-600 to-mint-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-navy-700 hover:to-mint-600 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTrips.map(trip => (
          <TripCard key={trip.id} trip={trip} onBook={handleBook} />
        ))}
      </div>
    </div>
  );
};

// Trip Card Component
const TripCard = ({ trip, onBook }) => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingType, setBookingType] = useState('seat');
  const [quantity, setQuantity] = useState(1);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    onBook(trip.id, bookingType, quantity);
    setShowBookingForm(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-navy-900">{trip.from_location} → {trip.to_location}</h3>
          <p className="text-sm text-gray-600">by {trip.transporter_name}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          trip.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {trip.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm"><strong>Departure:</strong> {new Date(trip.departure_date).toLocaleString()}</p>
        <div className="flex space-x-4 text-sm">
          <span>🪑 {trip.available_seats} seats (€{trip.price_per_seat} each)</span>
          <span>📦 {trip.available_weight_kg}kg (€{trip.price_per_kg}/kg)</span>
        </div>
        {trip.notes && <p className="text-sm text-gray-600">{trip.notes}</p>}
      </div>

      {!showBookingForm ? (
        <button
          onClick={() => setShowBookingForm(true)}
          className="w-full bg-gradient-to-r from-navy-600 to-mint-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-navy-700 hover:to-mint-600 transition-all duration-200"
        >
          Book Now
        </button>
      ) : (
        <form onSubmit={handleBookingSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Booking Type</label>
            <select
              value={bookingType}
              onChange={(e) => {
                setBookingType(e.target.value);
                setQuantity(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
            >
              <option value="seat">Passenger Seat</option>
              <option value="parcel">Parcel Weight (kg)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {bookingType === 'seat' ? 'Number of Seats' : 'Weight (kg)'}
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              max={bookingType === 'seat' ? trip.available_seats : trip.available_weight_kg}
              step={bookingType === 'seat' ? '1' : '0.5'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-transparent"
            />
          </div>

          <div className="text-sm text-gray-600">
            <strong>Total: €{(quantity * (bookingType === 'seat' ? trip.price_per_seat : trip.price_per_kg)).toFixed(2)}</strong>
          </div>

          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-navy-600 to-mint-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-navy-700 hover:to-mint-600 transition-all duration-200"
            >
              Confirm Booking
            </button>
            <button
              type="button"
              onClick={() => setShowBookingForm(false)}
              className="flex-1 bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

// Notifications Component
const NotificationsList = ({ notifications, onMarkRead }) => {
  const handleMarkRead = async (notificationId) => {
    try {
      await axios.put(`${API}/notifications/${notificationId}/read`);
      onMarkRead();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-navy-900 mb-6">Notifications</h2>
      
      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-500">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map(notification => (
            <div key={notification.id} className={`bg-white rounded-xl shadow-lg p-4 ${!notification.read ? 'border-l-4 border-navy-500' : ''}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-navy-900">{notification.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-2">{new Date(notification.created_at).toLocaleString()}</p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => handleMarkRead(notification.id)}
                    className="text-xs text-navy-600 hover:text-navy-700 ml-4"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main App Component
const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-mint-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-navy-600 to-mint-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <p className="text-gray-600">Loading Mounti...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <div className="App">
        {!user ? <Login /> : <Dashboard />}
      </div>
    </AuthProvider>
  );
};

export default App;