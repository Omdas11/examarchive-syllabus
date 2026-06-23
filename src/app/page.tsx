import { getAllSyllabi } from '@/lib/syllabus';
import Link from 'next/link';
import { BookOpen, Calendar, Clock, FileText } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  const allSyllabi = getAllSyllabi();
  
  // Group by Semester, then by Paper Type
  const grouped = allSyllabi.reduce((acc, curr) => {
    const sem = curr.frontmatter.semester_no;
    const type = curr.frontmatter.paper_type;
    if (!acc[sem]) acc[sem] = {};
    if (!acc[sem][type]) acc[sem][type] = [];
    acc[sem][type].push(curr);
    return acc;
  }, {} as Record<number, Record<string, typeof allSyllabi>>);

  const semesters = Object.keys(grouped).map(Number).sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-6xl mx-auto flex flex-col gap-12">
        <header className="flex flex-col gap-2 pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <h1 className="text-4xl font-extrabold tracking-tight">Syllabus Vault</h1>
          <p className="text-lg text-neutral-500 dark:text-neutral-400">
            Select a paper below to visually review the extracted Markdown content.
          </p>
        </header>

        <div className="flex flex-col gap-16">
          {semesters.map((sem) => {
            const types = Object.keys(grouped[sem]).sort();
            return (
              <section key={sem} className="flex flex-col gap-8">
                <div className="flex items-center gap-4">
                  <h2 className="text-3xl font-bold border-b-4 border-blue-500 pb-1 inline-block">Semester {sem}</h2>
                  <div className="h-px bg-neutral-200 dark:bg-neutral-800 flex-grow"></div>
                </div>
                
                <div className="flex flex-col gap-10">
                  {types.map((type) => {
                    const papers = grouped[sem][type].sort((a, b) => a.frontmatter.paper_code.localeCompare(b.frontmatter.paper_code));
                    return (
                      <div key={type} className="flex flex-col gap-4">
                        <h3 className="text-xl font-semibold text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-neutral-600"></span>
                          {type} Papers
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          {papers.map(({ id, frontmatter }) => (
                            <Link 
                              key={id} 
                              href={`/paper/${id}`}
                              className="group flex flex-col justify-between bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200"
                            >
                              <div className="flex flex-col gap-3">
                                <h4 className="text-lg font-bold leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {frontmatter.paper_title}
                                </h4>
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
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
