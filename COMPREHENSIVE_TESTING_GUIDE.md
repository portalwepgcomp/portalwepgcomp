# Comprehensive Testing Guide: Teacher Approval & Superadmin System

This guide provides detailed testing procedures for the new `isTeacherActive` and `isSuperadmin` features in the WEPGCOMP portal.

## Overview of Changes

### Backend Changes
- **New Fields**: Added `isTeacherActive` and `isSuperadmin` boolean fields to the `UserAccount` model
- **New Endpoints**: 
  - `PATCH /users/:id/approve` - Approve teacher status
  - `PATCH /users/:id/promote` - Promote to superadmin
- **Updated Response**: `ResponseUserDto` now includes both new fields
- **Authorization**: Role-based access control implemented

### Database Schema
```sql
-- New columns in UserAccount table
isTeacherActive  Boolean @default(false)
isSuperadmin     Boolean @default(false)
```

## Testing Prerequisites

### 1. Environment Setup
```bash
# Navigate to backend
cd /home/elis/Projects/UFBA/portalwepgcomp-1/backend

# Install dependencies
npm install

# Run database migrations
npx prisma migrate deploy

# Start the backend server
npm run start:dev
```

### 2. Required Test Users
You'll need users with different roles for comprehensive testing:

1. **Superadmin User** (can approve teachers and promote superadmins)
2. **Admin User** (can approve teachers only)
3. **Professor User** (needs teacher approval)
4. **Default User** (regular user)

## Detailed Testing Procedures

### A. Database Verification Tests

#### Test 1: Verify Schema Changes
```bash
# Connect to your database and verify columns exist
npx prisma studio
# OR check directly in database:
# SELECT isTeacherActive, isSuperadmin FROM UserAccount LIMIT 5;
```

**Expected Results:**
- `isTeacherActive` column exists with default `false`
- `isSuperadmin` column exists with default `false`

#### Test 2: Verify Default Values
Create a new user and check default values:
```bash
# Check any newly created user
# Should have isTeacherActive: false, isSuperadmin: false
```

### B. API Endpoint Testing

#### Test 3: Teacher Approval Endpoint
```bash
# Test as Superadmin approving a teacher
curl -X PATCH http://localhost:3001/users/{USER_ID}/approve \
  -H "Authorization: Bearer {SUPERADMIN_TOKEN}" \
  -H "Content-Type: application/json"
```

**Test Cases:**
1. **Valid Superadmin Token**: ✅ Should succeed
2. **Valid Admin Token**: ✅ Should succeed  
3. **Regular User Token**: ❌ Should return 403 Forbidden
4. **Invalid User ID**: ❌ Should return 404 Not Found
5. **No Authorization**: ❌ Should return 401 Unauthorized

**Expected Response:**
```json
{
  "id": "user-id",
  "name": "User Name",
  "email": "user@ufba.br",
  "isTeacherActive": true,
  "isSuperadmin": false,
  // ... other fields
}
```

#### Test 4: Superadmin Promotion Endpoint
```bash
# Test promoting user to superadmin
curl -X PATCH http://localhost:3001/users/{USER_ID}/promote \
  -H "Authorization: Bearer {SUPERADMIN_TOKEN}" \
  -H "Content-Type: application/json"
```

**Test Cases:**
1. **Valid Superadmin Token**: ✅ Should succeed
2. **Admin Token**: ❌ Should return 403 Forbidden
3. **Regular User Token**: ❌ Should return 403 Forbidden
4. **Invalid User ID**: ❌ Should return 404 Not Found

**Expected Response:**
```json
{
  "id": "user-id",
  "level": "Superadmin",
  "isSuperadmin": true,
  // ... other fields
}
```

### C. User Flow Testing

#### Test 5: Complete Teacher Approval Flow
1. **Create Professor User**:
   ```bash
   POST /users
   {
     "name": "Test Professor",
     "email": "professor.test@ufba.br",
     "profile": "Professor",
     "level": "Default"
   }
   ```

2. **Verify Initial State**:
   - `isTeacherActive`: false
   - `level`: "Default"

3. **Approve Teacher** (as Admin/Superadmin):
   ```bash
   PATCH /users/{id}/approve
   ```

4. **Verify Final State**:
   - `isTeacherActive`: true
   - Teacher can now access teacher-specific features

#### Test 6: Complete Superadmin Promotion Flow
1. **Start with Approved Teacher**
2. **Promote to Superadmin** (as existing Superadmin):
   ```bash
   PATCH /users/{id}/promote
   ```
3. **Verify Final State**:
   - `level`: "Superadmin"
   - `isSuperadmin`: true
   - User can now approve teachers and promote superadmins

