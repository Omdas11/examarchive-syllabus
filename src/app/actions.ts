'use server';

import { Client, Databases, ID } from 'node-appwrite';
import { getSyllabusData } from '@/lib/syllabus';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const apiKey = process.env.APPWRITE_API_KEY!;
const databaseId = process.env.DATABASE_ID || 'examarchive';
const syllabusCollectionId = 'Syllabus_Table';

export async function approveAndPublishSyllabus(id: string) {
  try {
    const syllabusData = getSyllabusData(id);
    const { frontmatter, content } = syllabusData;

    const client = new Client()
      .setEndpoint(endpoint)
      .setProject(projectId)
      .setKey(apiKey);

    const databases = new Databases(client);

    // Prepare payload matching the Appwrite Syllabus_Table schema plus the new `status` column
    // The SyllabusTableRow in examarchive-v3 expects:
    // entry_id, university, course, stream, type, paper_code, paper_name, subject, unit_number, syllabus_content, lectures, tags
    
    // We'll create one single document per syllabus since the content is currently just the whole markdown string.
    // Wait, the main site splits by unit. If the unit_number is not strictly separated in our markdown, 
    // we can just put the whole markdown into unit 1, or parse it properly. For now, since the new schema 
    // allows a full markdown dump, we'll insert it as unit 1.
    
    const payload = {
      entry_id: frontmatter.entry_id || id,
      university: frontmatter.university || 'Unknown',
      course: frontmatter.course || 'Unknown',
      stream: frontmatter.stream || 'Unknown',
      type: frontmatter.paper_type || 'DSC',
      paper_code: frontmatter.paper_code || id,
      paper_name: frontmatter.paper_title || 'Untitled',
      subject: frontmatter.subject_code || 'GEN',
      unit_number: 1,
      syllabus_content: content,
      lectures: frontmatter.credits ? frontmatter.credits * 15 : 0,
      tags: [frontmatter.paper_code],
      status: 'pending' // The new status field we will add to Appwrite
    };

    await databases.createDocument(
      databaseId,
      syllabusCollectionId,
      ID.unique(),
      payload
    );

    return { success: true };
  } catch (error) {
    console.error("Failed to push to Appwrite:", error);
    return { success: false, error: String(error) };
  }
}
