import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Layout,
  GitBranch,
  Target,
  FolderTree,
  Users,
  LineChart,
  BadgeCheck,
  Settings,
  ChevronRight,
} from "lucide-react"

interface ModuleCardProps {
  title: string
  description: string
  href: string
  progress: number
  quizScore?: number | null
  icon:
    | "BookOpen"
    | "Layout"
    | "GitBranch"
    | "Target"
    | "FolderTree"
    | "Users"
    | "LineChart"
    | "BadgeCheck"
    | "Settings"
}

export default function ModuleCard({ title, description, href, progress, quizScore, icon }: ModuleCardProps) {
  const IconComponent = {
    BookOpen,
    Layout,
    GitBranch,
    Target,
    FolderTree,
    Users,
    LineChart,
    BadgeCheck,
    Settings,
  }[icon]

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <IconComponent className="h-6 w-6" />
          </div>
          {/* Progress percentage removed per UX */}
        </div>
        <CardTitle className="mt-4">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
        {/* Progress bar removed per UX */}

        {/* Quiz percentage removed per UX */}
      </CardContent>
      <CardFooter>
        <Button asChild variant="ghost" className="w-full justify-between">
          <Link href={href}>
            Accéder au module
            <ChevronRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

