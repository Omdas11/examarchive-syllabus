import { getAllSyllabi } from '@/lib/syllabus';
import SyllabusDashboard from '@/components/SyllabusDashboard';

export default function Home() {
  const allSyllabi = getAllSyllabi();

  return (
    <div className="min-h-screen bg-surface p-4 md:p-8">
      <main className="max-w-7xl mx-auto flex flex-col gap-10">
        <header className="flex flex-col gap-3 pb-8 border-b border-outline-variant/20">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight ea-hero-heading text-primary">Syllabus Vault</h1>
          <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl">
            Review, verify, and approve AI-extracted Markdown syllabus content before publishing it to the main ExamArchive.
          </p>
        </header>

        <SyllabusDashboard syllabi={allSyllabi} />
      </main>
    </div>
  );
}
