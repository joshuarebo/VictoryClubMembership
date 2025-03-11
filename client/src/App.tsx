import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { Sidebar } from "@/components/layout/sidebar";
import Clubs from "@/pages/clubs";
import Students from "@/pages/students";
import Activities from "@/pages/activities";
import Reports from "@/pages/reports";

function Router() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        <Switch>
          <Route path="/clubs" component={Clubs} />
          <Route path="/students" component={Students} />
          <Route path="/activities" component={Activities} />
          <Route path="/reports" component={Reports} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
