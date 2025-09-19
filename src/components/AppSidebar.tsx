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
} from "./ui/sidebar";
import { 
  BarChart3,
  Receipt,
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  FileText,
  Settings,
  LogOut,
  BookOpen,
  GraduationCap
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

interface AppSidebarProps {
  activePage: string;
  setActivePage: (page: any) => void;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

const menuItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        icon: BarChart3,
        id: "dashboard",
      },
    ],
  },
  {
    title: "Transactions",
    items: [
      {
        title: "Credit",
        icon: TrendingUp,
        id: "credit",
      },
      {
        title: "Debit",
        icon: TrendingDown,
        id: "debit",
      },
      {
        title: "Expenses",
        icon: Receipt,
        id: "expenses",
      },
    ],
  },
  {
    title: "Reports",
    items: [
      {
        title: "Reports",
        icon: FileText,
        id: "reports",
      },
    ],
  },
];

export function AppSidebar({ activePage, setActivePage, isOpen, onToggle }: AppSidebarProps) {
  return (
    <Sidebar className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200`}>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-white">One Ummah School</span>
            <span className="text-sm text-white/70">Finance Management</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-white/70">{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setActivePage(item.id)}
                      isActive={activePage === item.id}
                      className="w-full text-white hover:bg-white/10 data-[active=true]:bg-white data-[active=true]:text-primary"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Admin User" />
              <AvatarFallback>AU</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">Admin User</span>
              <span className="text-xs text-white/70">admin@school.edu</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <Button variant="ghost" size="sm" className="flex-1 text-white hover:bg-white/10">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 text-white hover:bg-white/10">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}