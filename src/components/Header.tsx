import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { BookOpen } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-outline-variant/10 glass">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 text-neutral-900 dark:text-white font-bold text-xl hover:opacity-80 transition-opacity">
            <div className="bg-primary/10 text-primary p-1.5 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            Syllabus Vault
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-400">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          </nav>
          <div className="h-6 w-px bg-outline-variant/20 hidden md:block"></div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
