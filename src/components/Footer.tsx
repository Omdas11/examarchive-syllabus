export function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-8">
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
        <p>© {new Date().getFullYear()} ExamArchive Review. All rights reserved.</p>
        <p>A side project for verifying AI extracted syllabi.</p>
      </div>
    </footer>
  );
}
