import { SimulateurMediaLinkPanel } from '@/components/vente/SimulateurMediaLinkPanel'

export default function StrategieSocialMediaPage() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Stratégie — Social Media</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Simulateur média multi-plateformes : estimez volumes, taux de pénétration et niveaux de
            pression pour construire votre stratégie.
          </p>
        </div>
        <SimulateurMediaLinkPanel />
      </div>
    </div>
  )
}
