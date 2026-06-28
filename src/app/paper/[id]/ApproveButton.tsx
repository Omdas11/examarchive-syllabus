'use client';

import { useState, useEffect } from 'react';
import { approveAndPublishSyllabus } from '@/app/actions';
import { Send, CheckCircle, Lock } from 'lucide-react';
import Link from 'next/link';

export default function ApproveButton({ id, initialIsAuthenticated }: { id: string, initialIsAuthenticated: boolean }) {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const isAuthenticated = initialIsAuthenticated;

  useEffect(() => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
  }, []);

  const isCaptchaValid = parseInt(userAnswer) === num1 + num2;

  const handleApprove = async () => {
    if (!isCaptchaValid) {
      setError('Incorrect CAPTCHA answer.');
      return;
    }
    
    setIsPending(true);
    setError('');
    
    const captchaToken = Buffer.from(`${num1}+${num2}=${userAnswer}`).toString('base64');
    const result = await approveAndPublishSyllabus(id, captchaToken);
    
    if (result.success) {
      setIsSuccess(true);
    } else {
      setError(result.error || 'Failed to publish');
    }
    
    setIsPending(false);
  };



  if (isAuthenticated === false) {
    // Add ?redirect= parameter so the main site returns the user here after login
    const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://syllabus.examarchive.dev/paper/${id}`;
    return (
      <a href={`https://examarchive.dev/login?redirect=${encodeURIComponent(currentUrl)}`} className="flex items-center gap-2 px-6 py-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-xl font-bold transition-colors">
        <Lock className="w-5 h-5" />
        Login to Approve
      </a>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex items-center gap-2 px-6 py-3 bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 rounded-xl font-bold">
        <CheckCircle className="w-5 h-5" />
        Sent to Admin!
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-3">
      <div className="flex items-center gap-3 bg-surface p-2 rounded-xl border border-outline-variant/20 shadow-sm">
        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300 whitespace-nowrap px-2">
          What is {num1} + {num2}?
        </span>
        <input 
          type="number" 
          className="input-field py-1.5 px-3 w-20 text-center"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="?"
        />
      </div>
      
      <button 
        onClick={handleApprove}
        disabled={isPending || !userAnswer}
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
