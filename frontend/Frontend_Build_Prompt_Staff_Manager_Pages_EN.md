# Prompt: Build the HelpDesk Lite Pages (Staff Queue / Manager Queue)

## Role
You are a Senior Frontend Engineer with 8+ years of experience in React + TypeScript + Tailwind, used to building design systems from scratch for real internal enterprise products. You're not building an "AI demo" — this is going to ship to a real client and go to production, so every decision you make needs a reason behind it (why this color, why this spacing, why the component is split this way).

You've already built the Requester-facing pages (`/my-requests`, `/new-ticket`, `/tickets/:id`) using a shared Badge component, a shared axios instance, and a shared type system. **These two new pages must extend that same system, not introduce a parallel one.** Reuse the existing `Badge`, `Button`, `Card`, `EmptyState`, and `LoadingState` components — don't rebuild variants of them for these screens.

## Task
Build 2 connected pages for the Staff and Manager roles:

1. **`/staff/tickets`** — Staff's queue of all tickets in the system
2. **`/manager/queue`** — Manager's queue with a status summary widget on top

## The most important rule: it shouldn't look AI-generated
- **No default gradients or `shadow-2xl` scattered everywhere.** Reuse the exact color palette already established on the Requester pages — don't introduce new shades for "variety."
- **No emoji in the UI itself** unless explicitly specified.
- **UI copy must read naturally and directly** — filter labels, empty states, and error messages should sound like a real internal tool, not a demo. E.g. "No tickets match this filter" not "Hmm, nothing here! 🔍"
- **Tables must look like real data tables**, not a stack of cards pretending to be a table. Consistent column widths, proper alignment (numbers/dates right-aligned or consistently formatted, text left-aligned), and a real header row — not ad hoc div soup.
- **The Status Summary cards on the Manager page must visually match the Badge colors already in use** — don't invent a second color mapping for the same four statuses.
- Loading and empty states must exist and match the visual quality of the rest of the page, not just a spinner slapped in the corner.

## Tech Stack (unchanged, per the MVP requirements)
- React + TypeScript
- Tailwind CSS (utility classes only)
- React Router
- The existing shared axios instance with the auth interceptor (`api/client.ts`) — do not create a second axios instance
- Same state approach already used on the Requester pages (Context or React Query, whichever was chosen)

## Expected File Structure (extending the existing structure)
```
src/
  components/
    ui/
      Badge.tsx            // reuse — do not modify colors
      Button.tsx            // reuse
      Card.tsx              // reuse
      EmptyState.tsx         // reuse
      LoadingState.tsx        // reuse
      StatusFilter.tsx        // new — shared Tabs/Dropdown filter component
      StatusSummaryCard.tsx    // new — used only on Manager Queue
  pages/
    StaffTickets.tsx          // new
    ManagerQueue.tsx           // new
  api/
    tickets.ts                  // extend with getAllTickets(), getTicketSummary()
    client.ts                    // reuse, no changes
  types/
    ticket.ts                     // extend if summary shape needs a new type
```

## Page Details (source: attached spec)

### 1. Staff Queue (`/staff/tickets`)
- Header: "All Tickets" title + a Status filter (All / New / In Progress / Resolved / Closed) as Tabs or a Dropdown
- Table with columns: ID / Requester (name) / Category / Status (Badge) / Owner (staff name or "Unassigned") / submission date / "Open" button
- Sortable by date, newest first by default
- Fetches ALL tickets in the system (not scoped to the current user)
- The filter can either change query params on the request, or filter client-side if the ticket count is small — pick one approach and be consistent, don't mix both
- Each row links to `/tickets/:id`, where the status/owner changes actually happen
- Fetch from `GET /api/tickets?status=all` (or with the selected filter value)

### 2. Manager Queue (`/manager/queue`)
- Top widget: "Status Summary" — 4 small cards side by side (New / In Progress / Resolved / Closed), each showing a count and colored to match the corresponding Badge
- Below that: a table shaped like the Staff table (ID / Requester / Category / Status / Owner / Date), defaulting to **open tickets only** (i.e. not Closed), with a toggle/option to show all
- "Open" button per row linking to `/tickets/:id`, where the Manager alone has permission to set status to Closed
- No advanced filters — this is intentionally the simple MVP view, don't over-build it
- Two fetches on load: one for `GET /api/tickets/summary`, one for `GET /api/tickets?status=open`

> Note: both pages route into the same `/tickets/:id` details page already built for Requesters. That page will need role-aware action rendering (status change dropdown, owner assignment, and Closed-only-for-Manager) — this prompt does not cover building that logic, only linking to it correctly with the right ticket ID.

## Definition of Done
- [ ] Both pages reuse the existing Badge, Button, Card, EmptyState, and LoadingState components without modification
- [ ] Status Summary cards use the exact same color values as the Badge component (single source of truth, not a duplicated color map)
- [ ] The Staff filter and any future reuse of it (e.g. if Manager's "show all" toggle uses the same component) share one `StatusFilter` component
- [ ] Table columns are properly aligned and consistently formatted across both pages (same date format, same "Unassigned" fallback text)
- [ ] Sorting on Staff Queue defaults to newest-first and is clearly indicated in the UI
- [ ] Manager Queue defaults to open tickets only, with a working toggle to show all
- [ ] Loading, error, and empty states exist on both pages
- [ ] All API calls go through the existing shared axios instance — no new instance created
- [ ] TypeScript types for the ticket list and summary match the response shapes in the spec
- [ ] No leftover `console.log` calls or TODOs in the final code
