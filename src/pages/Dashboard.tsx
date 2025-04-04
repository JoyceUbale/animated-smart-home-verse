
import React, { useEffect, useRef, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { useSmartHome } from '@/contexts/SmartHomeContext';
import LightDevice from '@/components/LightDevice';
import ThermostatDevice from '@/components/ThermostatDevice';
import LockDevice from '@/components/LockDevice';
import SmartHomeModel3D from '@/components/SmartHomeModel3D';
import { gsap } from 'gsap';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Activity, Clock, HomeIcon, RotateCw, Zap, CubeIcon } from 'lucide-react';

const Dashboard = () => {
  const { devices, loading, toggleLight, setThermostat, toggleLock } = useSmartHome();
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [energySaving, setEnergySaving] = useState<number>(24);
  
  // Filter devices by type
  const lights = devices.filter(device => device.type === 'light');
  const thermostats = devices.filter(device => device.type === 'thermostat');
  const locks = devices.filter(device => device.type === 'lock');

  // Update energy savings every few seconds for animation
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergySaving(prev => {
        const change = Math.random() * 1.5 - 0.5;
        return Math.max(10, Math.min(40, prev + change));
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Animate dashboard on mount with staggered effect
  useEffect(() => {
    if (!dashboardRef.current) return;
    
    const timeline = gsap.timeline();
    
    // Animate hero section
    timeline.from(".hero-section", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });
    
    // Animate status cards with stagger
    timeline.from(".status-card", {
      y: 30,
      opacity: 0,
      stagger: 0.15,
      duration: 0.6,
      ease: "back.out(1.7)",
    }, "-=0.4");
    
    // Animate 3D model section
    timeline.from(".model-3d-section", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    }, "-=0.2");
    
    // Animate device sections
    timeline.from(".device-section", {
      y: 50,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "power3.out",
    }, "-=0.3");
  }, []);
  
  return (
    <MainLayout title="">
      <div ref={dashboardRef} className="space-y-10">
        {/* Hero Section */}
        <section className="hero-section relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/80 to-purple-600 text-white p-8 mb-8">
          <div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-10">
            <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-white blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-10 left-20 w-60 h-60 rounded-full bg-blue-300 blur-3xl animate-pulse-slower"></div>
          </div>
          
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Welcome Home</h1>
            <p className="text-lg md:text-xl opacity-90 mb-6">Your smart home is running efficiently today</p>
            
            <div className="flex items-center space-x-2 text-xl font-medium">
              <div className="flex items-center p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <Zap className="mr-2 h-5 w-5" />
                <span>{energySaving.toFixed(1)}% Energy Savings</span>
              </div>
              <div className="flex items-center p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <RotateCw className="mr-2 h-5 w-5 animate-spin-slow" />
                <span>Optimizing</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Status Overview */}
        <section className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="status-card border-none shadow-lg bg-gradient-to-br from-sky-50 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/20">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                  <HomeIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Rooms</p>
                <p className="text-2xl font-bold">{new Set(devices.map(d => d.room)).size}</p>
              </CardContent>
            </Card>
            
            <Card className="status-card border-none shadow-lg bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/20">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-3">
                  <Activity className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Active Devices</p>
                <p className="text-2xl font-bold">{devices.filter(d => d.status === 'on' || d.status === 'unlocked').length}</p>
              </CardContent>
            </Card>
            
            <Card className="status-card border-none shadow-lg bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/30 dark:to-green-900/20">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-3">
                  <Zap className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Energy</p>
                <p className="text-2xl font-bold">{energySaving.toFixed(1)}%</p>
              </CardContent>
            </Card>
            
            <Card className="status-card border-none shadow-lg bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/20">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-3">
                  <Clock className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Automation</p>
                <p className="text-2xl font-bold">7</p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* 3D Model Section */}
        <section className="model-3d-section mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold flex items-center">
              <CubeIcon className="mr-2 h-6 w-6 text-primary" />
              Smart Home Digital Twin
            </h2>
            <HoverCard>
              <HoverCardTrigger asChild>
                <span className="text-primary underline cursor-help">Interactive model</span>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <div>
                    <h4 className="text-sm font-semibold">3D Smart Home Model</h4>
                    <p className="text-sm">
                      Drag to rotate the model. The lights will update in real-time as you control your smart home.
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          
          <div className="rounded-xl overflow-hidden shadow-xl">
            <SmartHomeModel3D />
          </div>
        </section>
        
        {/* Lights Carousel Section */}
        <section className="device-section">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Lights</h2>
            <HoverCard>
              <HoverCardTrigger asChild>
                <span className="text-primary underline cursor-help">Energy tips</span>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  <div>
                    <h4 className="text-sm font-semibold">Energy Saving Tips</h4>
                    <p className="text-sm">
                      Turn off lights when not in use to save up to 15% on your energy bill.
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {Array(4).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-[180px] rounded-xl" />
              ))}
            </div>
          ) : (
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {lights.map(light => (
                  <CarouselItem key={light.id} className="pl-2 md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <LightDevice
                      device={light}
                      onToggle={() => toggleLight(light.id)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </Carousel>
          )}
        </section>
        
        {/* Thermostats Section */}
        <section className="device-section">
          <h2 className="text-2xl font-semibold mb-4">Climate Control</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loading ? (
              Array(2).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-[200px] rounded-xl" />
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
        <section className="device-section">
          <h2 className="text-2xl font-semibold mb-4">Security</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-[180px] rounded-xl" />
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
