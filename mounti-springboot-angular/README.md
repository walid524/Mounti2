# Mounti - Spring Boot + Angular Application

A mobile-first parcel and passenger delivery platform connecting travelers between Tunisia and France.

## 🛠 Technology Stack

- **Backend**: Spring Boot 3.2 + Spring Data JPA + H2 Database (with mock data)
- **Frontend**: Angular 17 + Angular Material + Tailwind CSS
- **Authentication**: JWT-based authentication
- **Database**: H2 in-memory database with mock data

## 🚀 Features

- **User Authentication**: JWT-based login/registration
- **Trip Management**: Create, search, and manage trips
- **Booking System**: Book passenger seats or parcel delivery
- **Notifications**: Real-time booking updates
- **Mobile-First Design**: Responsive Mediterranean theme
- **Mock Data**: Pre-populated database for testing

## 📂 Project Structure

```
mounti-springboot-angular/
├── backend/                    # Spring Boot Application
│   ├── src/main/java/com/mounti/
│   │   ├── MountiApplication.java
│   │   ├── config/            # Configuration classes
│   │   ├── controller/        # REST Controllers
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── entity/           # JPA Entities
│   │   ├── repository/       # Spring Data Repositories
│   │   ├── service/          # Business Logic Services
│   │   └── security/         # Security Configuration
│   ├── src/main/resources/
│   │   ├── application.yml   # Application configuration
│   │   └── data.sql         # Mock data
│   └── pom.xml              # Maven dependencies
├── frontend/                  # Angular Application
│   ├── src/app/
│   │   ├── components/       # Angular Components
│   │   ├── services/        # Angular Services
│   │   ├── models/          # TypeScript Models
│   │   ├── guards/          # Route Guards
│   │   └── interceptors/    # HTTP Interceptors
│   ├── src/assets/          # Static assets
│   ├── angular.json         # Angular CLI configuration
│   ├── package.json         # Node.js dependencies
│   └── tailwind.config.js   # Tailwind CSS configuration
└── docs/                     # Documentation
```

## 🔧 Setup Instructions

### Backend Setup (Spring Boot)

1. **Prerequisites**:
   - Java 17 or higher
   - Maven 3.6+

2. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

3. **Run the application**:
   ```bash
   mvn spring-boot:run
   ```

4. **Access H2 Console** (optional):
   - URL: http://localhost:8080/h2-console
   - JDBC URL: jdbc:h2:mem:mounti
   - Username: sa
   - Password: (empty)

### Frontend Setup (Angular)

1. **Prerequisites**:
   - Node.js 18+
   - Angular CLI 17+

2. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Run the application**:
   ```bash
   ng serve
   ```

5. **Access the application**:
   - URL: http://localhost:4200

## 📊 Mock Data

The application comes with pre-populated mock data:

### Users
- **Transporter**: email: transporter@mounti.com, password: password123
- **Client**: email: client@mounti.com, password: password123

### Trips
- Multiple trips between Tunisia and France
- Various departure dates and availability
- Different pricing structures

### Bookings
- Sample bookings for testing
- Different booking statuses
- Both seat and parcel bookings

## 🔐 Authentication

### JWT Token Authentication
- Login endpoint returns JWT token
- Token must be included in Authorization header
- Token expires after 24 hours

### Sample API Calls
```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"transporter@mounti.com","password":"password123"}'

# Access protected endpoint
curl -X GET http://localhost:8080/api/trips/my \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile

### Trips
- `GET /api/trips` - Get all trips (with filters)
- `POST /api/trips` - Create new trip
- `GET /api/trips/{id}` - Get specific trip
- `GET /api/trips/my` - Get user's trips
- `PUT /api/trips/{id}` - Update trip
- `DELETE /api/trips/{id}` - Delete trip

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my` - Get user's bookings
- `GET /api/bookings/trip/{tripId}` - Get trip bookings
- `PUT /api/bookings/{id}/status` - Update booking status

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/{id}/read` - Mark notification as read

## 🎨 UI Components

### Angular Components
- **Login Component**: User authentication
- **Dashboard Component**: Main user dashboard
- **Trip List Component**: Display and search trips
- **Trip Form Component**: Create/edit trips
- **Booking Component**: Handle bookings
- **Notification Component**: Display notifications

### Styling
- **Angular Material**: UI components
- **Tailwind CSS**: Utility-first CSS framework
- **Mediterranean Theme**: Navy blue, mint green, white
- **Responsive Design**: Mobile-first approach

## 🧪 Testing

### Backend Testing
```bash
cd backend
mvn test
```

### Frontend Testing
```bash
cd frontend
ng test
```

### E2E Testing
```bash
cd frontend
ng e2e
```

## 📱 Mobile Features

- **Responsive Design**: Works on all screen sizes
- **Touch-Friendly**: Optimized for mobile interaction
- **Progressive Web App**: Can be installed on mobile devices
- **Offline Support**: Basic offline functionality

## 🔮 Future Enhancements

- **Real Database**: Replace H2 with PostgreSQL/MySQL
- **Real Authentication**: OAuth2 integration
- **Push Notifications**: Real-time notifications
- **Payment Integration**: Stripe/PayPal integration
- **Location Services**: GPS integration for routes
- **Chat System**: In-app messaging
- **File Upload**: Document/image uploads

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
mvn clean package
java -jar target/mounti-backend-1.0.0.jar
```

### Frontend Deployment
```bash
cd frontend
ng build --prod
# Deploy dist/ folder to web server
```

## 📄 License

MIT License - feel free to use and modify as needed.

---

**Built with Spring Boot + Angular for developers who prefer Java ecosystem** ☕ 🚀