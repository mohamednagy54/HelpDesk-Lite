import { Router } from 'express';
import {
  createTicket,
  getMyTickets,
  getTicket,
  assignTicket,
  updateTicketStatus,
  getTickets,
  getTicketSummary,
} from '../controllers/ticketController';
import { protect } from '../middleware/auth';
import { roleCheck } from '../middleware/roleCheck';

const router = Router();

// Protect all ticket routes
router.use(protect);

router.post('/', createTicket);

// Named routes before /:id to avoid param capture
router.get('/all', roleCheck('staff', 'manager'), getTickets);   // used by Staff & Manager pages
router.get('/my', roleCheck('requester', 'staff', 'manager'), getMyTickets);
router.get('/mine', roleCheck('requester', 'staff', 'manager'), getMyTickets); // alias
router.get('/summary', roleCheck('manager'), getTicketSummary);

// Single ticket
router.get('/:id', getTicket);
router.patch('/:id/assign', roleCheck('staff', 'manager'), assignTicket);
router.patch('/:id/status', roleCheck('staff', 'manager'), updateTicketStatus);

// Root list (staff/manager with optional ?status or ?open filter)
router.get('/', roleCheck('staff', 'manager'), getTickets);

export default router;
