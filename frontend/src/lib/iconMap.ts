import {
  Brain,
  Database,
  BarChart3,
  Globe,
  Server,
  Code2,
  Github,
  Linkedin,
  Mail,
  BookOpen,
  Coffee,
  Gamepad2,
  Twitter,
  ExternalLink,
  type LucideIcon,
} from 'lucide-react'

const icons: Record<string, LucideIcon> = {
  Brain,
  Database,
  BarChart3,
  Globe,
  Server,
  Code2,
  Github,
  Linkedin,
  Mail,
  BookOpen,
  Coffee,
  Gamepad2,
  Twitter,
  ExternalLink,
}

export function getIcon(name: string): LucideIcon {
  return icons[name] ?? ExternalLink
}
