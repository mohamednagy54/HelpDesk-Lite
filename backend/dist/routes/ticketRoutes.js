"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticketController_1 = require("../controllers/ticketController");
const auth_1 = require("../middleware/auth");
const roleCheck_1 = require("../middleware/roleCheck");
const router = (0, express_1.Router)();
// Protect all ticket routes
router.use(auth_1.protect);
router.post('/', (0, roleCheck_1.roleCheck)('requester'), ticketController_1.createTicket);
router.get('/mine', (0, roleCheck_1.roleCheck)('requester'), ticketController_1.getMyTickets);
router.get('/summary', (0, roleCheck_1.roleCheck)('manager'), ticketController_1.getTicketSummary);
router.get('/:id', ticketController_1.getTicket);
router.patch('/:id/assign', (0, roleCheck_1.roleCheck)('staff'), ticketController_1.assignTicket);
router.patch('/:id/status', ticketController_1.updateTicketStatus);
router.get('/', (0, roleCheck_1.roleCheck)('staff', 'manager'), ticketController_1.getTickets);
exports.default = router;
