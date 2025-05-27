import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function DemandesPotentiels() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Demandes de potentiels</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Fiche brief avancée</CardTitle>
            <CardDescription>Remplissez ce tableau pour une étude approfondie du potentiel d'une campagne</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="my-8">
              <Image
                src="/images/Demande-de-potentiel-vierge.png"
                alt="Demande de potentiel vierge"
                width={800}
                height={400}
                className="rounded-lg border shadow-sm mx-auto"
              />
              <p className="text-sm text-muted-foreground text-center mt-2">
                Exemple de fiche brief à compléter pour l'étude de potentiel
              </p>
            </div>
            <div className="prose max-w-2xl mx-auto text-justify">
              <h3 className="text-xl font-semibold text-primary mb-2">À quoi sert ce tableau ?</h3>
              <ul className="list-disc list-inside space-y-2 pl-4">
                <li>Vérifier le potentiel d'une campagne sur une zone restreinte ou atypique</li>
                <li>Préparer des arguments de vente solides (données, ciblage, faisabilité)</li>
                <li>Appuyer la construction du dossier par un Traffic Manager</li>
                <li>Réaliser une étude approfondie pour un client à fort potentiel</li>
              </ul>
              <h3 className="text-xl font-semibold text-primary mb-2 mt-8">Pourquoi il est important ?</h3>
              <p>Il permet de cadrer la demande, de trouver les meilleurs ciblages et d'estimer les résultats potentiels.</p>
              <p>Certaines données sont obligatoires pour réaliser l'étude (ex : plateforme, géographie, âge cible, mots-clés).</p>
              <p>Plus le brief est complet, plus l'étude est fiable, rapide et exploitable en rendez-vous client.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 