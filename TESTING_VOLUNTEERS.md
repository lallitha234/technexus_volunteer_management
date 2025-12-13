# 🧪 Quick Testing Guide - Volunteer Management

## Manual Testing Steps

### ✅ Test 1: Create New Volunteer
**URL:** `http://localhost:5173/volunteers/new`

**Steps:**
1. Fill in **Full Name** (required): "Sarah Johnson"
2. Fill in **Email** (required): "sarah@example.com"
3. Fill in **Display Name**: "Sarah"
4. Fill in **Pronouns**: "She/Her"
5. Fill in **Phone**: "+1 (555) 123-4567"
6. Add **Bio**: "Passionate about community service"
7. **Admin Settings** section:
   - Select Status: "🟢 Active" (default)
   - Add Admin Notes: "Background check completed"
8. Select **Skills**: Check "Event Planning" and "Marketing"
9. Select **Interests**: Check "Community Service" and "Youth Development"
10. **Availability**:
    - Select Weekdays: Monday, Wednesday, Friday
    - Select Time Slots: "Morning (9am-12pm)" and "Afternoon (12pm-3pm)"
11. **Consent**:
    - Check "I consent to be contacted..."
    - Check "I consent to my photo..."
12. Click **"Create Volunteer"** button
13. Expect: Green success message "Volunteer created successfully! Redirecting..."
14. Expect: Auto-redirect to `/volunteers` after ~1.5 seconds
15. Verify: New volunteer appears in the list with green "🟢 Active" badge

**Database Verification:**
```sql
SELECT id, full_name, email, status, admin_notes, created_at 
FROM volunteers 
WHERE email = 'sarah@example.com';
```
Expected: Row exists with `status='active'` and `admin_notes='Background check completed'`

---

### ✅ Test 2: Delete Volunteer
**URL:** `http://localhost:5173/volunteers`

**Setup:**
1. Ensure you have at least one volunteer in the list
2. Find a volunteer to delete (or create one first)

**Steps:**
1. Locate volunteer card for "Sarah Johnson" (from Test 1)
2. Click the **Delete** button (red trash icon)
3. Expect: Modal dialog appears with:
   - ⚠️ Red warning icon
   - Title: "Delete Volunteer"
   - Message: "Are you sure you want to delete this volunteer..."
   - Item name displayed: "Sarah Johnson"
   - Warning: "...will be archived and their data preserved..."
   - Two buttons: "Delete Volunteer" (red) and "Cancel" (gray)
4. Click **"Delete Volunteer"** button
5. Expect: Button shows "Deleting..." state (loading)
6. Expect: Modal closes after successful deletion
7. Expect: "Sarah Johnson" disappears from the Active volunteers list
8. Expected result: Volunteer is **soft deleted** (archived, not removed from database)

**Database Verification:**
```sql
SELECT id, full_name, email, status, updated_at 
FROM volunteers 
WHERE email = 'sarah@example.com';
```
Expected: Row still exists with `status='archived'` and recent `updated_at` timestamp

**Verify Archived Volunteers:**
1. In Volunteers page, change Status filter to "🔴 Archived"
2. Expect: "Sarah Johnson" appears in this view
3. Expect: Status badge shows "🔴 archived"

---

### ✅ Test 3: Update Volunteer Status
**URL:** `http://localhost:5173/volunteers`

**Steps:**
1. Click **Edit** button on any volunteer card
2. Change **Status** to "🔵 Inactive"
3. Modify **Admin Notes**: "On temporary leave"
4. Click **Update** button
5. Verify: Volunteer updated successfully

**Database Verification:**
```sql
SELECT id, full_name, status, admin_notes, updated_at 
FROM volunteers 
WHERE full_name = 'Sarah Johnson';
```
Expected: `status='inactive'` and new admin_notes value

---

### ✅ Test 4: Filter Volunteers by Status
**URL:** `http://localhost:5173/volunteers`

**Test Active Filter:**
1. Ensure Status dropdown shows "🟢 Active"
2. Expect: Only volunteers with `status='active'` displayed

**Test Inactive Filter:**
1. Change Status dropdown to "🔵 Inactive"
2. Expect: Only volunteers with `status='inactive'` displayed

**Test Archived Filter:**
1. Change Status dropdown to "🔴 Archived"
2. Expect: Only archived (deleted) volunteers displayed
3. Expect: "Sarah Johnson" from Test 2 appears here

---

### ✅ Test 5: Search Volunteers
**URL:** `http://localhost:5173/volunteers`

**Steps:**
1. In search box, type "sarah"
2. Expect: List filtered to show only "Sarah Johnson"
3. Try searching for "sarah@example.com"
4. Expect: Still shows Sarah Johnson
5. Try searching for non-existent name "zzzzzz"
6. Expect: "No volunteers found" message

---