### D. Authorization Testing

#### Test 7: Role-Based Access Control
Test each endpoint with different user roles:

| Endpoint | Superadmin | Admin | Professor | Default | Expected |
|----------|------------|-------|-----------|---------|----------|
| GET /users | ✅ | ✅ | ❌ | ❌ | Access control working |
| PATCH /users/:id/approve | ✅ | ✅ | ❌ | ❌ | Admin+ can approve |
| PATCH /users/:id/promote | ✅ | ❌ | ❌ | ❌ | Only Superadmin can promote |

#### Test 8: JWT Token Validation
1. **Valid Token**: All authorized requests succeed
2. **Expired Token**: Returns 401 Unauthorized
3. **Invalid Token**: Returns 401 Unauthorized
4. **Missing Token**: Returns 401 Unauthorized

### E. Integration Testing

#### Test 9: Frontend-Backend Integration
1. **User List Display**: New fields show correctly
2. **Action Buttons**: Appear based on user permissions
3. **State Updates**: UI updates immediately after approval/promotion
4. **Error Handling**: User-friendly error messages display

#### Test 10: Email Notifications (if implemented)
1. **Teacher Approval**: Email sent to newly approved teacher
2. **Superadmin Promotion**: Email sent to newly promoted superadmin

## Performance Testing

### Test 11: Load Testing
```bash
# Test concurrent approvals
for i in {1..10}; do
  curl -X PATCH http://localhost:3001/users/test-user-$i/approve \
    -H "Authorization: Bearer {TOKEN}" &
done
wait
```

### Test 12: Database Performance
- Monitor query execution time for user list with new fields
- Verify indexes on new columns if needed

## Security Testing

### Test 13: SQL Injection Prevention
```bash
# Test with malicious user ID
curl -X PATCH "http://localhost:3001/users/'; DROP TABLE UserAccount; --/approve" \
  -H "Authorization: Bearer {TOKEN}"
```

### Test 14: Cross-Site Request Forgery (CSRF)
Test that endpoints properly validate tokens and don't accept forged requests.

## Error Scenarios Testing

### Test 15: Edge Cases
1. **Approving Already Approved Teacher**: Should succeed gracefully
2. **Promoting Already Superadmin**: Should succeed gracefully
3. **Self-Approval**: User approving themselves (if allowed)
4. **Bulk Operations**: Multiple simultaneous requests

### Test 16: Network Failures
1. **Timeout Scenarios**: Long-running requests
2. **Connection Drops**: Mid-request failures
3. **Retry Logic**: Failed requests retry appropriately

## Regression Testing

### Test 17: Existing Functionality
Verify that adding new fields doesn't break existing features:
1. **User Registration**: Still works correctly
2. **Login/Authentication**: No issues with token generation
3. **Existing User Endpoints**: Still return correct data
4. **Database Queries**: Performance not degraded

## User Acceptance Testing

### Test 18: User Experience Validation
1. **Intuitive UI**: New approval buttons are clear
2. **Feedback**: Users understand what happened after actions
3. **Permissions**: Users see appropriate options based on their role
4. **Mobile Responsiveness**: Works on mobile devices

## Test Data Cleanup

After testing, clean up test data:
```sql
-- Reset test users
UPDATE UserAccount 
SET isTeacherActive = false, isSuperadmin = false 
WHERE email LIKE '%test%';

-- Delete test users if needed
DELETE FROM UserAccount WHERE email LIKE '%test%';
```

## Troubleshooting Common Issues

### Issue 1: 403 Forbidden Errors
- **Cause**: Insufficient permissions
- **Solution**: Verify user has correct role/level
- **Debug**: Check JWT payload for user level

### Issue 2: Database Connection Errors
- **Cause**: Database not running or connection string incorrect
- **Solution**: Verify database status and environment variables

### Issue 3: Token Expiration
- **Cause**: JWT tokens expire after set time
- **Solution**: Generate fresh tokens for testing

## Automated Testing

### Unit Tests
```bash
# Run backend unit tests
npm test

# Run specific test suites
npm test -- user.service.spec.ts
npm test -- user.controller.spec.ts
```

### Integration Tests
```bash
# Run end-to-end tests
npm run test:e2e
```

## Monitoring and Logging

### Production Monitoring
1. **Log Approval Events**: Track who approves whom
2. **Monitor Failed Attempts**: Track unauthorized access attempts
3. **Performance Metrics**: Response times for approval endpoints
4. **Error Rates**: Track and alert on high error rates

## Conclusion

This comprehensive testing ensures the teacher approval and superadmin promotion features work correctly, securely, and provide a good user experience. Regular execution of these tests helps maintain system integrity and catch regressions early.