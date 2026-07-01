import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-outline-variant/10 glass">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-3 text-neutral-900 dark:text-white font-bold text-xl hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lift p-2">
              <Image
                src="/branding/logo.png"
                alt="ExamArchive logo"
                width={24}
                height={24}
                className="rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold leading-none tracking-tight">Syllabus Vault</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary mt-0.5 leading-none">ExamArchive</span>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-400">
            <a href="https://examarchive.dev" className="hover:text-primary transition-colors">Main Site</a>
            <Link href="/" className="hover:text-primary transition-colors">Syllabi</Link>
            <Link href="/profile" className="hover:text-primary transition-colors flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              Profile
            </Link>
          </nav>
          <div className="h-6 w-px bg-outline-variant/20 hidden md:block"></div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
