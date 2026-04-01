import { NavLink } from 'react-router';
import { LayoutDashboard, Users, User, Settings, FileText, Shield, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/users', icon: Users, label: 'Users' },
  { to: '/roles', icon: Shield, label: 'Roles' },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/audit-logs', icon: FileText, label: 'Audit Logs' },
  { to: '/profile', icon: User, label: 'Profile' },
];

interface SidebarProps {
  onClose: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Logo area */}
      <div className="flex h-16 items-center justify-between px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-sidebar-foreground">SaaS Admin</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Separator className="opacity-50" />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          Menu
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary/10 text-primary border-l-[3px] border-primary pl-[9px]'
                  : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground border-l-[3px] border-transparent pl-[9px]'
              }`
            }
          >
            <item.icon className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-105" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t px-4 py-3">
        <div className="rounded-lg bg-muted/50 px-3 py-2.5">
          <p className="text-[11px] font-medium text-muted-foreground">SaaS Platform</p>
          <p className="text-[10px] text-muted-foreground/60">v1.0.0 · Admin Panel</p>
        </div>
      </div>
    </div>
  );
}
