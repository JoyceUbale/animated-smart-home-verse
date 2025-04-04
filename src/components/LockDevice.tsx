
import React, { useEffect, useRef } from 'react';
import { Lock, Unlock, Shield, ShieldX } from 'lucide-react';
import DeviceCard from './DeviceCard';
import { Device } from '@/lib/api';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface LockDeviceProps {
  device: Device;
  onToggle: () => void;
  className?: string;
}

const LockDevice = ({ device, onToggle, className }: LockDeviceProps) => {
  const isLocked = device.status === 'locked';
  const iconRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const shieldRef = useRef<HTMLDivElement>(null);
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
    
    if (shieldRef.current) {
      gsap.from(shieldRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
        delay: 0.5
      });
    }
  }, []);
  
  // Animate lock status change
  useEffect(() => {
    if (!iconRef.current || !rippleRef.current || !shieldRef.current) return;
    
    const tl = gsap.timeline();
    
    // Reset ripple to prepare for animation
    gsap.set(rippleRef.current, { scale: 0, opacity: 0.8 });
    
    // Animate the lock icon
    tl.to(iconRef.current, {
      rotate: isLocked ? 0 : 180,
      scale: 1.2,
      duration: 0.5,
      ease: 'back.out(1.7)',
      onComplete: () => {
        gsap.to(iconRef.current, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    });
    
    // Animate the shield icon
    tl.to(shieldRef.current, {
      scale: 1.2,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(shieldRef.current, {
          scale: 1,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)'
        });
      }
    }, '-=0.4');
    
    // Animate the security ripple
    tl.to(rippleRef.current, {
      scale: 2,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
    }, '-=0.3');
    
    // Card glow effect
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        boxShadow: isLocked 
          ? '0 0 15px 0 rgba(16, 185, 129, 0.3)' 
          : '0 0 15px 0 rgba(239, 68, 68, 0.3)',
        duration: 1,
        ease: 'power1.out'
      });
    }
  }, [isLocked]);
  
  return (
    <div ref={cardRef} className={cn("transform transition-transform duration-300 hover:scale-105", className)}>
      <DeviceCard device={device} onToggle={onToggle}>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative">
            <div 
              ref={rippleRef}
              className={cn(
                "absolute inset-0 rounded-full -z-10 transform scale-0 opacity-0",
                isLocked ? "bg-security-locked" : "bg-security-unlocked"
              )}
            />
            
            <div 
              ref={iconRef}
              className="p-2 rounded-full bg-secondary transition-colors"
              onClick={onToggle}
            >
              {isLocked ? (
                <Lock
                  size={40}
                  className="text-security-locked transition-colors duration-300"
                />
              ) : (
                <Unlock
                  size={40}
                  className="text-security-unlocked transition-colors duration-300"
                />
              )}
            </div>
          </div>
          
          <div ref={shieldRef} className="mt-2">
            {isLocked ? (
              <Shield size={24} className="text-security-locked animate-pulse-slow" />
            ) : (
              <ShieldX size={24} className="text-security-unlocked animate-pulse-slow" />
            )}
          </div>
          
          <span className={cn(
            "font-medium text-lg transition-colors duration-300",
            isLocked 
              ? "text-security-locked" 
              : "text-security-unlocked"
          )}>
            {isLocked ? "LOCKED" : "UNLOCKED"}
          </span>
          
          <div className="text-sm text-muted-foreground mt-1">{device.room}</div>
        </div>
      </DeviceCard>
    </div>
  );
};

export default LockDevice;
