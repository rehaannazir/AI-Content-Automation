import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const NODE_COUNT = 140;
const CONNECT_DISTANCE = 1.9;
const FIELD_RADIUS = 5.5;

function generateNodes(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // distribute inside a flattened ellipsoid so the network reads wide, not a sphere blob
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius * Math.cbrt(Math.random());
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta) * 1.35;
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.75;
    positions[i * 3 + 2] = r * Math.cos(phi) * 0.9;
  }
  return positions;
}

function buildConnections(positions: Float32Array, maxDistance: number) {
  const lineVertices: number[] = [];
  const count = positions.length / 3;
  for (let i = 0; i < count; i++) {
    const ix = positions[i * 3];
    const iy = positions[i * 3 + 1];
    const iz = positions[i * 3 + 2];
    for (let j = i + 1; j < count; j++) {
      const jx = positions[j * 3];
      const jy = positions[j * 3 + 1];
      const jz = positions[j * 3 + 2];
      const dist = Math.hypot(ix - jx, iy - jy, iz - jz);
      if (dist < maxDistance) {
        lineVertices.push(ix, iy, iz, jx, jy, jz);
      }
    }
  }
  return new Float32Array(lineVertices);
}

function NeuralNetwork() {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const pointer = useRef({ x: 0, y: 0 });

  const positions = useMemo(() => generateNodes(NODE_COUNT, FIELD_RADIUS), []);
  const lineVertices = useMemo(() => buildConnections(positions, CONNECT_DISTANCE), [positions]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.045;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      (state.pointer.y * Math.PI) / 40,
      0.03
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      -(state.pointer.x * Math.PI) / 60,
      0.03
    );
    pointer.current = { x: state.pointer.x, y: state.pointer.y };
  });

  return (
    <group ref={groupRef} scale={Math.min(viewport.width / 12, 1.15)}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lineVertices, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#f5cb5c" transparent opacity={0.09} />
      </lineSegments>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#f5cb5c"
          size={0.045}
          sizeAttenuation
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#e8eddf"
          size={0.11}
          sizeAttenuation
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function AmbientDrift() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => generateNodes(60, 7.5), []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y -= delta * 0.015;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#cfdbd5"
        size={0.02}
        sizeAttenuation
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export function NeuralNetworkScene() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 7.2], fov: 50 }}
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.4} />
      <NeuralNetwork />
      <AmbientDrift />
    </Canvas>
  );
}
