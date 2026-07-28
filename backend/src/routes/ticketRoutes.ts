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
router.get('/my', roleCheck('requester'), getMyTickets);
router.get('/summary', roleCheck('manager'), getTicketSummary);
router.get('/:id', getTicket);
router.patch('/:id/assign', roleCheck('staff', 'manager'), assignTicket);
router.patch('/:id/status', roleCheck('staff', 'manager'), updateTicketStatus);
router.get('/', roleCheck('staff', 'manager'), getTickets);

export default router;
