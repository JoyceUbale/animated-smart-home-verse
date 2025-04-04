
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { useSmartHome } from '@/contexts/SmartHomeContext';
import ThermostatDevice from '@/components/ThermostatDevice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ThermostatControl = () => {
  const { devices, setThermostat } = useSmartHome();
  const thermostats = devices.filter(device => device.type === 'thermostat');
  
  return (
    <MainLayout title="Thermostat Control">
      <div className="space-y-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Temperature Control</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Use the interactive dials below to adjust the temperature for each room.
              The color of the dial will change to indicate heating (red) or cooling (blue).
            </p>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {thermostats.map(thermostat => (
            <ThermostatDevice
              key={thermostat.id}
              device={thermostat}
              onTemperatureChange={(temperature) => setThermostat(thermostat.id, temperature)}
              className="h-full"
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default ThermostatControl;
