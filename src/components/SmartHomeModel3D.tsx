
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Float, PerspectiveCamera } from '@react-three/drei';
import { useSmartHome } from '@/contexts/SmartHomeContext';
import * as THREE from 'three';

// Simple house model
function House({ lights }: { lights: { id: string; status: string; room: string }[] }) {
  const houseRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (houseRef.current) {
      houseRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.05;
    }
  });

  return (
    <group ref={houseRef}>
      {/* House base */}
      <mesh position={[0, -0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 0.1, 4]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>

      {/* House walls */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[3.5, 1, 3.5]} />
        <meshStandardMaterial color="#f5f5f5" transparent opacity={0.8} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 1.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[2.8, 1.2, 4]} />
        <meshStandardMaterial color="#d32f2f" />
      </mesh>

      {/* Rooms with lights */}
      {lights.map((light, index) => {
        const positions = [
          [-1, 0, -1],  // Living Room
          [1, 0, -1],   // Bedroom
          [-1, 0, 1],   // Kitchen
          [1, 0, 1],    // Bathroom
        ];
        
        const roomIndex = index % positions.length;
        const isOn = light.status === 'on';
        
        return (
          <group key={light.id} position={positions[roomIndex]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.2, 0.6, 1.2]} />
              <meshStandardMaterial 
                color={isOn ? "#fffde7" : "#424242"} 
                emissive={isOn ? "#ffecb3" : "#000000"}
                emissiveIntensity={isOn ? 0.5 : 0}
              />
            </mesh>
            
            {/* Light bulb */}
            <pointLight 
              position={[0, 0.5, 0]} 
              intensity={isOn ? 1.5 : 0} 
              color={isOn ? "#fffde7" : "#000000"} 
              distance={2}
            />
            
            <mesh position={[0, 0.6, 0]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial 
                color={isOn ? "#ffee58" : "#bdbdbd"} 
                emissive={isOn ? "#ffee58" : "#000000"}
                emissiveIntensity={isOn ? 0.8 : 0}
              />
            </mesh>
            
            {/* Room label */}
            <group position={[0, -0.4, 0]} rotation={[0, 0, 0]}>
              <mesh>
                <planeGeometry args={[1.0, 0.3]} />
                <meshBasicMaterial color="#2196f3" transparent opacity={0.7} />
              </mesh>
            </group>
          </group>
        );
      })}
    </group>
  );
}

const SmartHomeModel3D: React.FC = () => {
  const { devices } = useSmartHome();
  const lights = devices.filter(device => device.type === 'light');

  return (
    <div className="h-[300px] w-full rounded-xl overflow-hidden shadow-xl">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={40} />
        <Environment preset="apartment" />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        
        <Float
          speed={1.5} 
          rotationIntensity={0.2} 
          floatIntensity={0.5}
        >
          <House lights={lights} />
        </Float>
        
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
};

export default SmartHomeModel3D;
