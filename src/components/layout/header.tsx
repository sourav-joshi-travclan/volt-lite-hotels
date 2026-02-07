"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
} from "@/components/ui/resizable-navbar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth-store";
import { LogOut, Search, Calendar, User } from "lucide-react";
import { useState } from "react";

const navItems = [
  { name: "Search", link: "/search" },
  { name: "Bookings", link: "/bookings" },
];

export function Header() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    logout();
    router.push("/login");
    router.refresh();
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <Navbar className="sticky inset-x-0 top-0 z-50 w-full">
      <div className="pt-4 px-2 md:px-4">
        {/* Desktop */}
        <NavBody
          className="!min-w-0 !bg-[var(--surface)]/90 dark:!bg-[var(--surface)]/90 !rounded-2xl border border-[var(--border)]"
        >
          <Link
            href="/search"
            className="relative z-20 flex items-center gap-2 px-4 py-2 text-white font-semibold tracking-tight"
          >
            <span className="text-lg">Volt</span>
            <span className="text-muted-foreground text-sm font-normal hidden sm:inline">
              Hotels
            </span>
          </Link>
          <NavItems
            items={navItems}
            onItemClick={closeMobile}
            className="!text-muted-foreground [&_a:hover]:!text-white"
          />
          <div className="relative z-20 flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[var(--accent-primary)] text-white">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-500 focus:text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </NavBody>

        {/* Mobile */}
        <MobileNav
          className="!bg-[var(--surface)]/90 dark:!bg-[var(--surface)]/90 !rounded-2xl border border-[var(--border)]"
        >
          <MobileNavHeader>
            <Link
              href="/search"
              onClick={closeMobile}
              className="flex items-center gap-2 font-semibold tracking-tight text-white px-2"
            >
              <span className="text-lg">Volt</span>
              <span className="text-muted-foreground text-sm font-normal">Hotels</span>
            </Link>
            <MobileNavToggle isOpen={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)} />
          </MobileNavHeader>
          <MobileNavMenu isOpen={mobileOpen} onClose={closeMobile}>
            {navItems.map((item) => (
              <Link
                key={item.link}
                href={item.link}
                onClick={closeMobile}
                className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-white rounded-lg hover:bg-[var(--surface-elevated)]"
              >
                {item.name === "Search" ? <Search className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
                {item.name}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground hover:text-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <User className="h-4 w-4 mr-2" />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-500 focus:text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </MobileNavMenu>
        </MobileNav>
      </div>
    </Navbar>
  );
}
