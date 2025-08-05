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
        // Create new webhook
        const { name, url, triggers } = body
        
        const { data, error } = await supabaseClient
          .from('webhooks')
          .insert({
            name,
            url,
            triggers,
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

      if (body.action === 'trigger') {
        // Trigger webhooks based on event
        const { eventType, data: eventData } = body
        
        // Get active webhooks that should be triggered by this event
        const { data: webhooks, error } = await supabaseClient
          .from('webhooks')
          .select('*')
          .eq('active', true)
          .contains('triggers', [eventType])

        if (error) throw error

        // Trigger each webhook
        const webhookPromises = webhooks?.map(async (webhook) => {
          try {
            const response = await fetch(webhook.url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Analytics-Webhook/1.0'
              },
              body: JSON.stringify({
                event: eventType,
                timestamp: new Date().toISOString(),
                data: eventData,
                webhook_id: webhook.id
              })
            })

            // Log webhook execution
            await supabaseClient
              .from('webhook_logs')
              .insert({
                webhook_id: webhook.id,
                event_type: eventType,
                status: response.status,
                response_time: Date.now(),
                executed_at: new Date().toISOString()
              })

            return { webhook_id: webhook.id, status: response.status, success: response.ok }
          } catch (error) {
            // Log failed webhook
            await supabaseClient
              .from('webhook_logs')
              .insert({
                webhook_id: webhook.id,
                event_type: eventType,
                status: 0,
                error: error.message,
                executed_at: new Date().toISOString()
              })

            return { webhook_id: webhook.id, error: error.message, success: false }
          }
        }) || []

        const results = await Promise.all(webhookPromises)

        return new Response(
          JSON.stringify({ 
            success: true, 
            triggered: results.length,
            results 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    if (req.method === 'GET') {
      // Get all webhooks
      const { data, error } = await supabaseClient
        .from('webhooks')
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