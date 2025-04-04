
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Moon, Sun, VolumeX, Volume2, RotateCw } from 'lucide-react';
import { useSmartHome } from '@/contexts/SmartHomeContext';
import { motion } from 'framer-motion';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { refreshDevices } = useSmartHome();
  
  // Local state for settings
  const [voiceControlEnabled, setVoiceControlEnabled] = useState(() => {
    return localStorage.getItem('voiceControlEnabled') !== 'false'; // Default to true
  });
  const [devicePollingInterval, setDevicePollingInterval] = useState(() => {
    return localStorage.getItem('devicePollingInterval') || '30';
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem('notificationsEnabled') !== 'false'; // Default to true
  });
  
  // Handler functions
  const handleVoiceControlToggle = (enabled: boolean) => {
    setVoiceControlEnabled(enabled);
    localStorage.setItem('voiceControlEnabled', String(enabled));
    
    toast({
      title: "Settings Updated",
      description: `Voice control has been ${enabled ? 'enabled' : 'disabled'}.`,
    });
  };
  
  const handlePollingIntervalChange = (value: string) => {
    setDevicePollingInterval(value);
    localStorage.setItem('devicePollingInterval', value);
    
    toast({
      title: "Settings Updated",
      description: `Device polling interval set to ${value} seconds.`,
    });
  };
  
  const handleNotificationsToggle = (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    localStorage.setItem('notificationsEnabled', String(enabled));
    
    toast({
      title: "Settings Updated",
      description: `Notifications have been ${enabled ? 'enabled' : 'disabled'}.`,
    });
  };
  
  const handleRefreshDevices = async () => {
    await refreshDevices();
    
    toast({
      title: "Devices Refreshed",
      description: "Device status has been refreshed from the server.",
    });
  };
  
  return (
    <MainLayout title="Settings">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how the Smart Home Controller looks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="theme-toggle" className="font-medium">
                  Dark Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark theme
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-muted-foreground" />
                <Switch
                  id="theme-toggle"
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
                <Moon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Light Theme Preview */}
              <div
                className={`rounded-md border p-4 ${theme === 'light' ? 'ring-2 ring-primary' : ''}`}
                onClick={() => theme === 'dark' && toggleTheme()}
              >
                <div className="bg-white dark:bg-white rounded-md p-4 shadow-sm">
                  <div className="h-4 w-1/2 bg-gray-200 mb-2 rounded" />
                  <div className="h-8 w-8 rounded-full bg-blue-500 mb-2" />
                  <div className="h-3 w-3/4 bg-gray-200 rounded" />
                </div>
                <p className="mt-2 text-center text-sm text-muted-foreground">Light</p>
              </div>
              
              {/* Dark Theme Preview */}
              <div
                className={`rounded-md border p-4 ${theme === 'dark' ? 'ring-2 ring-primary' : ''}`}
                onClick={() => theme === 'light' && toggleTheme()}
              >
                <div className="bg-gray-900 rounded-md p-4 shadow-sm">
                  <div className="h-4 w-1/2 bg-gray-700 mb-2 rounded" />
                  <div className="h-8 w-8 rounded-full bg-blue-500 mb-2" />
                  <div className="h-3 w-3/4 bg-gray-700 rounded" />
                </div>
                <p className="mt-2 text-center text-sm text-muted-foreground">Dark</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Voice Control Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {voiceControlEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              Voice Control
            </CardTitle>
            <CardDescription>
              Configure voice recognition settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="voice-toggle" className="font-medium">
                  Enable Voice Control
                </Label>
                <p className="text-sm text-muted-foreground">
                  Allow control of devices using voice commands
                </p>
              </div>
              <Switch
                id="voice-toggle"
                checked={voiceControlEnabled}
                onCheckedChange={handleVoiceControlToggle}
              />
            </div>
            
            {voiceControlEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t pt-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications-toggle" className="font-medium">
                      Voice Command Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Show notifications when voice commands are processed
                    </p>
                  </div>
                  <Switch
                    id="notifications-toggle"
                    checked={notificationsEnabled}
                    onCheckedChange={handleNotificationsToggle}
                  />
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
        
        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>
              Configure system behavior and performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="polling-interval" className="font-medium">
                  Device Polling Interval
                </Label>
                <p className="text-sm text-muted-foreground">
                  How often to check for device status updates
                </p>
              </div>
              <Select
                value={devicePollingInterval}
                onValueChange={handlePollingIntervalChange}
              >
                <SelectTrigger className="w-40" id="polling-interval">
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">1 minute</SelectItem>
                  <SelectItem value="300">5 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={handleRefreshDevices}
                className="flex items-center gap-2"
              >
                <RotateCw className="h-4 w-4" />
                Refresh Device Status
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Settings;
