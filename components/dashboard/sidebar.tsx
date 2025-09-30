"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutDashboard, FolderKanban, LogOut, User } from "lucide-react";
import { authHelper } from "@/lib/helpers/auth.helper";
import { ROUTES, TOAST_MESSAGES } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const navigation = [
  {
    name: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    name: "Service Categories",
    href: ROUTES.SERVICE_CATEGORIES,
    icon: FolderKanban,
  },
  {
    name: "Profile",
    href: ROUTES.PROFILE,
    icon: User,
  },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = () => {
    authHelper.clearAuth();
    toast({
      title: "Success",
      description: TOAST_MESSAGES.LOGOUT_SUCCESS,
    });
    router.push(ROUTES.LOGIN);
  };

  const handleNavClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  const normalize = (p: string | undefined) => {
    if (!p) return "";
    if (p === "/") return "/";
    return p.endsWith("/") ? p.slice(0, -1) : p;
  };

  const current = normalize(pathname);
  const activeItem = navigation.reduce<(typeof navigation)[number] | undefined>(
    (best, navItem) => {
      const navHref = normalize(navItem.href);
      if (!navHref) return best;
      const matches = current === navHref || current.startsWith(navHref + "/");
      if (!matches) return best;
      if (!best) return navItem;
      return navHref.length > normalize(best.href).length ? navItem : best;
    },
    undefined
  );

  return (
    <div className="flex h-full flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <Link
          href={ROUTES.DASHBOARD}
          className="flex items-center gap-2 font-semibold"
          onClick={handleNavClick}
        >
          <Image src="/icon.png" alt="BeHub Logo" width={24} height={24} />
          <span className="text-lg">BeHub Admin</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive = activeItem?.name === item.name;

            return (
              <Link key={item.name} href={item.href} onClick={handleNavClick}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive && "bg-secondary"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <div className="border-t p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 font-bold hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
