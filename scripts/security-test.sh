#!/bin/bash

# Security Test Script for BD APIs
# This script tests various security features implemented in the application

set -e

API_URL="http://localhost:3000"
TEST_RESULTS_FILE="security-test-results.log"

echo "🔒 Starting Security Tests for BD APIs" > $TEST_RESULTS_FILE
echo "=======================================" >> $TEST_RESULTS_FILE
echo "Test started at: $(date)" >> $TEST_RESULTS_FILE
echo "" >> $TEST_RESULTS_FILE

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to log test results
log_test() {
    local test_name="$1"
    local status="$2"
    local details="$3"
    
    echo -e "${BLUE}Testing: ${test_name}${NC}"
    echo "[$status] $test_name: $details" >> $TEST_RESULTS_FILE
    
    if [ "$status" = "PASS" ]; then
        echo -e "${GREEN}✅ PASS${NC}: $details"
    elif [ "$status" = "FAIL" ]; then
        echo -e "${RED}❌ FAIL${NC}: $details"
    else
        echo -e "${YELLOW}⚠️  WARN${NC}: $details"
    fi
    echo ""
}

# Function to check if server is running
check_server() {
    if curl -s "$API_URL/health" > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

echo "🔒 BD APIs Security Test Suite"
echo "=============================="
echo ""

# Check if server is running
echo "🚀 Checking if server is running..."
if check_server; then
    log_test "Server Health Check" "PASS" "Server is running and responding"
else
    echo -e "${RED}❌ Server is not running. Please start the server first with: npm start${NC}"
    echo "Exiting security tests..."
    exit 1
fi

# Test 1: Health Endpoint
echo "🏥 Testing Health Endpoint..."
HEALTH_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/health_response.json "$API_URL/health")
if [ "$HEALTH_RESPONSE" = "200" ]; then
    HEALTH_DATA=$(cat /tmp/health_response.json)
    log_test "Health Endpoint" "PASS" "Returns 200 OK with status data: $HEALTH_DATA"
else
    log_test "Health Endpoint" "FAIL" "Expected 200, got $HEALTH_RESPONSE"
fi

# Test 2: Security Headers
echo "🛡️  Testing Security Headers..."
HEADERS=$(curl -s -I "$API_URL/health")

# Check for specific security headers
if echo "$HEADERS" | grep -qi "x-content-type-options"; then
    log_test "X-Content-Type-Options Header" "PASS" "Header present"
else
    log_test "X-Content-Type-Options Header" "FAIL" "Header missing"
fi

if echo "$HEADERS" | grep -qi "x-frame-options"; then
    log_test "X-Frame-Options Header" "PASS" "Header present"
else
    log_test "X-Frame-Options Header" "FAIL" "Header missing"
fi

if echo "$HEADERS" | grep -qi "content-security-policy"; then
    log_test "Content-Security-Policy Header" "PASS" "Header present"
else
    log_test "Content-Security-Policy Header" "FAIL" "Header missing"
fi

# Test 3: Input Sanitization
echo "🧹 Testing Input Sanitization..."
XSS_PAYLOAD="<script>alert('xss')</script>"
SQL_PAYLOAD="'; DROP TABLE divisions; --"

# Test XSS protection
XSS_RESPONSE=$(curl -s "$API_URL/api/v1.1/divisions?test=$XSS_PAYLOAD")
if echo "$XSS_RESPONSE" | grep -q "<script>"; then
    log_test "XSS Protection" "FAIL" "XSS payload not sanitized"
else
    log_test "XSS Protection" "PASS" "XSS payload sanitized or blocked"
fi

# Test SQL injection protection (via input sanitization)
SQL_RESPONSE=$(curl -s "$API_URL/api/v1.1/divisions?test=$SQL_PAYLOAD")
if echo "$SQL_RESPONSE" | grep -q "DROP TABLE"; then
    log_test "SQL Injection Protection" "FAIL" "SQL payload not sanitized"
else
    log_test "SQL Injection Protection" "PASS" "SQL payload sanitized or blocked"
fi

# Test 4: Rate Limiting
echo "⏱️  Testing Rate Limiting..."
echo "Making rapid requests to test rate limiting..."

RATE_LIMIT_TRIGGERED=false
for i in {1..15}; do
    RESPONSE_CODE=$(curl -s -w "%{http_code}" -o /dev/null "$API_URL/api/v1.1/divisions")
    if [ "$RESPONSE_CODE" = "429" ]; then
        RATE_LIMIT_TRIGGERED=true
        break
    fi
    sleep 0.1
