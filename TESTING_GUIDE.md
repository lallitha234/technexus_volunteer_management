# Quick Start - Testing All Admin Features

## Starting the Application

### 1. Start Backend Server
```bash
cd backend
npm start
# Server runs on http://localhost:3000
```

### 2. Start Frontend Server
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

### 3. Access the Application
Open browser and go to: `http://localhost:5173`

---

## Login

**Email:** Use your admin email
**Password:** Use your admin password

After login, you'll be redirected to the Dashboard.

---

## Feature Testing Checklist

### ✅ Dashboard (`http://localhost:5173/dashboard`)
- [ ] See KPI cards with volunteer stats
- [ ] Refresh button updates analytics
- [ ] Quick action buttons are clickable
- [ ] Admin tips display correctly
- [ ] Resource links are visible
- [ ] System status shows "Running" & "Connected"

### ✅ Volunteers (`http://localhost:5173/volunteers`)
- [ ] List shows existing volunteers
- [ ] Search functionality works
- [ ] Filter by status changes list
- [ ] Volunteer cards display stats
- [ ] Pagination works if more than 12 volunteers

### ✅ Create Volunteer (`http://localhost:5173/volunteers/new`)
- [ ] Fill all required fields (Full Name, Email)
- [ ] Select skills and interests
- [ ] Choose availability
- [ ] Accept consent
- [ ] Click "Create Volunteer"
- [ ] Redirected back to volunteers list
- [ ] New volunteer appears in list

### ✅ Edit Volunteer (`http://localhost:5173/volunteers/[id]/edit`)
- [ ] Click "Edit" on volunteer card
- [ ] Update profile information
- [ ] Change skills/interests
- [ ] Modify availability
- [ ] Click "Save Changes"
- [ ] Changes are saved successfully

### ✅ Events (`http://localhost:5173/events`)
- [ ] List shows existing events
- [ ] Filter by status works
- [ ] Event details display correctly
- [ ] Event categories show as tags
- [ ] Action buttons are available

### ✅ Create Event (`http://localhost:5173/events/new`)
- [ ] Fill event title (required)
- [ ] Enter start date/time (required)
- [ ] Enter end date/time (required)
- [ ] Add location address (optional)
- [ ] Add GPS coordinates (optional)
- [ ] Set estimated volunteers
- [ ] Select event categories
- [ ] Click "Create Event"
- [ ] Redirected back to events list
- [ ] Event appears as draft

### ✅ Publish Event
- [ ] Filter events to "Draft" status
- [ ] Click "Publish" button
- [ ] Event status changes to "Published"
- [ ] Event now has different action buttons

### ✅ Tasks (`http://localhost:5173/tasks`)
- [ ] List shows pending and completed tasks
- [ ] Filter by status works
- [ ] Priority colors display correctly (Red/Yellow/Green)
- [ ] Due dates show correctly
- [ ] "Mark Done" button works for pending tasks

### ✅ Messages (`http://localhost:5173/messages`)
- [ ] Message composer is visible
- [ ] Type a test message
- [ ] Click "Send to All"
- [ ] Message appears in history
- [ ] Timestamp is displayed

### ✅ Settings (`http://localhost:5173/settings`)
- [ ] Account email displays
- [ ] Role shows "Admin"
- [ ] Notification toggles work
- [ ] "Export All Data" button is clickable
- [ ] System info displays
- [ ] Help links are visible
- [ ] Logout button works

### ✅ Navigation
- [ ] Sidebar icons are colored correctly
- [ ] Click sidebar icons navigate to pages
- [ ] Active page icon is highlighted
- [ ] Back buttons work
- [ ] Breadcrumbs navigate correctly

### ✅ Responsiveness
- [ ] Test on desktop (1280px+)
- [ ] Test on tablet (768px)
- [ ] Test on mobile (375px)
- [ ] Sidebar hides on small screens
- [ ] Layout adjusts properly

### ✅ Forms & Validation
- [ ] Required fields show error if empty
- [ ] Email validation works
- [ ] Date validation works (end after start)
- [ ] Success messages appear
- [ ] Error messages display

### ✅ UI/UX
- [ ] Loading states work (spinners)
- [ ] Hover effects on buttons
- [ ] Smooth transitions between pages
- [ ] Colors are consistent
- [ ] Text is readable

