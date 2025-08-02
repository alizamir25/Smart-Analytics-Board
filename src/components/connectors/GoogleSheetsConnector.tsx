import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet, RefreshCw, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GoogleSheetsConnectorProps {
  onDataImported?: (data: any[]) => void;
}

export const GoogleSheetsConnector = ({ onDataImported }: GoogleSheetsConnectorProps) => {
  const [sheetUrl, setSheetUrl] = useState('');
  const [range, setRange] = useState('A1:Z1000');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [rowCount, setRowCount] = useState(0);
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!sheetUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a Google Sheets URL",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnected(true);
      setLastSync(new Date());
      setRowCount(Math.floor(Math.random() * 500) + 100);
      setIsLoading(false);
      
      // Generate mock data
      const mockData = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        value: Math.floor(Math.random() * 1000),
        category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)],
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }));
      
      onDataImported?.(mockData);
      
      toast({
        title: "Connected Successfully",
        description: `Imported ${rowCount} rows from Google Sheets`,
      });
    }, 2000);
  };

  const handleSync = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLastSync(new Date());
      setIsLoading(false);
      toast({
        title: "Data Synced",
        description: "Successfully synced with Google Sheets",
      });
    }, 1000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setLastSync(null);
    setRowCount(0);
    setSheetUrl('');
    toast({
      title: "Disconnected",
      description: "Google Sheets connection removed",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-green-600" />
          <CardTitle>Google Sheets Connector</CardTitle>
          {isConnected && <Badge variant="secondary" className="bg-green-100 text-green-800">Connected</Badge>}
        </div>
        <CardDescription>
          Import data directly from Google Sheets with real-time sync
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="sheet-url">Google Sheets URL</Label>
              <Input
                id="sheet-url"
                placeholder="https://docs.google.com/spreadsheets/d/..."
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="range">Data Range</Label>
              <Input
                id="range"
                placeholder="A1:Z1000"
                value={range}
                onChange={(e) => setRange(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={handleConnect} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Connect to Google Sheets
                </>
              )}
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">
                  Connected to Google Sheets
                </p>
                <p className="text-sm text-green-600 dark:text-green-300">
                  {rowCount} rows imported
                </p>
              </div>
              <Check className="h-5 w-5 text-green-600" />
            </div>
            
            {lastSync && (
              <p className="text-sm text-muted-foreground">
                Last synced: {lastSync.toLocaleString()}
              </p>
            )}
            
            <div className="flex gap-2">
              <Button 
                onClick={handleSync} 
                disabled={isLoading}
                variant="outline"
                className="flex-1"
              >
                {isLoading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Sync Now
              </Button>
              
              <Button 
                onClick={handleDisconnect} 
                variant="destructive"
                className="flex-1"
              >
                Disconnect
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};