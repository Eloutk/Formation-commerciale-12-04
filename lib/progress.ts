// Données de progression des modules (simulées)
// Dans une application réelle, ces données viendraient d'une base de données ou d'une API

interface Module {
  id: string
  title: string
  description: string
  href: string
  progress: number
  quizScore: number | null
  icon: string
}

export function getModulesProgress() {
  const modules: Module[] = [
    {
      id: "methodologie-link",
      title: "Méthodologie Link",
      description: "Découvrez la différence entre Community Manager et Traffic Manager",
      href: "/formation/methodologie-link",
      progress: 100,
      quizScore: 85,
      icon: "BookOpen",
    },
    {
      id: "plateformes-placement",
      title: "Plateformes et placement",
      description: "Explorez les différentes plateformes de publicité digitale",
      href: "/formation/plateformes-placement",
      progress: 100,
      quizScore: 90,
      icon: "Layout",
    },
    {
      id: "tunnel-conversion",
      title: "Tunnel de conversion",
      description: "Optimisez votre stratégie de conversion",
      href: "/formation/tunnel-conversion",
      progress: 75,
      quizScore: 80,
      icon: "GitBranch",
    },
    {
      id: "objectifs-campagne",
      title: "Objectifs de campagne",
      description: "Définissez des objectifs SMART pour vos campagnes",
      href: "/formation/objectifs-campagne",
      progress: 60,
      quizScore: 75,
      icon: "Target",
    },
    {
      id: "ciblage",
      title: "Ciblage",
      description: "Maîtrisez les stratégies de ciblage par plateforme",
      href: "/formation/ciblage",
      progress: 30,
      quizScore: null,
      icon: "Users",
    },
    {
      id: "architecture-campagnes",
      title: "Architecture des campagnes",
      description: "Structurez efficacement vos campagnes publicitaires",
      href: "/formation/architecture-campagnes",
      progress: 40,
      quizScore: 65,
      icon: "FolderTree",
    },
    {
      id: "tracking",
      title: "Tracking",
      description: "Suivez et analysez les performances de vos campagnes",
      href: "/formation/tracking",
      progress: 100,
      quizScore: 95,
      icon: "LineChart",
    },
    {
      id: "score-qualite",
      title: "Score qualité",
      description: "Améliorez la qualité de vos annonces et landing pages",
      href: "/formation/score-qualite",
      progress: 100,
      quizScore: 85,
      icon: "BadgeCheck",
    },
    {
      id: "optimisations",
      title: "Optimisations",
      description: "Techniques d'optimisation pour maximiser vos résultats",
      href: "/formation/optimisations",
      progress: 50,
      quizScore: 70,
      icon: "Settings",
    },
  ]

  // Calculer la progression globale
  const totalModules = modules.length
  const totalProgress = modules.reduce((sum, module) => sum + module.progress, 0)
  const overallProgress = Math.round(totalProgress / totalModules)

  return { modules, overallProgress }
}

