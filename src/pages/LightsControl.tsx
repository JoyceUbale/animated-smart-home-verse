
import React, { useEffect, useRef } from 'react';
import MainLayout from '@/components/MainLayout';
import { useSmartHome } from '@/contexts/SmartHomeContext';
import LightDevice from '@/components/LightDevice';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Lightbulb, Power } from 'lucide-react';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const LightsControl = () => {
  const { devices, toggleLight } = useSmartHome();
  const lights = devices.filter(device => device.type === 'light');
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  
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
  
  // Animation setup
  useEffect(() => {
    if (!pageRef.current || !headerRef.current) return;
    
    // Header animation
    gsap.from(headerRef.current.children, {
      y: -50,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out"
    });
    
    // Room sections animation
    const rooms = pageRef.current.querySelectorAll('.room-section');
    
    rooms.forEach((room, index) => {
      // Add parallax effect to room titles
      gsap.from(room.querySelector('.room-title'), {
        x: index % 2 === 0 ? -100 : 100,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: room,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1,
        }
      });
      
      // Fade in and scale up room devices
      gsap.from(room.querySelectorAll('.light-device'), {
        opacity: 0,
        scale: 0.8,
        y: 30,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: room,
          start: 'top 75%',
          end: 'top 40%',
          scrub: 1,
        }
      });
    });
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [roomEntries.length]);
  
  // Function to turn all lights in a room on/off
  const toggleRoomLights = (room: string, targetStatus: 'on' | 'off') => {
    const roomLights = lightsByRoom[room];
    roomLights.forEach(light => {
      if (light.status !== targetStatus) {
        toggleLight(light.id);
      }
    });
  };
  
  return (
    <MainLayout title="">
      <div 
        ref={headerRef} 
        className="relative overflow-hidden mb-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-8"
      >
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-yellow-200 blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-10 left-20 w-60 h-60 rounded-full bg-blue-300 blur-3xl animate-pulse-slower"></div>
        </div>
        
        <h1 className="text-4xl font-bold mb-3 relative z-10">Lights Control</h1>
        <p className="text-xl opacity-90 max-w-xl mb-6 relative z-10">
          Control lighting throughout your home with realistic previews and effects
        </p>
      </div>
      
      <div ref={pageRef} className="space-y-16">
        {roomEntries.map(([room, roomLights], index) => (
          <section key={room} className="room-section space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-semibold room-title">{room}</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => toggleRoomLights(room, 'on')}
                >
                  <Power size={16} className="text-green-500" />
                  All On
                </Button>
                <Button
                  variant="outline"
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => toggleRoomLights(room, 'off')}
                >
                  <Power size={16} className="text-red-500" />
                  All Off
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {roomLights.map(light => (
                <div key={light.id} className="light-device">
                  <LightDevice
                    device={light}
                    onToggle={() => toggleLight(light.id)}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </MainLayout>
  );
};

export default LightsControl;
