
import React, { useEffect, useRef } from 'react';
import MainLayout from '@/components/MainLayout';
import { useSmartHome } from '@/contexts/SmartHomeContext';
import LockDevice from '@/components/LockDevice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';
import { Shield, ShieldAlert } from 'lucide-react';

const SecurityControl = () => {
  const { devices, toggleLock } = useSmartHome();
  const locks = devices.filter(device => device.type === 'lock');
  const allLocksRef = useRef<HTMLButtonElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  
  // Check if all locks are locked
  const allLocked = locks.every(lock => lock.status === 'locked');
  
  // Handle lock all devices
  const handleLockAll = () => {
    locks.forEach(lock => {
      if (lock.status !== 'locked') {
        toggleLock(lock.id);
      }
    });
  };
  
  // Animate security status changes
  useEffect(() => {
    if (!statusRef.current) return;
    
    const tl = gsap.timeline();
    
    if (allLocked) {
      tl.to(statusRef.current, {
        backgroundColor: 'rgba(16, 185, 129, 0.1)', // Green background
        borderColor: 'rgba(16, 185, 129, 0.5)',
        duration: 0.5,
        ease: 'power2.out',
      });
      
      tl.fromTo('.security-icon',
        { scale: 1.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' },
        '-=0.3'
      );
    } else {
      tl.to(statusRef.current, {
        backgroundColor: 'rgba(239, 68, 68, 0.1)', // Red background
        borderColor: 'rgba(239, 68, 68, 0.5)',
        duration: 0.5,
        ease: 'power2.out',
      });
      
      tl.fromTo('.security-icon',
        { scale: 1.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' },
        '-=0.3'
      );
    }
  }, [allLocked]);
  
  // Animate lock all button
  useEffect(() => {
    if (!allLocksRef.current || allLocked) return;
    
    // Add pulse animation to draw attention
    const pulseAnimation = gsap.timeline({ repeat: -1, repeatDelay: 3 });
    
    pulseAnimation.to(allLocksRef.current, {
      scale: 1.05,
      boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)',
      duration: 0.5,
      ease: 'power2.inOut',
    });
    
    pulseAnimation.to(allLocksRef.current, {
      scale: 1,
      boxShadow: '0 0 0 rgba(16, 185, 129, 0)',
      duration: 0.5,
      ease: 'power2.inOut',
    });
    
    return () => {
      pulseAnimation.kill();
    };
  }, [allLocked]);
  
  return (
    <MainLayout title="Security Control">
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Security Status */}
        <Card>
          <CardHeader>
            <CardTitle>Security Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              ref={statusRef}
              className="border rounded-md p-6 transition-colors duration-300 text-center"
              style={{
                backgroundColor: allLocked ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                borderColor: allLocked ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)',
              }}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="security-icon">
                  {allLocked ? (
                    <Shield size={48} className="text-security-locked" />
                  ) : (
                    <ShieldAlert size={48} className="text-security-unlocked" />
                  )}
                </div>
                <h3 className="text-xl font-medium">
                  {allLocked ? 'All Secured' : 'Security Alert'}
                </h3>
                <p className="text-muted-foreground">
                  {allLocked 
                    ? 'All doors are currently locked and secured.' 
                    : 'Some doors are unlocked. Consider locking all doors.'}
                </p>
                
                {!allLocked && (
                  <Button 
                    ref={allLocksRef}
                    variant="default"
                    className="mt-2" 
                    onClick={handleLockAll}
                  >
                    Lock All Doors
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Lock Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {locks.map(lock => (
            <LockDevice
              key={lock.id}
              device={lock}
              onToggle={() => toggleLock(lock.id)}
              className="h-full"
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default SecurityControl;
