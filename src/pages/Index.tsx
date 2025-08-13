import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Dashboard } from "@/pages/Dashboard";
import { DataUpload } from "@/pages/DataUpload";
import { AdminPanel } from "@/pages/AdminPanel";
import { AdvancedVisualizations } from "@/pages/AdvancedVisualizations";
import { DataConnectors } from "@/pages/DataConnectors";
import { DashboardTemplates } from "@/pages/DashboardTemplates";
import SecurityGovernance from "@/pages/SecurityGovernance";
import { KPITracking } from "@/pages/KPITracking";
import { EmbeddedMode } from "@/pages/EmbeddedMode";
import { LanguageProvider } from "@/contexts/LanguageContext";

interface User {
  email: string;
  role: 'admin' | 'analyst' | 'viewer';
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleLogin = (email: string, role: 'admin' | 'analyst' | 'viewer') => {
    setUser({ email, role });
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage("dashboard");
  };

  const renderPage = () => {
    if (!user) return null;

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'kpi':
        return <KPITracking />;
      case 'embed':
        return <EmbeddedMode />;
      case 'templates':
        return <DashboardTemplates user={user} />;
      case 'upload':
        return <DataUpload user={user} />;
      case 'visualizations':
        return <AdvancedVisualizations />;
      case 'connectors':
        return <DataConnectors />;
      case 'security':
        return <SecurityGovernance />;
      case 'admin':
        return <AdminPanel user={user} />;
      case 'data':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Data Sources</h2>
            <p className="text-muted-foreground">Database connection interface coming soon</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Predictive Analytics</h2>
            <p className="text-muted-foreground">ML model interface coming soon</p>
          </div>
        );
      case 'insights':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">ML Insights</h2>
            <p className="text-muted-foreground">AI-powered insights coming soon</p>
          </div>
        );
      case 'reports':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Interactive Reports</h2>
            <p className="text-muted-foreground">Drag-and-drop reporting coming soon</p>
          </div>
        );
      case 'users':
        return <AdminPanel user={user} />;
      default:
        return <Dashboard user={user} />;
    }
  };

  if (!user) {
    return (
      <LoginForm
        onLogin={handleLogin}
        onToggleMode={() => setIsSignUp(!isSignUp)}
        isSignUp={isSignUp}
      />
    );
  }

  return (
    <LanguageProvider>
      <DashboardLayout
        user={user}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLogout={handleLogout}
      >
        {renderPage()}
      </DashboardLayout>
    </LanguageProvider>
  );
};

export default Index;
