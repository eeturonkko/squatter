"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Scale } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useConvexAuth } from "convex/react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function WeeksSidebar() {
  const { isAuthenticated } = useConvexAuth();
  const weeks = useQuery(api.weeksAndWeight.getWeeksByUserId);
  const pathname = usePathname();

  // Don't render sidebar if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Group weeks by target (bulk/cut)
  const bulkWeeks = weeks?.filter((week) => week.target === "bulk") || [];
  const cutWeeks = weeks?.filter((week) => week.target === "cut") || [];

  return (
    <Sidebar
      collapsible="none"
      className="w-64 min-w-64 border-r border-border h-[calc(100vh-4rem)] top-16 sticky"
    >
      <SidebarHeader className="h-14 border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4">
          <Dumbbell className="h-5 w-5" />
          <span className="font-medium">Progression Weeks</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {!weeks || weeks.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            No weeks created yet. Create your first week to get started.
          </div>
        ) : (
          <>
            {bulkWeeks.length > 0 && (
              <SidebarGroup>
                <SidebarGroupLabel className="flex items-center">
                  <span className="flex items-center gap-2">
                    <Dumbbell className="h-4 w-4 text-emerald-500" />
                    Bulk Weeks
                  </span>
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {bulkWeeks.map((week) => (
                      <SidebarMenuItem key={week._id}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === `/weeks/${week._id}`}
                        >
                          <Link href={`/weeks/${week._id}`}>
                            <span>{week.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

            {cutWeeks.length > 0 && (
              <SidebarGroup>
                <SidebarGroupLabel className="flex items-center">
                  <span className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-purple-500" />
                    Cut Weeks
                  </span>
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {cutWeeks.map((week) => (
                      <SidebarMenuItem key={week._id}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === `/weeks/${week._id}`}
                        >
                          <Link href={`/weeks/${week._id}`}>
                            <span>{week.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </>
        )}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="text-xs text-muted-foreground">
          Track your progress through each week
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
