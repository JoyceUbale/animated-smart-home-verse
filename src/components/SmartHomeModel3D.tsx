
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Box } from '@react-three/drei';
import { useTheme } from '@/contexts/ThemeContext';
import * as THREE from 'three';

const SmartHomeModel = () => {
  const { nodes, materials } = useGLTF('/scene.gltf');
  const theme = useTheme();
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group dispose={null}>
      <scene name="Scene">
        <mesh
          ref={meshRef}
          name="house001"
          castShadow
          receiveShadow
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.01}
        >
          {/* Use Box as a fallback if the model doesn't load properly */}
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#cccccc" />
        </mesh>
      </scene>
    </group>
  );
};

const SmartHomeModel3D = () => {
  const { theme } = useTheme();
  
  return (
    <div className="w-full h-[300px] rounded-lg overflow-hidden border">
      <Canvas shadows camera={{ position: [0, 5, 12], fov: 25 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <SmartHomeModel />
        <OrbitControls enableZoom={false} enablePan={false} />
        <Environment preset="apartment" />
      </Canvas>
    </div>
  );
};

export default SmartHomeModel3D;
