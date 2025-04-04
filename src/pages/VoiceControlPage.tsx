
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { useSmartHome } from '@/contexts/SmartHomeContext';
import VoiceControl from '@/components/VoiceControl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const VoiceControlPage = () => {
  const { devices, toggleLight, setThermostat, toggleLock } = useSmartHome();
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  
  const handleVoiceCommand = (command: string) => {
    // Add command to history
    setCommandHistory(prev => [command, ...prev].slice(0, 5));
    
    // Process the command
    const lowercaseCommand = command.toLowerCase();
    
    // Process light commands
    if (/turn (on|off) .*(light|lights)/i.test(lowercaseCommand)) {
      const isOn = /turn on/i.test(lowercaseCommand);
      const roomMatch = lowercaseCommand.match(/turn (on|off) (.*) light/);
      
      if (roomMatch && roomMatch[2]) {
        const roomName = roomMatch[2].trim();
        processLightCommand(roomName, isOn);
        return;
      }
    }
    
    // Process thermostat commands
    if (/set .* to (\d+) degrees/i.test(lowercaseCommand)) {
      const match = lowercaseCommand.match(/set (.*) to (\d+) degrees/i);
      if (match && match[1] && match[2]) {
        const roomName = match[1].trim();
        const temperature = parseInt(match[2]);
        processThermostatCommand(roomName, temperature);
        return;
      }
    }
    
    // Process lock commands
    if (/(lock|unlock) .* door/i.test(lowercaseCommand)) {
      const shouldLock = /lock .* door/i.test(lowercaseCommand);
      const match = lowercaseCommand.match(/(lock|unlock) (.*) door/i);
      
      if (match && match[2]) {
        const doorName = match[2].trim();
        processLockCommand(doorName, shouldLock);
        return;
      }
    }
    
    // If no command was processed
    toast({
      title: "Voice Command",
      description: "Sorry, I didn't understand that command.",
      variant: "destructive"
    });
  };
  
  const processLightCommand = (roomName: string, turnOn: boolean) => {
    // Find lights matching the room name
    const targetLights = devices.filter(
      device => device.type === 'light' && 
      device.room.toLowerCase().includes(roomName.toLowerCase())
    );
    
    if (targetLights.length > 0) {
      targetLights.forEach(light => {
        const shouldToggle = (turnOn && light.status === 'off') || (!turnOn && light.status === 'on');
        
        if (shouldToggle) {
          toggleLight(light.id);
        }
      });
      
      toast({
        title: "Voice Command",
        description: `Turned ${turnOn ? 'on' : 'off'} lights in ${roomName}`,
      });
    } else {
      toast({
        title: "Voice Command",
        description: `No lights found in ${roomName}`,
        variant: "destructive"
      });
    }
  };
  
  const processThermostatCommand = (roomName: string, temperature: number) => {
    // Find thermostats matching the room name
    const targetThermostats = devices.filter(
      device => device.type === 'thermostat' && 
      device.room.toLowerCase().includes(roomName.toLowerCase())
    );
    
    if (targetThermostats.length > 0) {
      targetThermostats.forEach(thermostat => {
        setThermostat(thermostat.id, temperature);
      });
      
      toast({
        title: "Voice Command",
        description: `Set ${roomName} temperature to ${temperature}°C`,
      });
    } else {
      toast({
        title: "Voice Command",
        description: `No thermostat found in ${roomName}`,
        variant: "destructive"
      });
    }
  };
  
  const processLockCommand = (doorName: string, shouldLock: boolean) => {
    // Find locks matching the door name
    const targetLocks = devices.filter(
      device => device.type === 'lock' && 
      device.name.toLowerCase().includes(doorName.toLowerCase())
    );
    
    if (targetLocks.length > 0) {
      targetLocks.forEach(lock => {
        const shouldToggle = (shouldLock && lock.status === 'unlocked') || 
                            (!shouldLock && lock.status === 'locked');
        
        if (shouldToggle) {
          toggleLock(lock.id);
        }
      });
      
      toast({
        title: "Voice Command",
        description: `${shouldLock ? 'Locked' : 'Unlocked'} ${doorName} door`,
      });
    } else {
      toast({
        title: "Voice Command",
        description: `No door found with name ${doorName}`,
        variant: "destructive"
      });
    }
  };
  
  return (
    <MainLayout title="Voice Control">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Voice Command Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-medium">Try saying:</p>
              <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1">
                <li>"Turn on living room light"</li>
                <li>"Turn off bedroom light"</li>
                <li>"Set living room to 22 degrees"</li>
                <li>"Lock front door"</li>
                <li>"Unlock back door"</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <VoiceControl onCommand={handleVoiceCommand} />
          
          <Card>
            <CardHeader>
              <CardTitle>Command History</CardTitle>
            </CardHeader>
            <CardContent>
              {commandHistory.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No commands yet
                </p>
              ) : (
                <ul className="space-y-2">
                  {commandHistory.map((cmd, index) => (
                    <li 
                      key={index}
                      className="border-b pb-2 last:border-b-0 text-sm"
                    >
                      "{cmd}"
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default VoiceControlPage;
