#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Mounti Platform
Tests authentication, trip management, booking system, and notifications
"""

import requests
import json
import uuid
from datetime import datetime, timedelta
import time
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get base URL from frontend .env
BASE_URL = os.getenv('REACT_APP_BACKEND_URL', 'http://localhost:8001') + '/api'

print(f"Testing Mounti Backend API at: {BASE_URL}")
print("=" * 60)

class MountiAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session_token = None
        self.user_data = None
        self.test_results = {
            'auth': {'passed': 0, 'failed': 0, 'errors': []},
            'trips': {'passed': 0, 'failed': 0, 'errors': []},
            'bookings': {'passed': 0, 'failed': 0, 'errors': []},
            'notifications': {'passed': 0, 'failed': 0, 'errors': []}
        }
        
    def log_result(self, category, test_name, success, error_msg=None):
        """Log test results"""
        if success:
            self.test_results[category]['passed'] += 1
            print(f"✅ {test_name}")
        else:
            self.test_results[category]['failed'] += 1
            self.test_results[category]['errors'].append(f"{test_name}: {error_msg}")
            print(f"❌ {test_name}: {error_msg}")
    
    def make_request(self, method, endpoint, data=None, headers=None):
        """Make HTTP request with proper error handling"""
        url = f"{self.base_url}{endpoint}"
        
        # Add authorization header if we have a session token
        if self.session_token and headers is None:
            headers = {"Authorization": f"Bearer {self.session_token}"}
        elif self.session_token and headers:
            headers["Authorization"] = f"Bearer {self.session_token}"
        
        try:
            if method.upper() == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method.upper() == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method.upper() == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            else:
                raise ValueError(f"Unsupported method: {method}")
            
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {str(e)}")
            return None
    
    def test_authentication_system(self):
        """Test Authentication System with Emergent Auth"""
        print("\n🔐 Testing Authentication System")
        print("-" * 40)
        
        # Test 1: Create mock session (simulating Emergent Auth flow)
        print("Testing session creation...")
        mock_session_data = {
            "session_id": f"mock_session_{uuid.uuid4()}"
        }
        
        # Since we can't actually call Emergent Auth in testing, we'll test the endpoint structure
        response = self.make_request('POST', '/auth/session', mock_session_data)
        
        if response is None:
            self.log_result('auth', 'Session Creation Endpoint', False, "Connection failed")
        elif response.status_code == 400:
            # Expected for mock session - endpoint is working
            self.log_result('auth', 'Session Creation Endpoint Structure', True)
        else:
            self.log_result('auth', 'Session Creation Endpoint', False, f"Unexpected status: {response.status_code}")
        
        # Test 2: Create a mock session for testing other endpoints
        print("Creating mock session for testing...")
        # We'll simulate having a valid session by creating mock data
        self.session_token = f"test_token_{uuid.uuid4()}"
        self.user_data = {
            "id": str(uuid.uuid4()),
            "email": "ahmed.ben.salem@email.com",
            "name": "Ahmed Ben Salem",
            "is_transporter": True
        }
        
        # Test 3: Test /auth/me endpoint (will fail without real session, but tests endpoint)
        response = self.make_request('GET', '/auth/me')
        if response and response.status_code == 401:
            self.log_result('auth', 'Protected Endpoint Security', True)
        else:
            self.log_result('auth', 'Protected Endpoint Security', False, "Should return 401 for invalid token")
        
        # Test 4: Test logout endpoint
        response = self.make_request('POST', '/auth/logout')
        if response and response.status_code == 401:
            self.log_result('auth', 'Logout Endpoint Security', True)
        else:
            self.log_result('auth', 'Logout Endpoint Security', False, "Should return 401 for invalid token")
    
    def test_trip_management(self):
        """Test Trip Management CRUD Operations"""
        print("\n🚗 Testing Trip Management System")
        print("-" * 40)
        
        # Test 1: Get all trips (public endpoint)
        print("Testing trip retrieval...")
        response = self.make_request('GET', '/trips')
        
        if response and response.status_code == 200:
            self.log_result('trips', 'Get All Trips', True)
            try:
                trips = response.json()
                if isinstance(trips, list):
                    self.log_result('trips', 'Trip List Format', True)
                else:
                    self.log_result('trips', 'Trip List Format', False, "Response is not a list")
            except json.JSONDecodeError:
                self.log_result('trips', 'Trip Response JSON', False, "Invalid JSON response")
        else:
            error_msg = f"Status: {response.status_code if response else 'Connection failed'}"
            self.log_result('trips', 'Get All Trips', False, error_msg)
        
        # Test 2: Test trip search with filters
        print("Testing trip search with filters...")
        search_params = "?from_location=Tunis&to_location=Paris"
        response = self.make_request('GET', f'/trips{search_params}')
        
        if response and response.status_code == 200:
            self.log_result('trips', 'Trip Search with Filters', True)
        else:
            error_msg = f"Status: {response.status_code if response else 'Connection failed'}"
            self.log_result('trips', 'Trip Search with Filters', False, error_msg)
        
        # Test 3: Test date filter
        tomorrow = (datetime.now() + timedelta(days=1)).isoformat()
        date_params = f"?departure_date={tomorrow}"
        response = self.make_request('GET', f'/trips{date_params}')
        
        if response and response.status_code == 200:
            self.log_result('trips', 'Trip Date Filter', True)
        else:
            error_msg = f"Status: {response.status_code if response else 'Connection failed'}"
            self.log_result('trips', 'Trip Date Filter', False, error_msg)
        
        # Test 4: Test individual trip retrieval
        print("Testing individual trip retrieval...")
        test_trip_id = str(uuid.uuid4())
        response = self.make_request('GET', f'/trips/{test_trip_id}')
        
        if response and response.status_code == 404:
            self.log_result('trips', 'Trip Not Found Handling', True)
        else:
            error_msg = f"Status: {response.status_code if response else 'Connection failed'}"
            self.log_result('trips', 'Trip Not Found Handling', False, error_msg)
        
        # Test 5: Test protected endpoints (should require auth)
        print("Testing protected trip endpoints...")
        
        # Test create trip (should require auth)
        trip_data = {
            "from_location": "Tunis, Tunisia",
            "to_location": "Marseille, France",
            "departure_date": (datetime.now() + timedelta(days=3)).isoformat(),
            "available_seats": 3,
            "available_weight_kg": 20.0,
            "price_per_seat": 150.0,
            "price_per_kg": 5.0,
            "notes": "Direct route via ferry, comfortable journey"
        }
        
        response = self.make_request('POST', '/trips', trip_data)
        if response and response.status_code == 401:
            self.log_result('trips', 'Create Trip Auth Protection', True)
        else:
            error_msg = f"Status: {response.status_code if response else 'Connection failed'}"
            self.log_result('trips', 'Create Trip Auth Protection', False, error_msg)
        
        # Test get my trips (should require auth)
        response = self.make_request('GET', '/trips/my')
        if response and response.status_code == 401:
            self.log_result('trips', 'My Trips Auth Protection', True)
        else:
            error_msg = f"Status: {response.status_code if response else 'Connection failed'}"
            self.log_result('trips', 'My Trips Auth Protection', False, error_msg)
    
    def test_booking_system(self):
        """Test Booking System with Status Management"""
        print("\n📋 Testing Booking System")
        print("-" * 40)
        
        # Test 1: Test create booking (should require auth)
        print("Testing booking creation...")
        booking_data = {
            "trip_id": str(uuid.uuid4()),
            "booking_type": "seat",
            "quantity": 2
        }
        
        response = self.make_request('POST', '/bookings', booking_data)
        if response and response.status_code == 401:
            self.log_result('bookings', 'Create Booking Auth Protection', True)
        else:
            error_msg = f"Status: {response.status_code if response else 'Connection failed'}"
            self.log_result('bookings', 'Create Booking Auth Protection', False, error_msg)
        
        # Test 2: Test parcel booking structure
        parcel_booking_data = {
            "trip_id": str(uuid.uuid4()),
            "booking_type": "parcel",
            "quantity": 5  # 5kg parcel
        }
        
        response = self.make_request('POST', '/bookings', parcel_booking_data)
        if response and response.status_code == 401:
            self.log_result('bookings', 'Create Parcel Booking Auth Protection', True)
        else:
            error_msg = f"Status: {response.status_code if response else 'Connection failed'}"
            self.log_result('bookings', 'Create Parcel Booking Auth Protection', False, error_msg)
        
        # Test 3: Test get my bookings (should require auth)
        print("Testing booking retrieval...")
        response = self.make_request('GET', '/bookings/my')
        if response and response.status_code == 401:
            self.log_result('bookings', 'My Bookings Auth Protection', True)
        else:
            error_msg = f"Status: {response.status_code if response else 'Connection failed'}"
            self.log_result('bookings', 'My Bookings Auth Protection', False, error_msg)
        
        # Test 4: Test get trip bookings (should require auth)
        test_trip_id = str(uuid.uuid4())
        response = self.make_request('GET', f'/bookings/trip/{test_trip_id}')
        if response and response.status_code == 401:
            self.log_result('bookings', 'Trip Bookings Auth Protection', True)
        else:
            error_msg = f"Status: {response.status_code if response else 'Connection failed'}"
            self.log_result('bookings', 'Trip Bookings Auth Protection', False, error_msg)
        
        # Test 5: Test booking status update (should require auth)
        print("Testing booking status management...")
        test_booking_id = str(uuid.uuid4())
        status_data = {"status": "confirmed"}
        
        response = self.make_request('PUT', f'/bookings/{test_booking_id}/status', status_data)
        if response and response.status_code == 401:
            self.log_result('bookings', 'Booking Status Update Auth Protection', True)
        else:
            error_msg = f"Status: {response.status_code if response else 'Connection failed'}"
            self.log_result('bookings', 'Booking Status Update Auth Protection', False, error_msg)
    
    def test_notifications_system(self):
        """Test Notifications System"""
        print("\n🔔 Testing Notifications System")
        print("-" * 40)
        
        # Test 1: Test get notifications (should require auth)
        print("Testing notification retrieval...")
        response = self.make_request('GET', '/notifications')
        if response and response.status_code == 401:
            self.log_result('notifications', 'Get Notifications Auth Protection', True)
        else:
            error_msg = f"Status: {response.status_code if response else 'Connection failed'}"
            self.log_result('notifications', 'Get Notifications Auth Protection', False, error_msg)
        
        # Test 2: Test mark notification as read (should require auth)
        print("Testing notification read status...")
        test_notification_id = str(uuid.uuid4())
        response = self.make_request('PUT', f'/notifications/{test_notification_id}/read')
        if response and response.status_code == 401:
            self.log_result('notifications', 'Mark Notification Read Auth Protection', True)
        else:
            error_msg = f"Status: {response.status_code if response else 'Connection failed'}"
            self.log_result('notifications', 'Mark Notification Read Auth Protection', False, error_msg)
    
    def test_error_handling(self):
        """Test API error handling"""
        print("\n⚠️  Testing Error Handling")
        print("-" * 40)
        
        # Test 1: Invalid endpoint
        response = self.make_request('GET', '/invalid-endpoint')
        if response and response.status_code == 404:
            self.log_result('auth', 'Invalid Endpoint Handling', True)
        else:
            error_msg = f"Status: {response.status_code if response else 'Connection failed'}"
            self.log_result('auth', 'Invalid Endpoint Handling', False, error_msg)
        
        # Test 2: Invalid JSON data
        response = self.make_request('POST', '/auth/session', "invalid-json")
        if response and response.status_code in [400, 422]:
            self.log_result('auth', 'Invalid JSON Handling', True)
        else:
            error_msg = f"Status: {response.status_code if response else 'Connection failed'}"
            self.log_result('auth', 'Invalid JSON Handling', False, error_msg)
    
    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting Mounti Backend API Tests")
        print(f"Target URL: {self.base_url}")
        print("=" * 60)
        
        # Run test suites
        self.test_authentication_system()
        self.test_trip_management()
        self.test_booking_system()
        self.test_notifications_system()
        self.test_error_handling()
        
        # Print summary
        self.print_summary()
    
    def print_summary(self):
        """Print test results summary"""
        print("\n" + "=" * 60)
        print("📊 TEST RESULTS SUMMARY")
        print("=" * 60)
        
        total_passed = 0
        total_failed = 0
        
        for category, results in self.test_results.items():
            passed = results['passed']
            failed = results['failed']
            total_passed += passed
            total_failed += failed
            
            status = "✅ PASS" if failed == 0 else "❌ FAIL"
            print(f"{category.upper():15} | {status} | Passed: {passed:2d} | Failed: {failed:2d}")
            
            # Print errors if any
            if results['errors']:
                for error in results['errors']:
                    print(f"  └─ {error}")
        
        print("-" * 60)
        print(f"TOTAL RESULTS    | Passed: {total_passed:2d} | Failed: {total_failed:2d}")
        
        if total_failed == 0:
            print("🎉 All critical API endpoints are properly structured and secured!")
        else:
            print(f"⚠️  {total_failed} issues found - see details above")
        
        print("=" * 60)
        
        return total_failed == 0

if __name__ == "__main__":
    tester = MountiAPITester()
    success = tester.run_all_tests()
    
    if success:
        print("\n✅ Backend API testing completed successfully!")
        exit(0)
    else:
        print("\n❌ Backend API testing found issues!")
        exit(1)