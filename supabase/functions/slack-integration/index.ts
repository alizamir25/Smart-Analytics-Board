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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    if (req.method === 'POST') {
      const body = await req.json()
      
      if (body.action === 'create') {
        // Create new Slack integration
        const { channel, webhook, alertTypes } = body
        
        const { data, error } = await supabaseClient
          .from('slack_integrations')
          .insert({
            channel,
            webhook,
            alert_types: alertTypes,
            active: true,
            created_at: new Date().toISOString()
          })
          .select()

        if (error) throw error

        return new Response(
          JSON.stringify({ success: true, data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (body.action === 'send_alert') {
        // Send alert to Slack channels
        const { alertType, title, message, data: alertData } = body
        
        // Get active integrations that should receive this alert type
        const { data: integrations, error } = await supabaseClient
          .from('slack_integrations')
          .select('*')
          .eq('active', true)
          .contains('alert_types', [alertType])

        if (error) throw error

        // Send to each Slack channel
        const slackPromises = integrations?.map(async (integration) => {
          try {
            const slackPayload = {
              channel: integration.channel,
              username: 'Analytics Bot',
              icon_emoji: ':chart_with_upwards_trend:',
              attachments: [
                {
                  color: getAlertColor(alertType),
                  title: title,
                  text: message,
                  fields: [
                    {
                      title: 'Alert Type',
                      value: alertType,
                      short: true
                    },
                    {
                      title: 'Timestamp',
                      value: new Date().toLocaleString(),
                      short: true
                    }
                  ],
                  footer: 'Analytics Dashboard',
                  ts: Math.floor(Date.now() / 1000)
                }
              ]
            }

            // Add data fields if provided
            if (alertData) {
              Object.keys(alertData).forEach(key => {
                slackPayload.attachments[0].fields.push({
                  title: key.replace(/_/g, ' ').toUpperCase(),
                  value: String(alertData[key]),
                  short: true
                })
              })
            }

            const response = await fetch(integration.webhook, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(slackPayload)
            })

            // Log Slack message
            await supabaseClient
              .from('slack_logs')
              .insert({
                integration_id: integration.id,
                alert_type: alertType,
                status: response.status,
                sent_at: new Date().toISOString()
              })

            return { integration_id: integration.id, status: response.status, success: response.ok }
          } catch (error) {
            // Log failed Slack message
            await supabaseClient
              .from('slack_logs')
              .insert({
                integration_id: integration.id,
                alert_type: alertType,
                status: 0,
                error: error.message,
                sent_at: new Date().toISOString()
              })

            return { integration_id: integration.id, error: error.message, success: false }
          }
        }) || []

        const results = await Promise.all(slackPromises)

        return new Response(
          JSON.stringify({ 
            success: true, 
            sent: results.length,
            results 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    if (req.method === 'GET') {
      // Get all Slack integrations
      const { data, error } = await supabaseClient
        .from('slack_integrations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function getAlertColor(alertType: string): string {
  switch (alertType) {
    case 'threshold_breached':
      return 'danger'
    case 'anomaly_detected':
      return 'warning'
    case 'goal_achieved':
      return 'good'
    default:
      return '#36a64f'
  }
}