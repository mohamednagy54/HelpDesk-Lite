const express = require('express');
const router = express.Router();
const { 
  createTicket, 
  getMyTickets, 
  getTicket, 
  assignTicket, 
  updateTicketStatus, 
  getTickets, 
  getTicketSummary 
} = require('../controllers/ticketController');
const { protect } = require('../middleware/auth');
const { roleCheck } = require('../middleware/roleCheck');

// Protect all ticket routes
router.use(protect);

// Manager only summary
router.get('/summary', roleCheck('manager'), getTicketSummary);

// Staff and Manager visibility
router.get('/', roleCheck('staff', 'manager'), getTickets);

// Requester specific routes
router.get('/mine', getMyTickets);
router.post('/', createTicket);

// Access to specific ticket (access controlled inside controller)
router.get('/:id', getTicket);

// Status and Assign
router.patch('/:id/assign', roleCheck('staff'), assignTicket);
router.patch('/:id/status', roleCheck('staff', 'manager'), updateTicketStatus);

module.exports = router;