### ✅ Test 6: Audit Trail Verification
**Database Query:**
```sql
SELECT action, entity_type, entity_id, user_id, old_data, new_data, created_at 
FROM audit_logs 
WHERE entity_type = 'volunteers' 
ORDER BY created_at DESC 
LIMIT 10;
```

**Expected Results:**
- `action='CREATE'`: When volunteer was created
- `action='UPDATE'`: When status/notes were changed
- `action='DELETE'`: When volunteer was archived
- `new_data` contains: `{"status":"archived"}` for deletions
- Timestamp matches when action was performed

---

## API Testing with cURL

### Create Volunteer
```bash
curl -X POST http://localhost:3000/api/volunteers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "email": "test@example.com",
    "status": "active",
    "admin_notes": "Test volunteer",
    "skills": ["Event Planning"],
    "interests": ["Community Service"],
    "consent_contact": true,
    "consent_photo": false
  }'
```

**Expected Response (201):**
```json
{
  "id": "uuid-here",
  "full_name": "Test User",
  "email": "test@example.com",
  "status": "active",
  "admin_notes": "Test volunteer",
  ...
}
```

### Delete Volunteer
```bash
curl -X DELETE http://localhost:3000/api/volunteers/UUID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response (200):**
```json
{
  "message": "Volunteer archived successfully"
}
```

### List Volunteers
```bash
curl -X GET "http://localhost:3000/api/volunteers?status=active&search=john" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Error Scenarios to Test

### ❌ Test: Create Volunteer Without Email
1. Try to create volunteer with empty email field
2. Expect: Error message "Email is required"
3. Button remains clickable, no submission

### ❌ Test: Create Volunteer With Invalid Email
1. Enter email: "notanemail"
2. Click Create
3. Expect: Error message "Please enter a valid email"

### ❌ Test: Create Volunteer Without Full Name
1. Leave Full Name empty
2. Try to submit
3. Expect: Error message "Full name is required"

### ❌ Test: Delete and Cancel
1. Click Delete on a volunteer
2. Modal appears
3. Click "Cancel" button
4. Expect: Modal closes, volunteer still in list

### ❌ Test: Double-Click Prevention
1. Click Delete button
2. Modal appears
3. Quickly click "Delete Volunteer" twice
4. Expect: First click processes, button disabled
5. Expect: Second click has no effect (button shows "Deleting...")

---

## Performance & Edge Cases

### Test: Large Volunteer List
1. Create 50+ volunteers in database
2. Navigate to `/volunteers`
3. Expect: Pagination shows 12 per page
4. Expect: Page navigation works correctly
5. Expect: No performance degradation

### Test: Search with Special Characters
1. Search for "O'Brien" (apostrophe)
2. Search for "Maria-Jose" (hyphen)
3. Expect: Search handles special characters correctly

### Test: Rapid Status Changes
1. Click Edit on volunteer
2. Change status multiple times
3. Click Update
4. Expect: Final status saved correctly
5. Expect: Audit log shows all changes

---

## Checklist Summary

- [ ] Create volunteer with all fields
- [ ] Create volunteer with minimum required fields
- [ ] Delete volunteer shows confirmation modal
- [ ] Delete volunteer soft deletes (archived)
- [ ] Archived volunteer appears in "Archived" filter
- [ ] Update volunteer status
- [ ] Search volunteers by name
- [ ] Search volunteers by email
- [ ] Pagination works correctly
- [ ] Error messages display for validation failures
- [ ] Success message displays after creation
- [ ] API returns correct status codes (201, 200, 400, etc)
- [ ] Audit logs record all operations
- [ ] Admin notes saved to database
- [ ] Status field persists correctly

---

## Success Criteria

✅ All tests pass without errors  
✅ Database records persist correctly  
✅ Audit trail shows all operations  
✅ Delete operations use soft delete (status='archived')  
✅ Admin notes visible only to admins  
✅ Status filter shows only volunteers in selected status  
✅ Search functionality works for name and email  
✅ Error messages are clear and helpful  
✅ Loading states prevent double-submission  
✅ TypeScript compilation successful with no errors

---

## Troubleshooting

### Issue: Delete button not working
- Check: Browser console for errors
- Check: JWT token is valid and not expired
- Check: User has admin role
- Check: Volunteer ID is valid

### Issue: Admin notes not saving
- Check: admin_notes field is in form payload
- Check: Database column exists: `ALTER TABLE volunteers ADD COLUMN admin_notes TEXT;`
- Check: Backend update includes admin_notes in payload

### Issue: Modal not appearing
- Check: DeleteConfirmationModal component imported correctly
- Check: Modal state variables initialized properly
- Check: No CSS display:none hiding the modal

### Issue: TypeScript errors in IDE
- Run: `npm install` to ensure all dependencies installed
- Run: `npx tsc --noEmit` to check compilation
- Clear: VS Code cache and reload

