
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import { useTheme } from "./ThemeProvider";
import { Suspense } from "react";

const ParticleField = () => {
  const { theme } = useTheme();
  const particleCount = 300; // Reduced for better performance
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#f97316" transparent opacity={0.6} />
    </points>
  );
};

export const BackgroundScene = () => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 -z-10">
      <Suspense fallback={<div className="bg-background h-full w-full" />}>
        <Canvas camera={{ position: [0, 0, 5] }}>
          <color attach="background" args={[theme === 'dark' ? '#111111' : '#fdfdfd']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <ParticleField />
          <mesh>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
              color="#f97316"
              transparent
              opacity={0.1}
              wireframe
            />
          </mesh>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
