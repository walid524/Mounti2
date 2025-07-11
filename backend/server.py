from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timedelta
import requests
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="Mounti API", description="Smart parcel and passenger delivery platform")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

security = HTTPBearer()

# Pydantic Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    picture: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_transporter: bool = False

class Trip(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    transporter_id: str
    transporter_name: str
    from_location: str
    to_location: str
    departure_date: datetime
    available_seats: int
    available_weight_kg: float
    price_per_seat: float
    price_per_kg: float
    notes: Optional[str] = None
    status: str = "active"  # active, completed, cancelled
    created_at: datetime = Field(default_factory=datetime.utcnow)

class TripCreate(BaseModel):
    from_location: str
    to_location: str
    departure_date: datetime
    available_seats: int
    available_weight_kg: float
    price_per_seat: float
    price_per_kg: float
    notes: Optional[str] = None

class Booking(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    trip_id: str
    client_id: str
    client_name: str
    booking_type: str  # "seat" or "parcel"
    quantity: int  # number of seats or weight in kg
    total_price: float
    status: str = "pending"  # pending, confirmed, cancelled
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BookingCreate(BaseModel):
    trip_id: str
    booking_type: str  # "seat" or "parcel"
    quantity: int

class Notification(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    message: str
    type: str  # "booking_request", "booking_confirmed", "trip_update"
    read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Session management
sessions = {}

# Authentication helpers
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    session_token = credentials.credentials
    if session_token not in sessions:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    user_id = sessions[session_token]
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return User(**user)

# Authentication endpoints
@api_router.post("/auth/session")
async def create_session(request: Request):
    """Handle session creation from Emergent Auth"""
    body = await request.json()
    session_id = body.get("session_id")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID required")
    
    # Call Emergent Auth API
    try:
        response = requests.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Invalid session")
        
        user_data = response.json()
        
        # Check if user exists
        existing_user = await db.users.find_one({"email": user_data["email"]})
        
        if not existing_user:
            # Create new user
            user = User(
                email=user_data["email"],
                name=user_data["name"],
                picture=user_data.get("picture")
            )
            await db.users.insert_one(user.dict())
        else:
            user = User(**existing_user)
        
        # Create session
        session_token = str(uuid.uuid4())
        sessions[session_token] = user.id
        
        return {
            "session_token": session_token,
            "user": user.dict(),
            "expires_at": (datetime.utcnow() + timedelta(days=7)).isoformat()
        }
        
    except requests.RequestException:
        raise HTTPException(status_code=500, detail="Authentication service unavailable")

@api_router.get("/auth/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@api_router.post("/auth/logout")
async def logout(credentials: HTTPAuthorizationCredentials = Depends(security)):
    session_token = credentials.credentials
    if session_token in sessions:
        del sessions[session_token]
    return {"message": "Logged out successfully"}

# Trip endpoints
@api_router.post("/trips", response_model=Trip)
async def create_trip(trip_data: TripCreate, current_user: User = Depends(get_current_user)):
    trip = Trip(
        transporter_id=current_user.id,
        transporter_name=current_user.name,
        **trip_data.dict()
    )
    await db.trips.insert_one(trip.dict())
    return trip

@api_router.get("/trips", response_model=List[Trip])
async def get_trips(
    from_location: Optional[str] = None,
    to_location: Optional[str] = None,
    departure_date: Optional[str] = None
):
    query = {"status": "active"}
    
    if from_location:
        query["from_location"] = {"$regex": from_location, "$options": "i"}
    if to_location:
        query["to_location"] = {"$regex": to_location, "$options": "i"}
    if departure_date:
        # Parse date and create range for the day
        try:
            date = datetime.fromisoformat(departure_date.replace('Z', '+00:00'))
            start_date = date.replace(hour=0, minute=0, second=0, microsecond=0)
            end_date = start_date + timedelta(days=1)
            query["departure_date"] = {"$gte": start_date, "$lt": end_date}
        except ValueError:
            pass
    
    trips = await db.trips.find(query).to_list(1000)
    return [Trip(**trip) for trip in trips]

@api_router.get("/trips/my", response_model=List[Trip])
async def get_my_trips(current_user: User = Depends(get_current_user)):
    trips = await db.trips.find({"transporter_id": current_user.id}).to_list(1000)
    return [Trip(**trip) for trip in trips]

@api_router.get("/trips/{trip_id}", response_model=Trip)
async def get_trip(trip_id: str):
    trip = await db.trips.find_one({"id": trip_id})
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return Trip(**trip)

# Booking endpoints
@api_router.post("/bookings", response_model=Booking)
async def create_booking(booking_data: BookingCreate, current_user: User = Depends(get_current_user)):
    # Get trip details
    trip = await db.trips.find_one({"id": booking_data.trip_id})
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    
    trip_obj = Trip(**trip)
    
    # Calculate price
    if booking_data.booking_type == "seat":
        total_price = booking_data.quantity * trip_obj.price_per_seat
        if booking_data.quantity > trip_obj.available_seats:
            raise HTTPException(status_code=400, detail="Not enough seats available")
    else:  # parcel
        total_price = booking_data.quantity * trip_obj.price_per_kg
        if booking_data.quantity > trip_obj.available_weight_kg:
            raise HTTPException(status_code=400, detail="Not enough weight capacity available")
    
    # Create booking
    booking = Booking(
        trip_id=booking_data.trip_id,
        client_id=current_user.id,
        client_name=current_user.name,
        booking_type=booking_data.booking_type,
        quantity=booking_data.quantity,
        total_price=total_price
    )
    
    await db.bookings.insert_one(booking.dict())
    
    # Create notification for transporter
    notification = Notification(
        user_id=trip_obj.transporter_id,
        title="New Booking Request",
        message=f"{current_user.name} wants to book {booking_data.quantity} {booking_data.booking_type}(s) for your trip from {trip_obj.from_location} to {trip_obj.to_location}",
        type="booking_request"
    )
    await db.notifications.insert_one(notification.dict())
    
    return booking

@api_router.get("/bookings/my", response_model=List[Booking])
async def get_my_bookings(current_user: User = Depends(get_current_user)):
    bookings = await db.bookings.find({"client_id": current_user.id}).to_list(1000)
    return [Booking(**booking) for booking in bookings]

@api_router.get("/bookings/trip/{trip_id}", response_model=List[Booking])
async def get_trip_bookings(trip_id: str, current_user: User = Depends(get_current_user)):
    # Verify user owns the trip
    trip = await db.trips.find_one({"id": trip_id, "transporter_id": current_user.id})
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found or not authorized")
    
    bookings = await db.bookings.find({"trip_id": trip_id}).to_list(1000)
    return [Booking(**booking) for booking in bookings]

@api_router.put("/bookings/{booking_id}/status")
async def update_booking_status(booking_id: str, status: str, current_user: User = Depends(get_current_user)):
    booking = await db.bookings.find_one({"id": booking_id})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    booking_obj = Booking(**booking)
    
    # Check if user is authorized to update this booking
    trip = await db.trips.find_one({"id": booking_obj.trip_id})
    if not trip or trip["transporter_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this booking")
    
    # Update booking status
    await db.bookings.update_one(
        {"id": booking_id},
        {"$set": {"status": status}}
    )
    
    # Create notification for client
    notification = Notification(
        user_id=booking_obj.client_id,
        title="Booking Status Updated",
        message=f"Your booking has been {status}",
        type="booking_confirmed"
    )
    await db.notifications.insert_one(notification.dict())
    
    return {"message": "Booking status updated successfully"}

# Notification endpoints
@api_router.get("/notifications", response_model=List[Notification])
async def get_notifications(current_user: User = Depends(get_current_user)):
    notifications = await db.notifications.find({"user_id": current_user.id}).sort("created_at", -1).to_list(1000)
    return [Notification(**notification) for notification in notifications]

@api_router.put("/notifications/{notification_id}/read")
async def mark_notification_read(notification_id: str, current_user: User = Depends(get_current_user)):
    await db.notifications.update_one(
        {"id": notification_id, "user_id": current_user.id},
        {"$set": {"read": True}}
    )
    return {"message": "Notification marked as read"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()