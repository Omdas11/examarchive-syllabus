import { getSyllabusData, getAllSyllabusIds } from '@/lib/syllabus';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import ApproveButton from './ApproveButton';

export async function generateStaticParams() {
  const ids = getAllSyllabusIds();
  return ids.map((id) => ({
    id: id,
  }));
}

export default async function PaperReview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const syllabusData = getSyllabusData(id);
  const fm = syllabusData.frontmatter;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 p-4 md:p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto flex flex-col gap-8 pb-16">
        
        <nav className="flex items-center text-sm text-neutral-500 font-medium">
          <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-neutral-800 dark:text-neutral-200">Semester {fm.semester_no}</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-neutral-800 dark:text-neutral-200">{fm.paper_code}</span>
        </nav>

        <header className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 text-sm font-bold rounded-lg uppercase tracking-wider">
                  {fm.paper_code}
                </span>
                {fm.status === 'draft' && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-sm font-bold rounded-lg uppercase tracking-wider flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    Draft Review
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2">
                {fm.paper_title}
              </h1>
              <p className="text-neutral-500 text-lg">
                {fm.university} • {fm.stream} • {fm.course}
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <ApproveButton id={id} />
              
              <div className="flex flex-col gap-2 p-4 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-100 dark:border-neutral-800 min-w-[200px]">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Credits</span>
                <span className="font-semibold">{fm.credits}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Total Marks</span>
                <span className="font-semibold">{fm.marks_total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Paper Type</span>
                <span className="font-semibold">{fm.paper_type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Semester</span>
                <span className="font-semibold">{fm.semester_no}</span>
              </div>
            </div>
          </div>
        </header>

        <section className="bg-white dark:bg-neutral-900 p-6 md:p-10 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800">
          <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:border-b prose-h2:pb-2 prose-h2:mb-6 prose-table:w-full prose-th:bg-neutral-100 dark:prose-th:bg-neutral-800 prose-th:p-3 prose-td:p-3 prose-tr:border-b prose-tr:border-neutral-200 dark:prose-tr:border-neutral-800 prose-td:align-top">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {syllabusData.content}
            </ReactMarkdown>
          </div>
        </section>

      </main>
    </div>
  );
}
