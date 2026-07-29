# Prompt: Build the HelpDesk Lite Pages (My Requests / New Ticket / Ticket Details — full role logic)

## Role
You are a Senior Frontend Engineer with 8+ years of experience in React + TypeScript + Tailwind, used to building design systems from scratch for real internal enterprise products. You're not building an "AI demo" — this ships to a real client and goes to production, so every decision needs a reason behind it (why this color, why this spacing, why the component is split this way).

This work extends the existing shell and shared components already built (`Badge`, `Button`, `Card`, `EmptyState`, `LoadingState`, the shared axios instance, `ProtectedRoute`). Reuse them as-is — don't recreate variants of anything that already exists.

## Task
Build 3 connected pages that share one design system:

1. **`/my-requests`** — the Requester's list of submitted tickets
2. **`/new-ticket`** — new ticket submission form
3. **`/tickets/:id`** — ticket details, with **full role-aware behavior**: read-only for Requester, status change + owner assignment for Staff, plus Closed permission for Manager

The third page is the most complex piece here — it's one page whose *content* changes based on who's viewing it, not three separate pages. Design it that way from the start.

## The most important rule: it shouldn't look AI-generated
- **No default gradients or `shadow-2xl` scattered everywhere.** Use a limited palette (2–3 core colors + one gray scale), applied identically across all three pages.
- **No emoji in the UI** beyond the one already specified (✅ in the New Ticket confirmation state) — don't add more.
- **UI copy reads naturally and directly.** Error messages are calm and professional ("We couldn't update the ticket status, please try again"), not overly apologetic or overly enthusiastic.
- **Action controls (status dropdown, assign dropdown) must look like real product UI**, not a raw `<select>` dropped in with no styling. Disabled/unavailable states (e.g. a Requester simply not seeing these controls at all) should feel intentional, not like something was forgotten.
- **Optimistic updates, if used, must have a visible rollback/error path.** If a status or owner change fails server-side, the UI must revert and show why — silently failing or leaving stale UI state is not acceptable.
- Every status Badge is the same component, same colors, everywhere:
  - New → gray/light blue
  - In Progress → orange
  - Resolved → light green
  - Closed → dark green/dark gray

## Tech Stack (unchanged)
- React + TypeScript
- Tailwind CSS (utility classes only)
- React Router
- The existing shared axios instance with the auth interceptor — reuse it
- Existing auth/user Context — read the current user's role from it, don't re-fetch or re-derive it

## Expected File Structure (extending the existing structure)
```
src/
  components/
    ui/
      Badge.tsx                // reuse
      Button.tsx                 // reuse
      Card.tsx                    // reuse
      EmptyState.tsx                // reuse
      LoadingState.tsx                // reuse
    tickets/
      StatusChangeControl.tsx        // new — renders only for Staff/Manager
      AssignOwnerControl.tsx          // new — renders only for Staff/Manager
  pages/
    MyRequests.tsx                     // new
    NewTicket.tsx                       // new
    TicketDetails.tsx                    // new — role-aware
  api/
    tickets.ts                             // getMyTickets(), createTicket(), getTicketById(), updateTicketStatus(), assignOwner()
    client.ts                                // reuse
  types/
    ticket.ts                                 // Ticket, TicketStatus, Owner, Requester types
```

## Page Details (source: attached spec)

### 1. My Requests (`/my-requests`)
- Header: "My Requests" title + "+ New Ticket" button → `/new-ticket`
- Table: Ticket ID / Category / truncated description / Status Badge / submission date / "View Details" button
- Empty state: "You haven't submitted any requests yet" + "Submit a new request" button
- Fetch from `GET /api/tickets/my` on load
- Rows link to `/tickets/:id`

### 2. New Ticket (`/new-ticket`)
- Title: "New Support Request"
- Category dropdown: Access / Software / Hardware / Other (required)
- Description textarea: required, min 10 characters, with a visible character counter
- Submit button disabled until required fields are valid
- On success: confirmation state (Card/Modal) — "Your request was received successfully ✅" + ticket ID + "Back to My Requests" or "Submit another request"
- On failure: clear error message, form state preserved (nothing typed is lost)
- POST to `POST /api/tickets`

### 3. Ticket Details (`/tickets/:id`) — full role logic

**Shared header/info block (all roles see this):**
- Ticket ID + Status as a large Badge
- Category, full description, requester's name, created_at, updated_at, current Owner (or "Unassigned")

**Requester:**
- Fully read-only. No action controls rendered at all.

**Staff:**
- `StatusChangeControl`: a dropdown/button that only ever offers the *single next* allowed status in the sequence New → In Progress → Resolved. Never shows a way to go backward, and never shows "Closed" as an option.
- `AssignOwnerControl`: dropdown to assign the ticket to themselves or another staff member (Assign/Reassign).

**Manager:**
- Same `StatusChangeControl` and `AssignOwnerControl` as Staff, but the status control also offers **Closed** as an available next step, exclusively for this role.

**Functionality:**
1. Fetch ticket details via `GET /api/tickets/:id` using the ID from the URL.
2. Status change → `PATCH /api/tickets/:id/status`, then update the UI (optimistic update with rollback-on-error, or refetch — pick one strategy and apply it consistently to both status and owner changes, don't mix strategies within the same page).
3. Owner change → `PATCH /api/tickets/:id/assign`, same update strategy as above.
4. If a disallowed transition is somehow attempted (e.g. stale UI state), show a clear inline error — this is a UX safety net, not a substitute for backend validation, and the copy should make it obvious it's a validation issue, not a generic failure.

## Definition of Done
- [ ] All three pages use the exact same Badge component and color values
- [ ] All API calls go through the existing shared axios instance
- [ ] TypeScript types match the response shapes exactly, including `owner: {...} | null`
- [ ] Loading, error, and empty states exist on all three pages
- [ ] My Requests description column truncates cleanly with no layout overflow
- [ ] New Ticket form blocks submission until valid, and preserves typed data on failure
- [ ] Ticket Details renders zero action controls for Requester, and the correct controls for Staff vs Manager, driven by role from auth state — not by any client-side guesswork
- [ ] Staff's status control never offers "Closed" as an option under any circumstance
- [ ] Manager's status control offers "Closed" only when it's actually a valid next step for the ticket's current status
- [ ] Status and owner changes use one consistent update strategy (optimistic-with-rollback OR refetch) applied the same way in both places
- [ ] Failed status/owner updates show a visible error and leave the UI in a correct (not stale, not silently wrong) state
- [ ] All UI copy is in one consistent language throughout
- [ ] No leftover `console.log` calls or TODOs in the final code
