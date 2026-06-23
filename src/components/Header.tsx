import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { BookOpen } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 text-neutral-900 dark:text-white font-bold text-xl hover:opacity-80 transition-opacity">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            Syllabus Vault
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-400">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
            <Link href="/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Admin Login</Link>
          </nav>
          <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800 hidden md:block"></div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
