import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { recipients, reportName, pdfUrl, fileName } = await req.json()
    
    // Get email service API key from Supabase secrets
    const emailApiKey = Deno.env.get('EMAIL_API_KEY')
    const emailServiceUrl = Deno.env.get('EMAIL_SERVICE_URL') || 'https://api.sendgrid.v3/mail/send'
    
    if (!emailApiKey) {
      throw new Error('Email API key not configured')
    }

    // Download PDF file to attach to email
    const pdfResponse = await fetch(pdfUrl)
    const pdfBuffer = await pdfResponse.arrayBuffer()
    const pdfBase64 = btoa(String.fromCharCode(...new Uint8Array(pdfBuffer)))

    // Prepare email content
    const emailData = {
      personalizations: recipients.map((email: string) => ({
        to: [{ email }],
        subject: `${reportName} - ${new Date().toLocaleDateString()}`
      })),
      from: {
        email: 'reports@yourcompany.com',
        name: 'Analytics Reports'
      },
      content: [
        {
          type: 'text/html',
          value: `
            <h2>${reportName}</h2>
            <p>Please find your scheduled analytics report attached.</p>
            <p>This report was generated on ${new Date().toLocaleDateString()} and contains the latest insights from your dashboards.</p>
            <br>
            <p>Best regards,<br>Analytics Team</p>
          `
        }
      ],
      attachments: [
        {
          content: pdfBase64,
          filename: fileName,
          type: 'application/pdf',
          disposition: 'attachment'
        }
      ]
    }

    // Send email using SendGrid (or your preferred email service)
    const emailResponse = await fetch(emailServiceUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${emailApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    })

    if (!emailResponse.ok) {
      throw new Error(`Email service error: ${emailResponse.statusText}`)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Report sent to ${recipients.length} recipients` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})