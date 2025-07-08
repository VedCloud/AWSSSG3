import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "@/pages/home";
import LearningPaths from "@/pages/learning-paths";
import ArchitectureBuilder from "@/pages/architecture-builder";
import ChallengeMode from "@/pages/challenge-mode";
import NotFound from "@/pages/not-found";
import { Switch as UISwitch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

function DarkModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center space-x-3">
      <Sun className="w-4 h-4 text-yellow-500 dark:text-gray-400" />
      <UISwitch
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        className="data-[state=checked]:bg-aws-orange data-[state=unchecked]:bg-gray-300"
      />
      <Moon className="w-4 h-4 text-gray-400 dark:text-aws-orange" />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/learning-paths" component={LearningPaths} />
      <Route path="/architecture-builder" component={ArchitectureBuilder} />
      <Route path="/challenge-mode" component={ChallengeMode} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <DarkModeToggle />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;