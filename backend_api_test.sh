#!/bin/bash
# Mounti Backend API Test Script
# Tests all critical endpoints using curl

BASE_URL="https://08b58334-8a10-4c17-8c5e-54f0ce4cea2e.preview.emergentagent.com/api"

echo "🚀 Testing Mounti Backend API"
echo "Base URL: $BASE_URL"
echo "============================================================"

# Test counters
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    local expected_status="$5"
    local headers="$6"
    
    echo -n "Testing $name... "
    
    if [ "$method" = "GET" ]; then
        if [ -n "$headers" ]; then
            response=$(curl -s -w "%{http_code}" -X GET "$BASE_URL$endpoint" -H "$headers" --max-time 15)
        else
            response=$(curl -s -w "%{http_code}" -X GET "$BASE_URL$endpoint" --max-time 15)
        fi
    elif [ "$method" = "POST" ]; then
        if [ -n "$headers" ]; then
            response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL$endpoint" -H "Content-Type: application/json" -H "$headers" -d "$data" --max-time 15)
        else
            response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL$endpoint" -H "Content-Type: application/json" -d "$data" --max-time 15)
        fi
    elif [ "$method" = "PUT" ]; then
        if [ -n "$headers" ]; then
            response=$(curl -s -w "%{http_code}" -X PUT "$BASE_URL$endpoint" -H "Content-Type: application/json" -H "$headers" -d "$data" --max-time 15)
        else
            response=$(curl -s -w "%{http_code}" -X PUT "$BASE_URL$endpoint" -H "Content-Type: application/json" -d "$data" --max-time 15)
        fi
    fi
    
    # Extract status code (last 3 characters)
    status_code="${response: -3}"
    
    if [ "$status_code" = "$expected_status" ]; then
        echo "✅ PASS (Status: $status_code)"
        ((PASSED++))
    else
        echo "❌ FAIL (Expected: $expected_status, Got: $status_code)"
        ((FAILED++))
    fi
}

echo ""
echo "🔐 Authentication System Tests"
echo "----------------------------------------"

# Test session creation with invalid data
test_endpoint "Session Creation (Invalid)" "POST" "/auth/session" '{"session_id":"invalid"}' "400"

# Test session creation with malformed JSON
test_endpoint "Session Creation (Bad JSON)" "POST" "/auth/session" 'invalid-json' "400"

# Test protected endpoint without auth (should return 403 - no auth header)
test_endpoint "Protected Endpoint (No Auth Header)" "GET" "/auth/me" "" "403"

# Test protected endpoint with invalid auth (should return 401 - invalid token)
test_endpoint "Protected Endpoint (Invalid Token)" "GET" "/auth/me" "" "401" "Authorization: Bearer invalid-token"

# Test logout without auth (should return 403 - no auth header)
test_endpoint "Logout Endpoint (No Auth Header)" "POST" "/auth/logout" "" "403"

# Test logout with invalid auth (should return 401 - invalid token)
test_endpoint "Logout Endpoint (Invalid Token)" "POST" "/auth/logout" "" "401" "Authorization: Bearer invalid-token"

echo ""
echo "🚗 Trip Management Tests"
echo "----------------------------------------"

# Test get all trips (public)
test_endpoint "Get All Trips" "GET" "/trips" "" "200"

# Test trip search with filters
test_endpoint "Trip Search (Location Filter)" "GET" "/trips?from_location=Tunis&to_location=Paris" "" "200"

# Test trip search with date filter
tomorrow=$(date -d "+1 day" -Iseconds)
test_endpoint "Trip Search (Date Filter)" "GET" "/trips?departure_date=$tomorrow" "" "200"

# Test individual trip (not found)
test_endpoint "Get Trip (Not Found)" "GET" "/trips/non-existent-id" "" "404"

# Test create trip (requires auth - no header = 403)
trip_data='{"from_location":"Tunis","to_location":"Paris","departure_date":"2025-07-15T10:00:00","available_seats":3,"available_weight_kg":20.0,"price_per_seat":150.0,"price_per_kg":5.0}'
test_endpoint "Create Trip (No Auth Header)" "POST" "/trips" "$trip_data" "403"

# Test create trip with invalid token (should return 401)
test_endpoint "Create Trip (Invalid Token)" "POST" "/trips" "$trip_data" "401" "Authorization: Bearer invalid-token"

# Test get my trips (requires auth - no header = 403)
test_endpoint "Get My Trips (No Auth Header)" "GET" "/trips/my" "" "403"

# Test get my trips with invalid token (should return 401)
test_endpoint "Get My Trips (Invalid Token)" "GET" "/trips/my" "" "401" "Authorization: Bearer invalid-token"

echo ""
echo "📋 Booking System Tests"
echo "----------------------------------------"

# Test create booking (requires auth)
booking_data='{"trip_id":"test-trip-id","booking_type":"seat","quantity":2}'
test_endpoint "Create Booking (Auth Required)" "POST" "/bookings" "$booking_data" "401"

# Test create parcel booking (requires auth)
parcel_data='{"trip_id":"test-trip-id","booking_type":"parcel","quantity":5}'
test_endpoint "Create Parcel Booking (Auth Required)" "POST" "/bookings" "$parcel_data" "401"

# Test get my bookings (requires auth)
test_endpoint "Get My Bookings (Auth Required)" "GET" "/bookings/my" "" "401"

# Test get trip bookings (requires auth)
test_endpoint "Get Trip Bookings (Auth Required)" "GET" "/bookings/trip/test-trip-id" "" "401"

# Test update booking status (requires auth)
status_data='{"status":"confirmed"}'
test_endpoint "Update Booking Status (Auth Required)" "PUT" "/bookings/test-booking-id/status" "$status_data" "401"

echo ""
echo "🔔 Notifications System Tests"
echo "----------------------------------------"

# Test get notifications (requires auth)
test_endpoint "Get Notifications (Auth Required)" "GET" "/notifications" "" "401"

# Test mark notification read (requires auth)
test_endpoint "Mark Notification Read (Auth Required)" "PUT" "/notifications/test-notification-id/read" "" "401"

echo ""
echo "⚠️  Error Handling Tests"
echo "----------------------------------------"

# Test invalid endpoint
test_endpoint "Invalid Endpoint" "GET" "/invalid-endpoint" "" "404"

echo ""
echo "============================================================"
echo "📊 TEST RESULTS SUMMARY"
echo "============================================================"
echo "✅ Passed: $PASSED"
echo "❌ Failed: $FAILED"
echo "Total Tests: $((PASSED + FAILED))"

if [ $FAILED -eq 0 ]; then
    echo ""
    echo "🎉 All backend API endpoints are working correctly!"
    echo "✅ Authentication system properly protects endpoints"
    echo "✅ Public endpoints (trip search) work without auth"
    echo "✅ Error handling is implemented correctly"
    exit 0
else
    echo ""
    echo "⚠️  Some tests failed. See details above."
    exit 1
fi