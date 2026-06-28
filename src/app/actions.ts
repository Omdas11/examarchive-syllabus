'use server';

import { Client, Databases, ID, Account } from 'node-appwrite';
import { getSyllabusData } from '@/lib/syllabus';
import { cookies } from 'next/headers';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const apiKey = process.env.APPWRITE_API_KEY!;
const databaseId = process.env.DATABASE_ID || 'examarchive';
const syllabusCollectionId = 'Syllabus_Table';

export async function approveAndPublishSyllabus(id: string, captchaToken: string) {
  try {
    // 1. Verify Math CAPTCHA
    const decodedCaptcha = Buffer.from(captchaToken, 'base64').toString('utf8');
    const [equation, answer] = decodedCaptcha.split('=');
    const [num1, num2] = equation.split('+').map(Number);
    
    if (num1 + num2 !== parseInt(answer)) {
      return { success: false, error: "CAPTCHA verification failed." };
    }

    // 2. Get User ID from session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('ea_session');
    
    if (!sessionCookie?.value) {
      return { success: false, error: "You must be logged in to approve syllabi." };
    }

    const sessionClient = new Client()
      .setEndpoint(endpoint)
      .setProject(projectId)
      .setSession(sessionCookie.value);
    
    const account = new Account(sessionClient);
    let userId = '';
    try {
      const user = await account.get();
      userId = user.$id;
    } catch (e) {
      return { success: false, error: "Authentication session expired or invalid." };
    }

    // 3. Insert into Appwrite
    const syllabusData = getSyllabusData(id);
    const { frontmatter, content } = syllabusData;

    const client = new Client()
      .setEndpoint(endpoint)
      .setProject(projectId)
      .setKey(apiKey);

    const databases = new Databases(client);
    
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
      status: 'pending', // The new status field we will add to Appwrite
      submitted_by: userId // Ensure you create this attribute in Appwrite
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

export async function submitReport(paperId: string, reason: string) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('ea_session');
    
    if (!sessionCookie?.value) {
      return { success: false, error: "You must be logged in to report an issue." };
    }

    const sessionClient = new Client()
      .setEndpoint(endpoint)
      .setProject(projectId)
      .setSession(sessionCookie.value);
    
    const account = new Account(sessionClient);
    let userId = '';
    try {
      const user = await account.get();
      userId = user.$id;
    } catch (e) {
      return { success: false, error: "Authentication session invalid." };
    }

    const adminClient = new Client()
      .setEndpoint(endpoint)
      .setProject(projectId)
      .setKey(apiKey);

    const databases = new Databases(adminClient);
    
    await databases.createDocument(
      databaseId,
      'Reports_Table',
      ID.unique(),
      {
        paper_id: paperId,
        reason: reason,
        reported_by: userId,
        status: 'open'
      }
    );

    return { success: true };
  } catch (error) {
    console.error("Failed to submit report:", error);
    return { success: false, error: String(error) };
  }
}
