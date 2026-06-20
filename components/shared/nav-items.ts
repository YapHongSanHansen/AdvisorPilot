import {
  LayoutDashboard,
  PlusCircle,
  Sparkles,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
};

/** Primary navigation — the four MVP screens (create → rank → decide → audit). */
export const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Capacity & utilization overview",
  },
  {
    href: "/allocate",
    label: "New allocation",
    icon: PlusCircle,
    description: "Create a project & requirements",
  },
  {
    href: "/recommendations",
    label: "Recommendations",
    icon: Sparkles,
    description: "Ranked candidates & reasons",
  },
  {
    href: "/audit",
    label: "Audit",
    icon: BarChart3,
    description: "Workload & override analytics",
  },
];
