import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Send, Check, AlertCircle, Eye, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RestApiConnectorProps {
  onDataReceived?: (data: any) => void;
}

export const RestApiConnector = ({ onDataReceived }: RestApiConnectorProps) => {
  const [endpoint, setEndpoint] = useState('https://jsonplaceholder.typicode.com/posts');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRequest, setLastRequest] = useState<Date | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const { toast } = useToast();

  const handleSendRequest = async () => {
    if (!endpoint.trim()) {
      toast({
        title: "Endpoint Required",
        description: "Please enter an API endpoint URL",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setLastRequest(new Date());
    
    try {
      // Simulate API request
      setTimeout(() => {
        let mockResponse;
        
        if (endpoint.includes('jsonplaceholder')) {
          // Mock JSONPlaceholder response
          mockResponse = [
            { id: 1, title: "Sample Post 1", body: "This is a sample post body", userId: 1 },
            { id: 2, title: "Sample Post 2", body: "Another sample post", userId: 2 },
            { id: 3, title: "Sample Post 3", body: "Yet another post", userId: 1 }
          ];
        } else {
          // Generic mock response
          mockResponse = {
            success: true,
            data: Array.from({ length: 10 }, (_, i) => ({
              id: i + 1,
              name: `Item ${i + 1}`,
              value: Math.floor(Math.random() * 1000),
              timestamp: new Date().toISOString()
            }))
          };
        }
        
        setResponse(mockResponse);
        setStatus(200);
        setIsLoading(false);
        onDataReceived?.(mockResponse);
        
        toast({
          title: "Request Successful",
          description: `Received ${Array.isArray(mockResponse) ? mockResponse.length : 'data'} from API`,
        });
      }, 1500);
      
    } catch (error) {
      setIsLoading(false);
      setStatus(500);
      toast({
        title: "Request Failed",
        description: "Failed to fetch data from API",
        variant: "destructive"
      });
    }
  };

  const formatResponse = (data: any) => {
    return JSON.stringify(data, null, 2);
  };

  const getStatusColor = (status: number | null) => {
    if (!status) return 'default';
    if (status >= 200 && status < 300) return 'default';
    if (status >= 400 && status < 500) return 'destructive';
    return 'destructive';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-600" />
          <CardTitle>REST API Connector</CardTitle>
          {status && (
            <Badge variant={getStatusColor(status)} className="ml-auto">
              {status}
            </Badge>
          )}
        </div>
        <CardDescription>
          Connect to any REST API endpoint and import data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="request" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="request">Request</TabsTrigger>
            <TabsTrigger value="response">Response</TabsTrigger>
          </TabsList>
          
          <TabsContent value="request" className="space-y-4">
            <div className="flex gap-2">
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
              
              <Input
                placeholder="https://api.example.com/data"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="flex-1"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Headers (JSON)</Label>
              <Textarea
                placeholder='{"Authorization": "Bearer token"}'
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                rows={3}
                className="font-mono text-sm"
              />
            </div>
            
            {(method === 'POST' || method === 'PUT') && (
              <div className="space-y-2">
                <Label>Request Body (JSON)</Label>
                <Textarea
                  placeholder='{"key": "value"}'
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={4}
                  className="font-mono text-sm"
                />
              </div>
            )}
            
            <Button 
              onClick={handleSendRequest} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Send className="mr-2 h-4 w-4 animate-pulse" />
                  Sending Request...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Request
                </>
              )}
            </Button>
            
            {lastRequest && (
              <p className="text-sm text-muted-foreground">
                Last request: {lastRequest.toLocaleString()}
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="response" className="space-y-4">
            {response ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  <Label>Response Data</Label>
                  <Badge variant={getStatusColor(status)}>
                    {status} {status === 200 ? 'OK' : 'Error'}
                  </Badge>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 overflow-auto max-h-96">
                  <pre className="text-sm font-mono whitespace-pre-wrap">
                    {formatResponse(response)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <div className="text-center">
                  <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Send a request to see response data</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};