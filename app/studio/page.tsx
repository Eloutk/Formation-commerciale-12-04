"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function StudioPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Studio - Guide des formats visuels</h1>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Page en construction</CardTitle>
              <CardDescription>
                Cette page est actuellement en cours de développement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Le contenu sera bientôt disponible.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
