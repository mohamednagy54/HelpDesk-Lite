# HelpDesk Lite — Full Frontend Pages Breakdown (from the MVP Plan)

> General note: default Base URL is `/api`, and every protected endpoint requires an `Authorization: Bearer <token>` header. The general response shape follows what was agreed in the doc:
> ```json
> { "success": true, "message": "...", "data": {...} }
> ```

---

## 0. General Layout + Routing before diving into the pages

### Base Layout (Shell)
- **Navbar** at the top: HelpDesk Lite logo + user name + role (Badge: Requester / Staff / Manager) + Logout button.
- **Sidebar** (optional, role-based):
  - Requester: "My Requests" + "New Ticket"
  - Staff: "All Tickets" + "My Requests" (if they also submit tickets themselves)
  - Manager: "Queue" + "Status Summary"
- **Protected Routes**: any route other than `/login` must check for a valid JWT in localStorage/cookies; if missing → redirect to `/login`.
- **Role Guard**: every route is filtered by role (e.g. a Requester can't open `/manager/queue`).

### Route Map
| Route | Who sees it | Page |
|---|---|---|
| `/login` | Everyone (Public) | Login |
| `/my-requests` | Requester | My Requests |
| `/new-ticket` | Requester | New Ticket Form |
| `/tickets/:id` | Everyone (different view per role) | Ticket Details |
| `/staff/tickets` | Staff | All Tickets (Staff Queue) |
| `/manager/queue` | Manager | Manager Queue View |
| `/manager/summary` | Manager | Status Summary (can also live as a widget on top of the Queue page) |

---

## 1. Login Page — `/login`

### Purpose
The single entry point to the system; after a successful login the role is determined and the user is redirected to the right page.

### Page Layout
- Card centered on screen containing:
  - Logo / "HelpDesk Lite" title
  - Input: Email or Username
  - Input: Password (with Show/Hide toggle)
  - "Login" button (with a loading state while the request is in flight)
  - A spot below the form for error messages (wrong email/password) in red

### Functionality
1. Basic client-side validation before submitting (fields not empty, valid email format).
2. On clicking "Login":
   - Sends the request; on success: stores the JWT + user data (id, name, role) in localStorage/state management (Context or Redux/Zustand).
   - Based on the returned role, redirects:
     - `Requester` → `/my-requests`
     - `Staff` → `/staff/tickets`
     - `Manager` → `/manager/queue`
3. On failure: shows "Invalid login credentials."
4. The token is then attached to every subsequent request as a header.

### Endpoint Used
```
POST /api/auth/login
Body: { "email": "string", "password": "string" }
Response: {
  "success": true,
  "data": {
    "token": "jwt...",
    "user": { "id": 1, "name": "Ahmed", "role": "requester" }
  }
}
```

---

## 2. "My Requests" Page — `/my-requests` — Requester

### Purpose
The Requester sees all the tickets they've submitted and each one's current status, without needing to follow up by email or ask someone.

### Page Layout
- **Header**: "My Requests" title + a "+ New Ticket" button (links to `/new-ticket`).
- **Table/List** with columns:
  - Ticket ID
  - Category
  - Short description (truncated if long)
  - Status (as a colored Badge: New = gray/blue, In Progress = orange, Resolved = light green, Closed = dark green/gray)
  - Submission date (created_at)
  - "View Details" button for each row
- **Empty State**: if there are no tickets, show "You haven't submitted any requests yet" + a "Submit a new request" button.
- An optional simple Status filter above the table (not in the core MVP requirements, but useful).

### Functionality
- On opening the page, fetch all tickets for the current user (the backend identifies the user from the JWT).
- Clicking a row/details button goes to `/tickets/:id`.
- Auto-refresh or a Refresh button (optional) so the user can see if the status changed.

### Endpoint Used
```
GET /api/tickets/my
Headers: Authorization: Bearer <token>
Response: {
  "success": true,
  "data": [
    { "id": 12, "category": "Software", "description": "...", "status": "In Progress", "created_at": "..." }
  ]
}
```

---

## 3. "New Ticket" Form — `/new-ticket` — Requester

### Purpose
Submit a new support request in the simplest possible way.

### Page Layout
- Title "New Support Request"
- A form containing:
  - **"Category" Dropdown/Select**: fixed list (Access / Software / Hardware / Other) — required
  - **"Description" Textarea**: description of the issue — required (with a minimum character count, e.g. 10 characters)
  - (requester_id is taken automatically from the JWT — not a form field)
  - "Submit Request" button (disabled until required fields are filled)
- After a successful submission: a **Confirmation State** — a Card/Modal showing:
  - "Your request was received successfully ✅"
  - The Ticket ID
  - A "Back to My Requests" or "Submit another request" button

### Functionality
1. Client-side validation before submitting.
2. On submit: loading state on the button.
3. On success: show the confirmation screen with the Ticket ID; the initial status is auto-set to `New` by the server.
4. On failure (e.g. server error): error message + ability to retry without losing what was typed.

### Endpoint Used
```
POST /api/tickets
Headers: Authorization: Bearer <token>
Body: { "category": "Software", "description": "..." }
Response: {
  "success": true,
  "message": "Request received",
  "data": { "id": 45, "status": "New", "created_at": "..." }
}
```

---

## 4. "Ticket Details" Page — `/tickets/:id` — All Roles (different view per role)

### Purpose
Show the full data of a single ticket, with different actions depending on the user's role.

### Page Layout (shared by everyone)
- **Header**: Ticket ID + Status as a large Badge
- **Core info**:
  - Category
  - Full description
  - Requester's name
  - Submission date (created_at) and last updated date (updated_at)
  - Current Owner (staff member's name, or "Unassigned" if no one has been assigned)

### The part that differs per role:

**a. Requester:**
- Fully read-only. Sees all the data + the current status. No edit buttons at all.

**b. Staff:**
- A **"Change Status"** button/Dropdown: can move the ticket to the next allowed status only, in order (New → In Progress → Resolved). No going backward. (Setting a ticket to Closed is reserved for the Manager only.)
- A **"Assign Owner"** button/Dropdown: can set themselves or another colleague as Owner (Assign/Reassign).
- The UI prevents selecting a previous status (the Dropdown only shows the next allowed status).

**c. Manager:**
- All the Staff permissions, plus the ability to set status to **Closed** (they're the only one who can do this).

### Functionality
1. On opening the page: fetch ticket details by the ID from the URL.
2. If the status changes: PATCH request + update the UI immediately (Optimistic Update or refetch).
3. If the Owner changes: same idea.
4. Show a clear error message if a disallowed status transition is attempted (extra client-side protection, not a replacement for server-side validation).

### Endpoints Used
```
GET /api/tickets/:id
Response: {
  "success": true,
  "data": {
    "id": 45, "category": "Software", "description": "...",
    "status": "In Progress", "requester": {"id":3,"name":"..."},
    "owner": {"id":7,"name":"..."} | null,
    "created_at": "...", "updated_at": "..."
  }
}

PATCH /api/tickets/:id/status
Body: { "status": "Resolved" }
Response: { "success": true, "data": { "id": 45, "status": "Resolved" } }

PATCH /api/tickets/:id/assign
Body: { "owner_id": 7 }
Response: { "success": true, "data": { "id": 45, "owner": {"id":7,"name":"..."} } }
```

---

## 5. "All Tickets" Page (Staff Queue) — `/staff/tickets` — Staff

### Purpose
Staff can see all tickets (not just their own) so they can handle any request.

### Page Layout
- **Header**: "All Tickets" title + a simple Status filter (All / New / In Progress / Resolved / Closed) as Tabs or a Dropdown.
- **Table** with columns:
  - ID
  - Requester (name)
  - Category
  - Status (Badge)
  - Owner (staff name or "Unassigned")
  - Submission date
  - "Open" button linking to `/tickets/:id`
- Ability to **sort** by date (newest on top by default).

### Functionality
- Fetch all tickets (not limited to a specific user).
- The filter changes query params on the same request, or client-side filtering if the count is small.
- Each row leads to the details page to change the status/Owner from there.

### Endpoint Used
```
GET /api/tickets?status=all
Response: {
  "success": true,
  "data": [ { "id": 45, "requester": {...}, "category": "...", "status": "...", "owner": {...} | null, "created_at": "..." } ]
}
```

---

## 6. Manager Queue View — `/manager/queue` — Manager

### Purpose
A simple view for the manager of all open tickets with their status and owner, without complex filters.

### Page Layout
- **Widget/Card at the top of the page**: "Status Summary" — 4 small cards side by side:
  - New: count
  - In Progress: count
  - Resolved: count
  - Closed: count
  (each card colored to match the Badge colors used elsewhere)
- **Table below**: roughly the same shape as the Staff table (ID / Requester / Category / Status / Owner / Date), but the focus here is open tickets by default (not Closed), with the option to show all.
- An "Open" button per row linking to `/tickets/:id`, where the manager alone can set the ticket to Closed.

### Functionality
1. On opening the page: one or two requests — one for the status counts, one for the ticket list.
2. No advanced filters, per MVP requirements — just a simple view.
3. Clicking any row goes to the same `/tickets/:id` details page, with manager-level permissions (closing the ticket).

### Endpoints Used
```
GET /api/tickets/summary
Response: {
  "success": true,
  "data": { "New": 5, "In Progress": 3, "Resolved": 2, "Closed": 10 }
}

GET /api/tickets?status=open   // or with no query if "open" is the default
Response: {
  "success": true,
  "data": [ { "id": 45, "requester": {...}, "category": "...", "status": "...", "owner": {...} | null, "created_at": "..." } ]
}
```

---

## Quick Summary of All Frontend Endpoints

| Method | Endpoint | Used by | From which page |
|---|---|---|---|
| POST | `/api/auth/login` | Everyone | Login |
| GET | `/api/tickets/my` | Requester | My Requests |
| POST | `/api/tickets` | Requester | New Ticket |
| GET | `/api/tickets/:id` | Everyone | Ticket Details |
| PATCH | `/api/tickets/:id/status` | Staff/Manager | Ticket Details |
| PATCH | `/api/tickets/:id/assign` | Staff/Manager | Ticket Details |
| GET | `/api/tickets?status=` | Staff | All Tickets |
| GET | `/api/tickets/summary` | Manager | Manager Queue |
| GET | `/api/tickets?status=open` | Manager | Manager Queue |

---

## Extra Implementation Notes (useful while splitting the work)
- Use **one reusable Badge component** for all four statuses, with consistent colors across every screen (visual consistency + easier maintenance).
- Build an **API Mock (static JSON)** for the first couple of hours, as the plan suggests, so Member 2 and Member 3 can start building screens without waiting for Auth to be ready.
- The Role Guard and Protected Routes are best implemented once in a `<ProtectedRoute role="staff">` component so they're not repeated across routes.
- Store the JWT + user data in a single Context/state management store, and attach it to every request via an Axios interceptor instead of manually adding it everywhere.
