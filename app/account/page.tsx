"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import supabase from '@/utils/supabase/client'

export default function AccountPage() {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [lastSeen, setLastSeen] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        setLoading(false)
        return
      }
      setEmail(session.user.email || '')

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, last_seen_at')
        .eq('id', session.user.id)
        .maybeSingle()

      setFullName(profile?.full_name || '')
      setLastSeen(profile?.last_seen_at ? new Date(profile.last_seen_at).toLocaleString() : '')
      setLoading(false)
    }
    load()
  }, [])

  const onSave = async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return
    await supabase.from('profiles').update({ full_name: fullName }).eq('id', session.user.id)
    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Mon compte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input value={email} readOnly />
          </div>
          <div className="grid gap-2">
            <Label>Nom complet</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Votre nom" />
          </div>
          {lastSeen && (
            <div className="text-sm text-muted-foreground">Dernière activité: {lastSeen}</div>
          )}
          <Button onClick={onSave} disabled={loading}>{loading ? 'Enregistrement...' : 'Enregistrer'}</Button>
        </CardContent>
      </Card>
    </div>
  )
}

