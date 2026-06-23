import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export interface SyllabusFrontmatter {
  entry_type: string;
  entry_id: string;
  university: string;
  course: string;
  stream: string;
  paper_code: string;
  paper_title: string;
  subject_code: string;
  paper_type: string;
  semester_code: string;
  semester_no: number;
  credits: number;
  marks_total: number;
  syllabus_pdf_url: string;
  source_reference: string;
  status: string;
  version: number;
  last_updated: string;
}

export interface SyllabusData {
  id: string;
  frontmatter: SyllabusFrontmatter;
  content: string;
}

export function getAllSyllabusIds(): string[] {
  if (!fs.existsSync(contentDirectory)) return [];
  const fileNames = fs.readdirSync(contentDirectory);
  return fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => fileName.replace(/\.md$/, ''));
}

export function getSyllabusData(id: string): SyllabusData {
  const fullPath = path.join(contentDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  return {
    id,
    frontmatter: matterResult.data as SyllabusFrontmatter,
    content: matterResult.content,
  };
}

export function getAllSyllabi(): SyllabusData[] {
  const ids = getAllSyllabusIds();
  return ids.map(id => getSyllabusData(id));
}
