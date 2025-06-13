import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import {Stars as StarBG} from '@react-three/drei';

const scale = meters => Math.cbrt(meters) * 0.5; // visual scale factor

export default function NeoVisualization({ neo }) {
    // position: along x-axis at missDistanceKm/1e6 for demonstration
    const pos = useMemo(() => [(neo.missDistanceKm/1e6), 0, 0], [neo]);
    const radius = useMemo(() =>
        scale((neo.diameterMinMeters + neo.diameterMaxMeters)/2), [neo]);

    return (
        <Canvas camera={{ position: [5,5,5], fov: 50 }}>
            <StarBG radius={100} depth={50} count={5000} factor={4} fade />
            <ambientLight intensity={0.3}/>
            <pointLight position={[10,10,10]}/>
            {/* Earth */}
            <mesh>
                <sphereGeometry args={[0.5, 32, 32]}/>
                <meshStandardMaterial color="royalblue"/>
            </mesh>
            {/* Asteroid */}
            <mesh position={pos}>
                <sphereGeometry args={[radius, 16, 16]}/>
                <meshStandardMaterial color="salmon"/>
            </mesh>
            {/* Trajectory line */}
            <Line points={[[0,0,0], pos]} dashed dashSize={0.1} gapSize={0.1} lineWidth={1}/>
            <OrbitControls />
        </Canvas>
    );
}
