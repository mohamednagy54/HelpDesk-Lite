import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ticketsApi } from '@/features/tickets/api/tickets.api';
import type { TicketCategory, Ticket } from '@/types/ticket';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Send, PlusCircle, ListFilter } from 'lucide-react';
import { Loader } from '@/components/ui/Loader';

const CATEGORIES: TicketCategory[] = ['Access', 'Software', 'Hardware', 'Other'];

export const NewTicketPage: React.FC = () => {
  const navigate = useNavigate();

  // Form State
  const [category, setCategory] = useState<TicketCategory | ''>('');
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Success Confirmation State
  const [createdTicket, setCreatedTicket] = useState<Ticket | null>(null);

  const isCategoryValid = category !== '';
  const isDescriptionValid = description.trim().length >= 10;
  const isFormValid = isCategoryValid && isDescriptionValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const response = await ticketsApi.createTicket({
        category: category as TicketCategory,
        description: description.trim(),
      });

      if (response.success && response.data) {
        setCreatedTicket(response.data);
      } else {
        setErrorMsg(response.message || 'We could not submit your request. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message ||
          'Something went wrong while submitting your request. Your typed details have been saved so you can try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCategory('');
    setDescription('');
    setCreatedTicket(null);
    setErrorMsg(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Link */}
      <Link
        to="/my-requests"
        className="inline-flex items-center text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Requests</span>
      </Link>

      {/* Confirmation State */}
      {createdTicket ? (
        <Card className="text-center py-10 px-6 space-y-6 border-emerald-500/30 bg-emerald-950/10 animate-fadeIn">
          <div className="flex justify-center">
            <svg 
              className="w-14 h-14 text-emerald-400" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" className="animate-svg-draw" style={{ strokeDasharray: 100 }} />
              <path d="M9 12l2 2 4-4" className="animate-svg-draw" style={{ strokeDasharray: 100, animationDelay: '0.2s' }} />
            </svg>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-100">
              Your request was received successfully ✅
            </h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Our team has been notified and will review your ticket shortly.
            </p>
          </div>

          {/* Ticket ID Box */}
          <div className="inline-block bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 font-mono text-sm text-slate-300">
            Ticket Ref ID:{' '}
            <span className="text-indigo-400 font-bold">
              #{createdTicket._id.slice(-6).toUpperCase()}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              onClick={() => navigate('/my-requests')}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-5 py-2.5 flex items-center justify-center gap-2"
            >
              <ListFilter className="w-4 h-4" />
              <span>Back to My Requests</span>
            </Button>

            <Button
              variant="outline"
              onClick={resetForm}
              className="w-full sm:w-auto border-slate-700 hover:border-slate-600 text-slate-300 text-xs px-5 py-2.5 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Another Request</span>
            </Button>
          </div>
        </Card>
      ) : (
        /* Form State */
        <Card className="space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h1 className="text-xl font-bold text-slate-100">New Support Request</h1>
            <p className="text-xs text-slate-400 mt-1">
              Please describe your problem in detail so our support staff can resolve it efficiently.
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-950/40 border border-red-500/30 text-red-400 p-3.5 rounded-lg text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Category Select */}
            <div className="space-y-1.5">
              <label htmlFor="category" className="block text-xs font-medium text-slate-300">
                Category <span className="text-indigo-400">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as TicketCategory)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-lg px-3.5 py-2.5 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              >
                <option value="" disabled className="text-slate-500">
                  Select a issue category...
                </option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900 text-slate-100">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Description Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="description" className="block text-xs font-medium text-slate-300">
                  Issue Description <span className="text-indigo-400">*</span>
                </label>
                <span
                  className={`text-xs font-mono ${
                    description.trim().length >= 10 ? 'text-slate-400' : 'text-amber-400/90'
                  }`}
                >
                  {description.trim().length} / 10 min chars
                </span>
              </div>
              <textarea
                id="description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what happened, steps to reproduce, or any error messages..."
                className="w-full bg-slate-800/90 border border-slate-700 rounded-lg p-3.5 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none"
              />
              {description.length > 0 && description.trim().length < 10 && (
                <p className="text-xs text-amber-400/90 font-medium">
                  Please provide at least 10 characters so we can understand your issue.
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/my-requests')}
                disabled={isSubmitting}
                className="border-slate-700 text-slate-400 hover:text-slate-200 text-xs py-2 px-4"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-medium px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader size="sm" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Request</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default NewTicketPage;
