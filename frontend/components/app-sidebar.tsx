"use client"

import { Scale, Gavel, FileText, BarChart3, Shield } from "lucide-react"
import { NetworkStatus } from "@/components/network-status"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"

const menuItems = [
  { title: "Dashboard", icon: Scale, url: "/" },
  { title: "Disputes", icon: Gavel, url: "/disputes" },
  { title: "File Dispute", icon: FileText, url: "/file" },
  { title: "Analytics", icon: BarChart3, url: "/analytics" },
  { title: "Admin", icon: Shield, url: "/admin" },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <div className="bg-black dark:bg-white p-2 rounded">
            <Scale className="h-5 w-5 text-white dark:text-black" />
          </div>
          <div>
            <h2 className="font-bold text-lg">Justice Oracle</h2>
            <p className="text-xs text-muted-foreground">AI Arbitration</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between text-xs">
          <div className="text-muted-foreground">
            <p className="font-medium">Justice Oracle v1.0</p>
            <p className="mt-1">Powered by GenLayer</p>
          </div>
          <NetworkStatus />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
