# API Reference

## Base URL
- Development: `http://localhost:3000/api`
- Production: `https://your-backend.vercel.app/api`

## Authentication

All protected endpoints require an `Authorization` header with a Supabase JWT token:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Get token by logging in through the frontend (handled automatically).

---

## Health Check

```
GET /health
```

Returns server status. No auth required.

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## Volunteers

### List Volunteers
```
GET /api/volunteers?status=active&search=john&skills=cooking
```

**Query Parameters:**
- `status` - Filter by status (active, inactive, archived)
- `search` - Filter by name or email
- `skills` - Filter by skills (comma-separated)

**Response:**
```json
[
  {
    "id": "uuid",
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "pronouns": "he/him",
    "skills": ["cooking", "teaching"],
    "interests": ["education", "food"],
    "availability_weekdays": ["Monday", "Wednesday"],
    "availability_time_slots": ["9-12", "17-21"],
    "total_hours": 45.5,
    "total_events": 12,
    "no_show_count": 1,
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### Create Volunteer
```
POST /api/volunteers
Content-Type: application/json

{
  "full_name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+9876543210",
  "pronouns": "she/her",
  "skills": ["design", "marketing"],
  "interests": ["nonprofit", "art"],
  "consent_contact": true,
  "consent_photo": false
}
```

**Response:** 201 Created + volunteer object

### Get Volunteer
```
GET /api/volunteers/{id}
```

**Response:** Volunteer object

### Update Volunteer
```
PATCH /api/volunteers/{id}
Content-Type: application/json

{
  "full_name": "Jane Smith Updated",
  "skills": ["design", "marketing", "ux"]
}
```

**Response:** 200 OK + updated volunteer object

### Delete Volunteer (Archive)
```
DELETE /api/volunteers/{id}
```

Soft deletes (archives) the volunteer. `status` becomes "archived".

**Response:** 200 OK

### Assign Badge to Volunteer
```
POST /api/volunteers/{id}/assign-badge
Content-Type: application/json

{
  "badge_id": "uuid"
}
```

**Response:** 201 Created + volunteer_badge object

---

## Events

### List Events
```
GET /api/events?status=published
```

**Query Parameters:**
- `status` - draft, published, cancelled, completed

**Response:** Array of event objects

### Create Event
```
POST /api/events
Content-Type: application/json

{
  "title": "Community Cleanup",
  "description": "Spring cleanup in the park",
  "location_address": "Central Park, NYC",
  "start_at": "2024-03-15T09:00:00Z",
  "end_at": "2024-03-15T12:00:00Z",
  "estimated_volunteers": 20,
  "tags": ["outdoor", "environment"]
}
```

**Response:** 201 Created + event object

### Get Event
```
GET /api/events/{id}
```

**Response:** Event object

### Update Event
```
PATCH /api/events/{id}
Content-Type: application/json

{
  "title": "Updated Title",
  "estimated_volunteers": 25
}
```

**Response:** 200 OK + updated event object

### Publish Event
```
POST /api/events/{id}/publish
```

Changes status to "published" and sets `published_at` timestamp.

**Response:** 200 OK + event object

### Cancel Event
```
POST /api/events/{id}/cancel
```

Changes status to "cancelled" and sets `cancelled_at` timestamp.

**Response:** 200 OK + event object

---

## Shifts

### Create Shift
```
POST /api/events/create-shift
Content-Type: application/json

{
  "event_id": "uuid",
  "role_name": "Setup Crew",
  "description": "Help set up tables and chairs",
  "required_skills": ["coordination"],
  "start_at": "2024-03-15T08:00:00Z",
  "end_at": "2024-03-15T09:00:00Z",
  "seat_count": 5
}
```

**Response:** 201 Created + shift object

### Get Event Shifts
```
GET /api/events/{eventId}/shifts
```

**Response:** Array of shift objects for the event

### Assign Volunteer to Shift
```
POST /api/events/{shiftId}/assign
Content-Type: application/json

