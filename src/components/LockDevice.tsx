
import React, { useEffect, useRef } from 'react';
import { Lock, Unlock } from 'lucide-react';
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
  
  // Animate lock status change
  useEffect(() => {
    if (!iconRef.current || !rippleRef.current) return;
    
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
    
    // Animate the security ripple
    tl.to(rippleRef.current, {
      scale: 2,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
    }, '-=0.3');
  }, [isLocked]);
  
  return (
    <DeviceCard device={device} onToggle={onToggle} className={className}>
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
        
        <span className={cn(
          "font-medium text-lg transition-colors duration-300",
          isLocked 
            ? "text-security-locked" 
            : "text-security-unlocked"
        )}>
          {isLocked ? "LOCKED" : "UNLOCKED"}
        </span>
      </div>
    </DeviceCard>
  );
};

export default LockDevice;
