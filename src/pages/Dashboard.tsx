
import React, { useEffect, useRef } from 'react';
import MainLayout from '@/components/MainLayout';
import { useSmartHome } from '@/contexts/SmartHomeContext';
import LightDevice from '@/components/LightDevice';
import ThermostatDevice from '@/components/ThermostatDevice';
import LockDevice from '@/components/LockDevice';
import { gsap } from 'gsap';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { devices, loading, toggleLight, setThermostat, toggleLock } = useSmartHome();
  const dashboardRef = useRef<HTMLDivElement>(null);
  
  // Filter devices by type
  const lights = devices.filter(device => device.type === 'light');
  const thermostats = devices.filter(device => device.type === 'thermostat');
  const locks = devices.filter(device => device.type === 'lock');
  
  // Animate dashboard on mount
  useEffect(() => {
    if (!dashboardRef.current) return;
    
    const sections = dashboardRef.current.querySelectorAll('section');
    
    gsap.from(sections, {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power2.out',
      clearProps: 'all',
    });
  }, []);
  
  return (
    <MainLayout title="Smart Home Dashboard">
      <div ref={dashboardRef} className="space-y-10">
        {/* Lights Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Lights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-card rounded-lg shadow-sm p-4 space-y-4">
                  <Skeleton className="h-4 w-1/2 rounded-md" />
                  <div className="flex justify-center">
                    <Skeleton className="h-16 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full rounded-md" />
                </div>
              ))
            ) : (
              lights.map(light => (
                <LightDevice
                  key={light.id}
                  device={light}
                  onToggle={() => toggleLight(light.id)}
                />
              ))
            )}
          </div>
        </section>
        
        {/* Thermostats Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Thermostats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loading ? (
              Array(2).fill(0).map((_, i) => (
                <div key={i} className="bg-card rounded-lg shadow-sm p-4 space-y-4">
                  <Skeleton className="h-4 w-1/2 rounded-md" />
                  <div className="flex justify-center">
                    <Skeleton className="h-32 w-32 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full rounded-md" />
                </div>
              ))
            ) : (
              thermostats.map(thermostat => (
                <ThermostatDevice
                  key={thermostat.id}
                  device={thermostat}
                  onTemperatureChange={(temperature) => setThermostat(thermostat.id, temperature)}
                />
              ))
            )}
          </div>
        </section>
        
        {/* Security Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Security</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {loading ? (
              Array(2).fill(0).map((_, i) => (
                <div key={i} className="bg-card rounded-lg shadow-sm p-4 space-y-4">
                  <Skeleton className="h-4 w-1/2 rounded-md" />
                  <div className="flex justify-center">
                    <Skeleton className="h-16 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full rounded-md" />
                </div>
              ))
            ) : (
              locks.map(lock => (
                <LockDevice
                  key={lock.id}
                  device={lock}
                  onToggle={() => toggleLock(lock.id)}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
