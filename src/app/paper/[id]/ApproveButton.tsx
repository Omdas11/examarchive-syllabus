'use client';

import { useState, useEffect } from 'react';
import { approveAndPublishSyllabus } from '@/app/actions';
import { Send, CheckCircle, Lock } from 'lucide-react';
import { account } from '@/lib/appwrite-client';
import { Turnstile } from '@marsidev/react-turnstile';
import Link from 'next/link';

export default function ApproveButton({ id }: { id: string }) {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    account.get()
      .then(() => setIsAuthenticated(true))
      .catch((e) => {
        console.error("Appwrite Auth Error:", e);
        setIsAuthenticated(false);
      });
  }, []);

  const handleApprove = async () => {
    if (!captchaToken) {
      setError('Please complete the CAPTCHA.');
      return;
    }
    
    setIsPending(true);
    setError('');
    
    const result = await approveAndPublishSyllabus(id, captchaToken);
    
    if (result.success) {
      setIsSuccess(true);
    } else {
      setError(result.error || 'Failed to publish');
    }
    
    setIsPending(false);
  };

  if (isAuthenticated === null) {
    return <div className="h-12 w-48 animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>;
  }

  if (isAuthenticated === false) {
    return (
      <a href="https://examarchive.dev/login" className="flex items-center gap-2 px-6 py-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-xl font-bold transition-colors">
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
      <Turnstile
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        onSuccess={(token) => setCaptchaToken(token)}
      />
      <button 
        onClick={handleApprove}
        disabled={isPending || !captchaToken}
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
