import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";

/** App frame: desktop sidebar + mobile top bar wrapping the page content. */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 md:flex-row">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <MobileNav />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