done

if [ "$RATE_LIMIT_TRIGGERED" = true ]; then
    log_test "Rate Limiting" "PASS" "Rate limit triggered after multiple requests"
else
    log_test "Rate Limiting" "WARN" "Rate limit not triggered in 15 requests (may need more requests)"
fi

# Test 5: Error Handling
echo "🚨 Testing Error Handling..."
ERROR_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/error_response.json "$API_URL/nonexistent-endpoint")
if [ "$ERROR_RESPONSE" = "404" ]; then
    ERROR_DATA=$(cat /tmp/error_response.json 2>/dev/null || echo "No response body")
    log_test "404 Error Handling" "PASS" "Returns proper 404 status"
    
    # Check if error response doesn't leak sensitive information
    if echo "$ERROR_DATA" | grep -qi "stack\|prisma\|database"; then
        log_test "Error Information Disclosure" "FAIL" "Error response may leak sensitive information"
    else
        log_test "Error Information Disclosure" "PASS" "Error response doesn't leak sensitive information"
    fi
else
    log_test "404 Error Handling" "FAIL" "Expected 404, got $ERROR_RESPONSE"
fi

# Test 6: CORS Headers
echo "🌐 Testing CORS Configuration..."
CORS_HEADERS=$(curl -s -I "$API_URL/api/v1.1/divisions")
if echo "$CORS_HEADERS" | grep -qi "access-control-allow-origin"; then
    log_test "CORS Headers" "PASS" "CORS headers present"
else
    log_test "CORS Headers" "FAIL" "CORS headers missing"
fi

# Test 7: API Functionality
echo "🔌 Testing API Functionality..."
API_RESPONSE=$(curl -s -w "%{http_code}" -o /tmp/api_response.json "$API_URL/api/v1.1/divisions")
if [ "$API_RESPONSE" = "200" ]; then
    API_DATA=$(cat /tmp/api_response.json)
    if echo "$API_DATA" | grep -q "divisions\|data"; then
        log_test "API Functionality" "PASS" "API returns expected data structure"
    else
        log_test "API Functionality" "WARN" "API response format may be unexpected"
    fi
else
    log_test "API Functionality" "FAIL" "API not responding correctly (HTTP $API_RESPONSE)"
fi

# Test 8: Database File Permissions (if accessible)
echo "📁 Testing Database Security..."
DB_PATH="./prisma/dev.db"
if [ -f "$DB_PATH" ]; then
    DB_PERMS=$(ls -la "$DB_PATH" | cut -d' ' -f1)
    if [[ "$DB_PERMS" == *"rw-------"* ]] || [[ "$DB_PERMS" == *"600"* ]]; then
        log_test "Database File Permissions" "PASS" "Database file has secure permissions ($DB_PERMS)"
    else
        log_test "Database File Permissions" "WARN" "Database file permissions may be too permissive ($DB_PERMS)"
    fi
else
    log_test "Database File Permissions" "WARN" "Database file not found at expected location"
fi

# Cleanup temporary files
rm -f /tmp/health_response.json /tmp/error_response.json /tmp/api_response.json

# Generate summary
echo "" >> $TEST_RESULTS_FILE
echo "Test completed at: $(date)" >> $TEST_RESULTS_FILE
echo "" >> $TEST_RESULTS_FILE

PASS_COUNT=$(grep -c "\[PASS\]" $TEST_RESULTS_FILE || echo "0")
FAIL_COUNT=$(grep -c "\[FAIL\]" $TEST_RESULTS_FILE || echo "0")
WARN_COUNT=$(grep -c "\[WARN\]" $TEST_RESULTS_FILE || echo "0")

echo "📊 Security Test Summary"
echo "======================="
echo -e "${GREEN}✅ Passed: $PASS_COUNT${NC}"
echo -e "${RED}❌ Failed: $FAIL_COUNT${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARN_COUNT${NC}"
echo ""
echo "📋 Detailed results saved to: $TEST_RESULTS_FILE"
echo ""

if [ "$FAIL_COUNT" -gt 0 ]; then
    echo -e "${RED}🚨 Some security tests failed. Please review the results and fix the issues.${NC}"
    exit 1
else
    echo -e "${GREEN}🎉 All critical security tests passed!${NC}"
    if [ "$WARN_COUNT" -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Please review the warnings for potential improvements.${NC}"
    fi
fi
