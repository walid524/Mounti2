# Mounti - Smart Parcel & Passenger Delivery Platform

A mobile-first web application connecting travelers and senders between Tunisia and France for smart parcel and passenger delivery.

## 🎯 Features

### Core Functionality
- **Transporter Dashboard**: View trips, manage clients, track parcel delivery status
- **Client Dashboard**: Search trips, reserve seats/parcel space, track status
- **Trip Creation**: Responsive form with location inputs, date picker, capacity management
- **Booking System**: Book passenger seats or parcel delivery space
- **Notifications**: Real-time updates for booking requests and status changes
- **Authentication**: Seamless login/registration using Emergent managed auth

### Design
- **Mobile-First**: Optimized for mobile devices with responsive design
- **Mediterranean Theme**: Navy blue, mint green, and white color palette
- **Modern UI**: Clean typography, soft shadows, intuitive navigation
- **Dual Navigation**: Bottom tabs for mobile, top tabs for desktop

## 🛠 Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Authentication**: Emergent Managed Auth (no external setup required)
- **Deployment**: Kubernetes container environment

## 📂 Project Structure

```
mounti-app/
├── backend/
│   ├── server.py              # Main FastAPI application
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
├── frontend/
│   ├── src/
│   │   ├── App.js            # Main React component
│   │   ├── App.css           # Styles with Mediterranean theme
│   │   └── index.js          # React entry point
│   ├── package.json          # Node.js dependencies
│   ├── tailwind.config.js    # Tailwind configuration
│   └── .env                  # Frontend environment variables
├── test_result.md            # Testing documentation
├── backend_api_test.sh       # Backend API testing script
└── backend_test.py           # Python backend testing script
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB
- Yarn package manager

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend/
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set environment variables in `.env`:
   ```env
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=mounti_database
   ```

4. Run the backend server:
   ```bash
   uvicorn server:app --host 0.0.0.0 --port 8001 --reload
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend/
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Set environment variables in `.env`:
   ```env
   REACT_APP_BACKEND_URL=http://localhost:8001
   ```

4. Start the development server:
   ```bash
   yarn start
   ```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/session` - Create session from Emergent auth
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Trips
- `GET /api/trips` - Get all trips (with optional filters)
- `POST /api/trips` - Create new trip (requires auth)
- `GET /api/trips/my` - Get user's trips (requires auth)
- `GET /api/trips/{trip_id}` - Get specific trip

### Bookings
- `POST /api/bookings` - Create booking (requires auth)
- `GET /api/bookings/my` - Get user's bookings (requires auth)
- `GET /api/bookings/trip/{trip_id}` - Get trip bookings (requires auth)
- `PUT /api/bookings/{booking_id}/status` - Update booking status (requires auth)

### Notifications
- `GET /api/notifications` - Get user notifications (requires auth)
- `PUT /api/notifications/{notification_id}/read` - Mark notification as read (requires auth)

## 🎨 Design System

### Colors
- **Navy Blue**: Primary color for headers, buttons, and accents
- **Mint Green**: Secondary color for highlights and success states
- **White**: Background and card colors
- **Gray**: Text and border colors

### Typography
- Clean, modern font stack
- Responsive font sizes
- Proper heading hierarchy

### Components
- Rounded corners (xl radius)
- Soft shadows
- Gradient backgrounds
- Smooth transitions

## 📱 Mobile-First Design

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Navigation
- **Mobile**: Bottom tab navigation with icons
- **Desktop**: Top horizontal navigation
- **Tablet**: Adapts between mobile and desktop patterns

## 🔐 Authentication Flow

1. User clicks "Sign in with Email" button
2. Redirects to Emergent Auth service
3. After successful authentication, redirects back with session_id
4. Frontend calls backend to create session
5. Backend validates with Emergent Auth API
6. Session token stored in localStorage
7. Token used for all authenticated requests

## 🧪 Testing

### Backend Testing
Run the comprehensive backend API tests:
```bash
./backend_api_test.sh
```

Or use the Python test script:
```bash
python backend_test.py
```

### Test Coverage
- ✅ Authentication system
- ✅ Trip management CRUD operations
- ✅ Booking system with status management
- ✅ Notifications system
- ✅ Error handling and validation
- ✅ Authorization and security

## 🌍 Deployment

The application is designed for Kubernetes deployment with:
- Ingress rules for API routing
- Environment variable management
- Service discovery and load balancing
- Health checks and monitoring

## 📋 Data Models

### User
- id, email, name, picture, created_at, is_transporter

### Trip
- id, transporter_id, from_location, to_location, departure_date
- available_seats, available_weight_kg, price_per_seat, price_per_kg
- notes, status, created_at

### Booking
- id, trip_id, client_id, booking_type, quantity, total_price
- status, created_at

### Notification
- id, user_id, title, message, type, read, created_at

## 🔮 Future Enhancements

### Planned Features
- **Location Autocomplete**: Google Places API integration
- **Real-time Updates**: WebSocket notifications
- **Dark Mode**: Theme switching capability
- **Advanced Filtering**: More search options
- **Payment Integration**: Stripe or PayPal
- **Chat System**: In-app messaging
- **Rating System**: User reviews and ratings

### Technical Improvements
- **Progressive Web App**: Offline functionality
- **Push Notifications**: Mobile push notifications
- **Analytics**: User behavior tracking
- **Monitoring**: Application performance monitoring
- **Caching**: Redis for improved performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for connecting travelers and senders between Tunisia and France**