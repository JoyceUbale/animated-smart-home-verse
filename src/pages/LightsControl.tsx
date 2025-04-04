
import React, { useEffect, useRef } from 'react';
import MainLayout from '@/components/MainLayout';
import { useSmartHome } from '@/contexts/SmartHomeContext';
import LightDevice from '@/components/LightDevice';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const LightsControl = () => {
  const { devices, toggleLight } = useSmartHome();
  const lights = devices.filter(device => device.type === 'light');
  const pageRef = useRef<HTMLDivElement>(null);
  
  // Group lights by room
  const lightsByRoom = lights.reduce((acc, light) => {
    if (!acc[light.room]) {
      acc[light.room] = [];
    }
    acc[light.room].push(light);
    return acc;
  }, {} as Record<string, typeof lights>);
  
  // Convert to array of [room, lights] pairs
  const roomEntries = Object.entries(lightsByRoom);
  
  // Animate rooms on scroll
  useEffect(() => {
    if (!pageRef.current) return;
    
    const rooms = pageRef.current.querySelectorAll('section');
    
    rooms.forEach(room => {
      gsap.from(room, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: room,
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      });
    });
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [roomEntries.length]);
  
  return (
    <MainLayout title="Lights Control">
      <div ref={pageRef} className="space-y-12">
        {roomEntries.map(([room, roomLights]) => (
          <section key={room} className="space-y-4">
            <h2 className="text-2xl font-semibold">{room}</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {roomLights.map(light => (
                <LightDevice
                  key={light.id}
                  device={light}
                  onToggle={() => toggleLight(light.id)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </MainLayout>
  );
};

export default LightsControl;
