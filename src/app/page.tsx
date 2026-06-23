import { getAllSyllabi } from '@/lib/syllabus';
import Link from 'next/link';
import { BookOpen, Calendar, Clock, FileText } from 'lucide-react';

export default function Home() {
  const allSyllabi = getAllSyllabi();
  
  // Sort by semester number, then paper code
  allSyllabi.sort((a, b) => {
    if (a.frontmatter.semester_no !== b.frontmatter.semester_no) {
      return a.frontmatter.semester_no - b.frontmatter.semester_no;
    }
    return a.frontmatter.paper_code.localeCompare(b.frontmatter.paper_code);
  });

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-6xl mx-auto flex flex-col gap-8">
        <header className="flex flex-col gap-2 pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <h1 className="text-4xl font-extrabold tracking-tight">Syllabus Reviewer</h1>
          <p className="text-lg text-neutral-500 dark:text-neutral-400">
            Select a paper below to visually review the extracted Markdown content.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allSyllabi.map(({ id, frontmatter }) => (
            <Link 
              key={id} 
              href={`/paper/${id}`}
              className="group flex flex-col justify-between bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200"
            >
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-semibold rounded-md">
                    Semester {frontmatter.semester_no}
                  </span>
                  <span className="px-2 py-1 bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 text-xs font-medium rounded-md">
                    {frontmatter.paper_type}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {frontmatter.paper_title}
                </h2>
                
                <div className="flex items-center gap-2 text-sm font-mono text-neutral-500 dark:text-neutral-400">
                  <FileText className="w-4 h-4" />
                  {frontmatter.paper_code}
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-sm text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {frontmatter.credits} Cr
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {frontmatter.subject_code}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
