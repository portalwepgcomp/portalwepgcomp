# Quick Testing Guide: Enhanced Role Management System

## 🚀 Fast Track Testing - 20 Minutes

This guide provides essential tests to quickly verify the enhanced role management system with `isTeacherActive`, `isAdmin`, and `isSuperadmin` features.

## Prerequisites (2 minutes)

```bash
# 1. Start backend server
cd /home/elis/Projects/UFBA/portalwepgcomp-1/backend
npm run start:dev

# 2. Ensure database is running and migrated
npx prisma migrate deploy
```

**You need:**
- 1 Superadmin user token 🔑
- 1 Regular professor user ID to test with 👤

## Core Tests (15 minutes)

### ✅ Test 1: Verify New Fields in User Response (1 min)
```bash
# Get any user and check response includes new fields
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3001/users

# ✓ Look for: "isTeacherActive": false, "isAdmin": false, "isSuperadmin": false
```

### ✅ Test 2: Teacher Approval Flow (3 mins)
```bash
# Step 1: Approve a teacher
curl -X PATCH \
     -H "Authorization: Bearer SUPERADMIN_TOKEN" \
     http://localhost:3001/users/PROFESSOR_ID/approve

# ✓ Expected: "isTeacherActive": true in response
# ✓ Status: 200 OK
```

### ✅ Test 3: Admin Promotion Flow (3 mins)
```bash
# Step 2: Promote approved teacher to admin
curl -X PATCH \
     -H "Authorization: Bearer SUPERADMIN_TOKEN" \
     http://localhost:3001/users/PROFESSOR_ID/promote-admin

# ✓ Expected: "isAdmin": true, "level": "Admin"
# ✓ Status: 200 OK
```

### ✅ Test 4: Superadmin Promotion Flow (3 mins)
```bash
# Step 3: Promote admin to superadmin
curl -X PATCH \
     -H "Authorization: Bearer SUPERADMIN_TOKEN" \
     http://localhost:3001/users/PROFESSOR_ID/promote-superadmin

# ✓ Expected: "isSuperadmin": true, "level": "Superadmin"
# ✓ Status: 200 OK
```

### ✅ Test 5: Demotion Flow (3 mins)
```bash
# Step 4: Demote user by one level
curl -X PATCH \
     -H "Authorization: Bearer SUPERADMIN_TOKEN" \
     http://localhost:3001/users/PROFESSOR_ID/demote

# ✓ Expected: "isSuperadmin": false, "level": "Admin", "isAdmin": true
# ✓ Status: 200 OK
```

### ✅ Test 6: Authorization Check (2 mins)
```bash
# Test with regular user token (should fail)
curl -X PATCH \
     -H "Authorization: Bearer REGULAR_USER_TOKEN" \
     http://localhost:3001/users/SOME_ID/promote-admin

# ✓ Expected: 403 Forbidden
```

### ✅ Test 5: Database Verification (2 mins)
```bash
# Check database directly
npx prisma studio
# OR use database client to verify:
# SELECT id, email, isTeacherActive, isSuperadmin FROM UserAccount WHERE id = 'TEST_USER_ID';

# ✓ Expected: Values match API responses
```

### ✅ Test 6: Frontend Integration Check (1 min)
```bash
# Start frontend (in new terminal)
cd /home/elis/Projects/UFBA/portalwepgcomp-1/frontend
npm run dev

# Visit: http://localhost:3000
# Login as admin and check user management page
# ✓ Expected: Can see new user status/permissions
```

## Quick Validation Checklist

| Feature | Test | Status | Notes |
|---------|------|--------|-------|
| New Fields | User API returns `isTeacherActive` & `isSuperadmin` | ☐ | |
| Teacher Approval | `PATCH /users/:id/approve` works | ☐ | |
| Superadmin Promotion | `PATCH /users/:id/promote` works | ☐ | |
| Authorization | Regular users get 403 on admin endpoints | ☐ | |
| Database | New columns exist and update correctly | ☐ | |
| Frontend | UI shows approval options for admins | ☐ | |

## Common Issues & Quick Fixes

### 🔧 Issue: 401 Unauthorized
```bash
# Fix: Check if your token is valid and not expired
# Generate new token by logging in again
```

### 🔧 Issue: 500 Internal Server Error
```bash
# Fix: Check backend logs
npm run start:dev
# Look for database connection or migration issues
```

### 🔧 Issue: User not found (404)
```bash
# Fix: Verify user ID exists
curl -H "Authorization: Bearer TOKEN" http://localhost:3001/users
# Use valid user ID from response
```

### 🔧 Issue: Database connection error
```bash
# Fix: Ensure database is running
# Check your .env file for correct DATABASE_URL
```

## Success Criteria (1 min verification)

**✅ All tests pass if:**
1. API endpoints return 200 status codes
2. Response includes new boolean fields
3. Database values update correctly
4. Authorization works (403 for unauthorized users)
5. Frontend shows appropriate controls for admins

## Sample Valid Test Data

```json
// Before approval
{
  "id": "user-123",
  "email": "test@ufba.br",
  "level": "Default",
  "isTeacherActive": false,
  "isSuperadmin": false
}

// After teacher approval
{
  "id": "user-123", 
  "email": "test@ufba.br",
  "level": "Default",
  "isTeacherActive": true,
  "isSuperadmin": false
}

// After superadmin promotion
{
  "id": "user-123",
  "email": "test@ufba.br", 
  "level": "Superadmin",
  "isTeacherActive": true,
  "isSuperadmin": true
}
```

## Emergency Rollback

If tests fail and you need to rollback:

```bash
# Reset user state in database
npx prisma studio
# OR SQL:
# UPDATE UserAccount SET isTeacherActive = false, isSuperadmin = false WHERE id = 'problem_user_id';
```

## Next Steps

- ✅ **If all tests pass**: Move to comprehensive testing
- ❌ **If tests fail**: Check logs and fix issues before proceeding
- 🔄 **Partial success**: Review failed tests in comprehensive guide

---

**Time to complete: ~15 minutes**  
**Confidence level after passing: Ready for production testing** 🚀
