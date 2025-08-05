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

    // This function is triggered by a cron job to process scheduled reports
    console.log('Running scheduled reports cron job...')

    // Get all active scheduled reports that should run now
    const now = new Date()
    const currentTime = now.toTimeString().slice(0, 5) // HH:MM format
    const currentDay = now.getDay() // 0 = Sunday, 1 = Monday, etc.

    const { data: reports, error } = await supabaseClient
      .from('scheduled_reports')
      .select('*')
      .eq('active', true)
      .eq('time', currentTime)

    if (error) throw error

    const reportsToRun = reports?.filter(report => {
      if (report.frequency === 'daily') return true
      if (report.frequency === 'weekly') return currentDay === 1 // Run on Mondays
      if (report.frequency === 'monthly') return now.getDate() === 1 // Run on 1st of month
      return false
    }) || []

    console.log(`Found ${reportsToRun.length} reports to run`)

    // Process each report
    const results = await Promise.all(
      reportsToRun.map(async (report) => {
        try {
          console.log(`Processing report: ${report.name}`)

          // Generate PDF
          const pdfResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-report-pdf`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              reportId: report.id,
              dashboards: report.dashboards,
              format: report.format
            })
          })

          if (!pdfResponse.ok) {
            throw new Error(`Failed to generate PDF: ${pdfResponse.statusText}`)
          }

          const { pdfUrl, fileName } = await pdfResponse.json()

          // Send email
          const emailResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-report-email`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              recipients: report.recipients,
              reportName: report.name,
              pdfUrl,
              fileName
            })
          })

          if (!emailResponse.ok) {
            throw new Error(`Failed to send email: ${emailResponse.statusText}`)
          }

          // Update last run time
          await supabaseClient
            .from('scheduled_reports')
            .update({ 
              last_run: now.toISOString(),
              next_run: calculateNextRun(report.frequency, report.time)
            })
            .eq('id', report.id)

          // Log successful execution
          await supabaseClient
            .from('report_logs')
            .insert({
              report_id: report.id,
              status: 'success',
              executed_at: now.toISOString(),
              recipients_count: report.recipients.length
            })

          return { 
            reportId: report.id, 
            name: report.name, 
            status: 'success',
            recipientsCount: report.recipients.length
          }

        } catch (error) {
          console.error(`Error processing report ${report.name}:`, error)

          // Log failed execution
          await supabaseClient
            .from('report_logs')
            .insert({
              report_id: report.id,
              status: 'failed',
              error: error.message,
              executed_at: now.toISOString()
            })

          return { 
            reportId: report.id, 
            name: report.name, 
            status: 'failed', 
            error: error.message 
          }
        }
      })
    )

    const successCount = results.filter(r => r.status === 'success').length
    const failureCount = results.filter(r => r.status === 'failed').length

    console.log(`Cron job completed: ${successCount} successful, ${failureCount} failed`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: results.length,
        successful: successCount,
        failed: failureCount,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Cron job error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function calculateNextRun(frequency: string, time: string): string {
  const now = new Date()
  const nextRun = new Date()
  
  const [hours, minutes] = time.split(':').map(Number)
  nextRun.setHours(hours, minutes, 0, 0)

  switch (frequency) {
    case 'daily':
      if (nextRun <= now) {
        nextRun.setDate(nextRun.getDate() + 1)
      }
      break
    case 'weekly':
      // Run on Mondays
      const daysUntilMonday = (8 - nextRun.getDay()) % 7 || 7
      nextRun.setDate(nextRun.getDate() + daysUntilMonday)
      break
    case 'monthly':
      // Run on 1st of next month
      nextRun.setMonth(nextRun.getMonth() + 1, 1)
      break
  }

  return nextRun.toISOString()
}