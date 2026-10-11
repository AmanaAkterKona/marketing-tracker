import {
  Activity, Users, Mail, Server, BarChart3, Database, Globe2, Layers,
  Target, Zap, ShieldCheck, Code2, Cloud, Link2, LineChart, PieChart,
  Megaphone, Search, Settings, Workflow, ShoppingCart, Cpu, GitBranch, Rocket,
  type LucideIcon
} from 'lucide-react';

// Icons the admin can pick for Expertise cards and Project cards.
export const ICON_OPTIONS: Record<string, LucideIcon> = {
  Activity, Users, Mail, Server, BarChart3, Database, Globe2, Layers,
  Target, Zap, ShieldCheck, Code2, Cloud, Link2, LineChart, PieChart,
  Megaphone, Search, Settings, Workflow, ShoppingCart, Cpu, GitBranch, Rocket
};

export const ICON_KEYS = Object.keys(ICON_OPTIONS);

// Icon for a saved key; falls back to a default list by position (old behaviour).
export function resolveIcon(key: string | undefined, index: number, defaults: LucideIcon[]): LucideIcon {
  if (key && ICON_OPTIONS[key]) return ICON_OPTIONS[key];
  return defaults[index % defaults.length];
}