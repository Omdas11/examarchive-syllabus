import { cookies } from 'next/headers';
import { Client, Account, Databases, Query } from 'node-appwrite';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('ea_session');
  
  if (!sessionCookie?.value) {
    redirect(`https://examarchive.dev/login?redirect=${encodeURIComponent('https://syllabus.examarchive.dev/profile')}`);
  }

  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;
  const databaseId = process.env.DATABASE_ID || 'examarchive';

  const sessionClient = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setSession(sessionCookie.value);
  
  const account = new Account(sessionClient);
  let user;
  
  try {
    user = await account.get();
  } catch (e) {
    redirect(`https://examarchive.dev/login?redirect=${encodeURIComponent('https://syllabus.examarchive.dev/profile')}`);
  }

  // Use the admin client to fetch syllabus submissions for this user
  const adminClient = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(process.env.APPWRITE_API_KEY!);
    
  const databases = new Databases(adminClient);
  
  let submissions = [];
  try {
    const result = await databases.listDocuments(
      databaseId,
      'Syllabus_Table',
      [
        Query.equal('submitted_by', user.$id),
        Query.orderDesc('$createdAt')
      ]
    );
    submissions = result.documents;
  } catch (error) {
    console.error("Error fetching submissions:", error);
    // Ignore if attribute doesn't exist yet, we'll just show empty
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 p-4 md:p-8">
      <main className="max-w-5xl mx-auto flex flex-col gap-8">
        
        <nav className="flex items-center text-sm text-neutral-500 font-medium mb-2">
          <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </nav>

        <header className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">{user.name}</h1>
            <p className="text-neutral-500 mt-1">{user.email}</p>
          </div>
        </header>

        <section className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              My Submissions
            </h2>
            <div className="text-sm font-medium bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
              {submissions.length} Total
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {submissions.length === 0 ? (
              <div className="p-12 text-center text-neutral-500">
                You haven't submitted any syllabi for approval yet.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-sm font-semibold">
                  <tr>
                    <th className="px-6 py-4">Paper Code</th>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Submitted On</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {submissions.map((sub: any) => (
                    <tr key={sub.$id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4 font-bold">{sub.paper_code}</td>
                      <td className="px-6 py-4">
                        <div className="line-clamp-1">{sub.paper_name}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-500">
                        {new Date(sub.$createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {sub.status === 'approved' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            <CheckCircle className="w-3 h-3" /> Approved
                          </span>
                        ) : sub.status === 'rejected' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                            <XCircle className="w-3 h-3" /> Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                            <Clock className="w-3 h-3" /> Pending Review
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
        
      </main>
    </div>
  );
}
