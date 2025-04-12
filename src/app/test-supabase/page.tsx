'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function TestSupabase() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase.from('test').select('*').limit(1)
        
        if (error) {
          setStatus('error')
          setMessage(`Erreur de connexion: ${error.message}`)
        } else {
          setStatus('success')
          setMessage('Connexion à Supabase réussie !')
        }
      } catch (err) {
        setStatus('error')
        setMessage(`Erreur: ${err.message}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test de connexion Supabase</h1>
      <div className={`p-4 rounded-lg ${
        status === 'loading' ? 'bg-gray-100' :
        status === 'success' ? 'bg-green-100' :
        'bg-red-100'
      }`}>
        {status === 'loading' && 'Test de connexion en cours...'}
        {status === 'success' && message}
        {status === 'error' && message}
      </div>
    </div>
  )
} 