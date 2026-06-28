"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, FileText, LayoutGrid, List } from 'lucide-react';
import { SyllabusData } from '@/lib/syllabus';

interface SyllabusDashboardProps {
  syllabi: SyllabusData[];
}

export default function SyllabusDashboard({ syllabi }: SyllabusDashboardProps) {
  const [department, setDepartment] = useState<string>("All");
  const [paperType, setPaperType] = useState<string>("All");
  const [semester, setSemester] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 24;

  // Determine departments based on paper_code prefixes
  const getDepartment = (paperCode: string, type: string) => {
    if (type === "AEC" || type === "VAC") return "Common";
    if (paperCode.startsWith("BOT")) return "Botany";
    if (paperCode.startsWith("CHM")) return "Chemistry";
    if (paperCode.startsWith("COM")) return "Commerce";
    if (paperCode.startsWith("PHY")) return "Physics";
    if (paperCode.startsWith("ZOO")) return "Zoology";
    if (paperCode.startsWith("MTM")) return "Mathematics";
    return "Other";
  };

  const filteredSyllabi = useMemo(() => {
    return syllabi.filter(paper => {
      const pDept = getDepartment(paper.frontmatter.paper_code, paper.frontmatter.paper_type);
      const pType = paper.frontmatter.paper_type;
      const pSem = String(paper.frontmatter.semester_no);

      if (department !== "All" && pDept !== department) return false;
      if (paperType !== "All" && pType !== paperType) return false;
      if (semester !== "All" && pSem !== semester) return false;
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const titleMatch = paper.frontmatter.paper_title?.toLowerCase().includes(term);
        const codeMatch = paper.frontmatter.paper_code?.toLowerCase().includes(term);
        if (!titleMatch && !codeMatch) return false;
      }

      return true;
    }).sort((a, b) => a.frontmatter.paper_code.localeCompare(b.frontmatter.paper_code));
  }, [syllabi, department, paperType, semester, searchTerm]);

  const departments = ["All", "Botany", "Chemistry", "Commerce", "Mathematics", "Physics", "Zoology", "Common"];
  const paperTypes = ["All", "DSC", "DSM", "SEC", "IDC", "AEC", "VAC", "INT", "RPD"];
  const semesters = ["All", "1", "2", "3", "4", "5", "6", "7", "8"];

  const totalPages = Math.ceil(filteredSyllabi.length / ITEMS_PER_PAGE);
  const paginatedSyllabi = filteredSyllabi.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Controls */}
      <div className="flex flex-col gap-4 bg-surface p-4 rounded-2xl border border-outline-variant/20 shadow-sm">
        {/* Search Bar */}
        <div className="w-full relative">
          <input 
            type="text" 
            placeholder="Search by paper title or code..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Department</label>
            <select 
              className="input-field py-2 pr-8"
              value={department}
              onChange={(e) => { setDepartment(e.target.value); setCurrentPage(1); }}
            >
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Paper Type</label>
            <select 
              className="input-field py-2 pr-8"
              value={paperType}
              onChange={(e) => { setPaperType(e.target.value); setCurrentPage(1); }}
            >
              {paperTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Semester</label>
            <select 
              className="input-field py-2 pr-8"
              value={semester}
              onChange={(e) => { setSemester(e.target.value); setCurrentPage(1); }}
            >
              {semesters.map(s => <option key={s} value={s}>{s === "All" ? "All Semesters" : `Semester ${s}`}</option>)}
            </select>
          </div>
        </div>

        {/* View Toggles */}
        <div className="flex items-center gap-2 self-start md:self-end h-full mt-auto mb-1">
          <button 
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
            title="Grid View"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
              title="List View"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredSyllabi.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-500 border-2 border-dashed border-outline-variant/30 rounded-2xl">
          <BookOpen className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">No papers found</p>
          <p className="text-sm">Try adjusting your filters to see more results.</p>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-page-in">
              {paginatedSyllabi.map(({ id, frontmatter }) => (
                <Link 
                  key={id} 
                  href={`/paper/${id}`}
                  className="card group flex flex-col justify-between p-6 h-full"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-xs font-bold rounded bg-primary/10 text-primary">
                        {frontmatter.paper_type}
                      </span>
                      <span className="px-2 py-0.5 text-xs font-bold rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                        Sem {frontmatter.semester_no}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                      {frontmatter.paper_title}
                    </h4>
                    <div className="flex items-center gap-2 text-sm font-mono text-neutral-500 dark:text-neutral-400">
                      <FileText className="w-4 h-4" />
                      {frontmatter.paper_code}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-outline-variant/20 text-sm text-neutral-500 dark:text-neutral-400">
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
          ) : (
            <div className="card overflow-x-auto animate-page-in">
              <table className="zebra-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Semester</th>
                    <th>Credits</th>
                    <th>Subject</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSyllabi.map(({ id, frontmatter }) => (
                    <tr key={id} className="group cursor-pointer" onClick={() => window.location.href = `/paper/${id}`}>
                      <td className="font-mono text-sm font-medium text-primary group-hover:underline">
                        {frontmatter.paper_code}
                      </td>
                      <td className="font-semibold">{frontmatter.paper_title}</td>
                      <td>
                        <span className="px-2 py-0.5 text-xs font-bold rounded bg-primary/10 text-primary">
                          {frontmatter.paper_type}
                        </span>
                      </td>
                      <td>Semester {frontmatter.semester_no}</td>
                      <td>{frontmatter.credits}</td>
                      <td className="text-neutral-500">{frontmatter.subject_code}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-8 mt-4 border-t border-outline-variant/20">
              <span className="text-sm text-neutral-500">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredSyllabi.length)} of {filteredSyllabi.length} papers
              </span>
              <div className="flex items-center gap-2">
                <button
                  className="btn btn-secondary px-4 py-2"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                >
                  Previous
                </button>
                <div className="flex items-center gap-1 mx-2">
                  <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                <button
                  className="btn btn-secondary px-4 py-2"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
