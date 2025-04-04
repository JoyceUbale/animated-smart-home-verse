
import React, { useEffect, useRef, useState } from 'react';
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

const roomImages = {
  "Living Room": "/images/living-room.jpg",
  "Bedroom": "/images/bedroom.jpg",
  "Kitchen": "/images/kitchen.jpg",
  "Bathroom": "/images/bathroom.jpg",
  "Office": "/images/office.jpg",
  "Dining Room": "/images/dining-room.jpg",
  // Default fallback
  "default": "/images/default-room.jpg"
};

const LightDevice = ({ device, onToggle, className }: LightDeviceProps) => {
  const isOn = device.status === 'on';
  const iconRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  
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
    if (!iconRef.current || !statusRef.current || !glowRef.current || !roomRef.current) return;
    
    const tl = gsap.timeline();
    
    if (isOn) {
      // Turn on animation
      tl.to(iconRef.current, {
        color: '#FEF7CD',
        scale: 1.2,
        duration: 0.4,
        ease: 'power2.out'
      });
      
      // Enhanced room lighting effect
      tl.to(roomRef.current, {
        filter: 'brightness(1.3)',
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.3');
      
      tl.to(glowRef.current, {
        opacity: 0.9,
        scale: 1.2,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(glowRef.current, {
            scale: 1.35,
            opacity: 0.7,
            repeat: -1,
            yoyo: true,
            duration: 2.5,
            ease: 'sine.inOut'
          });
        }
      }, '-=0.6');
      
      // Room ambient glow
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          boxShadow: '0 0 25px 5px rgba(254, 247, 205, 0.4)',
          duration: 1.2,
          ease: 'power1.out'
        });
      }
      
      tl.fromTo(statusRef.current, 
        { opacity: 0, y: -5 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
        '-=0.3'
      );
    } else {
      // Turn off animation
      gsap.killTweensOf(glowRef.current);
      
      tl.to(iconRef.current, {
        color: 'currentColor',
        scale: 1,
        duration: 0.3,
        ease: 'power2.in'
      });
      
      // Darken room
      tl.to(roomRef.current, {
        filter: 'brightness(0.8)',
        duration: 0.6,
        ease: 'power2.in'
      }, '-=0.3');
      
      tl.to(glowRef.current, {
        opacity: 0,
        scale: 0.5,
        duration: 0.3,
        ease: 'power2.in'
      }, '-=0.2');
      
      // Remove room ambient glow
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          duration: 1,
          ease: 'power1.out'
        });
      }
      
      tl.fromTo(statusRef.current,
        { opacity: 0, y: 5 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
        '-=0.3'
      );
    }
  }, [isOn]);

  // Get the appropriate room image
  const roomImage = roomImages[device.room as keyof typeof roomImages] || roomImages.default;
  
  // Mouse hover effect
  const handleMouseEnter = () => {
    setHovered(true);
    gsap.to(cardRef.current, {
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out'
    });
  };
  
  const handleMouseLeave = () => {
    setHovered(false);
    gsap.to(cardRef.current, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
  };
  
  return (
    <div 
      ref={cardRef} 
      className={cn("transform overflow-hidden rounded-xl", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: 'transform 0.3s ease',
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      <div className="relative overflow-hidden rounded-xl h-[280px]">
        {/* Room image */}
        <div 
          ref={roomRef} 
          className="absolute inset-0 w-full h-full transition-all duration-500"
          style={{
            backgroundImage: `url(${roomImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: isOn ? 'brightness(1.3)' : 'brightness(0.8)',
            transition: 'filter 0.5s ease'
          }}
        />
        
        {/* Overlay for better text contrast */}
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-to-t transition-opacity duration-500",
            isOn ? "from-black/40 to-transparent" : "from-black/70 to-transparent opacity-90"
          )} 
        />
        
        <DeviceCard device={device} onToggle={onToggle} className="bg-transparent border-0 shadow-none relative z-10">
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="relative">
              {/* Enhanced glow effect */}
              <div 
                ref={glowRef}
                className={cn(
                  "absolute inset-0 rounded-full blur-xl -z-10 transition-all duration-300",
                  isOn ? "bg-yellow-200 opacity-80" : "opacity-0"
                )}
                style={{ transform: 'scale(1.5)' }}
              />
              
              {/* Second larger glow for more realistic effect */}
              <div 
                className={cn(
                  "absolute inset-0 rounded-full blur-3xl -z-20 transition-all duration-500",
                  isOn ? "bg-yellow-100 opacity-60" : "opacity-0"
                )}
                style={{ transform: 'scale(2.5)' }}
              />
              
              <div 
                ref={iconRef}
                className="relative z-10 transition-all duration-300 hover:scale-110"
              >
                <Lightbulb 
                  size={56} 
                  className={cn(
                    "transition-all duration-500",
                    isOn ? "text-yellow-100 drop-shadow-[0_0_15px_rgba(255,255,180,0.8)]" : "text-gray-300"
                  )} 
                />
              </div>
            </div>
            
            <div ref={statusRef} className="transition-all duration-300">
              <span className={cn(
                "font-medium text-xl",
                isOn ? "text-yellow-100" : "text-white"
              )}>
                {isOn ? "ON" : "OFF"}
              </span>
            </div>
            
            <div className="text-lg font-medium text-white mt-1">{device.name}</div>
            <div className="text-sm text-white/80">{device.room}</div>
          </div>
        </DeviceCard>
      </div>
    </div>
  );
};

export default LightDevice;
