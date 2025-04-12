import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
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
          <div className="text-sm text-muted-foreground">{progress}% complété</div>
        </div>
        <CardTitle className="mt-4">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
        <Progress value={progress} className="h-2 mt-4" />

        {quizScore !== null && quizScore !== undefined && (
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Quiz:</span>
            <span className={`font-medium ${quizScore >= 70 ? "text-green-600" : "text-amber-600"}`}>{quizScore}%</span>
          </div>
        )}
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

