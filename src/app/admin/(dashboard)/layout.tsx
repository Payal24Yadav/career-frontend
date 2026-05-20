"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { GraduationCap, LayoutDashboard, FileText, Briefcase, Building2, MessageSquare, Star, LogOut, Menu, X, ChevronRight, BookOpen, Users, Bell, ClipboardList } from "lucide-react";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Blogs", href: "/admin/blogs", icon: FileText },
  { name: "News", href: "/admin/news", icon: Bell },
  { name: "Jobs", href: "/admin/jobs", icon: Briefcase },
  { name: "Internships", href: "/admin/internships", icon: Briefcase },
  { name: "Colleges", href: "/admin/colleges", icon: Building2 },
  { name: "Programs", href: "/admin/programs", icon: BookOpen },
  { name: "Mock Tests", href: "/admin/mock-tests", icon: BookOpen },
  { name: "Questions", href: "/admin/mock-tests/questions", icon: ClipboardList },
  { name: "Test Registrations", href: "/admin/mock-test-registrations", icon: ClipboardList },
  { name: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  { name: "Testimonials", href: "/admin/testimonials", icon: Star },
  { name: "College Partners", href: "/admin/college-partners", icon: Users },
  { name: "Consultant Partners", href: "/admin/consultant-partners", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/admin/login");
  }, [user, loading, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return null;

  const handleLogout = async () => { await logout(); router.push("/admin/login"); };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-navy transform transition-transform duration-300 lg:translate-x-0 h-screen overflow-y-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center"><GraduationCap className="w-5 h-5 text-white" /></div>
              <span className="text-lg font-bold text-white">Career<span className="text-accent">Path</span></span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400"><X className="w-5 h-5" /></button>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link key={link.name} href={link.href} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-primary/20 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                  <Icon className="w-5 h-5" />{link.name}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-sm font-bold">{user.name?.charAt(0)}</div>
              <div><div className="text-sm text-white font-medium">{user.name}</div><div className="text-xs text-gray-500">{user.email}</div></div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 hover:text-navy"><Menu className="w-5 h-5" /></button>
          <div className="flex-1" />
          <Link href="/" className="text-sm text-primary hover:underline">View Site →</Link>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
