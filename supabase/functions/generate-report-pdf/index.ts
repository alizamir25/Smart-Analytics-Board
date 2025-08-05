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

    const { reportId, dashboards, format } = await req.json()

    // Generate PDF using Puppeteer or similar service
    // For now, we'll create a simple HTML to PDF conversion
    const htmlContent = await generateReportHTML(dashboards, supabaseClient)
    
    // In a real implementation, you would use a service like:
    // - Puppeteer for PDF generation
    // - jsPDF for client-side PDF generation
    // - External service like PDFShift or similar
    
    const pdfBuffer = await generatePDF(htmlContent)

    // Store the PDF in Supabase Storage
    const fileName = `report-${reportId}-${Date.now()}.pdf`
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('reports')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
      })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: urlData } = supabaseClient.storage
      .from('reports')
      .getPublicUrl(fileName)

    return new Response(
      JSON.stringify({ 
        success: true, 
        pdfUrl: urlData.publicUrl,
        fileName 
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

async function generateReportHTML(dashboards: string[], supabaseClient: any): Promise<string> {
  // Fetch dashboard data
  const { data: dashboardData } = await supabaseClient
    .from('dashboard_data')
    .select('*')
    .in('dashboard_name', dashboards)

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Analytics Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 40px; }
        .dashboard { margin-bottom: 40px; page-break-inside: avoid; }
        .chart { width: 100%; height: 300px; border: 1px solid #ddd; margin: 20px 0; }
        .metrics { display: flex; justify-content: space-around; margin: 20px 0; }
        .metric { text-align: center; }
        .metric-value { font-size: 24px; font-weight: bold; }
        .metric-label { color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Analytics Report</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
      </div>
      
      ${dashboards.map(dashboard => `
        <div class="dashboard">
          <h2>${dashboard}</h2>
          <div class="metrics">
            <div class="metric">
              <div class="metric-value">1,234</div>
              <div class="metric-label">Total Users</div>
            </div>
            <div class="metric">
              <div class="metric-value">$45,678</div>
              <div class="metric-label">Revenue</div>
            </div>
            <div class="metric">
              <div class="metric-value">87%</div>
              <div class="metric-label">Conversion Rate</div>
            </div>
          </div>
          <div class="chart">
            [Chart placeholder for ${dashboard}]
          </div>
        </div>
      `).join('')}
    </body>
    </html>
  `
}

async function generatePDF(htmlContent: string): Promise<Uint8Array> {
  // This is a placeholder implementation
  // In a real scenario, you would use Puppeteer or a similar service
  
  // For demonstration, we'll return a simple text-based "PDF"
  const encoder = new TextEncoder()
  return encoder.encode(`PDF Report Content:\n\n${htmlContent}`)
}