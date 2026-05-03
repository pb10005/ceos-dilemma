import {
  Calendar,
  Banknote,
  TrendingUp,
  TrendingDown,
  Building2,
  Zap,
  Package,
  DollarSign,
  Swords,
  Users,
  Megaphone,
  Factory,
  UserPlus,
  FlaskConical,
  Tag,
  CreditCard,
  ArrowDownCircle,
  BarChart3,
  Lightbulb,
  History,
  Cloud,
  ShoppingCart,
  Wrench,
  AlertTriangle,
  XCircle,
  Info,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { EventCategory } from '@/types/game'

export {
  Calendar,
  Banknote,
  TrendingUp,
  TrendingDown,
  Building2,
  Zap,
  Package,
  DollarSign,
  Swords,
  Users,
  Megaphone,
  Factory,
  UserPlus,
  FlaskConical,
  Tag,
  CreditCard,
  ArrowDownCircle,
  BarChart3,
  Lightbulb,
  History,
  Cloud,
  ShoppingCart,
  Wrench,
  AlertTriangle,
  XCircle,
  Info,
}

export type { LucideIcon }

const categoryIconMap: Record<EventCategory, LucideIcon> = {
  market: Zap,
  supply: Package,
  finance: DollarSign,
  competition: Swords,
  internal: Users,
}

export function CategoryIcon({
  category,
  className = 'h-4 w-4',
}: {
  category: EventCategory
  className?: string
}) {
  const Icon = categoryIconMap[category]
  return <Icon className={className} />
}
