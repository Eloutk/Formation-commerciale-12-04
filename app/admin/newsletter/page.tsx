'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { checkIsAdmin } from '@/lib/admin'
import supabase from '@/utils/supabase/client'
import { Plus, Trash2, Save, Loader2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

interface MonthlyContent {
  id?: string
  month: number
  year: number
  actu_flash_title: string
  actu_flash_description: string
  success_items: string[]
  digital_info_title: string
  digital_info_description: string
  digital_info_tags: string[]
  new_clients: Array<{ name: string; date: string; type: string }>
}

export default function AdminNewsletterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [selectedYear, setSelectedYear] = useState(currentYear)
  
  const [content, setContent] = useState<MonthlyContent>({
    month: currentMonth,
    year: currentYear,
    actu_flash_title: '',
    actu_flash_description: '',
    success_items: [''],
    digital_info_title: '',
    digital_info_description: '',
    digital_info_tags: [''],
    new_clients: [{ name: '', date: '', type: '' }],
  })

  const monthNames = [
    '', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ]

  // Vérifier si l'utilisateur est admin
  useEffect(() => {
    async function verifyAdmin() {
      const adminStatus = await checkIsAdmin()
      setIsAdmin(adminStatus)
      
      if (!adminStatus) {
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les droits d'administrateur.",
          variant: "destructive"
        })
        router.push('/home')
        return
      }
      
      setLoading(false)
      loadContent(selectedMonth, selectedYear)
    }
    
    verifyAdmin()
  }, [router, toast])

  // Charger le contenu d'un mois spécifique
  async function loadContent(month: number, year: number) {
    try {
      const { data, error } = await supabase
        .from('monthly_content')
        .select('*')
        .eq('month', month)
        .eq('year', year)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setContent({
          id: data.id,
          month: data.month,
          year: data.year,
          actu_flash_title: data.actu_flash_title || '',
          actu_flash_description: data.actu_flash_description || '',
          success_items: data.success_items || [''],
          digital_info_title: data.digital_info_title || '',
          digital_info_description: data.digital_info_description || '',
          digital_info_tags: data.digital_info_tags || [''],
          new_clients: data.new_clients || [{ name: '', date: '', type: '' }],
        })
      } else {
        // Réinitialiser avec des valeurs vides
        setContent({
          month,
          year,
          actu_flash_title: '',
          actu_flash_description: '',
          success_items: [''],
          digital_info_title: '',
          digital_info_description: '',
          digital_info_tags: [''],
          new_clients: [{ name: '', date: '', type: '' }],
        })
      }
    } catch (error) {
      console.error('Error loading content:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger le contenu.",
        variant: "destructive"
      })
    }
  }

  // Sauvegarder le contenu
  async function saveContent() {
    setSaving(true)
    
    try {
      const payload = {
        month: selectedMonth,
        year: selectedYear,
        actu_flash_title: content.actu_flash_title,
        actu_flash_description: content.actu_flash_description,
        success_items: content.success_items.filter(item => item.trim() !== ''),
        digital_info_title: content.digital_info_title,
        digital_info_description: content.digital_info_description,
        digital_info_tags: content.digital_info_tags.filter(tag => tag.trim() !== ''),
        new_clients: content.new_clients.filter(client => client.name.trim() !== ''),
      }

      if (content.id) {
        // Mise à jour
        const { error } = await supabase
          .from('monthly_content')
          .update(payload)
          .eq('id', content.id)

        if (error) throw error
      } else {
        // Insertion
        const { data: { user } } = await supabase.auth.getUser()
        const { data, error } = await supabase
          .from('monthly_content')
          .insert({ ...payload, created_by: user?.id })
          .select()
          .single()

        if (error) throw error
        
        setContent(prev => ({ ...prev, id: data.id }))
      }

      toast({
        title: "Sauvegarde réussie",
        description: `Contenu de ${monthNames[selectedMonth]} ${selectedYear} enregistré.`,
      })
    } catch (error) {
      console.error('Error saving content:', error)
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le contenu.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#E94C16]" />
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gestion Newsletter Homepage</h1>
        <p className="text-muted-foreground">
          Éditer les informations mensuelles affichées sur la page d'accueil
        </p>
      </div>

      {/* Sélecteur Mois/Année */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sélectionner le mois</CardTitle>
          <CardDescription>Choisissez le mois et l'année à éditer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Mois</Label>
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => {
                  const month = parseInt(value)
                  setSelectedMonth(month)
                  loadContent(month, selectedYear)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {monthNames.slice(1).map((name, index) => (
                    <SelectItem key={index + 1} value={(index + 1).toString()}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Année</Label>
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => {
                  const year = parseInt(value)
                  setSelectedYear(year)
                  loadContent(selectedMonth, year)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2026, 2027, 2028, 2029, 2030].map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* L'actu flash */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📰 L'actu flash</CardTitle>
          <CardDescription>Nouvelle importante du mois (arrivée, promotion, etc.)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Titre</Label>
            <Input
              placeholder="Ex: Bienvenue à Nicolas Da Cruz"
              value={content.actu_flash_title}
              onChange={(e) => setContent(prev => ({ ...prev, actu_flash_title: e.target.value }))}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              placeholder="Ex: qui a rejoint Link le 26 Janvier au poste de monteur"
              value={content.actu_flash_description}
              onChange={(e) => setContent(prev => ({ ...prev, actu_flash_description: e.target.value }))}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Les succès du mois */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🏆 Les succès du mois</CardTitle>
          <CardDescription>Victoires, nouveaux contrats, renouvellements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {content.success_items.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Textarea
                placeholder="Ex: Le Canada ainsi que le Campus du Lac repartent avec nous pour une nouvelle saison !"
                value={item}
                onChange={(e) => {
                  const newItems = [...content.success_items]
                  newItems[index] = e.target.value
                  setContent(prev => ({ ...prev, success_items: newItems }))
                }}
                rows={2}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const newItems = content.success_items.filter((_, i) => i !== index)
                  setContent(prev => ({ ...prev, success_items: newItems.length > 0 ? newItems : [''] }))
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => setContent(prev => ({ ...prev, success_items: [...prev.success_items, ''] }))}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un succès
          </Button>
        </CardContent>
      </Card>

      {/* Info digitale */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>💡 Info digitale du mois</CardTitle>
          <CardDescription>Actualité tech, IA, nouveaux outils</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Titre</Label>
            <Input
              placeholder="Ex: Les nouveautés META pour 2026"
              value={content.digital_info_title}
              onChange={(e) => setContent(prev => ({ ...prev, digital_info_title: e.target.value }))}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              placeholder="Description de l'info digitale..."
              value={content.digital_info_description}
              onChange={(e) => setContent(prev => ({ ...prev, digital_info_description: e.target.value }))}
              rows={3}
            />
          </div>
          <div>
            <Label>Tags</Label>
            <div className="space-y-2">
              {content.digital_info_tags.map((tag, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Ex: META, IA, Algorithme..."
                    value={tag}
                    onChange={(e) => {
                      const newTags = [...content.digital_info_tags]
                      newTags[index] = e.target.value
                      setContent(prev => ({ ...prev, digital_info_tags: newTags }))
                    }}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const newTags = content.digital_info_tags.filter((_, i) => i !== index)
                      setContent(prev => ({ ...prev, digital_info_tags: newTags.length > 0 ? newTags : [''] }))
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => setContent(prev => ({ ...prev, digital_info_tags: [...prev.digital_info_tags, ''] }))}
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un tag
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nouveaux clients */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>👥 Nouveaux clients</CardTitle>
          <CardDescription>Clients arrivés ce mois-ci</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.new_clients.map((client, index) => (
            <div key={index} className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-end">
              <div>
                <Label>Nom du client</Label>
                <Input
                  placeholder="Ex: Carrefour Market"
                  value={client.name}
                  onChange={(e) => {
                    const newClients = [...content.new_clients]
                    newClients[index].name = e.target.value
                    setContent(prev => ({ ...prev, new_clients: newClients }))
                  }}
                />
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={client.date}
                  onChange={(e) => {
                    const newClients = [...content.new_clients]
                    newClients[index].date = e.target.value
                    setContent(prev => ({ ...prev, new_clients: newClients }))
                  }}
                  className="w-36"
                />
              </div>
              <div>
                <Label>Type</Label>
                <Input
                  placeholder="Retail"
                  value={client.type}
                  onChange={(e) => {
                    const newClients = [...content.new_clients]
                    newClients[index].type = e.target.value
                    setContent(prev => ({ ...prev, new_clients: newClients }))
                  }}
                  className="w-24"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const newClients = content.new_clients.filter((_, i) => i !== index)
                  setContent(prev => ({ 
                    ...prev, 
                    new_clients: newClients.length > 0 ? newClients : [{ name: '', date: '', type: '' }] 
                  }))
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => setContent(prev => ({ 
              ...prev, 
              new_clients: [...prev.new_clients, { name: '', date: '', type: '' }] 
            }))}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un client
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 sticky bottom-4 bg-background/95 backdrop-blur py-4 border-t">
        <Button
          onClick={saveContent}
          disabled={saving}
          className="flex-1 bg-[#E94C16] hover:bg-[#E94C16]/90"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Enregistrer
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push('/home')}
        >
          Annuler
        </Button>
      </div>
    </div>
  )
}
