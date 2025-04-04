
import React, { useEffect, useRef, useState } from 'react';
import { Thermometer } from 'lucide-react';
import DeviceCard from './DeviceCard';
import { Device } from '@/lib/api';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';
import { Draggable } from 'gsap/Draggable';

// Register the draggable plugin
gsap.registerPlugin(Draggable);

interface ThermostatDeviceProps {
  device: Device;
  onTemperatureChange: (temp: number) => void;
  className?: string;
}

const ThermostatDevice = ({ device, onTemperatureChange, className }: ThermostatDeviceProps) => {
  const temperature = device.data?.temperature || 22;
  const dialRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef<number>(0);
  const [displayTemp, setDisplayTemp] = useState(temperature);
  
  // Set up the draggable thermostat dial
  useEffect(() => {
    if (!dialRef.current || !knobRef.current) return;

    // Convert temperature to initial rotation (20°C = 0 rotation, each degree = 10 rotation)
    const initialRotation = (temperature - 20) * 10;
    rotationRef.current = initialRotation;
    
    // Set initial rotation
    gsap.set(dialRef.current, { rotation: initialRotation });
    
    // Create draggable dial
    const draggable = Draggable.create(knobRef.current, {
      type: "rotation",
      inertia: true,
      bounds: { minRotation: -100, maxRotation: 100 }, // 10°C to 30°C
      onDrag: function() {
        const rotation = this.rotation;
        rotationRef.current = rotation;
        
        // Convert rotation to temperature (each 10 degrees of rotation = 1 degree Celsius)
        const newTemp = Math.round(20 + rotation / 10);
        setDisplayTemp(newTemp);
        
        // Update the dial color based on temperature
        const hue = gsap.utils.mapRange(10, 30, 240, 0, newTemp);
        gsap.to(dialRef.current, { 
          borderColor: `hsl(${hue}, 85%, 50%)`,
          background: `linear-gradient(45deg, hsl(${hue}, 85%, 96%), hsl(${hue}, 85%, 90%))`,
        });
      },
      onDragEnd: function() {
        const rotation = this.rotation;
        const newTemp = Math.round(20 + rotation / 10);
        onTemperatureChange(newTemp);
        
        // Animate the snap to nearest degree
        const snapRotation = newTemp * 10 - 200; // Convert back to rotation
        gsap.to(dialRef.current, {
          rotation: snapRotation,
          duration: 0.3,
          ease: "elastic.out(1, 0.5)",
        });
      }
    })[0];
    
    return () => {
      draggable.kill();
    };
  }, [device.id]);

  // Animate temperature changes from API
  useEffect(() => {
    if (!dialRef.current || !valueRef.current) return;
    
    const targetRotation = (temperature - 20) * 10;
    
    // Only animate if the change wasn't caused by the draggable
    if (Math.abs(rotationRef.current - targetRotation) > 5) {
      gsap.to(dialRef.current, {
        rotation: targetRotation,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      });
      
      // Animate the temperature display
      gsap.fromTo(valueRef.current, 
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
      );
      
      rotationRef.current = targetRotation;
      setDisplayTemp(temperature);
    }
    
    // Update the dial color based on temperature
    const hue = gsap.utils.mapRange(10, 30, 240, 0, temperature);
    gsap.to(dialRef.current, { 
      borderColor: `hsl(${hue}, 85%, 50%)`,
      background: `linear-gradient(45deg, hsl(${hue}, 85%, 96%), hsl(${hue}, 85%, 90%))`,
    });
  }, [temperature]);
  
  // Determine color based on temperature
  const getTemperatureColor = () => {
    if (displayTemp <= 18) return 'text-cool';
    if (displayTemp >= 25) return 'text-warm';
    return 'text-primary';
  };
  
  return (
    <DeviceCard device={device} className={className}>
      <div className="flex flex-col items-center py-3 gap-3">
        <div className="relative flex items-center justify-center">
          <div 
            ref={dialRef}
            className="w-32 h-32 rounded-full border-4 border-primary bg-gradient-to-br from-secondary to-secondary shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing thermostat-dial"
          >
            <div className="absolute inset-0 rounded-full pointer-events-none shadow-inner" />
            <div 
              ref={valueRef}
              className={cn("text-2xl font-bold", getTemperatureColor())}
            >
              {displayTemp}°C
            </div>
          </div>
          <div
            ref={knobRef}
            className="absolute top-1/2 left-1/2 w-6 h-6 rounded-full bg-primary transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-10"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Drag to adjust temperature
        </div>
      </div>
    </DeviceCard>
  );
};

export default ThermostatDevice;
