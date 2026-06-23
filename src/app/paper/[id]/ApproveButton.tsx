'use client';

import { useState } from 'react';
import { approveAndPublishSyllabus } from '@/app/actions';
import { Send, CheckCircle } from 'lucide-react';

export default function ApproveButton({ id }: { id: string }) {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleApprove = async () => {
    setIsPending(true);
    setError('');
    
    const result = await approveAndPublishSyllabus(id);
    
    if (result.success) {
      setIsSuccess(true);
    } else {
      setError(result.error || 'Failed to publish');
    }
    
    setIsPending(false);
  };

  if (isSuccess) {
    return (
      <div className="flex items-center gap-2 px-6 py-3 bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 rounded-xl font-bold">
        <CheckCircle className="w-5 h-5" />
        Sent to Admin!
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button 
        onClick={handleApprove}
        disabled={isPending}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 shadow-sm shadow-blue-500/20"
      >
        {isPending ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        ) : (
          <Send className="w-5 h-5" />
        )}
        {isPending ? 'Publishing...' : 'Approve & Send to Admin'}
      </button>
      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
    </div>
  );
}
