import { Request, Response, NextFunction } from 'express';
import Ticket from '../models/Ticket';
import User from '../models/User';
import { TicketCategory, TicketStatus } from '../types';

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private (Requester)
export const createTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { description, category } = req.body;
    if (!description || !category) {
      return res.status(400).json({ success: false, message: 'Please provide description and category', errors: [] });
    }

    if (description.length < 10) {
      return res.status(400).json({ success: false, message: 'Description must be at least 10 characters long', errors: [] });
    }

    if (!['Hardware', 'Software', 'Access', 'Other'].includes(category)) {
      return res.status(400).json({ success: false, message: 'Invalid category', errors: [] });
    }

    const ticket = await Ticket.create({
      requester: req.user!._id,
      description,
      category: category as TicketCategory,
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
export const getMyTickets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;
    const query: Record<string, any> = { requester: req.user!._id };
    if (status) {
      query.status = status;
    }
    const tickets = await Ticket.find(query).populate('owner', 'name email');
    res.json({ success: true, message: 'Tickets fetched', data: tickets });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private (Requester (own), Staff, Manager)
export const getTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('requester', 'name email').populate('owner', 'name email');

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found', errors: [] });
    }

    if (req.user!.role === 'requester' && ticket.requester._id.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this ticket', errors: [] });
    }

    res.json({ success: true, message: 'Ticket fetched', data: ticket });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign ticket to staff
// @route   PATCH /api/tickets/:id/assign
// @access  Private (Staff)
export const assignTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found', errors: [] });
    }

    const { ownerId } = req.body;
    if (!ownerId) {
      return res.status(400).json({ success: false, message: 'Please provide ownerId', errors: [] });
    }

    const owner = await User.findById(ownerId);
    if (!owner || (owner.role !== 'staff' && owner.role !== 'manager')) {
      return res.status(422).json({ success: false, message: 'Invalid owner: must be an existing staff or manager', errors: [] });
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
export const updateTicketStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Please provide status', errors: [] });
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found', errors: [] });
    }

    const currentStatus = ticket.status;
    const flow: TicketStatus[] = ['New', 'In Progress', 'Resolved', 'Closed'];
    const currentIndex = flow.indexOf(currentStatus);
    const newIndex = flow.indexOf(status as TicketStatus);

    if (newIndex === -1) {
      return res.status(400).json({ success: false, message: 'Invalid status', errors: [] });
    }

    if (newIndex !== currentIndex + 1) {
      return res.status(409).json({ success: false, message: `Cannot transition from ${currentStatus} to ${status}. Tickets must follow the linear flow: New -> In Progress -> Resolved -> Closed`, errors: [] });
    }

    if (status === 'Closed' && req.user!.role !== 'manager') {
      return res.status(403).json({ success: false, message: 'Only managers can close tickets', errors: [] });
    }

    ticket.status = status as TicketStatus;
    await ticket.save();

    res.json({ success: true, message: 'Ticket status updated', data: ticket });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Private (Staff, Manager)
export const getTickets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, open } = req.query;
    const query: Record<string, any> = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (open === 'true') {
      query.status = { $ne: 'Closed' };
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
export const getTicketSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const summary = await Ticket.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedSummary: Record<string, number> = {
      New: 0,
      'In Progress': 0,
      Resolved: 0,
      Closed: 0,
    };

    summary.forEach((item: { _id: string; count: number }) => {
      if (formattedSummary[item._id] !== undefined) {
        formattedSummary[item._id] = item.count;
      }
    });

    res.json({ success: true, message: 'Ticket summary fetched', data: formattedSummary });
  } catch (error) {
    next(error);
  }
};
