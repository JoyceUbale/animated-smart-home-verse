
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { voiceRecognition } from '@/lib/voiceRecognition';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface VoiceControlProps {
  onCommand: (command: string) => void;
  className?: string;
}

const VoiceControl = ({ onCommand, className }: VoiceControlProps) => {
  const [isListening, setIsListening] = useState(false);
  const [command, setCommand] = useState('');
  const [volumeLevel, setVolumeLevel] = useState(0);
  const waveRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const commandRef = useRef<HTMLDivElement>(null);
  
  // Generate array for wave bars
  const waveBarCount = 16;
  const waveBars = Array.from({ length: waveBarCount }, (_, i) => i);
  
  const handleToggleListen = async () => {
    if (isListening) {
      voiceRecognition.stop();
      setIsListening(false);
      return;
    }
    
    try {
      await voiceRecognition.start(
        (cmd) => {
          setCommand(cmd);
          onCommand(cmd);
        },
        (volume) => setVolumeLevel(volume)
      );
      setIsListening(true);
    } catch (error) {
      console.error('Failed to start voice recognition', error);
    }
  };
  
  // Animate wave bars based on volume level
  useEffect(() => {
    if (!waveRef.current || !isListening) return;
    
    const bars = waveRef.current.querySelectorAll('.wave-bar');
    bars.forEach((bar, index) => {
      // Calculate individual bar height based on its position and volume
      const barPosition = Math.abs((index - (waveBarCount / 2)) / (waveBarCount / 2));
      const randomFactor = Math.random() * 0.3 + 0.7; // Random factor between 0.7 and 1
      const height = Math.max(0.1, volumeLevel * (1 - barPosition * 0.5) * randomFactor);
      
      gsap.to(bar, {
        scaleY: height * 2, // Scale by volume
        duration: 0.1,
        ease: 'power1.out',
      });
    });
  }, [volumeLevel, isListening, waveBarCount]);
  
  // Animate button when state changes
  useEffect(() => {
    if (!buttonRef.current) return;
    
    gsap.to(buttonRef.current, {
      scale: isListening ? 1.1 : 1,
      boxShadow: isListening 
        ? '0 0 20px rgba(220, 38, 38, 0.6)' 
        : '0 0 0px rgba(220, 38, 38, 0)',
      duration: 0.3,
      ease: 'back.out(1.7)',
    });
  }, [isListening]);
  
  // Animate command appearance
  useEffect(() => {
    if (!commandRef.current || !command) return;
    
    gsap.fromTo(
      commandRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
    );
  }, [command]);
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2">
          Voice Control
          {isListening ? <Mic className="h-5 w-5 text-destructive" /> : <MicOff className="h-5 w-5" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        {/* Wave visualization */}
        <div
          ref={waveRef}
          className={cn(
            "h-20 flex items-center justify-center gap-1 transition-opacity duration-300",
            isListening ? "opacity-100" : "opacity-30"
          )}
        >
          {waveBars.map((i) => (
            <div
              key={i}
              className={cn(
                "wave-bar transition-colors duration-300",
                isListening ? "bg-destructive" : "bg-muted-foreground"
              )}
              style={{ height: '100%' }}
            />
          ))}
        </div>
        
        {/* Microphone button */}
        <Button
          ref={buttonRef}
          variant={isListening ? "destructive" : "outline"}
          size="lg"
          className="h-16 w-16 rounded-full flex items-center justify-center transition-all duration-300"
          onClick={handleToggleListen}
        >
          {isListening ? (
            <Mic className="h-6 w-6" />
          ) : (
            <MicOff className="h-6 w-6" />
          )}
        </Button>
        
        {/* Recognized command */}
        <div ref={commandRef} className="text-center min-h-16">
          {command && (
            <p className="text-sm">
              <span className="font-medium">Recognized command:</span>
              <br />
              "{command}"
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="text-center text-xs text-muted-foreground">
        {isListening ? "Listening..." : "Click the button to start"}
      </CardFooter>
    </Card>
  );
};

export default VoiceControl;
