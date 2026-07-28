# Backend Build Prompt — HelpDesk Lite MVP

Copy everything below and paste it into Claude Code, Cursor, or any AI coding assistant.

---

## PROMPT START

You are a senior backend engineer. Build the complete backend for **HelpDesk Lite**, an internal support-ticketing MVP. Work in clear, staged steps — do not skip ahead, and confirm each stage produces working, testable code before moving to the next. Follow the spec below exactly; do not invent features outside it, and do not silently change the assumptions listed in Section 2.

### 1. Tech Stack (fixed — do not substitute)

- Runtime: Node.js + Express
- Database: MongoDB (Atlas), via Mongoose ODM
- Auth: JWT (jsonwebtoken) + bcrypt for password hashing
- Environment config: dotenv
- API testing reference: Postman-style route list (Section 6)
- Response format (every endpoint, success or error): `{ "success": boolean, "data": object|array|null, "message": string }`

### 2. Fixed MVP Assumptions (already decided — implement as-is, do not re-open)

- Roles: `requester`, `staff`, `manager` — exactly these three, no sub-permissions.
- Ticket status flow is **linear, forward-only**: `New → In Progress → Resolved → Closed`. No backward transitions in v1.
- Only `staff` can move a ticket to `Resolved`. Only `manager` can move a ticket to `Closed`.
- Submission fields are mandatory: `description`, `category`. `category` is a fixed enum: `Hardware | Software | Access | Other`.
- Assignment is manual only (staff assigns self or a teammate as owner) — no round-robin, no auto-routing.
- Unassigned tickets stay `owner: null` until claimed manually.
- Out of scope — do NOT build: self-service/knowledge base, SLA/auto-routing, external ticketing integrations, advanced analytics/aging logic, granular multi-level permissions.

### 3. Data Models

**User**
```
name: String, required
email: String, required, unique
password: String, required (hashed with bcrypt before save)
role: String, enum ['requester','staff','manager'], default 'requester'
timestamps: true
```

**Ticket**
```
requester: ObjectId ref User, required
description: String, required
category: String, enum ['Hardware','Software','Access','Other'], required
status: String, enum ['New','In Progress','Resolved','Closed'], default 'New'
owner: ObjectId ref User, default null
timestamps: true
```

### 4. Build in This Exact Order — Confirm Each Stage Works Before Proceeding

**Stage 1 — Project Foundation**
- Initialize Express project, folder structure (`models/`, `routes/`, `controllers/`, `middleware/`, `config/`).
- Set up `.env` (MONGO_URI, JWT_SECRET, PORT) and `config/db.js` for the MongoDB connection.
- Confirm the server boots and logs a successful DB connection before writing any route.

**Stage 2 — Models**
- Create `User` and `Ticket` Mongoose models exactly as specified in Section 3.

**Stage 3 — Auth & Roles**
- `POST /api/auth/register` — create user, hash password, assign role.
- `POST /api/auth/login` — verify credentials, return JWT (include `id` and `role` in the payload).
- `middleware/auth.js` — verifies JWT, attaches `req.user`.
- `middleware/roleCheck.js` — takes allowed roles as arguments, blocks access otherwise (e.g. `roleCheck('staff','manager')`).
- Test both endpoints with Postman before moving on.

**Stage 4 — Ticket Submission & Requester Visibility**
- `POST /api/tickets` — requester creates a ticket (status auto-set to `New`).
- `GET /api/tickets/mine` — requester sees only their own tickets.
- `GET /api/tickets/:id` — ticket detail, accessible to its requester, any staff, or any manager.

**Stage 5 — Ownership & Status Transitions**
- `PATCH /api/tickets/:id/assign` — staff-only, sets `owner` to self or another staff id.
- `PATCH /api/tickets/:id/status` — enforce the linear flow from Section 2 and the resolve/close role restriction. Reject any transition that skips a step or goes backward, with a clear error message.

**Stage 6 — Manager Visibility**
- `GET /api/tickets` — manager-only (staff may also use this for their queue), returns all tickets with status + owner, supports a simple `?status=` filter.
- `GET /api/tickets/summary` — returns ticket counts grouped by status.

**Stage 7 — Hardening Pass**
- Input validation on every write endpoint (reject missing/invalid fields with a 400 and a clear message).
- Centralized error-handling middleware — no raw stack traces returned to the client.
- Confirm every protected route rejects requests with no token, an invalid token, and a wrong role — test all three cases per route.

### 5. Non-Functional Requirements

- Passwords never returned in any API response (exclude via `.select('-password')` or a toJSON transform).
- JWT has a defined expiry (e.g. `1d`).
- Each endpoint should respond in well under 1s on sample data.
- Schema should tolerate adding new fields/statuses later without a full rewrite (this is why status is a String enum, not a separate collection).

### 6. Full Endpoint List (deliver a working Postman collection covering all of these)

| Method | Endpoint | Role |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| POST | /api/tickets | Requester |
| GET | /api/tickets/mine | Requester |
| GET | /api/tickets/:id | Requester (own) / Staff / Manager |
| PATCH | /api/tickets/:id/assign | Staff |
| PATCH | /api/tickets/:id/status | Staff (→Resolved) / Manager (→Closed) |
| GET | /api/tickets | Staff / Manager |
| GET | /api/tickets/summary | Manager |

### 7. Deliverables

1. Full working Express + MongoDB backend matching the structure above.
2. A Postman collection (or `.http` file) covering every endpoint in Section 6, including at least one success case and one failure case (bad role / missing field / invalid transition) per endpoint.
3. A short `README.md`: setup steps, `.env` variables needed, and how to run the server locally.

Work stage by stage. After each stage, summarize what was built and what you tested, before starting the next stage.

## PROMPT END