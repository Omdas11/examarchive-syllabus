'use server';

import { Client, Databases, ID } from 'node-appwrite';
import { getSyllabusData } from '@/lib/syllabus';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
const apiKey = process.env.APPWRITE_API_KEY!;
const databaseId = process.env.DATABASE_ID || 'examarchive';
const syllabusCollectionId = 'Syllabus_Table';

export async function approveAndPublishSyllabus(id: string, captchaToken: string) {
  try {
    // 1. Verify Turnstile token
    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    if (!secretKey) throw new Error("Missing Turnstile secret key");

    const formData = new FormData();
    formData.append("secret", secretKey);
    formData.append("response", captchaToken);

    const captchaRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });
    const captchaData = await captchaRes.json();

    if (!captchaData.success) {
      return { success: false, error: "CAPTCHA verification failed." };
    }

    // 2. Insert into Appwrite
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
