import Link from "next/link";
import { LayoutDashboard, Building2, FileText, ExternalLink } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top nav */}
      <nav className="bg-[#0C2C1C] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-0 h-14">
          <div className="flex items-center gap-2 pr-6 border-r border-white/10 mr-2">
            <span className="text-base font-bold">Lapor Bupati</span>
            <span className="text-gold-400 font-bold text-base">Admin</span>
          </div>
          <NavLink href="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" />
          <NavLink href="/dashboard/laporan" icon={<FileText className="w-4 h-4" />} label="Laporan" />
          <NavLink href="/dashboard/opd" icon={<Building2 className="w-4 h-4" />} label="Kelola OPD" />
          <div className="ml-auto">
            <Link href="/" target="_blank"
              className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10">
              <ExternalLink className="w-3.5 h-3.5" /> Form Publik
            </Link>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {children}
      </main>
    </div>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all font-medium">
      {icon} {label}
    </Link>
  );
}
