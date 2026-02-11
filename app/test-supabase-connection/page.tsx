'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestSupabasePage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult('Test en cours...')
    
    try {
      // Test 1 : Ping direct de l'URL
      console.log('🔍 Test 1: Ping Supabase...')
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      
      const pingResponse = await fetch(`${url}/rest/v1/`, {
        method: 'HEAD',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        }
      })
      
      if (!pingResponse.ok) {
        setResult(`❌ Supabase ne répond pas (${pingResponse.status}).\n\n⚠️ Ton projet est probablement EN PAUSE.\n\nVa sur supabase.com/dashboard et restaure-le !`)
        setLoading(false)
        return
      }
      
      console.log('✅ Supabase répond!')
      
      // Test 2 : Vérifier la table profiles
      const tableResponse = await fetch(`${url}/rest/v1/profiles?select=count`, {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        }
      })
      
      const tableData = await tableResponse.text()
      
      setResult(
        `✅ Connexion Supabase OK!\n\n` +
        `URL: ${url}\n` +
        `Status ping: ${pingResponse.status}\n` +
        `Accès table profiles: ${tableResponse.ok ? 'OK' : 'ERREUR'}\n\n` +
        `➡️ Tu peux essayer de te connecter maintenant.`
      )
      
    } catch (error: any) {
      console.error('Erreur:', error)
      setResult(
        `❌ ERREUR: ${error.message}\n\n` +
        `Causes possibles:\n` +
        `1. Projet Supabase EN PAUSE (le plus probable)\n` +
        `2. Problème de réseau/firewall\n` +
        `3. URL Supabase incorrecte\n\n` +
        `➡️ Va sur supabase.com/dashboard et vérifie ton projet.`
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>🔧 Test de connexion Supabase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={testConnection} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Test en cours...' : 'Tester la connexion'}
          </Button>
          
          {result && (
            <pre className="bg-gray-100 p-4 rounded-lg whitespace-pre-wrap text-sm">
              {result}
            </pre>
          )}
          
          <div className="text-sm text-muted-foreground border-t pt-4">
            <p className="font-semibold mb-2">Si le projet est en pause :</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Va sur <a href="https://supabase.com/dashboard" target="_blank" className="text-blue-600 underline">supabase.com/dashboard</a></li>
              <li>Sélectionne ton projet</li>
              <li>Clique sur "Restore project" ou "Unpause"</li>
              <li>Attends 1-2 minutes que le projet redémarre</li>
              <li>Reviens ici et teste à nouveau</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
