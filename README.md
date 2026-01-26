# CAN Financial Solutions - Auth Fix Implementation Guide

## Quick Summary

Your application needs 3 things to work correctly:
1. **Middleware** for route protection (NEW FILE)
2. **Auth page** with proper cookie handling (REPLACE FILE)
3. **Updated logout** on all protected pages (MINOR UPDATES)

## ✅ Implementation Checklist

### Step 1: Add Middleware (5 minutes)
**File**: Create `middleware.ts` in your project root

**Location**: `your-project/middleware.ts` (same level as `package.json`)

**Action**: Copy the contents from `middleware.ts` file provided

**What it does**:
- Blocks access to `/dashboard`, `/fna`, `/prospect` without auth
- Automatically redirects to `/auth` if not authenticated
- Runs on every request (Edge runtime on Vercel)

**Testing**:
1. Clear cookies in browser
2. Try to visit `https://canfs.vercel.app/dashboard`
3. Should redirect to `/auth`

---

### Step 2: Update Auth Page (5 minutes)
**File**: `app/auth/page.tsx`

**Action**: Replace entire file with `app-auth-page.tsx`

**Key changes**:
- Sets secure cookie properly (HTTP vs HTTPS)
- Redirects to selected destination after login
- Works in both development and production

**Testing**:
1. Go to `/auth`
2. Enter any credentials
3. Select "Dashboard"
4. Click "Sign In"
5. Should redirect to `/dashboard` immediately

---

### Step 3: Update Prospect Page (10 minutes)
**File**: `app/prospect/page.tsx`

**Option A - Quick Fix**:
Use `SNIPPET-prospect-auth.tsx` to add:
1. Auth checking useEffect at component start
2. Updated logout function
3. New logout button handler

**Option B - Full Replace**:
Create new file using the snippet as reference

**Key changes**:
- Adds cookie check on page load
- Logout now clears cookie before redirect
- Consistent with other pages

**Testing**:
1. Go to `/prospect` when logged in
2. Click "Logout"
3. Should redirect to `/auth`
4. Try accessing `/prospect` again
5. Should redirect to `/auth` (not logged in)

---

### Step 4: Verify Dashboard (2 minutes)
**File**: `app/dashboard/page.tsx`

**Status**: ✅ Already correct!

**Verification**:
- Has `hasAuthCookie()` function? ✅
- Has `clearAuthCookie()` function? ✅
- Logout calls `clearAuthCookie()`? ✅
- Has auth check in useEffect? ✅

**No changes needed** - your dashboard is already implementing the auth correctly.

---

### Step 5: Verify FNA Page (2 minutes)
**File**: `app/fna/page.tsx`

**Status**: ⚠️ Almost correct (1 small fix)

**Action**: Add `clearAuthCookie()` to logout function

**Location**: Around line 604-610

**Change**:
```typescript
// BEFORE:
async function logout() {
  try {
    await supabase().auth.signOut();
  } finally {
    router.replace("/auth");
  }
}

// AFTER:
async function logout() {
  try {
    await supabase().auth.signOut();
  } finally {
    clearAuthCookie(); // ← ADD THIS LINE
    router.replace("/auth");
  }
}
```

Also add the auth utilities at the top of the file (copy from snippet).

**Testing**:
1. Go to `/fna` when logged in
2. Select a client
3. Click "Logout" button
4. Should redirect to `/auth`
5. Try accessing `/fna` again
6. Should redirect to `/auth`

---

## Complete File List

### Files to Create:
1. ✅ `middleware.ts` - NEW (root directory)

### Files to Replace:
2. ✅ `app/auth/page.tsx` - REPLACE with app-auth-page.tsx

### Files to Update (Minor):
3. ⚠️ `app/prospect/page.tsx` - Add auth check + update logout
4. ⚠️ `app/fna/page.tsx` - Add clearAuthCookie() to logout
5. ✅ `app/dashboard/page.tsx` - NO CHANGES (already correct)

---

## Testing Your Implementation

