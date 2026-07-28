export interface TicketSummary {
  New: number;
  'In Progress': number;
  Resolved: number;
  Closed: number;
}

export interface SummaryResponse {
  success: boolean;
  message: string;
  data: TicketSummary;
}
