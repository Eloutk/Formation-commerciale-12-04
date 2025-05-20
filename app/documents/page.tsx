'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"

export default function Documents() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Documents</h1>

        <Card>
          <CardHeader>
            <CardTitle>Guide des formats</CardTitle>
            <CardDescription>Documentation sur les formats publicitaires et leurs contraintes</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/Guide des formats visuels et des contraintes.pdf';
                link.download = 'Guide des formats visuels et des contraintes.pdf';
                link.onerror = () => {
                  alert('Le document n\'est pas disponible pour le moment. Veuillez réessayer plus tard.');
                };
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Télécharger le guide des formats
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 