
import React, { useEffect, useRef } from 'react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';

interface AnimatedToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  color?: string;
  label?: string;
  className?: string;
}

const AnimatedToggle = ({ 
  checked, 
  onChange, 
  color = '#3B82F6', 
  label, 
  className 
}: AnimatedToggleProps) => {
  const toggleRef = useRef<HTMLDivElement>(null);
  const previousChecked = useRef(checked);

  useEffect(() => {
    if (!toggleRef.current) return;

    if (previousChecked.current !== checked) {
      // Animate toggle change
      gsap.fromTo(
        toggleRef.current,
        { scale: 0.9, opacity: 0.8 },
        { 
          scale: 1, 
          opacity: 1,
          duration: 0.3,
          ease: 'back.out(1.7)' 
        }
      );
    }
    
    previousChecked.current = checked;
  }, [checked]);
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {label && <span className="text-sm">{label}</span>}
      <div ref={toggleRef}>
        <Switch 
          checked={checked} 
          onCheckedChange={onChange} 
          className={cn(
            "data-[state=checked]:bg-primary transition-all duration-300",
            checked ? "shadow-[0_0_8px_rgba(59,130,246,0.5)]" : ""
          )}
        />
      </div>
    </div>
  );
};

export default AnimatedToggle;
