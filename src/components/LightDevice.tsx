
import React, { useEffect, useRef } from 'react';
import { Lightbulb } from 'lucide-react';
import DeviceCard from './DeviceCard';
import { Device } from '@/lib/api';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface LightDeviceProps {
  device: Device;
  onToggle: () => void;
  className?: string;
}

const LightDevice = ({ device, onToggle, className }: LightDeviceProps) => {
  const isOn = device.status === 'on';
  const iconRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
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
  }, []);
  
  // Animate light status change
  useEffect(() => {
    if (!iconRef.current || !statusRef.current || !glowRef.current) return;
    
    const tl = gsap.timeline();
    
    if (isOn) {
      // Turn on animation
      tl.to(iconRef.current, {
        color: '#FEF7CD',
        scale: 1.1,
        duration: 0.3,
        ease: 'power2.out'
      });
      
      tl.to(glowRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(glowRef.current, {
            scale: 1.05,
            repeat: -1,
            yoyo: true,
            duration: 2,
            ease: 'sine.inOut'
          });
        }
      }, '-=0.2');
      
      tl.fromTo(statusRef.current, 
        { opacity: 0, y: -5 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
        '-=0.3'
      );
      
      // Add pulsing glow effect to the card
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          boxShadow: '0 0 15px 0 rgba(254, 247, 205, 0.3)',
          duration: 1,
          ease: 'power1.out'
        });
      }
    } else {
      // Turn off animation
      gsap.killTweensOf(glowRef.current);
      
      tl.to(iconRef.current, {
        color: 'currentColor',
        scale: 1,
        duration: 0.3,
        ease: 'power2.in'
      });
      
      tl.to(glowRef.current, {
        opacity: 0,
        scale: 0.5,
        duration: 0.3,
        ease: 'power2.in'
      }, '-=0.2');
      
      tl.fromTo(statusRef.current,
        { opacity: 0, y: 5 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
        '-=0.3'
      );
      
      // Remove glow effect from card
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          duration: 1,
          ease: 'power1.out'
        });
      }
    }
  }, [isOn]);
  
  return (
    <div ref={cardRef} className={cn("transform transition-transform duration-300 hover:scale-105", className)}>
      <DeviceCard device={device} onToggle={onToggle}>
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="relative">
            <div 
              ref={glowRef}
              className={cn(
                "absolute inset-0 rounded-full blur-lg -z-10 transition-all duration-300",
                isOn ? "bg-light-on opacity-75" : "opacity-0"
              )}
              style={{ transform: 'scale(1.5)' }}
            />
            
            <div 
              ref={iconRef}
              className="relative z-10 transition-all duration-300"
            >
              <Lightbulb 
                size={48} 
                className={cn(
                  "transition-all duration-500",
                  isOn ? "text-light-on animate-pulse-slow" : "text-light-off"
                )} 
              />
            </div>
          </div>
          
          <div ref={statusRef} className="transition-all duration-300">
            <span className={cn(
              "font-medium",
              isOn ? "text-light-on" : "text-light-off"
            )}>
              {isOn ? "ON" : "OFF"}
            </span>
          </div>
          
          <div className="text-sm text-muted-foreground mt-1">{device.room}</div>
        </div>
      </DeviceCard>
    </div>
  );
};

export default LightDevice;
