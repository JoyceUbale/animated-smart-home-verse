
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SmartHomeProvider } from "@/contexts/SmartHomeContext";

// Pages
import Dashboard from "@/pages/Dashboard";
import LightsControl from "@/pages/LightsControl";
import ThermostatControl from "@/pages/ThermostatControl";
import SecurityControl from "@/pages/SecurityControl";
import VoiceControlPage from "@/pages/VoiceControlPage";
import DeviceHistoryPage from "@/pages/DeviceHistoryPage";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <SmartHomeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/lights" element={<LightsControl />} />
              <Route path="/thermostat" element={<ThermostatControl />} />
              <Route path="/security" element={<SecurityControl />} />
              <Route path="/voice" element={<VoiceControlPage />} />
              <Route path="/history" element={<DeviceHistoryPage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SmartHomeProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
