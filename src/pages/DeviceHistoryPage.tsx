
import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { useSmartHome } from '@/contexts/SmartHomeContext';
import DeviceHistory, { DeviceEvent } from '@/components/DeviceHistory';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DeviceHistoryPage = () => {
  const { devices } = useSmartHome();
  const [deviceEvents, setDeviceEvents] = useState<DeviceEvent[]>([]);
  
  // Generate mock device events when devices change
  useEffect(() => {
    if (devices.length === 0) return;
    
    // Initial events
    const initialEvents = generateMockEvents(10);
    setDeviceEvents(initialEvents);
    
    // Set up interval for new events
    const interval = setInterval(() => {
      const newEvent = generateMockEvents(1)[0];
      setDeviceEvents(prev => [newEvent, ...prev].slice(0, 20)); // Keep only the last 20 events
    }, 10000); // Add a new event every 10 seconds
    
    return () => clearInterval(interval);
  }, [devices]);
  
  // Generate mock events for demonstration
  const generateMockEvents = (count: number): DeviceEvent[] => {
    if (devices.length === 0) return [];
    
    const events: DeviceEvent[] = [];
    const eventTypes = ['Toggled', 'Adjusted', 'Status Changed'];
    
    for (let i = 0; i < count; i++) {
      // Pick a random device
      const device = devices[Math.floor(Math.random() * devices.length)];
      
      // Generate a random event
      events.push({
        id: `event-${Date.now()}-${i}`,
        deviceId: device.id,
        deviceName: device.name,
        eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        status: device.status,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 3600000)) // Random time within the last hour
      });
    }
    
    // Sort by timestamp (newest first)
    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };
  
  return (
    <MainLayout title="Device History">
      <div className="max-w-6xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              View the history of device activities and status changes. This log shows the most recent events first.
            </p>
            
            <DeviceHistory events={deviceEvents} />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DeviceHistoryPage;
