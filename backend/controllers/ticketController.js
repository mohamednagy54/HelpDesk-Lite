const Ticket = require('../models/Ticket');

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private (Requester)
const createTicket = async (req, res, next) => {
  try {
    const { description, category } = req.body;
    if (!description || !category) {
      return res.status(400).json({ success: false, message: 'Please provide description and category', data: null });
    }
    
    // Validate category enum
    if (!['Hardware', 'Software', 'Access', 'Other'].includes(category)) {
      return res.status(400).json({ success: false, message: 'Invalid category', data: null });
    }

    const ticket = await Ticket.create({
      requester: req.user._id,
      description,
      category,
      status: 'New',
    });

    res.status(201).json({ success: true, message: 'Ticket created', data: ticket });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's tickets
// @route   GET /api/tickets/mine
// @access  Private (Requester)
const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ requester: req.user._id }).populate('owner', 'name email');
    res.json({ success: true, message: 'Tickets fetched', data: tickets });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private (Requester (own), Staff, Manager)
const getTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('requester', 'name email').populate('owner', 'name email');
    
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found', data: null });
    }

    // Access control: if role is requester, must be their own ticket
    if (req.user.role === 'requester' && ticket.requester._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this ticket', data: null });
    }

    res.json({ success: true, message: 'Ticket fetched', data: ticket });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign ticket to staff
// @route   PATCH /api/tickets/:id/assign
// @access  Private (Staff)
const assignTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found', data: null });
    }

    const { ownerId } = req.body; // Can be self or another staff id
    if (!ownerId) {
      return res.status(400).json({ success: false, message: 'Please provide ownerId', data: null });
    }

    ticket.owner = ownerId;
    await ticket.save();

    const updatedTicket = await Ticket.findById(req.params.id).populate('owner', 'name email');
    res.json({ success: true, message: 'Ticket assigned', data: updatedTicket });
  } catch (error) {
    next(error);
  }
};

// @desc    Update ticket status
// @route   PATCH /api/tickets/:id/status
// @access  Private (Staff -> Resolved, Manager -> Closed)
const updateTicketStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Please provide status', data: null });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found', data: null });
    }

    const currentStatus = ticket.status;
    const flow = ['New', 'In Progress', 'Resolved', 'Closed'];
    const currentIndex = flow.indexOf(currentStatus);
    const newIndex = flow.indexOf(status);

    if (newIndex === -1) {
      return res.status(400).json({ success: false, message: 'Invalid status', data: null });
    }

    // Enforce linear, forward-only flow
    if (newIndex !== currentIndex + 1) {
      return res.status(400).json({ success: false, message: `Cannot transition from ${currentStatus} to ${status}. Tickets must follow the linear flow: New -> In Progress -> Resolved -> Closed`, data: null });
    }

    // Role restrictions: 
    if (status === 'Resolved' && req.user.role !== 'staff') {
      return res.status(403).json({ success: false, message: 'Only staff can resolve tickets', data: null });
    }
    
    if (status === 'Closed' && req.user.role !== 'manager') {
      return res.status(403).json({ success: false, message: 'Only managers can close tickets', data: null });
    }

    ticket.status = status;
    await ticket.save();

    res.json({ success: true, message: 'Ticket status updated', data: ticket });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Private (Staff, Manager)
const getTickets = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) {
      query.status = status;
    }
    const tickets = await Ticket.find(query).populate('requester', 'name email').populate('owner', 'name email');
    res.json({ success: true, message: 'Tickets fetched', data: tickets });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ticket summary
// @route   GET /api/tickets/summary
// @access  Private (Manager)
const getTicketSummary = async (req, res, next) => {
  try {
    const summary = await Ticket.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Format response nicely
    const formattedSummary = {
      New: 0,
      'In Progress': 0,
      Resolved: 0,
      Closed: 0
    };
    
    summary.forEach(item => {
      if(formattedSummary[item._id] !== undefined) {
         formattedSummary[item._id] = item.count;
      }
    });

    res.json({ success: true, message: 'Ticket summary fetched', data: formattedSummary });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTicket,
  getMyTickets,
  getTicket,
  assignTicket,
  updateTicketStatus,
  getTickets,
  getTicketSummary,
};