---

## Recommended Testing Workflow

### Step 1: Setup Data
1. Create 3-5 test volunteers with different skills
2. Create 2-3 test events with different statuses
3. Create some test tasks

### Step 2: Test Core Workflows
1. Create new volunteer → Edit → Delete
2. Create event → Publish → Cancel
3. Send message → View history
4. Complete a task

### Step 3: Test Filters & Search
1. Search volunteers by name
2. Filter volunteers by status
3. Filter events by status
4. Filter tasks by status

### Step 4: Test Admin Features
1. Check dashboard analytics update
2. Export data
3. View system status
4. Change notification preferences

### Step 5: Test on Different Devices
1. Desktop browser
2. Mobile device (or browser zoom)
3. Tablet view
4. Different browsers

---

## Expected Results

### Each Feature Should:
- ✓ Load without errors
- ✓ Display data correctly
- ✓ Handle user input
- ✓ Show success/error messages
- ✓ Navigate properly
- ✓ Update data in database
- ✓ Work on mobile devices

### No Errors Should:
- ❌ Console errors
- ❌ TypeScript errors
- ❌ API errors (should show user-friendly messages)
- ❌ Navigation breaks
- ❌ Lost form data

---

## Troubleshooting

### If page doesn't load:
1. Check server is running (`npm start` for backend)
2. Check dev server is running (`npm run dev` for frontend)
3. Clear browser cache (Ctrl+Shift+Delete)
4. Check browser console for errors

### If API calls fail:
1. Ensure backend is running on port 3000
2. Check database connection
3. Verify Supabase credentials
4. Check network tab in browser dev tools

### If form doesn't submit:
1. Check all required fields are filled
2. Look for error message on page
3. Check browser console for errors
4. Verify email/date formats

### If sidebar doesn't show:
1. This is normal on mobile (hidden by design)
2. Check at tablet/desktop size
3. Make sure you're logged in (not on login page)

---

## Quick Commands

### Frontend Commands
```bash
cd frontend

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check for TypeScript errors
npm run type-check

# Format code
npm run format

# Lint code
npm run lint
```

### Backend Commands
```bash
cd backend

# Start server
npm start

# Start with nodemon (auto-restart)
npm run dev

# Check TypeScript
npm run type-check

# Run migrations
npm run migrate
```

---

## API Testing

### Test API directly with curl:
```bash
# Get all volunteers
curl http://localhost:3000/volunteers

# Create volunteer
curl -X POST http://localhost:3000/volunteers \
  -H "Content-Type: application/json" \
  -d '{"full_name":"John Doe","email":"john@example.com",...}'

# Get dashboard analytics
curl http://localhost:3000/analytics/summary
```

---

## Performance Testing

### Check Performance:
1. Open DevTools (F12)
2. Go to Performance tab
3. Click record
4. Perform actions
5. Click stop
6. Analyze results

Expected metrics:
- Page load: < 2 seconds
- First contentful paint: < 1 second
- Interactions: < 200ms
- No layout shifts

---

## Browser Compatibility

### Tested On:
- ✅ Chrome 120+
- ✅ Firefox 120+
- ✅ Safari 17+
- ✅ Edge 120+
- ✅ Mobile Chrome
- ✅ Mobile Safari

### Not Tested On:
- ❌ IE 11 (not supported)
- ❌ Older versions of browsers

---

## Final Checklist Before Deployment

- [ ] All features tested
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] All forms validate
- [ ] API calls work
- [ ] Mobile responsive
- [ ] Performance acceptable
- [ ] Documentation complete
- [ ] Environment variables set
- [ ] Database backup made

---

## Success Indicators

✅ You know everything is working when:
- Login works with valid credentials
- Dashboard shows real data
- You can create/edit/delete volunteers
- You can create/publish events
- Messages send successfully
- Tasks track correctly
- Settings save preferences
- Navigation flows smoothly
- Mobile view works properly
- No errors in console

---

## Need Help?

Refer to these documents:
- `ADMIN_GUIDE.md` - Feature usage guide
- `ADMIN_FEATURES.md` - Feature specifications
- `API.md` - API endpoint documentation
- `SETUP.md` - Initial setup
- Console logs - Error messages

---

**Happy Testing! 🚀**

All features are ready to be tested. If you find any issues, check the error messages and logs for details.
