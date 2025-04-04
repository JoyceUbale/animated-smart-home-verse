
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';
import { Device } from '@/lib/api';
import AnimatedToggle from './AnimatedToggle';

interface DeviceCardProps {
  device: Device;
  onToggle?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const DeviceCard = ({ device, onToggle, className, children }: DeviceCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isOn = device.status === 'on' || device.status === 'unlocked';
  
  // Animation on mount
  useEffect(() => {
    if (!cardRef.current) return;
    
    gsap.from(cardRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  }, []);
  
  // Animation when status changes
  useEffect(() => {
    if (!cardRef.current) return;
    
    gsap.to(cardRef.current, {
      scale: isOn ? 1.03 : 1,
      boxShadow: isOn ? '0 8px 30px rgba(0, 0, 0, 0.1)' : '0 2px 10px rgba(0, 0, 0, 0.05)',
      duration: 0.3,
      ease: 'power1.out',
    });
  }, [isOn]);
  
  return (
    <Card 
      ref={cardRef}
      className={cn(
        "overflow-hidden transition-all duration-300 device-card", 
        className
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{device.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      {onToggle && (
        <CardFooter className="flex justify-between pt-0">
          <span className="text-sm text-muted-foreground">{device.room}</span>
          <AnimatedToggle 
            checked={isOn} 
            onChange={() => onToggle()}
          />
        </CardFooter>
      )}
    </Card>
  );
};

export default DeviceCard;
