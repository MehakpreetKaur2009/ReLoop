import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppProvider } from "./contexts/AppContext";
import WelcomeScreen from "./pages/WelcomeScreen";
import RoleSelectScreen from "./pages/RoleSelectScreen";
import OnboardingScreen from "./pages/OnboardingScreen";
import DashboardLayout from "./components/DashboardLayout";
import ProfilePage from "./pages/ProfilePage";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={WelcomeScreen} />
      <Route path="/role-select" component={RoleSelectScreen} />
      <Route path="/onboarding" component={OnboardingScreen} />
      <Route path="/dashboard" component={DashboardLayout} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <AppProvider>
            <Toaster
              toastOptions={{
                style: {
                  borderRadius: "0.75rem",
                  background: "white",
                  border: "1.5px solid oklch(0.85 0.03 55 / 0.15)",
                  boxShadow: "0 4px 12px oklch(0.45 0.05 55 / 0.08)",
                },
              }}
            />
            <Router />
          </AppProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
