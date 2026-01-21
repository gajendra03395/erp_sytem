#!/bin/bash

# Employee Credentials API Test Script
# This tests the employee credential management system

echo "🧪 Testing Employee Credentials API"
echo "===================================="
echo ""

# Base URL
BASE_URL="http://localhost:3001"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}1. Testing GET all employees${NC}"
curl -s -X GET "$BASE_URL/api/auth/employees" \
  -H "Content-Type: application/json" | jq '.' || echo "Error in GET request"

echo ""
echo -e "${BLUE}2. Creating a new employee...${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/employees" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test-user@company.com",
    "role": "OPERATOR"
  }')

echo "$RESPONSE" | jq '.'
PASSWORD=$(echo "$RESPONSE" | jq -r '.credential.password')

echo ""
echo -e "${BLUE}3. Testing login with new credentials${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"test-user@company.com\",
    \"password\": \"$PASSWORD\"
  }")

echo "$LOGIN_RESPONSE" | jq '.'
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')

if [ "$TOKEN" != "null" ] && [ ! -z "$TOKEN" ]; then
  echo -e "${GREEN}✅ Login successful!${NC}"
else
  echo -e "${RED}❌ Login failed!${NC}"
fi

echo ""
echo -e "${BLUE}4. Getting all employees again${NC}"
curl -s -X GET "$BASE_URL/api/auth/employees" \
  -H "Content-Type: application/json" | jq '.'

echo ""
echo -e "${BLUE}5. Deleting the test employee${NC}"
DELETE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/api/auth/employees" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test-user@company.com"
  }')

echo "$DELETE_RESPONSE" | jq '.'

echo ""
echo -e "${BLUE}6. Verifying deletion${NC}"
curl -s -X GET "$BASE_URL/api/auth/employees" \
  -H "Content-Type: application/json" | jq '.credentials[] | {name, email}'

echo ""
echo -e "${GREEN}✅ All tests completed!${NC}"
