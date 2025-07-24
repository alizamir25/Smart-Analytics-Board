import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Database,
  Trash2,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DataUploadProps {
  user: { email: string; role: 'admin' | 'analyst' | 'viewer' };
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  uploadDate: Date;
}

export const DataUpload = ({ user }: DataUploadProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = useCallback((fileList: FileList) => {
    Array.from(fileList).forEach((file) => {
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 0,
        uploadDate: new Date(),
      };

      setFiles(prev => [...prev, newFile]);

      // Simulate upload progress
      const interval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === newFile.id) {
            const newProgress = Math.min(f.progress + Math.random() * 20, 100);
            return {
              ...f,
              progress: newProgress,
              status: newProgress >= 100 ? 'success' : 'uploading'
            };
          }
          return f;
        }));
      }, 300);

      setTimeout(() => {
        clearInterval(interval);
        setFiles(prev => prev.map(f => 
          f.id === newFile.id 
            ? { ...f, progress: 100, status: Math.random() > 0.1 ? 'success' : 'error' }
            : f
        ));
      }, 2000);
    });

    toast({
      title: "Upload started",
      description: `Processing ${fileList.length} file(s)`,
    });
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const retryUpload = (id: string) => {
    setFiles(prev => prev.map(f => 
      f.id === id 
        ? { ...f, status: 'uploading', progress: 0 }
        : f
    ));
    
    // Simulate retry
    setTimeout(() => {
      setFiles(prev => prev.map(f => 
        f.id === id 
          ? { ...f, status: 'success', progress: 100 }
          : f
      ));
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Upload area */}
      <Card>
        <CardHeader>
          <CardTitle>Data Upload</CardTitle>
          <CardDescription>
            Upload CSV files, Excel spreadsheets, or connect to databases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
              dragOver 
                ? "border-primary bg-primary/5" 
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Drop files here or click to browse</h3>
            <p className="text-muted-foreground mb-4">
              Supports CSV, Excel (.xlsx, .xls), and JSON files up to 100MB
            </p>
            <input
              type="file"
              multiple
              accept=".csv,.xlsx,.xls,.json"
              className="hidden"
              id="file-upload"
              onChange={(e) => {
                if (e.target.files) {
                  handleFileUpload(e.target.files);
                }
              }}
            />
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                Select Files
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Database connections */}
      <Card>
        <CardHeader>
          <CardTitle>Database Connections</CardTitle>
          <CardDescription>
            Connect to external data sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Database className="h-6 w-6" />
              <span>PostgreSQL</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Database className="h-6 w-6" />
              <span>MySQL</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Database className="h-6 w-6" />
              <span>MongoDB</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded files */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files ({files.length})</CardTitle>
            <CardDescription>
              Manage your uploaded datasets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <FileText className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">{file.name}</p>
                      <Badge 
                        variant={
                          file.status === 'success' ? 'default' : 
                          file.status === 'error' ? 'destructive' : 
                          'secondary'
                        }
                      >
                        {file.status === 'uploading' && 'Uploading'}
                        {file.status === 'success' && 'Ready'}
                        {file.status === 'error' && 'Failed'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{formatFileSize(file.size)}</span>
                      <span>{file.uploadDate.toLocaleDateString()}</span>
                    </div>
                    
                    {file.status === 'uploading' && (
                      <Progress value={file.progress} className="mt-2 h-2" />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {file.status === 'success' && (
                      <>
                        <CheckCircle className="h-5 w-5 text-accent" />
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    
                    {file.status === 'error' && (
                      <>
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => retryUpload(file.id)}
                        >
                          Retry
                        </Button>
                      </>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeFile(file.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};