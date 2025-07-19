import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Home, Settings, Users } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-primary to-primary-light rounded-lg">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">ResearchEval</h1>
                <p className="text-sm text-muted-foreground">
                  {isAdminRoute ? 'Admin Dashboard' : 'Research Submission Portal'}
                </p>
              </div>
            </div>
            
            <nav className="flex items-center gap-2">
              <Button 
                variant={!isAdminRoute ? "default" : "ghost"} 
                size="sm"
                onClick={() => window.location.href = '/'}
              >
                <Home className="h-4 w-4" />
                Submit
              </Button>
              <Button 
                variant={isAdminRoute ? "default" : "ghost"} 
                size="sm"
                onClick={() => window.location.href = '/admin'}
              >
                <Users className="h-4 w-4" />
                Admin
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card/50 border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 ResearchEval. Built for academic excellence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}