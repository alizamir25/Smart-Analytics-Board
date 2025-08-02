import { GoogleSheetsConnector } from "@/components/connectors/GoogleSheetsConnector";
import { RestApiConnector } from "@/components/connectors/RestApiConnector";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, TrendingUp } from "lucide-react";

export const DataConnectors = () => {
  const [importedData, setImportedData] = useState<any[]>([]);
  const [apiData, setApiData] = useState<any>(null);

  const handleDataImported = (data: any[]) => {
    setImportedData(data);
  };

  const handleApiDataReceived = (data: any) => {
    setApiData(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Data Connectors</h1>
        <p className="text-muted-foreground mt-2">
          Connect to external data sources and import data in real-time
        </p>
      </div>

      {/* Connection Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4" />
              Active Connections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Google Sheets & REST API</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Data Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {importedData.length + (Array.isArray(apiData) ? apiData.length : apiData ? 1 : 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total imported records</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">Just now</div>
            <Badge variant="secondary" className="text-xs">Auto-sync enabled</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Data Connectors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GoogleSheetsConnector onDataImported={handleDataImported} />
        <RestApiConnector onDataReceived={handleApiDataReceived} />
      </div>

      {/* Data Preview */}
      {(importedData.length > 0 || apiData) && (
        <Card>
          <CardHeader>
            <CardTitle>Imported Data Preview</CardTitle>
            <CardDescription>
              Preview of data imported from your connected sources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {importedData.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    Google Sheets Data
                    <Badge variant="secondary">{importedData.length} rows</Badge>
                  </h4>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 overflow-auto">
                    <pre className="text-sm">
                      {JSON.stringify(importedData.slice(0, 3), null, 2)}
                    </pre>
                  </div>
                </div>
              )}
              
              {apiData && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    API Response Data
                    <Badge variant="secondary">
                      {Array.isArray(apiData) ? `${apiData.length} items` : 'Object'}
                    </Badge>
                  </h4>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 overflow-auto max-h-64">
                    <pre className="text-sm">
                      {JSON.stringify(
                        Array.isArray(apiData) ? apiData.slice(0, 3) : apiData, 
                        null, 
                        2
                      )}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};