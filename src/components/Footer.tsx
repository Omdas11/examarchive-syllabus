import Image from 'next/image';

const PLATFORM_LOGOS = [
  { href: "https://github.com/Omdas11/examarchive-v3", title: "GitHub",  src: "/branding/footer/partner-github.png" },
  { href: "https://www.google.com",                    title: "Google",  src: "/branding/footer/partner-google.png" },
  { href: "https://appwrite.io",                       title: "Appwrite", src: "/branding/footer/partner-appwrite.png" },
  { href: "https://nextjs.org",                        title: "Next.js", src: "/branding/footer/partner-netxjs.png" },
];

export function Footer() {
  return (
    <footer
      className="mt-20 pt-16 pb-12 text-sm border-t border-outline-variant/10 w-full"
      style={{
        background: "linear-gradient(180deg, var(--brand-emerald-soft) 0%, var(--color-bg) 100%)",
        color: "var(--color-text-muted)",
        letterSpacing: "0.01em",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* ── 3-column link grid ── */}
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {/* Resources */}
          <div className="flex flex-col gap-3">
            <h4 className="mb-2 text-xs font-black uppercase tracking-[0.15em] text-primary">Resources</h4>
            <a href="https://examarchive.dev" className="hover:text-primary transition-colors text-sm font-medium">Home</a>
            <a href="https://examarchive.dev/browse" className="hover:text-primary transition-colors text-sm font-medium">Browse Archive</a>
            <a href="https://examarchive.dev/upload" className="hover:text-primary transition-colors text-sm font-medium">Upload Paper</a>
            <a href="https://examarchive.dev/syllabus" className="hover:text-primary transition-colors text-sm font-medium">Syllabus Library</a>
            <a href="https://examarchive.dev/about" className="hover:text-primary transition-colors text-sm font-medium">About ExamArchive</a>
          </div>

          {/* Platform info */}
          <div className="flex flex-col gap-3">
            <h4 className="mb-2 text-xs font-black uppercase tracking-[0.15em] text-primary">Syllabus Vault</h4>
            <span className="text-sm font-medium leading-relaxed">
              Currently in <strong className="text-on-surface">Verification Phase</strong> · Collaboratively extracting and vetting syllabi.
            </span>
            <span className="text-sm font-medium text-on-surface-variant/80">
              Community-driven · Admin-verified repository for FYUGP students.
            </span>
            <a href="https://examarchive.dev/about" className="text-primary font-bold text-sm hover:underline decoration-2 underline-offset-4 transition-all">
              Learn more about our mission →
            </a>
          </div>

          {/* Help & Support */}
          <div className="flex flex-col gap-3">
            <h4 className="mb-2 text-xs font-black uppercase tracking-[0.15em] text-primary">Help &amp; Support</h4>
            <a href="https://examarchive.dev/support" className="hover:text-primary transition-colors text-sm font-medium">Technical Support</a>
            <a href="https://examarchive.dev/support" className="hover:text-primary transition-colors text-sm font-medium">Contact Team</a>
            <a href="https://examarchive.dev/support" className="hover:text-primary transition-colors text-sm font-medium">Send Feedback</a>
            <a href="https://examarchive.dev/terms" className="hover:text-primary transition-colors text-sm font-medium">Terms &amp; Conditions</a>
            <a href="https://examarchive.dev/privacy" className="hover:text-primary transition-colors text-sm font-medium">Privacy Policy</a>
          </div>
        </div>

        {/* ── Platform logos ── */}
        <div className="py-10 text-center border-t border-outline-variant/10">
          <p className="mb-6 text-[10px] font-black tracking-[0.2em] uppercase opacity-40">Powered By</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {PLATFORM_LOGOS.map((logo) => (
              <a
                key={logo.href}
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                title={logo.title}
                className="opacity-40 hover:opacity-100 transition-all hover:scale-110 grayscale hover:grayscale-0"
                style={{ display: "inline-flex", alignItems: "center" }}
              >
                <Image
                  src={logo.src}
                  alt={logo.title}
                  width={32}
                  height={32}
                  style={{ objectFit: "contain", maxHeight: 32 }}
                />
              </a>
            ))}
          </div>
        </div>

        {/* ── Footer meta ── */}
        <div className="pt-8 text-center flex flex-col items-center gap-4 border-t border-outline-variant/10">
          <p className="text-xs font-medium opacity-60">
            © {new Date().getFullYear()} <span className="font-bold text-on-surface">ExamArchive</span> · Built by students for students · Soft Launch Phase
          </p>
        </div>
      </div>
    </footer>
  );
}
