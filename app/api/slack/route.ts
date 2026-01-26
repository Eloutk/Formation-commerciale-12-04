import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: () => {},
        remove: () => {},
      },
    }
  )
  
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { pdfBase64, fileName, firstName, message, clientName, term, pseudo, userId } = body || {}

  if (!pdfBase64 || !fileName || !firstName || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    // Insérer dans glossary_suggestions pour déclencher le trigger
    const payload: Record<string, any> = {
      term: term || `Validation TM - ${clientName || 'Client'}`,
      pseudo: pseudo || firstName,
    }
    if (userId) payload.user_id = userId

    const { error } = await supabase
      .from('glossary_suggestions')
      .insert(payload)

    if (error) throw error

    // Envoi direct sur Slack avec le PDF via webhook
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL
    if (slackWebhookUrl) {
      // D'abord envoyer le message avec les infos
      const slackMessage = {
        text: `📋 Validation TM - ${clientName || 'Client'}`,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `📋 Validation TM - ${clientName || 'Client'}`
            }
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*Prénom:*\n${firstName}`
              },
              {
                type: 'mrkdwn',
                text: `*Client:*\n${clientName || 'Non spécifié'}`
              }
            ]
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Message:*\n${message}`
            }
          }
        ]
      }

      await fetch(slackWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slackMessage)
      }).catch(err => console.error('Slack webhook error:', err))

      // Ensuite uploader le PDF via l'API Slack files.upload
      const slackToken = process.env.SLACK_BOT_TOKEN
      const slackChannel = process.env.SLACK_CHANNEL_ID
      
      if (slackToken && slackChannel) {
        // Convertir base64 en buffer
        const pdfBuffer = Buffer.from(pdfBase64, 'base64')
        
        // Utiliser multipart/form-data pour l'upload de fichier
        const boundary = `----WebKitFormBoundary${Math.random().toString(36).substring(2)}`
        const formDataParts: string[] = []
        
        formDataParts.push(`--${boundary}`)
        formDataParts.push(`Content-Disposition: form-data; name="file"; filename="${fileName}"`)
        formDataParts.push(`Content-Type: application/pdf`)
        formDataParts.push('')
        formDataParts.push(pdfBuffer.toString('binary'))
        formDataParts.push(`--${boundary}`)
        formDataParts.push(`Content-Disposition: form-data; name="channels"`)
        formDataParts.push('')
        formDataParts.push(slackChannel)
        formDataParts.push(`--${boundary}`)
        formDataParts.push(`Content-Disposition: form-data; name="initial_comment"`)
        formDataParts.push('')
        formDataParts.push(`PDF de la stratégie PDV - ${clientName || 'Client'}`)
        formDataParts.push(`--${boundary}--`)
        
        const formDataBody = Buffer.from(formDataParts.join('\r\n'), 'binary')

        await fetch('https://slack.com/api/files.upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${slackToken}`,
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
          },
          body: formDataBody
        }).catch(err => console.error('Slack file upload error:', err))
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Error sending to Slack:', error)
    return NextResponse.json({ error: error.message || 'Failed to send to Slack' }, { status: 500 })
  }
}