### Test 1: Login Flow
1. Go to `/auth`
2. Enter email: test@test.com, password: anything
3. Select destination: "Dashboard"
4. Click "Sign In"
5. **Expected**: Redirects to `/dashboard` immediately

**Repeat for**:
- FNA destination → Should go to `/fna`
- Prospect destination → Should go to `/prospect`

---

### Test 2: Route Protection
1. Open browser in incognito/private mode
2. Go directly to `/dashboard`
3. **Expected**: Immediately redirects to `/auth`

**Repeat for**:
- `/fna` → Should redirect to `/auth`
- `/prospect` → Should redirect to `/auth`

---

### Test 3: Logout from Dashboard
1. Login and go to `/dashboard`
2. Click "Logout" button in header
3. **Expected**: Redirects to `/auth`
4. Try accessing `/dashboard` again
5. **Expected**: Redirects to `/auth` (you're logged out)

**Repeat for**:
- Logout from `/fna`
- Logout from `/prospect`

---

### Test 4: Vercel Production
1. Deploy to Vercel
2. Repeat all tests above on production URL
3. Verify HTTPS cookies work correctly
4. Check middleware runs (Vercel Edge logs)

---

## Troubleshooting

### Problem: "Middleware not working"
**Symptom**: Can access `/dashboard` without logging in

**Solutions**:
1. Check middleware.ts is in **root directory** (not in `app/`)
2. Restart dev server: `npm run dev`
3. Check file is named exactly `middleware.ts` (not `middleware.tsx`)
4. Verify matcher config is correct

---

### Problem: "Logout button not working"
**Symptom**: Click logout but stay on same page

**Solutions**:
1. Check browser console for errors
2. Verify `clearAuthCookie()` function exists
3. Check `router.replace("/auth")` is called
4. Look for JavaScript errors preventing function execution

---

### Problem: "Infinite redirect loop"
**Symptom**: Page keeps redirecting between `/auth` and `/dashboard`

**Solutions**:
1. Check middleware matcher doesn't include `/auth`
2. Verify cookie is being set correctly on login
3. Check browser doesn't block cookies
4. Clear all cookies and try again

---

### Problem: "Works locally but not on Vercel"
**Symptom**: Auth works in dev, fails in production

**Solutions**:
1. Check `middleware.ts` is committed to git
2. Verify Vercel deployed the middleware (check deployment logs)
3. Check cookie `secure` flag (HTTPS required in production)
4. Look at Vercel Function logs for errors

---

## Security Notes

### Current Implementation
- Uses simple cookie (`canfs_auth=true`)
- 24-hour expiration
- SameSite=Lax protection
- Secure flag on HTTPS

### Recommended for Production
- Replace with proper JWT tokens
- Add server-side session validation
- Implement CSRF protection
- Add rate limiting on auth endpoints
- Use environment variables for secrets
- Add password hashing (currently accepts any password)

---

## Quick Reference

### Cookie Details
- **Name**: `canfs_auth`
- **Value**: `true` (when authenticated)
- **Expiration**: 24 hours (86400 seconds)
- **Path**: `/` (all routes)
- **SameSite**: `Lax`
- **Secure**: Yes (on HTTPS only)

### Protected Routes
- `/dashboard` and `/dashboard/*`
- `/fna` and `/fna/*`
- `/prospect` and `/prospect/*`

### Public Routes
- `/auth` (login page)
- Any other routes not in protected list

---

## Support & Next Steps

### After Implementation:
1. Test all flows locally
2. Deploy to Vercel
3. Test on production
4. Monitor for issues

### Future Enhancements:
1. Add "Remember Me" checkbox (longer cookie expiration)
2. Add "Forgot Password" flow
3. Implement real password validation
4. Add user roles/permissions
5. Add session timeout warnings
6. Implement refresh tokens

---

## Contact & Feedback

If you encounter issues:
1. Check browser console for errors
2. Check Network tab for failed requests
3. Verify cookies in Application tab
4. Review Vercel deployment logs

For additional support, provide:
- Browser console errors
- Network request details
- Steps to reproduce
- Expected vs actual behavior
