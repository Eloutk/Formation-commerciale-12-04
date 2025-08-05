'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"

export default function DocumentsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Documents</h1>
        <p className="text-muted-foreground mb-8">Consultez les documents disponibles</p>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Guide des formats</CardTitle>
              <CardDescription>Documentation sur les formats publicitaires et leurs contraintes</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
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

          <Card>
            <CardHeader>
              <CardTitle>Guide de la chefferie de projet diffusion et production</CardTitle>
              <CardDescription>Chefferie de projet, Monday, rapports, davis et besoins n'auront plus de secret pour vous </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/Guide de la Chefferie de Projet - V1.pdf';
                  link.download = 'Guide de la chefferie de projet - V1.pdf';
                  link.onerror = () => {
                    alert('Le document n\'est pas disponible pour le moment. Veuillez réessayer plus tard.');
                  };
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger le guide des chefs de projet
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 