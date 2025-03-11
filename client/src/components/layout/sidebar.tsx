import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, ClipboardList, Calendar, PieChart } from "lucide-react";

const sidebarItems = [
  { href: "/clubs", label: "Clubs", icon: Users },
  { href: "/students", label: "Students", icon: ClipboardList },
  { href: "/activities", label: "Activities", icon: Calendar },
  { href: "/reports", label: "Reports", icon: PieChart },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="flex h-screen border-r">
      <div className="flex w-60 flex-col">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold">Victory School</h2>
          <p className="text-sm text-muted-foreground">Club Management</p>
        </div>
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-2 py-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={location === item.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-2",
                      location === item.href && "bg-secondary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
