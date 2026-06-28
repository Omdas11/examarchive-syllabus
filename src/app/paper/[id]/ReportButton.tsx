'use client';

import { useState } from 'react';
import { Flag, X, Send } from 'lucide-react';
import { submitReport } from '@/app/actions';
import Link from 'next/link';

export default function ReportButton({ id, isAuthenticated }: { id: string, isAuthenticated: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError('Please provide a reason.');
      return;
    }
    setIsSubmitting(true);
    setError('');

    const res = await submitReport(id, reason);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => setIsOpen(false), 2000);
    } else {
      setError(res.error || 'Failed to submit report');
    }
    setIsSubmitting(false);
  };

  if (!isAuthenticated) {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://syllabus.examarchive.dev/paper/${id}`;
    return (
      <Link href={`https://examarchive.dev/login?redirect=${encodeURIComponent(currentUrl)}`} className="text-neutral-500 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium">
        <Flag className="w-4 h-4" />
        Report Issue
      </Link>
    );
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-neutral-500 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium"
      >
        <Flag className="w-4 h-4" />
        Report Issue
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface p-6 rounded-2xl shadow-xl w-full max-w-md border border-outline-variant/20 animate-page-in relative">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <Flag className="w-5 h-5 text-red-500" />
              Report Issue
            </h3>
            
            {success ? (
              <div className="text-green-600 bg-green-100 dark:bg-green-900/30 p-4 rounded-xl font-medium mt-4">
                Thank you! Your report has been submitted to the admins.
              </div>
            ) : (
              <>
                <p className="text-sm text-neutral-500 mb-4">
                  Did you find something wrong with this syllabus? Let us know and we'll fix it.
                </p>
                <textarea 
                  className="input-field w-full h-32 p-3 rounded-xl resize-none mb-4"
                  placeholder="Describe the issue..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded-xl text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || !reason.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                    {!isSubmitting && <Send className="w-4 h-4" />}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