{
  "volunteer_id": "uuid",
  "as_waitlist": false
}
```

If `as_waitlist` is false and shift is full, automatically adds to waitlist.

**Response:** 201 Created + shift_assignment object

### Unassign Volunteer from Shift
```
DELETE /api/events/{shiftId}/assign/{volunteerId}
```

If shift was full, promotes first person from waitlist.

**Response:** 200 OK

---

## Tasks

### List Tasks
```
GET /api/tasks?status=pending&assigned_to=uuid
```

**Query Parameters:**
- `status` - pending, completed, cancelled
- `assigned_to` - Filter by volunteer ID

**Response:** Array of task objects

### Create Task
```
POST /api/tasks
Content-Type: application/json

{
  "title": "Write thank you emails",
  "description": "Send thank you emails to last month's volunteers",
  "estimated_minutes": 45,
  "assigned_to": "volunteer-uuid"
}
```

**Response:** 201 Created + task object

### Complete Task
```
PATCH /api/tasks/{id}/complete
Content-Type: application/json

{
  "proof_photo_url": "https://...",
  "feedback": "Great work!"
}
```

**Response:** 200 OK + updated task object

---

## Messages

### Send Broadcast Message
```
POST /api/messages/broadcast
Content-Type: application/json

{
  "subject": "Upcoming event reminder",
  "content": "Don't forget about Saturday's cleanup event! 🌍",
  "filter": {
    "skills": ["coordination"],
    "availability": "Saturday"
  }
}
```

Broadcasts to all volunteers matching the filter.

**Response:** 201 Created + message object

### Send 1-to-1 Message
```
POST /api/messages/send
Content-Type: application/json

{
  "to_volunteer_id": "uuid",
  "subject": "Welcome!",
  "content": "Thank you for signing up!"
}
```

**Response:** 201 Created + message object

### Get Volunteer Messages
```
GET /api/messages/volunteer/{volunteerId}
```

Returns all messages sent to a specific volunteer.

**Response:** Array of message objects

---

## Analytics

### Get Dashboard Summary
```
GET /api/analytics/summary
```

**Response:**
```json
{
  "total_volunteers": 45,
  "active_volunteers": 38,
  "upcoming_events": 7,
  "total_hours_contributed": 1250.5,
  "event_fill_rate": 85.25,
  "no_show_rate": 5.5
}
```

---

## Exports

### Export Volunteers as CSV
```
GET /api/export/volunteers
```

Downloads a CSV file with:
- ID, Full Name, Email, Phone, Skills, Total Hours, Total Events, Created At

### Export Attendance Report
```
GET /api/export/attendance
```

Downloads a CSV file with attendance records:
- Volunteer Name, Email, Role, Shift Date, Status, Hours Worked

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error type",
  "message": "Human-readable error message"
}
```

### Common Status Codes
- **200** - Success
- **201** - Created
- **400** - Bad Request (missing fields)
- **401** - Unauthorized (no auth token)
- **403** - Forbidden (not admin)
- **404** - Not Found
- **500** - Server Error

---

## Rate Limiting

Currently no rate limiting. Implement in production if needed.

---

## Pagination

Most list endpoints support pagination via query params:

```
GET /api/volunteers?limit=20&offset=0
```

Not implemented yet, but can be added to limit response size.

---

## Timestamps

All timestamps are ISO 8601 format:
```
2024-01-15T10:30:00Z
```

---

## Filtering Examples

**List active volunteers with specific skills:**
```
GET /api/volunteers?status=active&skills=cooking,teaching
```

**List unpublished events:**
```
GET /api/events?status=draft
```

**Get pending tasks for a volunteer:**
```
GET /api/tasks?status=pending&assigned_to=abc123
```

**Broadcast to specific skill groups:**
```
POST /api/messages/broadcast
{
  "content": "...",
  "filter": {
    "skills": ["teaching", "mentoring"]
  }
}
```
