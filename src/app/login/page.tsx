"use client";

import { useState } from "react";
import { account } from "@/lib/appwrite-client";
import { AppwriteException } from "appwrite";
import { useRouter } from "next/navigation";
import { Turnstile } from '@marsidev/react-turnstile';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      setError("Please complete the CAPTCHA.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await account.createEmailPasswordSession(email, password);
      router.push("/");
    } catch (err) {
      if (err instanceof AppwriteException) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 text-center">
          Login
        </h1>
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4 border border-red-200 dark:border-red-800/50">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="user@examarchive.com"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex justify-center my-2">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onSuccess={(token) => setCaptchaToken(token)}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !captchaToken}
            className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-sm transition-colors"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
