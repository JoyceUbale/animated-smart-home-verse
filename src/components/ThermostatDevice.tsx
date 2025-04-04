
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
  const particlesRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef<number>(0);
  const [displayTemp, setDisplayTemp] = useState(temperature);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Initial animation
  useEffect(() => {
    if (!cardRef.current) return;
    
    gsap.from(cardRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out',
      delay: Math.random() * 0.3, // Randomize delay for staggered effect
    });
    
    if (dialRef.current) {
      gsap.from(dialRef.current, {
        scale: 0.5,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
        delay: 0.3
      });
    }
  }, []);
  
  // Set up the draggable thermostat dial
  useEffect(() => {
    if (!dialRef.current || !knobRef.current || !particlesRef.current) return;

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
        
        // Animate particles based on temperature
        updateParticles(newTemp);
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
    
    // Initialize particles
    updateParticles(temperature);
    
    return () => {
      draggable.kill();
    };
  }, [device.id]);
  
  // Function to update particles based on temperature
  const updateParticles = (temp: number) => {
    if (!particlesRef.current) return;
    
    const particles = particlesRef.current.children;
    const isCold = temp < 22;
    const isHot = temp > 24;
    
    // Clear previous animation
    gsap.killTweensOf(particles);
    
    if (isCold || isHot) {
      gsap.set(particlesRef.current, { display: 'block' });
      
      // Set particle colors
      const particleColor = isCold ? '#38BDF8' : '#F97316';
      
      // Animate each particle
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i] as HTMLDivElement;
        
        // Set color
        particle.style.backgroundColor = particleColor;
        
        // Randomize initial position
        gsap.set(particle, {
          x: (Math.random() - 0.5) * 20,
          y: (Math.random() - 0.5) * 20,
          scale: Math.random() * 0.5 + 0.5,
          opacity: Math.random() * 0.7 + 0.3
        });
        
        // Animate movement
        gsap.to(particle, {
          y: isCold ? '+=50' : '-=50',
          x: (Math.random() - 0.5) * 30,
          opacity: 0,
          scale: isCold ? 0.2 : 1.5,
          duration: 2 + Math.random() * 2,
          ease: 'power1.out',
          repeat: -1,
          delay: Math.random() * 2,
          onRepeat: () => {
            gsap.set(particle, {
              y: isCold ? -10 : 10,
              x: (Math.random() - 0.5) * 20,
              opacity: Math.random() * 0.7 + 0.3,
              scale: Math.random() * 0.5 + 0.5
            });
          }
        });
      }
    } else {
      // Hide particles when temperature is neutral
      gsap.to(particles, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          gsap.set(particlesRef.current, { display: 'none' });
        }
      });
    }
  };

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
      
      // Update particles
      updateParticles(temperature);
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
    <div ref={cardRef} className={cn("transform transition-transform duration-300 hover:scale-105", className)}>
      <DeviceCard device={device} className={className}>
        <div className="flex flex-col items-center py-6 gap-3">
          <div className="relative flex items-center justify-center">
            {/* Particles container */}
            <div 
              ref={particlesRef} 
              className="absolute inset-0 pointer-events-none" 
              style={{ display: 'none' }}
            >
              {/* Generate 15 particles */}
              {[...Array(15)].map((_, i) => (
                <div 
                  key={i} 
                  className="absolute rounded-full" 
                  style={{
                    width: '6px',
                    height: '6px',
                    top: '50%',
                    left: '50%',
                  }}
                />
              ))}
            </div>
            
            <div 
              ref={dialRef}
              className="w-32 h-32 rounded-full border-4 border-primary bg-gradient-to-br from-secondary to-secondary shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing thermostat-dial"
            >
              <div className="absolute inset-0 rounded-full pointer-events-none shadow-inner" />
              <div 
                ref={valueRef}
                className={cn(
                  "text-2xl font-bold transition-all duration-300",
                  getTemperatureColor()
                )}
              >
                {displayTemp}°C
              </div>
            </div>
            <div
              ref={knobRef}
              className="absolute top-1/2 left-1/2 w-6 h-6 rounded-full bg-primary transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-10"
            />
          </div>
          
          <div className="flex items-center gap-2 mt-1">
            <Thermometer 
              size={16} 
              className={cn(
                "transition-colors duration-300",
                getTemperatureColor()
              )} 
            />
            <div className="text-sm text-muted-foreground">
              Drag to adjust temperature
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">{device.room}</div>
        </div>
      </DeviceCard>
    </div>
  );
};

export default ThermostatDevice;
